const express = require('express')
const db = require('../../../db/db');
const app = express();

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!'
	});	
})

app.post('/addRack', async (req, res) => {
	const body = req.body;
	const now = new Date();
	const createdRack = await db('racks').insert({
		name: body.name,
		shelves: body.shelves,
		places: body.places,
		created_at: now,
		updated_at: now,
	}).returning('*');
	res.json(createdRack[0])
})

module.exports = app;