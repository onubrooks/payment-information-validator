const Helpers = require("../Lib/Helpers")

class PaymentInformationController {
  /**
   *
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   *
   * @return {http.ServerResponse}
   */
  async handle(req, res) {
    await Helpers.bodyParser(req)
    let body = JSON.parse(req.body);
    try {
        // handle authorization
      let authorization = req.headers['authorization'] || ""
      let token = authorization.split(' ')[1]
      let auth = Helpers.authorize(token, body);// res.write(JSON.stringify(auth));res.end();return
      if(!auth){
          this.handleResponse(res, 401, "unauthorized request")
          return;
      }
  
      let contentType = req.headers['content-type']

      if(contentType == 'application/xml'){
        res.write("xml detected");
        res.write(req.body);
        res.end();
      }else if (contentType == "application/json") {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.write(JSON.stringify({Valid: true}));
        res.end();
      } else{
        this.handleResponse(res, 403, `Forbidden: unsupported content type ${contentType}`);
      }
      
    } catch (error) {

      console.log(error);

      this.handleResponse(res, 500, "something went wrong...");

    }
  }

  /**
   *
   * @param {http.ServerResponse} res
   * @param {int} statusCode
   * @param {string} message
   *
   * @return {http.ServerResponse}
   */
  handleResponse(res, statusCode, message) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });

    res.end(message);
  }
};

module.exports = PaymentInformationController