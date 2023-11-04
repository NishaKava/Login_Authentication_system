const bcrypt = require('bcrypt')
const User = require('../models/user');

exports.registerPage = (req, res) => {
    res.render('register.ejs')
}

exports.registerUser = async (req, res) => {
    try {
        // retrieve the name, email, password, and confirm password from the request body
        const { name, email, password, confirm_password } = req.body;

        // perform validation on the name, email, password, and confirm password
        if (!name || !email || !password || !confirm_password) {
            // one or more fields are empty, return an error response
            console.log(name, email, password, confirm_password)
            return res.status(400).send({ error: 'Name, email, password, and confirm password are required' });
        }
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
            // email is not in a valid format, return an error response
            return res.status(400).send({ error: 'Invalid email address' });
        }
        if (password.length < 8) {
            // password is too short, return an error response
            return res.status(400).send({ error: 'Password must be at least 8 characters long' });
        }
        if (password !== confirm_password) {
            // passwords do not match, return an error response
            return res.status(400).send({ error: 'Passwords do not match' });
        }

        // check if a user with the same email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            // a user with the same email already exists, return an error response
            return res.status(400).send({ error: 'Email already in use' });
        }

        // hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user object using the name, email, and hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // save the user to the database
        await user.save();

        // Redirect the user to the login page
        res.redirect('/login');
    } catch (error) {
        // there was an error, send an error response to the client
        res.status(500).send({ error: 'Error registering user' });
    }
};
