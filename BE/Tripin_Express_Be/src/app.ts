import express from 'express';
import { errorHandler } from './middlewares/error-handler.middleware';
import { authOptions, authRouter } from './auth/routes/auth.route';
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your specific origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/auth', authRouter);
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;