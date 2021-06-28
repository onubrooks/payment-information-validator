const Luhn = require("./Luhn")

module.exports = class CreditCardValidator {
  validateCardNumber(num) {
    let luhn = new Luhn()
    let isValid = luhn.validate(num)

    if(isValid){
      return {
        key: "card_number",
        valid: true,
        message: "valid credit card number"
      }
    }
    return {
      key: "card_number",
      valid: false,
      message: "invalid credit card number"
    };
  }

  validateExpirationDate() {}

  validateCVV(cvv) {
    return {
      key: "cvv",
      valid: true,
      message: "cvv is valid"
    };
  }

  validateEmail() {}
};