import {body} from "express-validator";

export default body("email")
    .isString()
    .withMessage("Введите корректный email")
    .bail()
    .trim()
    .customSanitizer((value) => value.toLowerCase())
    .isLength({max: 254})
    .withMessage("Email должен быть не длиннее 254 символов")
    .bail()
    .isEmail()
    .withMessage("Введите корректный email");
