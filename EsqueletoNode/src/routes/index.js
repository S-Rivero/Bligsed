const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    // res.render('index', {title: 'First Website'});
    res.send('Directorio Raiz');
});

router.get('/about', (req,res)=>{
    // res.render('about');
    res.send('/About');
});

router.post('/auth', function (req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.get('/home', function (req, res) {
	// If the user is loggedin
	if (req.session.loggedin) {
		// Output username
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
});
module.exports = router;