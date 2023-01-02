const db = require('../../../db/db');
const express = require('express');
const { dnsPrefetchControl } = require('helmet');
const app = express();
const moment = require('moment')
const helperFuncions = require('./helperFunctions')

app.post('/addCategory', async (req, res) => {
	let category = req.body;
	const now = moment();
	category.created_at = now;
	category.updated_at = now;
	const created_category = await db('categories').insert(category).returning('*');
	res.json(created_category[0]);
})

app.delete('/deleteCategory/:id', async (req, res) => {
	const id = req.params.id;
	const now = moment();
	const deletedUser = await db('categories').where({id: id}).update({
		updated_at: now,
		deleted_at: now
	}).returning("*")
	res.json(deletedUser[0]);
})

app.get('/getAllCategories', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('categories').where(builder => {
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

app.get('/getOneCategory', async (req, res) => {
	const searchingData = req.body;
	const foundCategory = (await db('categories').select('*').where({...searchingData,
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

app.put('/editCategory/:id', async (req, res) => {
	const dataToChange = req.body;
	const editedCategory = await db('categories').where({id: req.params.id})
	.update({...dataToChange, updated_at: moment()}).returning('*')
	res.json(editedCategory[0])
})

module.exports = app;