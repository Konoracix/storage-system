require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT;


const middlewares = require('./middlewares')

const bp = require('body-parser');
const helmet = require('helmet')
const morgan = require('morgan')

const api = require('./api/v1/api')

app.use(helmet())
app.use(morgan('dev'))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.get('/', (req, res) => {
	res.json({
		message: 'Api v1 works good!',
	})
})


app.listen(port, ()=>{
	console.log(`App is listening on port ${port}`)
})
app.use(middlewares.authenticateJWT)	

app.use('/api', api);

app.use(middlewares.notFound)