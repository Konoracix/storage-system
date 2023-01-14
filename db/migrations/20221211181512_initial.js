/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('organizations', function (table) {
		table.increments('id');
		table.string('organization_name', 255).notNullable();
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');

	}).createTable('users', function (table) {
		table.increments('id');
		table.bigInteger('organization_id').references('id').inTable('organizations').notNullable()
		table.string('name', 255);
		table.string('surname', 255);
		table.string('mail', 255).notNullable().unique();
		table.string('password', 255).notNullable();
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');
		
	}).createTable('permissions', function (table){
		table.increments('id');
		table.bigInteger('user_id').references('id').inTable('users').notNullable().unique();
		table.boolean('users_permissions').defaultTo(false);
		table.boolean('racks_permissions').defaultTo(false);
		table.boolean('items_premissions').defaultTo(false);

		// table.boolean('adding_users').defaultTo(false);
		// table.boolean('editing_users_permissions').defaultTo(false);
		// table.boolean('removing_users').defaultTo(false);
		// table.boolean('adding_racks').defaultTo(false);
		// table.boolean('editing_racks').defaultTo(false);
		// table.boolean('removing_racks').defaultTo(false);
		// table.boolean('adding_items').defaultTo(false);
		// table.boolean('editing_items').defaultTo(false);
		// table.boolean('removing_items').defaultTo(false);
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');
		
	}).createTable('sessions', function (table){
		table.increments('id');
		table.string('token');
		table.timestamp('expiration_date').notNullable();
		table.bigInteger('user_id').references('id').inTable('users');
		
	}).createTable('categories', function (table){
		table.increments('id');
		table.bigInteger('organization_id').references('id').inTable('organizations').notNullable();
		table.string('category_name');
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');

	}).createTable('racks', function (table){
		table.increments('id');
		table.bigInteger('organization_id').references('id').inTable('organizations').notNullable();
		table.string('name', 255).notNullable();
		table.bigInteger('shelves').notNullable();
		table.bigInteger('places').notNullable();
		table.timestamp('created_at').notNullable();
		table.timestamp('updated_at').notNullable();
		table.timestamp('deleted_at');

	}).createTable('items', function (table){
		table.increments('id');
		table.bigInteger('organization_id').references('id').inTable('organizations').notNullable();
		table.bigInteger('categories_id').references('id').inTable('categories').notNullable();
		table.bigInteger('rack_id').references('id').inTable('racks').notNullable();
		table.bigInteger('shelve_number').notNullable();
		table.bigInteger('place_number').notNullable();
		table.string('name', 255).notNullable();
		table.string('description', 255);
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
	await knex.schema.dropTable('categories');
	await knex.schema.dropTable('sessions');
	await knex.schema.dropTable('permissions');
	await knex.schema.dropTable('users');
	await knex.schema.dropTable('organizations');

};
