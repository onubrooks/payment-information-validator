module.exports = class Validator{
    validate = (body, allRules) => {
        
        let validations = Object.keys(body).map(key => {
            let value = body[key];
            // rules is an array of functions/validations that return an object {valid: bool, message: string}
            let rules = allRules[key];
            if(!rules){
                return [
                  {
                    key,
                    valid: true,
                    message: "no validations given"
                  }
                ];
            }
            let outcomes = rules.map(valFunc => {
                return valFunc(value)
            })
            return outcomes;
        })
        return validations;
    }
}