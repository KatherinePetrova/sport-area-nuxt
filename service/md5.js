let crypto = require("crypto");

export default data => {
  return crypto
    .createHash("md5")
    .update(data)
    .digest("hex");
};
