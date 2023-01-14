const express = require('express');
const db = require('../../../db/db');
const app = express();
const validator = require('../validator');
const helperFuncions = require('./helperFunctions') 

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!'
	});	
})

app.post('/addRack', 	async (req, res) => {
	const body = req.body;
	const now = new Date();
	const validation = validator.validateRackData(body);
	let responseData = validation.message;
	res.statusCode = 400;
	if(validation.validationStatus){
		const createdRack = await db('racks').insert({
			...req.body,
			created_at: now,
			updated_at: now,
		}).returning('*');
		responseData = createdRack[0];
		res.statusCode = 200;
	}
	res.json(responseData)
})

app.get('/getRack', async (req, res) => {
	const searchingData = req.body;
	const foundCategory = (await db('racks').select('*').where({...searchingData,
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

app.get('/getRacks', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('racks').where(builder => {
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

app.get('/getRacksBySearch/:id/:data', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
		const dbData = await db('racks').where(builder => {
			// || req.params.data != 'null'
			if(req.params.data != 'undefined' && req.params.data != 'null'){
				builder.andWhere({
					organization_id: req.params.id,
					deleted_at: null,
					name: req.params.data
				});
			}else{
				builder.andWhere({
					organization_id: req.params.id,
					deleted_at: null,
				});
			}
	})
	.limit(filterQueries.limit)
	.offset((filterQueries.currentPage-1)*filterQueries.limit)
	.select('*')
	.orderBy('id');
	res.json({
		current_page: parseInt(filterQueries.currentPage),
		limit: parseInt(filterQueries.limit),
		total_pages: Math.ceil(await helperFuncions.count(req.params.id, req.params.data,  filterQueries.isDeleted) / filterQueries.limit),
		data: dbData
	})
})

app.delete('/deleteRack/:id', async (req, res) => {
	const id = req.params.id;
	const now = new Date();
	await db('racks').where({id: id}).update({
		deleted_at: now,
		updated_at: now
	})
	res.json({
		message: `succesfully deleted rack with id: ${id}`
	})
})

app.put('/editRack/:id', async (req, res) => {
	let response = {
		message: `Can't update created_at and updated_at!`
	};
	res.statusCode = 400
	const id = req.params.id;
	const body = req.body;
	if(body.updated_at == null && body.created_at == null){
		body.updated_at = new Date();
		response = (await db('racks').where({id: id}).update(body).returning('*'))[0];
		res.statusCode = 200	
	}
	res.json(response);
})

module.exports = app;