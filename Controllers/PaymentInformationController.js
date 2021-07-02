const Helpers = require("../Lib/Helpers")

const Validator = require("./Validator")
const CreditCardValidator = require("../Validations/CreditCard")
const EmailValidator = require("../Validations/Email")
const PhoneNumberValidator = require("../Validations/PhoneNumber")
const AmountValidator = require("../Validations/Amount")
const RequiredValidator = require("../Validations/Required")

class PaymentInformationController {

  /**
   *
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   *
   * @return {http.ServerResponse}
   */
  async handle(req, res) {
    if(req.headers['content-type'] == 'application/xml') {
      await Helpers.bodyParserXML(req)
    }else if(req.headers['content-type'] == 'application/json') {
      await Helpers.bodyParserJSON(req);
    } else {
      this.handleResponse(res, 403, {
        status: "Forbidden",
        message: "Unsupported content type"
      });
      return;
    }
  
    if (!req.body) {
      this.handleResponse(res, 403, {
        status: "Forbidden",
        message: "Empty payload detected"
      });
      return;
    }
    let body = req.body;
    
    try {
        // handle authorization
      let authorization = req.headers['authorization'] || ""
      
      let token = authorization.split(' ')[1]
      let auth = Helpers.authorize(token, body);
      if(!auth){
          this.handleResponse(res, 401, {status: 'Unauthorized', message: "Request authentication failed"})
          return;
      }
  
      let requiredValidator = new RequiredValidator();
      let creditCardValidator = new CreditCardValidator();
      let emailValidator = new EmailValidator();
      let phoneNumberValidator = new PhoneNumberValidator();
      let amountValidator = new AmountValidator();
      let keys = ['card_number', 'cvv2', 'expiration_date', 'email', 'phone_number', 'charge_amount'];
      let allRules = {
        card_number: [requiredValidator.validateRequiredKey('card_number'), creditCardValidator.validateCardNumber],
        cvv2: [requiredValidator.validateRequiredKey('cvv2'), creditCardValidator.validateCVV],
        expiration_date: [requiredValidator.validateRequiredKey('expiration_date'), creditCardValidator.validateExpirationDate],
        email: [requiredValidator.validateRequiredKey('email'), emailValidator.validateEmail],
        phone_number: [requiredValidator.validateRequiredKey('phone_number'), phoneNumberValidator.validatePhoneNumber],
        charge_amount: [requiredValidator.validateRequiredKey('charge_amount'), amountValidator.validateAmount]
      };
      let validator = new Validator();
      let validationResults = validator.validate(body, keys, allRules);
      
      if(validationResults.length){
        res.writeHead(422, {
          "Content-Type": "application/json"
        });
        res.write(
          JSON.stringify({ valid: false, message: 'Validation failed for some fields', errors: validationResults })
        );
      } else {
         res.writeHead(200, {
           "Content-Type": "application/json"
         });
         res.write(JSON.stringify({ valid: true, message: 'Validation passed successfully' }));
      }
      res.end();
      
    } catch (error) {

      console.log(error);

      this.handleResponse(res, 500, {
        status: "Error",
        message: "Something went wrong"
      });

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
    if (req.headers["content-type"] == "application/xml") {
      await Helpers.bodyParserXML(req);
    } else if (req.headers["content-type"] == "application/json") {
      await Helpers.bodyParserJSON(req);
    } else {
      this.handleResponse(res, 403, {
        status: "Forbidden",
        message: "Unsupported content type"
      });
      return;
    }
    let body = req.body;
    try {
      let hash = Helpers.getHash(body);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.write(JSON.stringify({
        "status": "success",
        "hash": hash
      }));
      res.end();
      
    } catch (error) {

      console.log(error);

      this.handleResponse(res, 500, {
        status: "Error",
        message: "Something went wrong while generating hmac hash"
      });

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

    res.end(JSON.stringify(message));
  }
};

module.exports = PaymentInformationController