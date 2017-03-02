module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING } = Sequelize
    return queryInterface.addColumn('users', 'password', {
      type: STRING,
    }).then(() => (
      queryInterface.sequelize.query( // password 1234
        `UPDATE users
         SET password = '$2a$10$Fnh/BI5zerG4EGESnBN0B.x7yU6ny4F2g1gFUjoTTlD0fhuip2Fm2'
         WHERE id = 1;`,
      )
    ))
  },
  down: queryInterface => (
    queryInterface.removeColumn('users', 'password')
  ),
}
