import https from 'https';
import http from 'http';
import { lookupSimple } from '@fabcotech/dappy-lookup';

import { validIpv4 } from './utils/validIpv4';
import { separateHostsFromUrl } from './utils/separateHostsFromUrl';

const getOptions = async (url: string, method: undefined | string) => {
  if (!url.startsWith('https://')) {
    throw new Error('Dappy only works with https');
  }
  const u = new URL(url);
  let networkk = '';
  if (u.hostname.endsWith('.d') || u.hostname.endsWith('.gamma')) {
    networkk = u.hostname
      .split('.')
      .slice(u.hostname.split('.').length - 1, u.hostname.split('.').length)
      .join('.');
  } else {
    throw new Error('Unknown TLD');
  }
  const network: 'd' | 'gamma' = networkk as 'd' | 'gamma';

  let aResp;
  try {
    aResp = await lookupSimple(u.hostname, 'A', {
      dappyNetwork: network,
    });
  } catch (err) {
    throw new Error('ENOTFOUND');
  }

  let certResp;
  try {
    certResp = await lookupSimple(u.hostname, 'CERT', {
      dappyNetwork: network,
    });
  } catch (err) {
    throw new Error('ENOTFOUND');
  }

  if (aResp.records.length === 0) {
    throw new Error('ENOTFOUND');
  }
  return {
    minVersion: 'TLSv1.2',
    servername: u.hostname,
    host: aResp.records[0].data,
    path: `${u.pathname || ''}${u.search}`,
    ca: [certResp.records[0].data],
    rejectUnauthorized: true,
    port: u.port || 443,
    method: (method as string).toUpperCase(),
    headers: {
      host: u.hostname,
    },
  };
};

const dhttps = {
  state: {
    override: false,
  },
  unoverrideNodeHttps: () => {
    if (!dhttps.state.override) {
      throw new Error('dhttps is already off');
    }
    dhttps.state.override = false;
    https.get = (https as any).getO;
    https.request = (https as any).requestO;
  },
  overrideNodeHttps: () => {
    if (dhttps.state.override) {
      throw new Error('dhttps is already on');
    }
    dhttps.state.override = true;
    /*
      Keep original methods reference
    */
    (https as any).getO = https.get;
    (https as any).requestO = https.request;
    /*
      Override
    */
    (https as any).get = dhttps.get;
    (https as any).request = dhttps.request;
  },
  request: (
    options: string | https.RequestOptions,
    cb: (a: any) => void,
    method?: 'get',
  ) => {
    let hosts: string[] = [];
    let path = '';
    if (typeof options === 'string') {
      hosts = separateHostsFromUrl(options).hosts;
      path = separateHostsFromUrl(options).path;
      // hostname = new URL(options).hostname;
      /* todo extract ipv4 from url https://122.122.122.122/hey
      this way we can validate ipv4 with validIpv4() */
    } else {
      // hostname = options.host;
      hosts = separateHostsFromUrl(options.host || '').hosts;
      path = options.path || '';
    }

    let endCalled = false;

    let onErrorGlobal: null | ((a: any) => void) = (a) => null;
    let onErrorCallback: null | ((a: any) => void) = null;
    let error: any = null;
    let payload: null | Buffer | string = null;
    let i = 0;
    const requestForOneHost = async () => {
      const hostnamee = hosts[i];
      /*
        IPV4 / IPV6 requests do not go through the
        dappyLookup
      */
      if (
        validIpv4(hostnamee as string)
        // todo
        // || validIpv6(hostname)
      ) {
        if (method === 'get') {
          return (https as any).getO(options, (res: any) => {
            if ([200, 400, 401, 403, 404].includes(res.statusCode)) {
              cb(res);
            } else {
              (onErrorGlobal as any)('Unsupported status code');
            }
            res.on('error', (err: any) => {
              (onErrorGlobal as any)(err);
            });
          });
        }
        return (https as any)
          .requestO(options, (res: any) => {
            if ([200, 400, 401, 403, 404].includes(res.statusCode)) {
              cb(res);
            } else {
              (onErrorGlobal as any)('Unsupported status code');
            }
            res.on('error', (err: any) => {
              (onErrorGlobal as any)(err);
            });
          })
          .end(payload);
      }

      let dOptions;
      try {
        if (typeof options === 'string') {
          dOptions = await getOptions(`https://${hostnamee}${path}`, method);
        } else {
          dOptions = await getOptions(
            `https://${hostnamee}${
              options.port ? `:${options.port}` : ''
            }${path}`,
            options.method,
          );
        }
        const req = (https as any).request(
          {
            ...(typeof options === 'string' ? {} : options),
            host: dOptions.host,
            ca: dOptions.ca,
            servername: dOptions.servername,
            minVersion: dOptions.minVersion,
            port: dOptions.port,
            path: dOptions.path,
            method: dOptions.method,
            headers: {
              ...(typeof options === 'string' ? {} : options.headers || {}),
              host: dOptions.headers.host,
            },
          },
          (res: any) => {
            if ([200, 400, 401, 403, 404].includes(res.statusCode)) {
              cb(res);
            } else {
              (onErrorGlobal as any)('Unsupported status code');
            }
            res.on('error', (err: any) => {
              (onErrorGlobal as any)(err);
            });
          },
        );
        if (endCalled) {
          (req as http.ClientRequest).end(payload);
          (req as http.ClientRequest).on('error', onErrorGlobal as any);
        }
      } catch (err) {
        (onErrorGlobal as any)(err);
      }
      return null;
    };
    onErrorGlobal = (err) => {
      if (i === hosts.length - 1) {
        error = err;
        if (onErrorCallback) onErrorCallback(err);
      } else {
        i += 1;
        requestForOneHost();
      }
    };

    return {
      write: (a: any) => {
        if (!payload) {
          payload = a;
        } else {
          payload += a;
        }
      },
      end: (a?: any) => {
        if (endCalled) return;
        endCalled = true;
        if (a) {
          if (!payload) {
            payload = a;
          } else {
            payload += a;
          }
        }
        requestForOneHost();
      },
      on: (event: string, cbb: (a: any) => void) => {
        if (event === 'error') {
          onErrorCallback = cbb;
          if (error) {
            onErrorCallback(error);
          }
        }
      },
    };
  },
  get: (url: string, cb: (a: any) => void) => {
    const r = dhttps.request(url, cb, 'get');
    r.end();
    return r;
  },
};

export default dhttps;
