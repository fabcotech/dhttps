import https from 'https';
import http from 'http';
import { lookupSimple } from '@fabcotech/dappy-lookup';

import { validIpv4 } from './utils/validIpv4';

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
    /*
      Is it already a IpV4 or IPV6 address ?
    */
    let hostname;
    if (typeof options === 'string') {
      hostname = new URL(options).hostname;
      /* todo extract ipv4 from url https://122.122.122.122/hey
      this way we can validate ipv4 with validIpv4() */
    } else {
      hostname = options.host;
    }
    if (
      validIpv4(hostname as string)
      // || validIpv6(hostname)
    ) {
      if (method === 'get') return (https as any).getO(options, cb);
      return (https as any).requestO(options, cb);
    }

    let endCalled = false;
    let error: any = null;
    let onError: null | ((a: any) => void) = null;
    let req: null | http.ClientRequest = null;
    let payload: null | Buffer | string = null;

    const f = async () => {
      let dOptions;
      try {
        if (typeof options === 'string') {
          dOptions = await getOptions(options, method);
        } else {
          dOptions = await getOptions(
            `https://${options.host}${options.port ? `:${options.port}` : ''}${
              options.path || ''
            }`,
            options.method,
          );
        }
        req = (https as any).request(
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
          cb,
        );
        if (endCalled) {
          (req as http.ClientRequest).end(payload);
          if (onError) {
            (req as http.ClientRequest).on('error', onError);
          }
        }
      } catch (err) {
        error = err;
        if (onError) {
          onError(error);
        }
      }
    };
    f();

    /*
      Return proxy object, waiting for dappy lookups
      for IP and CERT
    */
    return {
      write: (a: any) => {
        if (!payload) {
          payload = a;
        } else {
          payload += a;
        }
      },
      end: (a: any) => {
        endCalled = true;
        if (a) {
          if (!payload) {
            payload = a;
          } else {
            payload += a;
          }
        }
        if (req) req.end(payload);
      },
      on: (event: string, cbb: (a: any) => void) => {
        if (event === 'error') {
          // req is already created
          if (req) {
            if (onError) {
              if (error) {
                cbb(error);
              } else {
                req.on('error', cbb);
              }
            }
            // req is not created yet
          } else {
            onError = cbb;
            if (error) {
              onError(error);
            }
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
