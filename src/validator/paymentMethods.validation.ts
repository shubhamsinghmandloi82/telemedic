import Joi from "joi";

export const paymentMethod = Joi.object().options({
    abortEarly: false,
    allowUnknown: true,
}).keys({
    type: Joi.string().valid("card", "bank").required(),
    card_number: Joi.string().when("type", {
        is: "card",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    card_name: Joi.string().when("type", {
        is: "card",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    card_expiry: Joi.string().when("type", {
        is: "card",
        then: Joi.string().custom((value) => {
            const [month, year] = value.split("/");
            Joi.assert(parseInt(month), Joi.number().integer().min(1).max(12).required());
            Joi.assert(parseInt(year), Joi.number().integer().min(1).max(99).required());
            return value;
        }).required(),
        otherwise: Joi.forbidden(),
    }),
    card_cvv: Joi.string().when("type", {
        is: "card",
        then: Joi.string().length(3).required(),
        otherwise: Joi.forbidden(),
    }),
    bank_name: Joi.string().when("type", {
        is: "bank",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    account_number: Joi.string().when("type", {
        is: "bank",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    account_name: Joi.string().when("type", {
        is: "bank",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    account_type: Joi.string().when("type", {
        is: "bank",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    ifsc_code: Joi.string().when("type", {
        is: "bank",
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
});