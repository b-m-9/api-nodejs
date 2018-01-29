/**
 * Created by bogdanmedvedev on 29.06.16.
 */
var countries = require('country-list')();
var getCountryCode = require('tabgeo')(_path_root + 'modules/geoip/tabgeo_country_v4.dat');
module.exports = function (ip) {
    if (typeof ip !== 'string')
        return {success: false, error: 'error typeof stringIP:' + ip};
    ip = ip.replace('::ffff:', '');
    var arrIps = ip.split('.');
    if (+arrIps.length !== 4)
        return {success: false, error: 'error  IP:' + ip + ' Length:' + ip.split('.').length + ' != 4'};

    if ( 255 < +arrIps[0] || 0 > +arrIps[0] ||
         255 < +arrIps[1] || 0 > +arrIps[1] ||
         255 < +arrIps[2] || 0 > +arrIps[2] ||
         255 < +arrIps[3] || 0 > +arrIps[3])
        return {success: false, error: 'error  IP:' + ip + ' Mask: 0.0.0.0-255.255.255.255'};
    // if(ip.split('.'))
    //     return {success: false,error:'error typeof ip'};
    var code = getCountryCode(ip);

    return {
        ip: ip,
        counterCode: code,
        counterName: countries.getName(code) || code,
        success: true
    };
};
