![dhttps large image](https://raw.githubusercontent.com/fabcotech/dhttps/master/assets/dhttps.jpg)

**dhttps** allows nodeJS developers to rapidly and seamlessly use .d domains (dappy) in their programs. It has the exact same interface as NodeJS's https.

[dappy](https://dappy.tech) is a new domain name technology, domains are scopped under .d TLD and do not collide with any ICANN domain. Dappy was built for critical web applications, and with special care for developer experience and automation (management is JSON + CLI based).

### How exactly is it more secure ?

The DNS + CA system imposes reliance on many unique agents : a resolver ran by Google or Cloudflare, Verisign for .com domains, and also imposes to trust [hundreds of CAs](https://wiki.mozilla.org/CA/Included_Certificates) independently. This creates major trust issues, frictions and possibilities of hacking or spying.

Service discovery for .d domains is based on co-resolution, multiple companies or foundations constitute the dappy network and share a state by being part of the same ledger/blockchain-like network. The requests hit multiple independent companies, and consensus is performed on the answers at client level (no single resolver). One company cannot fool the client.

Co-resolution is performed for IP addresses and TLS certificates that are also stored in the dappy name system. Certificates are self-signed, no need to have them signed by an authority, or renewed.

**In short : a 100x simpler, more secure and trustless service discovery, leading to highly private and secure HTTPS connections.**

### How to use

```sh
npm i @fabcotech/dhttps
```

**dhttps** uses the dappy name system exclusively : .d and .gamma domains. You must own a domain in the dappy name system first : [purchase a .d domain](https://app.dappy.tech/), [get a free .gamma domain](https://gamma.dappy.tech/), [documentation for setting up zone and TLS certificates](https://docs.dappy.tech/docs/intro/).

**dhttps** has two modes, the soft mode does not override or touch node's `https`, and the hard mode that overrides nodejs's `https`.

#### Soft mode

The soft mode does not override any behavior of nodeJS, it just exposes `dhttps` and an interface similar to `https`: `dhttps.get` and `dhttps.request`.

```ts
import dhttps from '@fabcotech/dhttps';

dhttps.get('https://dappy.d', (res) => {
  res.on('data', (c: any) => {
    console.log(c.toString('utf8'));
  });
});
```

#### Hard mode (override)

The hard mode overrides nodeJS's `https`

```ts
import dhttps from '@fabcotech/dhttps';
import https from 'https';

dhttps.overrideNodeHttps();

const req1 = https.get('https://dappy.d', (res) => {
  res.on('data', (c: any) => {
    console.log(c.toString('utf8'));
  });
});
req1.on('error', console.log);

const req2 = https.request(
  {
    method: 'post',
    host: 'dappy.d',
    path: '/',
  },
  (res) => {
    console.log(res.statusCode);
  },
);
req2.on('error', console.log);
req2.end();
```
