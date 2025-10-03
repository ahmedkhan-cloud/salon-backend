const userHandlers = require("../handlers/userHandlers");
const userSchema = require("../joiSchemas/userSchemas");

module.exports = [
  {
    method: "POST",
    path: "/api/user/login/email",
    handler: userHandlers.loginViaEmail,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/api/user/login/phone-number",
    handler: userHandlers.loginViaPhoneNumber,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/api/user/signup",
    handler: userHandlers.signUp,
    options: {
      auth: false,
      validate: {
        payload: userSchema,
        failAction: (request, h, err) => {
          return h
            .response({
              status: "Error",
              message: "Error while validating data at signup",
              details: err.details,
            })
            .code(400);
        },
      },
    },
  },
  {
    method: "GET",
    path: "/api/user",
    handler: userHandlers.getUserInfo,
  },
  {
    method: "PUT",
    path: "/api/user",
    handler: userHandlers.updateUserInfo,
  },
   {
    method: "GET",
    path: "/api/user/check-token",
    handler: userHandlers.getUser,
  },
];
