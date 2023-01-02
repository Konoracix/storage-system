const db = require('../../../db/db');

async function count(is_deleted = "false"){
	const count = is_deleted == "false" ? await db('racks').where({deleted_at: null}).count() : await db('racks').count()
	return count[0].count;
}

module.exports = {
	count
}