import { expect } from 'chai';
import https from 'https';

import dhttps from './index';

/*
  Test domain or subdomain is really registered
  in the gamma network
*/
export const testDomain = 'dhttps.nnike.gamma';

/*
  cert and key generated with dappy-cli
  npx @fabcotech/dappy-cli generatecerts --hosts ${domain}
*/
export const cert = `-----BEGIN CERTIFICATE-----
MIIDCDCCAfCgAwIBAgIUN8q64V++mYa343wCqN+eOh3YaDUwDQYJKoZIhvcNAQEL
BQAwHTEbMBkGA1UEAwwSZGh0dHBzLm5uaWtlLmdhbW1hMB4XDTIzMDUyMzA5NTA0
NFoXDTMxMDgwOTA5NTA0NFowHTEbMBkGA1UEAwwSZGh0dHBzLm5uaWtlLmdhbW1h
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0OyaYxAF5v6m/t1pvTvc
QIE5bWl/Dyo6fQltNQoXKJrwlkED/QRNazLmLL3xDkPnugtr0lBuxZHVy5+6/X5x
ToWZFXPI0uKcs6tLV9QWesfQH4bxfNMmNQ30w0UJ7fUoyzP+DlZjPOwOEfHj872k
KgIyzCEyh23K4EowbM0YaFNhHtCHBWb3oDLVvRBZA02RMCzY5Y6OyENXup9wCUjT
3WONayor3OAVe8h2elqNOFbOLUWRFzJ553+0VTe9X9kZMeCkzvkpFI9CQnrFY2Jt
jOX0c5jyjmH4Tu9GNoCj8EY4/+vycV8sZj60ybu04uUjMegA1Gc3oA0JiVXV/L2T
SwIDAQABo0AwPjAdBgNVHREEFjAUghJkaHR0cHMubm5pa2UuZ2FtbWEwHQYDVR0O
BBYEFJbRFr/HUQ+PAyEFE021CZhPzHKcMA0GCSqGSIb3DQEBCwUAA4IBAQBPvQFG
ftM+59yCYbt/FJL6NfIaVao8i35rlns6YPiNClbLnvcEG0ZLYw7+M8v5tEtfCL4c
teZ13km+A0MbCY+4hgJO7hVpRJEgh1tvH7Avgxz8CPutQAy72TXWYwiBI2vBSFbv
pSLf8CgfU53kiCosBbLIAPov5i1wT22QSEZG1bIbPK6hMyzqSqwtdEGiXArH9LKb
2fcyarQYqwAY1ptzflUPkvRXXwReIKqeKoChunshOmC0VlbhJFGtVNM4t/LWR3LE
gySfD4+IIy0yoKJCXjSW72SmaTx6nZLf+R4AEdiqbyF2h0ihStqzX+OF9ffnSWp2
gVKI73Rn0GpFnUVu
-----END CERTIFICATE-----`;
export const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ7JpjEAXm/qb+
3Wm9O9xAgTltaX8PKjp9CW01ChcomvCWQQP9BE1rMuYsvfEOQ+e6C2vSUG7FkdXL
n7r9fnFOhZkVc8jS4pyzq0tX1BZ6x9AfhvF80yY1DfTDRQnt9SjLM/4OVmM87A4R
8ePzvaQqAjLMITKHbcrgSjBszRhoU2Ee0IcFZvegMtW9EFkDTZEwLNjljo7IQ1e6
n3AJSNPdY41rKivc4BV7yHZ6Wo04Vs4tRZEXMnnnf7RVN71f2Rkx4KTO+SkUj0JC
esVjYm2M5fRzmPKOYfhO70Y2gKPwRjj/6/JxXyxmPrTJu7Ti5SMx6ADUZzegDQmJ
VdX8vZNLAgMBAAECggEAKQ1Musljt4NzMeI0zEOuYBhkPdz8Y/DyxC3tgP4GFer3
+jY1P+qwAa/jLYh3DMwIBPUIjy9RzM1+mn+84OGPBxRWQ7JYFCQGEYHHkK7yadbI
TOGZouLkf4lJ/nKa5GCHTwJc2dlcr5RcoWcL2RF65+w9qgGd6aGHuzGouUBFmv3o
JWdqf8FAQWQIjQwQ6B4o7xLaMLNbDMbLcAHBU4rdCcFdFbvKr2kIl0Bgr3WcH1zk
OKoyjjIvZUkRUL7KzZdpcgTh12Oy/0id4ApMZKI0yih9IX84qbQtIctLIPaK2Rqk
Xb35txchob674qCj/pYcHmYb6/U7EoUM6SOP1t/PSQKBgQD2lP795d5DHA58VOmZ
YGaswdrx5hf5+l35TLEIM5jkfMJ2hlK5NkaooprCGnJ/Gcm92bB0dC9wP7rr6NPE
i/W+45GcRtT9vV8k78O8vb/32hHUxhPYiWRd4yDjbtZaQKbYzBFWmeYnwNZWHWXQ
eK9A+ZF8MccsCcwVWvseNExHQwKBgQDY52aQtDBeqcS1oHpc/WwqExi2nB0jR2xb
dhugCdj+rrLTQu8yGPt9zM3Yo2luIOqbELqXLUy9WRNsu3g1X5kP1AXHlu5RT58Z
cYZjvy2PIJamcTAsM27C6BXQnqj4N2QGlmP3yyuXrakQxITBjSqv9tR9LdbXxo8N
Z5GJU1avWQKBgQDvZzevMNe7lmjmA9cNZ9AoGMrHI1vSA2fr3K7gxJ/D7vEq/D0i
v3SY086nd+AEUPhTECDG3+sS8307AEFiyXRd0jqUXRz8Ajl29ia3gA76x8maKHoq
OTKuCQ/sYLdSxwR25qJKz37qx8oRr9cjMZkN34CF8RpsQlLXxQ6cg7AvWwKBgG5Z
m8a2xX0Dpf45fMdebu8g9AvDdNeD+M63Ueqj1/AKdRQiE4tLRneEAJ3c1UCgIntt
kWBkPYx/ivBgmBGfZ0G0PpSCZxCbD3hkV1jb5JPSopJfN4DlUc57QM34SkKt+4eW
b5mblbv/L+pF8Lx/013el9Bvx8PTUugg7twMuCdRAoGAd9ISZiWBCEMMsEM2iZfl
yTgYflMeLaC2qdATlCjdA81NeYOcyrcfYcTAlv/gF14Z33/eGUXg0AQytCz/MqMx
pGd08//ztmvpeH56AZfw0TVAkI4CPtT8X3h2zXpovkA9Dzbzjzz5e/4LMaU87zgt
93EoUcn+T54VStbTMlzvO9A=
-----END PRIVATE KEY-----`;

const servers: { [key: string]: https.Server } = {};

export const startServer = (
  getServers: () => any,
  serv: string,
  port: number,
) => {
  const serverss = getServers();
  serverss[serv] = https
    .createServer(
      {
        cert,
        key,
      },
      (req, res) => {
        // Used in or.spec.ts
        if (serv === 'serv2') {
          res.statusCode = 500;
          res.end();
          return;
        }

        if (req.url === '/stream') {
          res.write('streams');
          setTimeout(() => {
            res.write(' work !');
            res.end();
          }, 200);
          return;
        }

        let data = '';
        req.on('data', (c) => {
          data += c;
        });
        req.on('end', () => {
          if (data) {
            res.writeHead(200);
            res.end(data);
          } else {
            res.writeHead(200);
            res.end(`${req.method} ${req.url}`);
          }
        });
      },
    )
    .listen(port);
};
export const stopServer = (serv: any) => {
  serv.close();
};

describe('[simple domains] get/post/put queries on local web server', () => {
  before(() => {
    startServer(() => servers, 'serv1', 8001);
  });
  after(() => {
    stopServer(servers.serv1);
  });
  it('should dhttps.get', (done) => {
    const req = dhttps.get(`https://${testDomain}:8001/path?query`, (res) => {
      res.on('data', (c: Buffer) => {
        expect(c.toString('utf8')).to.eql('GET /path?query');
        done();
      });
    });
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
  });
  it('should dhttps.get (stream)', (done) => {
    const req = dhttps.get(`https://${testDomain}:8001/stream`, (res) => {
      let d = '';
      res.on('data', (c: Buffer) => {
        d += c.toString('utf8');
      });
      res.on('end', () => {
        expect(d).to.eql('streams work !');
        done();
      });
    });
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
  });
  it('should dhttps.request(post)', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'post',
        host: testDomain,
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('POST /path?query');
          done();
        });
      },
    );
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
    req.end();
  });
  it('should dhttps.request(post) with JSON payload', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'post',
        host: testDomain,
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('{"hello":"world"}');
          done();
        });
      },
    );
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
    req.end(JSON.stringify({ hello: 'world' }));
  });
  it('should dhttps.request(put)', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'put',
        host: testDomain,
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('PUT /path?query');
          done();
        });
      },
    );
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
    req.end();
  });
});

