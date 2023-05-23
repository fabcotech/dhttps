export const separateHostsFromUrl = (url: string) => {
  const sanitized = url
    .replace('https://', '')
    .replace(/ \| /g, '|')
    .replace(/\| /g, '|')
    .replace(/ \|/g, '|');

  const matches = sanitized.match(/[a-z0-9]{1}[.a-z0-9]*(:[0-9]{1,4}){0,1}/g);
  const hosts: string[] = [];

  let ind = 0;
  let over = false;
  for (let i = 0; i < (matches || []).length; i += 1) {
    const m = (matches || [])[i];
    if (!over && m.length !== 0 && sanitized.slice(ind, m.length + ind) === m) {
      if (ind === 0) {
        /*
          +1 is for the | separator
        */
        ind += m.length + 1;
        hosts.push(m);
        /*
        2nd host, or 3rd host etc, we must find a |
        separator right before it
      */
      } else if (sanitized[ind - 1] === '|') {
        ind += m.length + 1;
        hosts.push(m);
      } else {
        over = true;
      }
    }
  }
  return {
    hosts,
    path: sanitized.slice(ind - 1),
  };
};
