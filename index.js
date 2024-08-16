const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const Connection = require('./database/db');
const Routes = require('./routes/route');

const app = express();

const PORT = process.env.PORT || 8000;



Connection();
// Set security headers
app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, 
//     max: 100 // limit each IP to 100 requests per windowMs
//   });
//   app.use(limiter);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// Configure CORS
app.use(cors({
    origin: 'https://leninecommerce.netlify.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
  }));
  
  // Handle pre-flight requests
  app.options('*', cors());
app.use('/', Routes);


// Error handling middleware
app.use(errorHandler);
  


app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));




