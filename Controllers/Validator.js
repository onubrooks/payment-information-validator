module.exports = class Validator {
  validate = (body, keys, allRules) => {
    let validations = keys.map(key => {
      let value = body[key];
      // rules is an array of functions/validations that return an object {valid: bool, message: string}
      let rules = allRules[key];
      if (!rules) {
        return [
          {
            key,
            valid: true,
            message: "no validations given"
          }
        ];
      }
      let outcomes = rules.map(valFunc => {
        return valFunc(value);
      });
      return outcomes;
    });
    
    // flatten the array using reduce and concat, then filter out the valid data and return the invalid
    return validations
        .reduce((acc, val) => acc.concat(val), [])
        .filter(item => !item.valid)
  };
};