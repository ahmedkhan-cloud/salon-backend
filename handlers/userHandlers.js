const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const JWT_SECRET = "vqncola84lY()y^go(%^vnE08(yg57pmr0msgpc487)*";

module.exports = {
  loginViaEmail: async (request, h) => {
    try {
      const { emailAddress, password, remember } = request.payload;
      const user = await Users.findOne({ emailAddress: emailAddress });

      if (!user) {
        return h
          .response({
            status: "failed",
            message:
              "This email is not associated with any account, try signing up",
          })
          .code(404);
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return h
          .response({
            status: "failed",
            message: "Invalid email or password",
          })
          .code(401);
      }
      let token;

      if (remember) {
        token = JWT.sign(
          {
            id: user._id,
            role: user.role,
          },
          JWT_SECRET,
          { algorithm: "HS256", expiresIn: "144h" }
        );
      } else {
        token = JWT.sign(
          {
            id: user._id,
            role: user.role,
          },
          JWT_SECRET,
          { algorithm: "HS256", expiresIn: "1h" }
        );
      }
      return h
        .response({
          status: "success",
          message: "Logged in successfully",
          token: token,
          role: user.role,
        })
        .code(200);
    } catch (err) {
      console.log(
        "Error occured at login through email handler: ",
        err.message
      );
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  loginViaPhoneNumber: async (request, h) => {
    try {
      const { phoneNumber, password, remember } = request.payload;
      const user = await Users.findOne({ phoneNumber: phoneNumber });

      if (!user) {
        return h
          .response({
            status: "failed",
            message:
              "This phone number is not associated with any account, try signing up",
          })
          .code(404);
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      let token;
      if (!isPasswordCorrect) {
        return h
          .response({
            status: "failed",
            message: "Invalid phone number or password",
          })
          .code(401);
      }
      if (remember) {
        token = JWT.sign(
          {
            id: user._id,
            role: user.role,
          },
          JWT_SECRET,
          { algorithm: "HS256", expiresIn: "144h" }
        );
      } else {
        token = JWT.sign(
          {
            id: user._id,
            role: user.role,
          },
          JWT_SECRET,
          { algorithm: "HS256", expiresIn: "48h" }
        );
      }

      return h
        .response({
          status: "success",
          message: "Logged in successfully",
          token: token,
          role: user.role,
        })
        .code(200);
    } catch (err) {
      console.log(
        "Error occured at login through phone number handler: ",
        err.message
      );
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  signUp: async (request, h) => {
    try {
      const userExists = await Users.findOne({
        $or: [
          { emailAddress: request.payload.emailAddress },
          { phoneNumber: request.payload.phoneNumber },
        ],
      });

      if (userExists) {
        return h
          .response({
            status: "failed",
            message:
              "This phone number or email is already associated with an account, try signing up",
          })
          .code(409);
      }

      const userInfo = request.payload;
      const encryptedPassword = await bcrypt.hash(userInfo.password, 10);
      userInfo.password = encryptedPassword;

      const user = Users(userInfo);
      await user.save();

      return h
        .response({ status: "success", message: "Signed Up successfully" })
        .code(201);
    } catch (err) {
      console.log("Error occured at Sign up handler: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  getUserInfo: async (request, h) => {
    try {
      const id = request.auth.credentials.userId;
      if (!id) {
        return h
          .response({
            status: "failed",
            message: "The id is either invalid or expired",
          })
          .code(401);
      }
      const user = await Users.findOne({ _id: id }).select(
        "-password -__v -_id"
      );

      if (!user) {
        return h
          .response({
            status: "failed",
            message: "The id is either invalid or user doesn't exists",
          })
          .code(401);
      }

      return h.response({ status: "success", userInfo: user }).code(200);
    } catch (err) {
      console.log("An Error occured while getting user info: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  updateUserInfo: async (request, h) => {
    try {
      const id = request.auth.credentials.userId;
      const userData = request.payload;
      if (!id) {
        return h
          .response({
            status: "failed",
            message: "The id is either invalid or expired",
          })
          .code(401);
      }

      await Users.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            emailAddress: userData.emailAddress,
            phoneNumber: userData.phoneNumber,
          },
        }
      );

      const user = await Users.findOne({ _id: id }).select(
        "-password -__v -_id"
      );
      if (!user) {
        return h
          .response({
            status: "failed",
            message: "The id is either invalid or user doesn't exists",
          })
          .code(401);
      }

      return h.response({ status: "success", userInfo: user }).code(200);
    } catch (err) {
      console.log("An Error occured while getting user info: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  getUser: async (request, h) => {
    try {
      const userId = request.auth.credentials.userId;

      if (!userId) {
        return h
          .response({
            status: "failed",
            message: "Token Expired",
          })
          .code(401);
      }

      return h.response({ status: "success" }).code(200);
    } catch (err) {
      console.log("An Error occured while getting user info: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
};
