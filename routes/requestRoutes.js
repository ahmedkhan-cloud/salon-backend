const requestHandler = require("../handlers/requestHandlers");

module.exports = [
  {
    method: "GET",
    path: "/api/requests",
    handler: requestHandler.getRequests,
  },
  {
    method: "POST",
    path: "/api/requests",
    handler: requestHandler.createRequest,
  },
  {
    method: "DELETE",
    path: "/api/requests/{id}",
    handler: requestHandler.deleteRequest,
  },
];
