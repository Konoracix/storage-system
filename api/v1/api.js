const express = require('express')
const app = express();

const racks = require('./racks/racks');
const auth = require('./auth/auth')
const categories = require('./categories/categories')
const items = require('./items/items')

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!'
	})
})
app.use('/racks', racks);
app.use('/auth', auth);
app.use('/categories', categories);
app.use('/items', items);


module.exports = app;