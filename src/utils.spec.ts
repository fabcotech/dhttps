import { expect } from 'chai';

import { separateHostsFromUrl } from './utils/separateHostsFromUrl';

describe('[utils.separateHostsFromUrl] parser for composite domains', () => {
  it('should find zero hosts', () => {
    expect(separateHostsFromUrl('https://').hosts).to.eql([]);
    expect(separateHostsFromUrl('https://?foo.bar.com').hosts).to.eql([]);
    expect(separateHostsFromUrl('https:///hello').hosts).to.eql([]);
    expect(separateHostsFromUrl('https://.hello.com').hosts).to.eql([]);
    expect(separateHostsFromUrl('https://:12').hosts).to.eql([]);
  });
  it('should find one host (IP address)', () => {
    expect(separateHostsFromUrl('https://12.13.14.15').hosts).to.eql([
      '12.13.14.15',
    ]);
    expect(separateHostsFromUrl('https://12.13.14.15:444').hosts).to.eql([
      '12.13.14.15:444',
    ]);
  });
  it('should find one host', () => {
    expect(separateHostsFromUrl('https://foo.bar.com').hosts).to.eql([
      'foo.bar.com',
    ]);
    expect(separateHostsFromUrl('https://foo.bar.com:444').hosts).to.eql([
      'foo.bar.com:444',
    ]);
    expect(separateHostsFromUrl('https://foo.bar.com:444/index.html')).to.eql({
      hosts: ['foo.bar.com:444'],
      path: '/index.html',
    });
    expect(separateHostsFromUrl('https://foo.bar.com/foo.bar.com')).to.eql({
      hosts: ['foo.bar.com'],
      path: '/foo.bar.com',
    });
    expect(separateHostsFromUrl('https://foo.bar.com?foo.bar.com')).to.eql({
      hosts: ['foo.bar.com'],
      path: '?foo.bar.com',
    });
  });
  it('should find two hosts (IP address)', () => {
    expect(
      separateHostsFromUrl('https://12.13.14.15|16.17.18.19').hosts,
    ).to.eql(['12.13.14.15', '16.17.18.19']);
    expect(
      separateHostsFromUrl('https://12.13.14.15:555|16.17.18.19:777').hosts,
    ).to.eql(['12.13.14.15:555', '16.17.18.19:777']);
  });
  it('should find two hosts', () => {
    expect(separateHostsFromUrl('https://foo.bar.com | hello.d')).to.eql({
      hosts: ['foo.bar.com', 'hello.d'],
      path: '',
    });
    expect(separateHostsFromUrl('https://foo.bar:55.com| hello.d')).to.eql({
      hosts: ['foo.bar:55'],
      path: '.com|hello.d',
    });
    expect(separateHostsFromUrl('https://foo.bar.com |/hello.d')).to.eql({
      hosts: ['foo.bar.com'],
      path: '|/hello.d',
    });
    expect(separateHostsFromUrl('https://hi.d:444|hi.d:555|hi.d:777')).to.eql({
      hosts: ['hi.d:444', 'hi.d:555', 'hi.d:777'],
      path: '',
    });
    expect(
      separateHostsFromUrl(
        'https://hi.d:444 | hi.d:555 | hi.d:777/path/in/app?parameter#link2',
      ),
    ).to.eql({
      hosts: ['hi.d:444', 'hi.d:555', 'hi.d:777'],
      path: '/path/in/app?parameter#link2',
    });
  });
});
