let crypto = require("crypto");

const PRIVATE_KEY = "i-love-node-js";

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

  return getHash(body) == token
}

function getHash(body) {
  let json = JSON.stringify(body);

  let hmac = crypto.createHmac("sha512", PRIVATE_KEY);
  hmac.update(json);
  return hmac.digest("hex");

}

async function parseXML(req) {
  return fetch('xml-json-api', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/json'
    }
  })
    // no need to call res.json(), req.body will be parsed in the controller
    .then(data => req.body = data);
}

module.exports = {
    bodyParser,
    authorize,
    getHash,
    parseXML
}