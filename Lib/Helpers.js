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

module.exports = {
    bodyParser
}