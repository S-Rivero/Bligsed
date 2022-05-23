const express = require('express');
const app = require('../app');
const router = express.Router();

const passport = require('../lib/passport');


router.get('/registro', (req, res) => {
    res.render('registro.hbs');
});

router.post('/registro', (req, res) => {
    res.send(req.body);
});

// router.post('/login',
//     passport.authenticate('local', { failureRedirect: '/about' }),
//     function (req, res) {
//         res.redirect('/');
// });

// router.post('/auth', function (req, res) {
// 	// Capture the input fields
// 	let username = req.body.username;
// 	let password = req.body.password;
// 	// Ensure the input fields exists and are not empty
// 	if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				req.session.loggedin = true;
// 				req.session.username = username;
// 				// Redirect to home page
// 				res.redirect('/home');
// 			} else {
// 				res.send('Incorrect Username and/or Password!');
// 			}
// 			res.end();
// 		});
// 	} else {
// 		res.send('Please enter Username and Password!');
// 		res.end();
// 	}
// });

// router.get('/home', function (req, res) {
// 	// If the user is loggedin
// 	if (req.session.loggedin) {
// 		// Output username
// 		res.send('Welcome back, ' + req.session.username + '!');
// 	} else {
// 		// Not logged in
// 		res.send('Please login to view this page!');
// 	}
// 	res.end();
// });
module.exports = router;