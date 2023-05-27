const APIConfig = require("../../index");
module.exports = async function (ip) {
  if(APIConfig && APIConfig.geoipFn) return APIConfig.geoipFn(ip)
};
