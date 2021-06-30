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

  validateExpirationDate(expiration_date) {
    let mmddRe = /^(0?[1-9]|1[012])[\/\-]\d{4}$/;
    let valid = mmddRe.test(expiration_date);
    if (!valid) {
      return {
        key: "expiration_date",
        valid: false,
        message: "expiration_date is not a valid mm/yyyy date format"
      };
    }
    let dateArr = expiration_date.split(/[\/\-]/);
    let month = parseInt(dateArr[0]),
      year = parseInt(dateArr[1]);

    // Check the range of year
    if(year < 1000 || year > 3000){
      return {
        key: "expiration_date",
        valid: false,
        message: "year is out of range"
      };
    }

    // check if card is expired
    let today = new Date(), expiry = new Date(year, month-1);
    if(today.getTime() > expiry.getTime()){
      // today is newer
      return {
        key: "expiration_date",
        valid: false,
        message: "card is expired"
      };
    }

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