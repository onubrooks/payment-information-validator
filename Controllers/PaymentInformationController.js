const Helpers = require("../Lib/Helpers")

const Validator = require("./Validator")
const CreditCardValidator = require("../Validations/CreditCard")

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
        let creditCardValidator = new CreditCardValidator();
        let allRules = {
          card_number: [creditCardValidator.validateCardNumber],
          cvv: [creditCardValidator.validateCVV]
        }
        let validator = new Validator()
        let validationResults = validator.validate(body, allRules);
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.write(JSON.stringify(validationResults));
        // res.write(JSON.stringify({Valid: true}));
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
   * return a hmac hash of the request you want to validate
   * 
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   *
   * @return {http.ServerResponse}
   */
  async getHash(req, res) {
    await Helpers.bodyParser(req)
    let body = JSON.parse(req.body);
    try {
      let hash = Helpers.getHash(body);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.write(hash);
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

module.exports = PaymentInformationController