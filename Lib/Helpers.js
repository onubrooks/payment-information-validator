let crypto = require("crypto");
const https = require("https");

const PRIVATE_KEY = "i-love-node-js";

async function bodyParserJSON(req) {
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
      .on("end", async () => {
        req.body = JSON.parse(chunked);
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

async function bodyParserXML(req) {
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
      .on("end", async () => {
        let querystring = require("querystring");
        let pathquery = querystring.stringify({
          xml: chunked
        });
        let call = https
          .get(
            `https://api.factmaven.com/xml-to-json/?${pathquery}`,
            resp => {
              let chunked = "";

              // A chunk of data has been received.
              resp.on("data", chunk => {
                chunked += chunk;
              });

              // The whole response has been received.
              resp.on("end", () => {
                req.body = JSON.parse(chunked).root;
                resolve();
              });
            }
          )
          .on("error", err => {
            console.log("Error: " + err.message);
          })
          .end();
      });
  });
  
}

module.exports = {
    bodyParserJSON,
    authorize,
    getHash,
    bodyParserXML
}