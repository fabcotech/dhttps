import { expect } from 'chai';
import https from 'https';

import dhttps from './index';

import { testDomain, startServer, stopServer } from './index.spec';

const servers: { [key: string]: https.Server } = {};

describe('[composite domains] ex: "host1 | host2"', () => {
  before(() => {
    startServer(() => servers, 'serv1', 8001);
    startServer(() => servers, 'serv2', 8002);
  });
  after(() => {
    stopServer(servers.serv1);
    stopServer(servers.serv2);
  });
  it('should dhttps.get a two hosts domain', (done) => {
    const req = dhttps.get(
      `https://${testDomain}:8002 | ${testDomain}:8001/path?query`,
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('GET /path?query');
          done();
        });
      },
    );
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
  });
  it('should get error ENOTFOUND (domain does not exist)', (done) => {
    const req = dhttps.get(
      `https://abc${Math.round(Math.random() * 10000000)}.d`,
      (res) => {
        res.on('data', () => {});
      },
    );
    req.on('error', (err) => {
      expect(err.toString()).to.include('Error: ENOTFOUND');
      done();
    });
  });
  it('should not get error ENOTFOUND (2nd domain does exist)', (done) => {
    const req = dhttps.get(
      `https://abc${Math.round(
        Math.random() * 10000000,
      )}.d | ${testDomain}:8001/path?query`,
      (res) => {
        res.on('data', (c: Buffer) => {
          expect(c.toString('utf8')).to.eql('GET /path?query');
          done();
        });
      },
    );
    req.on('error', (err: any) => {
      console.error(err);
      process.exit(1);
    });
  });
});
