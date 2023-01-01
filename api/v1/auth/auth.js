const db = require('../../../db/db');
const express = require('express')
const app = express();
const bcrypt = require('bcrypt');
const helperFuncions = require('./helperFunctions'); 
const jwt = require('jsonwebtoken');
const moment = require('moment')

app.post('/addOrganization', async (req, res) => {
	const now = new Date();
	const insertedData = await db('organizations').insert({
		...req.body,
		created_at: now,
		updated_at: now
	}).returning('*');
	res.json(insertedData[0]);
});

app.delete('/removeOrganization/:id', async (req, res) => {
	const now = new Date();
	const deletedUser = await db('organizations').where({id: req.params.id}).update({
		updated_at: now,
		deleted_at: now
	}).returning('*')
	res.json({
		message: `succesfully deleted organization with id: ${req.params.id}`,
		deleted_user: deletedUser[0]
	})
});

app.get('/getAllOrganizations', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('organizations').where(builder => {
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

app.get('/getOneOrganization/:id', async (req, res) => {
	const data = await db('organizations').where({
		id: req.params.id,
		deleted_at: null
	});
	res.json(data[0]);
});

app.put('/editOrganization/:id', async (req, res) => {
	const editedOrganization = await db('organizations').where({id: req.params.id}).update({
		...req.body,
		updated_at: new Date()
	}).returning('*');
	res.json(editedOrganization[0]);
})

app.post('/addUser', async (req, res) => {
	const user = req.body;
	const now = new Date();
	let salt = bcrypt.genSaltSync(12);
	const hashedPassword = bcrypt.hashSync(req.body.password, salt);
	user.password = hashedPassword;
	user.created_at = now;
	user.updated_at = now;
	const createdUser = await db('users').insert(user).returning("*")
	res.json(createdUser[0])
})

app.delete('/removeUser/:id', async (req, res) => {
	const id = req.params.id;
	const now = new Date();
	const deletedUser = await db('users').where({id: id}).update({
		updated_at: now,
		deleted_at: now
	}).returning('*');
	res.json({
		message: `succesfully deleted user with id: ${req.params.id}`,
		deleted_user: deletedUser[0]
	})
})

app.get('/getAllUsers', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('users').where(builder => {
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

app.get('/getOneUser/:id', async (req, res) => {
	const user = await db('users').where({
		id: req.params.id,
		deleted_at: null
	});
	res.json(user[0])
})

app.put('/editUser/:id', async (req, res) => {
	let user = req.body;
	let salt = bcrypt.genSaltSync(12);
	if(user.password){
		user.password = bcrypt.hashSync(req.body.password, salt);
	}
	const updatedUser = await db('users').where({id: req.params.id}).update({
		...req.body,
		updated_at: new Date()
	}).returning('*');
	res.json(updatedUser[0])
})
// ----------
// permisions
// ----------

app.post('/addPermission', async (req, res) => {const { JsonWebTokenError } = require('jsonwebtoken');
})

app.delete('/removePermission/:id', async (req, res) => {
	const id = req.params.id;
	const now = new Date();
	const deletedPermissions = await db('permissions').where({id: id}).update({
		updated_at: now,
		deleted_at: now
	}).returning('*');
	res.json({
		message: `succesfully deleted permission with id: ${req.params.id}`,
		deleted_user: deletedPermissions[0]
	})
})

app.get('/getAllPermissions', async (req, res) => {
	const filterQueries = {
		limit: req.query.limit ?? 10,
		currentPage: req.query.current_page ?? 1,
		isDeleted: req.query.is_deleted ? req.query.is_deleted.toString() : "false",
		dateFrom: req.query.date_from,
		dateTo:	req.query.date_to
	}
	const dbData = await db('permissions').where(builder => {
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

app.get('/getOnePermission/:id', async (req, res) => {
	const permissions = await db('permissions').where({
		id: req.params.id,
		deleted_at: null
	});
	res.json(permissions[0])
})

app.put('/editPermission/:id', async (req, res) => {
	const updatedPermission = await db('permissions').where({id: req.params.id}).update({
		...req.body,
		updated_at: new Date()
	}).returning('*');
	res.json(updatedPermission[0])
})

app.get('/login', async (req, res) => {
	let mail = req.body.mail;
	let password = req.body.password;
	let user = (await db('users').select('*').where({
		mail: mail,
		deleted_at: null
	}))[0]
	if(user) {
		const result = await bcrypt.compare(password, user.password)
		if(result){
			let expiration_date = moment().add(1, 'hour').format();
			let jsonData = {
				mail: user.mail,
				user_id: user.id,
				expiration_date: expiration_date
			}
			let accessToken = {
				expiration_date: expiration_date,
				token: await jwt.sign(jsonData, 'AndrewTateDrinksBubbles'),
				user_id: user.id
			}
			const createdSession = await db('sessions').insert(accessToken).returning('*');
			res.json(createdSession[0]);
		}else{
			res.json({
				message: "Invalid data. API sad :("
			})
		}
	}else{
		res.json({
			message: "Invalid data. API sad :("
		})
	}
})

module.exports = app;