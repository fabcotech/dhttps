![dhttps large image](https://raw.githubusercontent.com/fabcotech/dhttps/master/assets/dhttps.jpg)

**dhttps** makes every nodeJS program 1000x more secure by isolating https requests from the Operating System, the Domain Name System and node's web PKI (hardcoded certificates authority from [Mozilla](https://wiki.mozilla.org/CA/Included_Certificates)) for TLS certificate verification.

dhttps uses instead [dappy](https://dappy.tech), a new service discovery and name system co-secured by independent companies. Dappy is designed to avoid at all cost hacks or inaccuracies in the service discovery phase, mainly for financial or other high value programs 
and web applications.

### How exactly is it more secure ?

In short, dappy domains end with .d, and they can be resolved (resolution means discovery of IP address and root certificate for TLS) only if the companies of the dappy network that are queried agree on the values, those companies are connected through a leaderless DLT. This distributed trust approach ensures that the client, program or browser never gets a wrong IP address or root certificate for a given domain.

This process is called co-resolution, co-resolution is performed over TLS by **dhttps** and not by a remote DNS resolver or service. Libraries and programs powered by dappy are independent from the certificate authorities system and the DNS.

### How to use

**dhttps** uses the dappy name system exclusively : .d and .gamma domains. You must own a domain in the dappy name system first : [purchase a .d domain](https://app.dappy.tech/), [get a free .gamma domain](https://gamma.dappy.tech/), [documentation for setting up zone and TLS certificates](https://docs.dappy.tech/docs/intro/).

**dhttps** has two modes, the soft mode does not override or touch node's `https`, and the hard mode that overrides nodejs's `https`.

#### Soft mode

The soft mode does not override any behavior of nodeJS, it just exposes `dhttps` and an interface similar to `https`: `dhttps.get` and `dhttps.request`.

```ts
import dhttps from 'dhttps';

dhttps.get('https://dappy.d', (res) => {
  res.on('data', (c: any) => {
    console.log(c.toString('utf8'));
  });
});
```

#### Hard mode (override)

The hard mode overrides nodeJS's `https`

```ts
import dhttps from 'dhttps';

dhttps.overrideNodeHttps();

const req = https.get('https://dappy.d', (res) => {
  res.on('data', (c: any) => {
    console.log(c.toString('utf8'));
  });
});
req.on('error', console.log);
```

```ts
import dhttps from 'dhttps';

dhttps.overrideNodeHttps();

const req = https.request(
  {
    method: 'post',
    host: 'dappy.d',
    path: '/',
  },
  (res) => {
    console.log(res.statusText);
  },
);
req.on('error', console.log);
req.end();
```
