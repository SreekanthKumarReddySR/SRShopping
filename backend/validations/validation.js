import Joi from '@hapi/joi';

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid("customer", "seller").required()
    });
    return schema.validate(data);
};


const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).unknown(true); // allow other fields like "name"
    return schema.validate(data);
};



export { registerValidation, loginValidation };
