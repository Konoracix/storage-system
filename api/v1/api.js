const express = require('express')
const app = express();

const racks = require('./racks/racks');
const auth = require('./auth/auth')

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!'
	})
})
app.use('/racks', racks);
app.use('/auth', auth);


module.exports = app;