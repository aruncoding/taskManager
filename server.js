import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import registerRoutes from './registerRoutes.js';
import db from './models/index.js'
import errorHandler from './middlewares/errorHandler.js';
const app = express()
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true,               
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,                
  message: "Too many requests from this IP, please try again after 15 minutes."
});


app.use(limiter);

// routes
registerRoutes(app);
app.use(errorHandler);
// Sync Sequelize models
db.sequelize.sync()
  .then(() => {
    console.log("Synced db success...");
  })
  .catch((err) => {
    console.log("Failed to sync db...: " + err.message);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});