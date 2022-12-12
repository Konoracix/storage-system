/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('racks', function (table) {
		table.increments('id');
		table.string('name', 255).notNullable();
		table.bigInteger('shelves').notNullable();
		table.bigInteger('places').notNullable();
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');
	})
  .createTable('items', function (table){
		table.increments('id');
		table.bigInteger('rack_id').references('id').inTable('racks').notNullable();
		table.bigInteger('shelve_number').notNullable();
		table.bigInteger('place_number').notNullable();
		table.string('name', 255).notNullable();
		table.string('description', 255);
		table.boolean('ready_to_shipment').defaultTo(false);
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');
	})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('items');
	await knex.schema.dropTable('racks');
};
