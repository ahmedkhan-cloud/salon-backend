const Request = require("../models/requestModel");

module.exports = {
  getRequests: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const requests = await Request.find().sort({ requestedAt: -1 }).populate('user slot');

        if (!requests) {
          return h.response({
            status: "not found",
          });
        }

        return h
          .response({
            status: "success",
            message: "There are requests",
            requests: requests,
          })
          .code(200);
      } catch (err) {
        console.log(
          "An Error occured while getting requests info: ",
          err.message
        );
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  createRequest: async (request, h) => {
    try {
      const id = request.auth.credentials.userId;
      const createRequest = Request({ ...request.payload, user: id });

      await createRequest.save();

      return h
        .response({
          status: "success",
          message: "Request created Successfully",
        })
        .code(201);
    } catch (err) {
      console.log("An Error occured while creating request: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  deleteRequest: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const id = request.params.id;

        await Request.findOneAndDelete({ _id: id });

        return h
          .response({
            status: "success",
            message: "Request Deleted Successfully",
          })
          .code(200);
      } catch (err) {
        console.log("An Error occured while deleting request info: ", err.message);
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
};
