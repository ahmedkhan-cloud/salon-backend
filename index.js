const Hapi = require("@hapi/hapi");
const userRoutes = require("./routes/userRoutes");
const slotsRoutes = require("./routes/slotsRoutes");
const requestsRoutes = require("./routes/requestRoutes");
const mongoose = require("mongoose");
const HapiJWT = require("hapi-auth-jwt2");

const JWT_SECRET = "vqncola84lY()y^go(%^vnE08(yg57pmr0msgpc487)*";

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
  routes: {
    cors: {
      origin: ["https://salon-frontend-five.vercel.app"],
      credentials: true,
      additionalHeaders: ["authorization", "content-type"],
    },
  },
});

server.ext("onPreResponse", (request, h) => {
  const response = request.response;

  if (response.isBoom) {
    const code = response.output.statusCode;
    console.log(`An error occured at ${request.path}: `, response.message);
    return h.response({
      code,
      error: response.output.payload.error,
      message: response.message,
    });
  }

  return h.continue;
});

server.route([...userRoutes, ...slotsRoutes, ...requestsRoutes]);

const validate = (decoded, request, h) => {
  if (!decoded || !decoded.id) {
    return { isValid: false };
  }

  return {
    isValid: true,
    credentials: {
      userId: decoded.id,
      role: decoded.role,
    },
  };
};

const start = async () => {
  await server.register(HapiJWT);
  await mongoose
    .connect("mongodb+srv://ahmedkhan_db_user:RP2Xb3O23KiwsVAR@practicecluster.56wf7m0.mongodb.net/?retryWrites=true&w=majority&appName=practiceCluster")
    .then(() => console.log("DB connected"));

  await server.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate,
    verifyOption: { algorithm: ["HS256"] },
  });

  server.auth.default("jwt");
  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
};

start();
