module.exports = class EmailValidator {
  validateEmail() {
    return {
      key: "email",
      valid: true,
      message: "email is valid"
    };
  }
};
