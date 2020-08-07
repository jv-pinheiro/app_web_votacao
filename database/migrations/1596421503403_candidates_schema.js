'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CandidatesSchema extends Schema {
  up () {
    this.create('candidates', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('image', 254)
      table.string('office', 254).notNullable()
      table.text('description').notNullable()
      table.integer('votes', 11).notNullable().unsigned()

      table.timestamps()
    })
  }

  down () {
    this.drop('candidates')
  }
}

module.exports = CandidatesSchema
