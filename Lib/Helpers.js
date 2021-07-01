let crypto = require("crypto");
const https = require("https");

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
  let querystring = require("querystring");
  let pathquery = querystring.stringify({
    xml: req.body
  });
  return https
    .get(`https://api.factmaven.com/xml-to-json?${pathquery}`, resp => {
      let chunked = "";

      // A chunk of data has been received.
      resp.on("data", chunk => {
        chunked += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        req.body = chunked;
        console.log(chunked)
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}

module.exports = {
    bodyParser,
    authorize,
    getHash,
    parseXML
}