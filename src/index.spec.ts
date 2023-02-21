import { expect } from 'chai';
import https from 'https';

import dhttps from './index';

/*
  cert and key generated with dappy-cli
  npx @fabcotech/dappy-cli generatecerts --hosts dhttps.dappy.gamma
*/
const cert = `-----BEGIN CERTIFICATE-----
MIIDCDCCAfCgAwIBAgIUURpurU55ADBs/nXuEqWreAHc3ZEwDQYJKoZIhvcNAQEL
BQAwHTEbMBkGA1UEAwwSZGh0dHBzLmRhcHB5LmdhbW1hMB4XDTIzMDIxNjE1MjQ1
N1oXDTMxMDUwNTE1MjQ1N1owHTEbMBkGA1UEAwwSZGh0dHBzLmRhcHB5LmdhbW1h
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1yZq3W/aFIOzTdhVVhk3
w3sTbIDm0RZKNjVZYpx3wvYUMs2WbT+rZbn51zE3GuhelXQljHOFFqmyJPENMlHE
I96yMb9OjBRaLslQ2sVpkS6S6dx0KSVOTc2IgGzXe9QPCtDHRHuU1bHO6eIsvxV1
ixJrq8fj/d8PShFzdMQ2GNxM53wYC295G/Y1gXAIQPO2fzAtqtn2rzYCWTK88Fl/
ipJN3jMw6ZhaGocA56xxUviBj1bud+mFCEeq52CitGxjAruaSF7+uuIZI7Rw1znT
/U+kONqwyR5nMk+SkPmdoEb0ZWjkNmMpXyAzTtM0QE/xUYoVNw2l3grfxXeHzSkV
cwIDAQABo0AwPjAdBgNVHREEFjAUghJkaHR0cHMuZGFwcHkuZ2FtbWEwHQYDVR0O
BBYEFH6GSGbV6Qp8re6LHruDsH6m7HT6MA0GCSqGSIb3DQEBCwUAA4IBAQBzpyQi
IPJNWkuno9EFonVHucMgHXjJXIBvPEQfoRuRNgm3cXoSiLc9BRcI4byGsxl4AMm4
7p1iluWgLeBFaIbeJVuO+J5cnzWRxjUWB436DnMJuWYUBhCgtRPx7mlUU/iaa2fK
Yv0D8iKoTxSmyv6mpkexTRB8UNaAuIbNYFwJDXafLmLWn+ZaJayOhYUsIp61fTlr
+LT+BoITFPMfRuY6WX7XkcFi/ntCxUlSUQJ2PzOiShRuNqMCKglvf8SefEVDPzP6
Nbne9NCtt+9UKxLXkZCLAlHGM0/LS/U04+h76thRvs8usmAhtS4Kom6HOpotttEn
06axJ+nc0XLvDDsV
-----END CERTIFICATE-----`;
const key = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXJmrdb9oUg7NN
2FVWGTfDexNsgObRFko2NVlinHfC9hQyzZZtP6tlufnXMTca6F6VdCWMc4UWqbIk
8Q0yUcQj3rIxv06MFFouyVDaxWmRLpLp3HQpJU5NzYiAbNd71A8K0MdEe5TVsc7p
4iy/FXWLEmurx+P93w9KEXN0xDYY3EznfBgLb3kb9jWBcAhA87Z/MC2q2favNgJZ
MrzwWX+Kkk3eMzDpmFoahwDnrHFS+IGPVu536YUIR6rnYKK0bGMCu5pIXv664hkj
tHDXOdP9T6Q42rDJHmcyT5KQ+Z2gRvRlaOQ2YylfIDNO0zRAT/FRihU3DaXeCt/F
d4fNKRVzAgMBAAECggEAP1dtpeTcySZe/x+ePBtviesttEec7NjJn30EZF5ZefoV
x0E0tNRGY0wmDJ9OMGtSEWEg/uExwRLTwkF/l51wB/lz7+Z5Ow9w345gchAlvNr/
4L8JKeX0UD6fHeQtaqTris0dpYFWt7VCDCSM9PLd6MRTE79lVaQ6rZ1Gpw1vOdDz
zPiyMzwruqryAyGc8/QjNIBPFk+bpzbUmz4dAPP2EL+QZXSTwuKP8hE8FxW3oS1k
pzpzCiw+ckuoXuYLKvetOFN7XFYTvaO4ChunalIaLOp6CQHNdpjG8qN4qLDIi0qC
B5Kf/9KFt4aug/04OLOvAFJ5ZFauZWEdxk97PeA4tQKBgQDksllB2mXJhGZw1uWt
ruZs8uOI1co4tX/mmdZsir9PlaAO+m8pJTwK++mGGNLJgLOkmR7UvlxNPLjAIcxD
8ho2AHUeKaEeDA4mRz2nvEPSva8HYtuDyFvXd8uueSQsFIqePWswRqPxnH3SyD28
tJfru8WhATGEFjOBXBT+PvsHnQKBgQDw1gtNtfw2c0+fHduc21EXabdRUlsEy8BJ
j6A+O2kRn5JIYEeo2syV2zsnpyy7AG9PT4nErodde4LIAI6eGbnoz6loptN6HI4Y
xS7EMkyXkzh49007ZLs+V/Ya2R3WYcL3X/5K11VfIDpysastZEz/yyAG7JKtUdeG
pd7WklHsTwKBgQCXe5MnzZPygWKhh5anDtzOeaxBbOr/2SkZA/lF+Dl0a7WTdkq/
REybMfWivzqQAlH7yvjjDhxxhLETgs+cifbWokLxcb2o+28756BtRITgSIhxKggh
KEu9Uzp1HQTatdiDrEcduQzK809cmQpbvnuKx9vGI9Y6mcIQA4BcUDdS+QKBgQDs
qkp9WUK592LdCChR4iu0CEz++yE6e0dAgoWD4joD+X105jhFNI4rDT76XovUUD8R
/yVxQ9j+AmuoQvPjZYCNydO+ZYIX04vHx62HW65snV23cb5RiVF/mEzeYVGy5GsF
US3BOg5I5pDJONLwTkpka6XTaBNTgsN7K/Dphuw+fQKBgQCEkJ1qpjW/gbPZn/1c
+t+qphye+Iz3nMA12jWWWzHZ67crCP+8qsY0S7aO3tLAGYDCD2FR2YxS0/C4svZ6
xBJKkvlxOHQuIs/rlFXOqmRWzR08QFaw8IDKlsEGo1cmZiF88z+ISq/gnR73UW7P
C3nQhEPk24D2CpkotUtMoBK0cA==
-----END PRIVATE KEY-----`;

let serv: any;
const startServer = () => {
  serv = https
    .createServer(
      {
        cert,
        key,
      },
      (req, res) => {
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
    .listen(8001);
};
const stopServer = () => {
  serv.close();
};

describe('dhttps, get/post/put queries on local web server', () => {
  before(startServer);
  after(stopServer);
  it('should dhttps.get', (done) => {
    dhttps.get('https://dhttps.dappy.gamma:8001/path?query', (res) => {
      res.on('data', (c: any) => {
        expect(c.toString('utf8')).to.eql('GET /path?query');
        done();
      });
    });
  });
  it('should dhttps.request(post)', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'post',
        host: 'dhttps.dappy.gamma',
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: any) => {
          expect(c.toString('utf8')).to.eql('POST /path?query');
          done();
        });
      },
    );
    req.end();
  });
  it('should dhttps.request(post) with JSON payload', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'post',
        host: 'dhttps.dappy.gamma',
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: any) => {
          expect(c.toString('utf8')).to.eql('{"hello":"world"}');
          done();
        });
      },
    );
    req.end(JSON.stringify({ hello: 'world' }));
  });
  it('should dhttps.request(put)', (done) => {
    const req = dhttps.request(
      {
        port: '8001',
        method: 'put',
        host: 'dhttps.dappy.gamma',
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: any) => {
          expect(c.toString('utf8')).to.eql('PUT /path?query');
          done();
        });
      },
    );
    req.end();
  });
});

describe("override Node's https, get/post/put queries on local web server", () => {
  before(() => {
    startServer();
    dhttps.overrideNodeHttps();
  });
  after(stopServer);
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
    https.get('https://dhttps.dappy.gamma:8001/path?query', (res) => {
      res.on('data', (c: any) => {
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
        host: 'dhttps.dappy.gamma',
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: any) => {
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
        host: 'dhttps.dappy.gamma',
        path: '/path?query',
      },
      (res) => {
        res.on('data', (c: any) => {
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
          host: 'dhttps.dappy.gamma',
        },
      },
      (res) => {
        res.on('data', (c: any) => {
          expect(c.toString('utf8')).to.eql('POST /path?query');
          done();
        });
      },
    );
    req.end();
  });
});

/* describe.only("override Node's https, same but with node-fetch", () => {
  before(() => {
    startServer();
    dhttps.overrideNodeHttps();
  });
  after(stopServer);
  it('should node-fetch.get', (done) => {
    fetch('https://dhttps.dappy.gamma:8001/path?query').then((res: any) => {
      console.log(res.text());
      expect(res.text()).to.eql('GET /path?query');
      done();
    });
  });
}); */

describe("unoverride Node's https", () => {
  before(() => {
    startServer();
    dhttps.unoverrideNodeHttps();
  });
  after(stopServer);
  it('should https.get', (done) => {
    https.get('https://example.com', (res) => {
      expect(res.statusCode).to.eql(200);
      done();
    });
  });
});
