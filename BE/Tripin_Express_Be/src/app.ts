import express from 'express';
import { errorHandler } from './middlewares/error-handler.middleware';
import { authRouter, authSession } from './auth/routes/auth.route';
import cors from 'cors';
import { aiRouter } from './ai/ai.routes';
import { tripManagementRouter } from './trip-mangement/routes/trip-mangement.routes';

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your specific origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());


app.use('/auth', authRouter);
app.use(authSession);
app.use('/ai', aiRouter); 
//TODO append api to urls
//add autg to all paths
app.use('/trips', tripManagementRouter);



// Global error handler (should be after routes)
app.use(errorHandler);

export default app;