describe('[simple domains] override mode, get/post/put queries on local web server', () => {
  before(() => {
    startServer(() => servers, 'serv1', 8001);
    dhttps.overrideNodeHttps();
  });
  after(() => {
    stopServer(servers.serv1);
  });
  it('should not https.get example.com (overridden)', (done) => {
    const req = https.get('https://example.com', (res) => {
      res.on('data', () => {});
    });
    req.on('error', (err) => {
      expect(err.toString()).to.eql('Error: Unknown TLD');
      done();
    });
  });
  it('should get error Unknown TLD', (done) => {
    const req = https.get('https://example.dd', (res) => {
      res.on('data', () => {});
    });
    req.on('error', (err) => {
      expect(err.toString()).to.eql('Error: Unknown TLD');
      done();
    });
  });
  it('should get error ENOTFOUND (domain does not exist)', (done) => {
    const req = https.get(
      `https://abc${Math.round(Math.random() * 10000000)}.d`,
      (res) => {
        res.on('data', () => {});
      },
    );
    req.on('error', (err) => {
      expect(err.toString()).to.eql('Error: ENOTFOUND');
      done();
    });
  });
  it('should https.get (overridden)', (done) => {
    https.get(`https://${testDomain}:8001/path?query`, (res) => {
      res.on('data', (c: Buffer) => {
        expect(c.toString('utf8')).to.eql('GET /path?query');
        done();
      });
    });
  });
  it('should https.request(post) (overridden)', (done) => {
    const req = https.request(
      {
        port: '8001',
        method: 'post',
        host: testDomain,
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('POST /path?query');
          done();
        });
      },
    );
    req.end();
  });
  it('should https.request(put) (overridden)', (done) => {
    const req = https.request(
      {
        port: '8001',
        method: 'put',
        host: testDomain,
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('PUT /path?query');
          done();
        });
      },
    );
    req.end();
  });
  it('should https.request(post) (overridden) with raw ipv4', (done) => {
    const req = https.request(
      {
        port: '8001',
        method: 'post',
        host: '127.0.0.1',
        rejectUnauthorized: true,
        ca: [cert],
        path: '/path?query',
        headers: {
          host: testDomain,
        },
      },
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('POST /path?query');
          done();
        });
      },
    );
    req.end();
  });
});

describe("[simple domains] unoverride Node's https", () => {
  before(() => {
    startServer(() => servers, 'serv1', 8001);
    dhttps.unoverrideNodeHttps();
  });
  after(() => {
    stopServer(servers.serv1);
  });
  it('should https.get example.com', (done) => {
    https.get('https://example.com', (res) => {
      expect(res.statusCode).to.eql(200);
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        expect(data.startsWith('<!doctype html>')).to.equal(true);
        done();
      });
    });
  });
});
