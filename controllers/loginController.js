const bcrypt = require("bcrypt");
const User = require('../models/user');


exports.loginPage = (req, res) => {
    res.render('login.ejs')
}

exports.loginUser = async (req, res) => {
    try {
        // retrieve the email and password from the request body
        const { email, password } = req.body;

        // find the user with the provided email in the database
        const user = await User.findOne({ email });

        // if the user exists, check if the provided password matches the hashed password
        if (user) {
            // use bcrypt to compare the provided password with the hashed password
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // the password matches, log the user in and redirect to the dashboard
                req.session.user = user;
                res.redirect('/home');
            } else {
                // the password does not match, return an error response
                res.status(401).send({ error: 'Incorrect email or password' });
            }
        } else {
            // no user was found with the provided email, return an error response
            res.status(401).send({ error: 'Incorrect email or password' });
        }
    } catch (error) {
        // there was an error, send an error response to the client
        res.status(500).send({ error: 'Error logging in' });
    }
};

