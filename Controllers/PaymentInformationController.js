const Helpers = require("../Lib/Helpers")

const Validator = require("./Validator")
const CreditCardValidator = require("../Validations/CreditCard")
const EmailValidator = require("../Validations/Email")
const PhoneNumberValidator = require("../Validations/PhoneNumber")
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
    await Helpers.bodyParser(req)
    if (!req.body) {
      this.handleResponse(res, 403, "Forbidden: empty payload");
      return;
    }
    let body = JSON.parse(req.body);
    
    try {
        // handle authorization
      let authorization = req.headers['authorization'] || ""
      
      // let token = authorization.split(' ')[1]
      // let auth = Helpers.authorize(token, body);// res.write(JSON.stringify(auth));res.end();return
      // if(!auth){
      //     this.handleResponse(res, 401, "unauthorized request")
      //     return;
      // }
  
      let contentType = req.headers['content-type']

      let requiredValidator = new RequiredValidator();
      let creditCardValidator = new CreditCardValidator();
      let emailValidator = new EmailValidator();
      let phoneNumberValidator = new PhoneNumberValidator();
      let keys = ['card_number', 'cvv2', 'expiration_date', 'email', 'phone_number'];
      let allRules = {
        card_number: [requiredValidator.validateRequiredKey('card_number'), creditCardValidator.validateCardNumber],
        cvv2: [requiredValidator.validateRequiredKey('cvv2'), creditCardValidator.validateCVV],
        expiration_date: [requiredValidator.validateRequiredKey('expiration_date'), creditCardValidator.validateExpirationDate],
        email: [requiredValidator.validateRequiredKey('email'), emailValidator.validateEmail],
        phone_number: [requiredValidator.validateRequiredKey('phone_number'), phoneNumberValidator.validatePhoneNumber]
      };
      let validator = new Validator();
      let validationResults = validator.validate(body, keys, allRules);
      
      if(validationResults.length){
        res.writeHead(422, {
          "Content-Type": "application/json"
        });
        res.write(
          JSON.stringify({ valid: false, errors: validationResults })
        );
      } else {
         res.writeHead(200, {
           "Content-Type": "application/json"
         });
        res.write(JSON.stringify({ valid: true }));
      }
      res.end();
      
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