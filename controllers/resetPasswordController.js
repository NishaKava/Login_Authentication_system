const crypto = require('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// This function could be a standalone utility function or part of a larger
// utility module for handling email functionality in your application
async function sendEmail(to, subject, body) {
    // create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // send the email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body
    });
}

exports.resetPasswordPage = (req, res) => {
    res.render('resetPassword.ejs');
};

exports.resetPassword = async (req, res) => {
    try {
        // retrieve the email from the request body
        const { email } = req.body;

        // find the user with the provided email in the database
        const user = await User.findOne({ email });

        // generate a random token
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');

        // set the reset password token and expiration date on the user object
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour from now

        // save the user to the database
        await user.save();

        // send an email to the user with a link to the reset password page
        const resetPasswordUrl = `http://localhost:3000/updatePassword/${resetPasswordToken}`;
        await sendEmail(email, 'Reset Your Password', `Click here to reset your password: ${resetPasswordUrl}`);

        // redirect the user to the login page
        res.redirect('/login');
    } catch (error) {
        // there was an error, send an error response to the client
        res.status(500).send({ error: 'Error resetting password' });
    }
};
