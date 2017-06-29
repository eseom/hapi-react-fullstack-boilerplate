module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    return queryInterface.addColumn('users', 'email', {
      type: STRING,
    }).then(() => (
      queryInterface.sequelize.query( // password 1234
        `UPDATE users
         SET email = 'tester@hrfb.com'
         WHERE id = 1;`,
      )
    ))
  },
  down: queryInterface => (
    queryInterface.removeColumn('users', 'email')
  ),
}
