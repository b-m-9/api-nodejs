const countries = require('country-list');
const geoip = require('geoip-lite');
module.exports = function (ip) {
  if (typeof ip !== 'string')
    return {success: false, error: 'error typeof stringIP:' + ip};
  ip = ip.replace('::ffff:', '');
  var arrIps = ip.split('.');
  if (+arrIps.length !== 4)
    return {success: false, error: 'error  IP:' + ip + ' Length:' + ip.split('.').length + ' != 4'};

  if (255 < +arrIps[0] || 0 > +arrIps[0] ||
    255 < +arrIps[1] || 0 > +arrIps[1] ||
    255 < +arrIps[2] || 0 > +arrIps[2] ||
    255 < +arrIps[3] || 0 > +arrIps[3])
    return {success: false, error: 'error  IP:' + ip + ' Mask: 0.0.0.0-255.255.255.255'};
  // if(ip.split('.'))
  //     return {success: false,error:'error typeof ip'};
  const code = geoip.lookup(ip);
  if (!code) {
    return {
      ip: ip,
      counterCode: "AA",
      counterName: "Unknown",
      city: "Unknown",
      range: [0, 0],
      success: true
    };
  }
  return {
    ip: ip,
    counterCode: code.country,
    counterName: countries.getName(code.country) || code.country,
    city: code.city,
    range: code.range,
    success: true
  };
};
