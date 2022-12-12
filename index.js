require('dotenv').config()
const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const port = process.env.PORT;


const bp = require('body-parser');
const helmet = require('helmet')
const morgan = require('morgan')

const api = require('./api/v1/api')

app.use(helmet())
app.use(morgan('dev'))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!',
	})
})


app.listen(port, ()=>{
	console.log(`App is listening on port ${port}`)
})

app.use('/api', api);