module.exports = class EmailValidator {
  validateEmail(email) {
    let re = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    let valid = re.test(email);
    if (!valid) {
      return {
        key: "email",
        valid: false,
        message: "email is invalid"
      };
    }

    // Further checking for things regex can't handle
    let parts = email.split("@");
    if (parts[0].length > 64) {
     return {
       key: "email",
       valid: false,
       message: "email name part is too long"
     };
    }

    let domainParts = parts[1].split(".");
    if (
      domainParts.some(function(part) {
        return part.length > 63;
      })
    ){
      return {
        key: "email",
        valid: false,
        message: "email domain part is too long"
      };
    }

    return {
      key: "email",
      valid: true,
      message: "email is valid"
    };
  }
};
