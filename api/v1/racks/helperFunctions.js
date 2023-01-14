const db = require('../../../db/db');

async function count(organization_id, data, is_deleted = "false"){

	// const count = is_deleted == "false" ? await db('users').where({deleted_at: null}).count() : await db('users').count()
	console.log(organization_id)
	console.log(data)
	const count = await db('racks').where(builder => {
		if(data != 'undefined' && data != 'null'){
			builder.andWhere({
				organization_id: organization_id,
				deleted_at: null,
				name: data
			});
		}else{
			builder.andWhere({
				organization_id: organization_id,
				deleted_at: null,
			});
		}
	}).count()
	return count[0].count;
}

module.exports = {
	count
}