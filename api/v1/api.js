const express = require('express')
const app = express();

const racks = require('./racks/racks');

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!'
	})
})
app.use('/racks', racks);


module.exports = app;