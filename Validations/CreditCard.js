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

  validateExpirationDate() {
    return {
      key: "expiration_date",
      valid: true,
      message: "expiration date is valid"
    };
  }

  validateCVV(cvv) {
    // a valid cvv has 3 or 4 digits, only numeric characters(0-9), and no alphabets or special chars
    let re = /^[0-9]{3,4}$/;
    let valid = re.test(cvv);
    if (!valid) {
      return {
        key: "cvv",
        valid: false,
        message: "cvv must be 3 or 4 numeric characters long"
      };
    }
    return {
      key: "cvv",
      valid: true,
      message: "cvv is valid"
    };
  }

};