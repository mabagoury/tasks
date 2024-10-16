import fs from 'fs'
import YAML from 'yaml';
import * as swaggerUi from 'swagger-ui-express';

import express from 'express';
import bodyParser from "body-parser";
import helmet from "helmet";

import { tasksRouter } from "./routes/tasks.routes";
import { usersRouter } from "./routes/users.routes";
import { isAuthenticated } from './middlewares/isAuthenticated.middleware';

const tasks = express();

// middlewares
tasks.use(express.json());
tasks.use(helmet());
tasks.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
tasks.use(bodyParser.json({limit: "30mb"}));
tasks.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

tasks.use('/tasks', isAuthenticated,tasksRouter);
tasks.use('/users', usersRouter);

// Setup Swagger docs
const swaggerFile = fs.readFileSync(process.cwd() + '/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);
const swaggerUiOptions = {
  customSiteTitle: 'Tasks',
};
tasks.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

const PORT = process.env.PORT || 3000;

tasks.listen(PORT, () => {
    console.log(`Server running ....`);
  });
    