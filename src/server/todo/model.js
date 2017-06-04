// @flow
import { server } from 'hails'

const { sequelize, DataTypes } = server

const { INTEGER, STRING, DATE } = DataTypes

const Todo = sequelize.define('todos', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
  title: STRING,
  userId: {
    field: 'user_id',
    type: INTEGER,
    reference: { model: 'users', key: 'id' },
  },
  createdAt: { type: DATE, field: 'created_at' },
  updatedAt: { type: DATE, field: 'updated_at' },
},
  {
    classMethods: {
      associate: (models) => {
        Todo.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        })
      },
    },
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  })

export {
  Todo,
}
