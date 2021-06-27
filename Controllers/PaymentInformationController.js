const Helpers = require("../Lib/Helpers")

module.exports = class PaymentInformationController {
  /**
   *
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   *
   * @return {http.ServerResponse}
   */
  async handle(req, res) {
    try {
        // handle authorization
      let authorization = req.headers['authorization'] || ""
      let token = authorization.split(' ')[1]
      if(!token){
          this.handleResponse(res, 401, "unauthorized request")
      }
      await Helpers.bodyParser(req)
      let contentType = req.headers['content-type']
    //   res.writeHead(200, {
    //     "Content-Type": "application/json"
    //   });

    //   res.write(JSON.stringify(req.body));
      res.write(req.body);

      res.end();

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