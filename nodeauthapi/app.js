const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'shhhhh', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
	    message: 'Post created',
	    authData
      });
    }
  });

});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
	id: 1,
	username: 'Lily',
	email: 'lily@gmail.com'
  }

  // Sign asynchronously. Adds a callback function
  jwt.sign({user: user}, 'shhhhh', {expiresIn: '30s'}, (err, token) => {
	res.json({
	  token: token
	});
  });
});

// Format of token
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  console.log(req.headers);
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
  	// Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
	// Forbidden
	res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server started on port 5000'));