exports.dashboardPage = (req, res) => {
    // get the user from the session
    const user = req.session.user;

    // render the dashboard page and pass the user object
    res.render('dashboard.ejs', { user });
}

exports.logout = (req, res) => {
    // destroy the session
    req.session.destroy();

    // redirect the user to the login page
    res.redirect('/login');
}

