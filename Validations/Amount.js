module.exports = class AmountValidator {
  validateAmount(amount) {
    let re = /^[1-9]\d+$/;
    let valid = re.test(amount);
    if (!valid) {
      return {
        key: "charge_amount",
        valid: false,
        message: "charge amount must be a number greater than zero (0)"
      };
    }

    return {
      key: "charge_amount",
      valid: true,
      message: "charge amount is valid"
    };
  }
};
