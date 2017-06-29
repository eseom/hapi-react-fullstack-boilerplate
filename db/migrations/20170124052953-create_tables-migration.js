module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE } = Sequelize
    return queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
      username: STRING,
      email: STRING,
      created_at: DATE,
      updated_at: DATE,
    }).then(() => {
      queryInterface.createTable('todos', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
        title: STRING,
        user_id: {
          type: INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
        },
        created_at: DATE,
        updated_at: DATE,
      })
    }).then(() => (
      queryInterface.sequelize.query(
        `INSERT INTO users
          (id, username, email, created_at, updated_at)
          VALUES
          (1, 'tester', 'tester@hrfb.com', current_timestamp, current_timestamp);`)
    ))
  },
  down: queryInterface => (
    queryInterface.dropTable('users').then(() => (
      queryInterface.dropTable('todos')
    ))
  ),
}
