// @flow

export default (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE } = DataTypes;
  const User = sequelize.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
    username: STRING,
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Todo);
      },
    },
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return {
    User,
  };
};
