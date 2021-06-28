let crypto = require("crypto");

async function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let chunked = "";
    req
      .on("error", err => {
        console.error(err);
        reject();
      })
      .on("data", chunk => {
        chunked += chunk;
      })
      .on("end", () => {
        req.body = chunked // JSON.parse(chunked);
        resolve();
      });
  });
}

function authorize(token, body){
  let json = JSON.stringify(body)

  // sortable.sort(function(a, b) {
  //   return a[1] - b[1];
  // });
  const PRIVATE_KEY = 'i-love-node-js'
  let hmac = crypto.createHmac("sha512", PRIVATE_KEY);
  hmac.update(json);
  let hash = hmac.digest("hex");

  return hash == token
}

function getHash(body) {
  let json = JSON.stringify(body);

  const PRIVATE_KEY = "i-love-node-js";
  let hmac = crypto.createHmac("sha512", PRIVATE_KEY);
  hmac.update(json);
  return hmac.digest("hex");

}

module.exports = {
    bodyParser,
    authorize,
    getHash
}