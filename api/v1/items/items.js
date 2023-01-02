const db = require('../../../db/db');
const express = require('express');
const app = express();
const moment = require('moment')
const helperFuncions = require('./helperFunctions')

app.post('/addItem', async (req, res) => {
	let item = req.body;
	const now = moment();
	item.created_at = now;
	item.updated_at = now;
	const created_item = await db('items').insert(item).returning('*');
	res.json(created_item[0]);
})

app.delete('/deleteItem/:id', async (req, res) => {
	const id = req.params.id;
	const now = moment();
	const deletedItem = await db('items').where({id: id}).update({
		updated_at: now,
		deleted_at: now
	}).returning("*")
	res.json(deletedItem[0]);
})

app.get('/getAllItems', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('items').where(builder => {
		if(filterQueries.isDeleted == "false"){
			builder.andWhere("deleted_at", null);
		}if(filterQueries.dateTo){
			builder.andWhere("created_at", "<", filterQueries.dateTo)
		}if(filterQueries.dateFrom){
			builder.andWhere("created_at", ">", filterQueries.dateFrom)
		}
	})
	.limit(filterQueries.limit)
	.offset((filterQueries.currentPage-1)*filterQueries.limit)
	.select('*');

	res.json({
		current_page: parseInt(filterQueries.currentPage),
		limit: parseInt(filterQueries.limit),
		total_pages: Math.ceil(await helperFuncions.count(filterQueries.isDeleted) / filterQueries.limit),
		data: dbData
	})
})

app.get('/getOneItem', async (req, res) => {
	const searchingData = req.body;
	const foundCategory = (await db('items').select('*').where({...searchingData,
		deleted_at: null
	}))[0];
	if(foundCategory){
		res.json(foundCategory)
	}else{
		res.json({
			message: 'Data not found'
		})
	}
})

app.put('/editItem/:id', async (req, res) => {
	const dataToChange = req.body;
	const editedCategory = await db('items').where({id: req.params.id})
	.update({...dataToChange, updated_at: moment()}).returning('*')
	res.json(editedCategory[0])
})

module.exports = app;