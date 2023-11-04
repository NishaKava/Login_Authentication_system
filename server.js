const express = require('express');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
const fs = require("fs/promises");
const mongoose = require('mongoose');
const ejs = require("ejs");

const homeController = require('./controllers/homeController');
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');
const dashboardController = require('./controllers/dashboardController');
const resetPasswordController = require('./controllers/resetPasswordController');
const updatePasswordController = require('./controllers/updatePasswordController');

// Load environment variables from the .env file
dotenv.config();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use the express.urlencoded middleware to parse request bodies
app.use(express.urlencoded({ extended: false }));

// Configure the express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // use a secret key from the .env file to encrypt the session data
  resave: false,
  saveUninitialized: false
}));

// Use the express.static middleware to serve static files from the public directory
app.use(express.static("public"));





// Define routes
app.route('/')
  .get(loginController.loginPage)
  .post(loginController.loginUser);
app.route('/home')

  .get(homeController.homePage);

app.route('/logout')
  .post(dashboardController.logout)

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});



app.route('/resetPassword')
  .get(resetPasswordController.resetPasswordPage)
  .post(resetPasswordController.resetPassword)

app.route('/updatePassword/:token')
  .get(updatePasswordController.updatePasswordPage)

app.route('/updatePassword')
  .post(updatePasswordController.updatePassword)

app.route('/login')
  .get(loginController.loginPage)
  .post(loginController.loginUser);

app.route('/register')
  .get(registerController.registerPage)
  .post(registerController.registerUser);

// Use error-handling middleware to handle errors that occur during the request-response cycle
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
