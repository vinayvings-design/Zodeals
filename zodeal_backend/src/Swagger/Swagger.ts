import path from "path";
import { fileURLToPath } from "url";
import swaggerJSDoc, { Options as SwaggerJSDocOptions } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupSwagger = (app: Express): void => {
  const swaggerDefinition = {
    swagger: "2.0",
    info: {
      title: "ZoDeals API Documentation",
      description: "RESTful API for ZoDeals services",
      version: "1.0.0",
    },
  };

  const options: SwaggerJSDocOptions = {
    swaggerDefinition,
    apis: [
      //prod
      path.join(__dirname, "../Controllers/*.js"),
      path.join(__dirname, "../Routes/*.js"),
      //local
      // path.join(__dirname, "../Controllers/*.ts"),
      // path.join(__dirname, "../Routes/*.ts"),
    ],
  };

  const extraOptions = {
    explorer: true,
    swaggerOptions: {
      validatorUrl: null,
    },
    customSiteTitle: "Swagger - ZoDeals",
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, extraOptions)
  );
};

export default setupSwagger;
