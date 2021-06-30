module.exports = class PhoneNumberValidator {
  validatePhoneNumber(phone) {
    let nigerianRe = /^\d{11}$/;
    let internationalRe = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
    // let re2 = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
    let valid = nigerianRe.test(phone);
    let valid_international = internationalRe.test(phone);
    if (!valid && !valid_international) {
      return {
        key: "phone_number",
        valid: false,
        message: "phone number must be 11 numeric characters long or have the international format"
      };
    }
    return {
      key: "phone_number",
      valid: true,
      message: "phone number is valid"
    };
  }
};
