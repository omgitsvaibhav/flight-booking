import express, { Express } from 'express';
import router from './routes';
import { errorHandler } from './utils/errors';
import cors from 'cors';
import helmet from 'helmet';

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/tentwenty", router);
app.use(errorHandler);

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});