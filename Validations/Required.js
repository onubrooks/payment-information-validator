module.exports = class RequiredValidator {
  validateRequiredKey(key) {
      return function(val){
          if (!val) {
            return {
              key,
              valid: false,
              message: `${key} is required`
            };
          }
          return {
            key,
            valid: true,
            message: `${key} is present in payload`
          };
      }
  }
};
