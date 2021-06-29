module.exports = class PhoneNumberValidator {
  validatePhoneNumber() {
    return {
      key: "phone_number",
      valid: true,
      message: "phone number is valid"
    };
  }
};
