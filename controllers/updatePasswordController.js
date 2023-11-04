const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.updatePasswordPage = (req, res) => {
    res.render('updatePassword.ejs', { token: req.params.token });
};

exports.updatePassword = async (req, res) => {
    try {
        // retrieve the email and new password from the request body
        const { email, password, confirm_password } = req.body;

        if (password.length < 8) {
            // password is too short, return an error response
            return res.status(400).send({ error: 'Password must be at least 8 characters long' });
        }
        // check if the password and confirmPassword fields match
        if (password !== confirm_password) {
            // the password and confirmPassword fields don't match, return an error response
            return res.status(400).send({ error: 'Password and confirm password do not match' });
        }

        // find the user with the provided email in the database
        const user = await User.findOne({ email });
        console.log(user)

        // if the user exists, update their password
        if (user) {
            // hash the new password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // update the user's password in the database
            await User.updateOne({ email }, { password: hashedPassword });

            // redirect the user to the login page
            res.redirect('/login');
        } else {
            // no user was found with the provided email, return an error response
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        // there was an error, send an error response to the client
        res.status(500).send({ error: 'Error updating password' });
    }
};
