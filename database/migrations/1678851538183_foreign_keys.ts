import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable('users', (table) => {
      table.foreign('role_id').references('id').inTable('roles').onDelete('SET NULL');
      table.foreign('document_type_id').references('id').inTable('document_types').onDelete('SET NULL');
    })

    this.schema.alterTable('forms', (table) => {
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('answer_id').references('id').inTable('answers').onDelete('CASCADE');
    })

    this.schema.alterTable('answers', (table) => {
      table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE');
    })

  }

  public async down () {
    return;
  }
}
