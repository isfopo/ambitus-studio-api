const express = require("express");
const app = express();
const expressSwagger = require("express-swagger-generator")(app);

let options = {
  swaggerDefinition: {
    info: {
      title: "Ambitus Studio",
      description:
        "a collaborative music making platform that allows you to create music across the internet with anyone.",
      version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.js"], //Path to the API handle folder
};

expressSwagger(options);

app.listen(3001, () => {
  console.log("swagger UI is listening on port 3001");
});
