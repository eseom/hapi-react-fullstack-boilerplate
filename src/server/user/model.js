// @flow
/* eslint no-param-reassign: "off" */

import bcrypt from 'bcrypt-nodejs'

const hasSecurePassword = (user, options, callback) => {
  if (user.password !== user.passwordConfirmation) {
    throw new Error("Password confirmation doesn't match Password")
  }
  bcrypt.hash(user.get('password'), 10, (err, hash) => {
    if (err) return callback(err)
    user.set('passwordDigest', hash)
    return callback(null, options)
  })
}

export default (sequelize: Object, DataTypes: Object) => {
  const { INTEGER, STRING, VIRTUAL, DATE } = DataTypes

  // https://nodeontrain.xyz/tuts/secure_password/
  const User = sequelize.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, scopes: ['public'] },
    username: STRING,
    passwordDigest: {
      field: 'password',
      type: STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      field: 'passwordVirtual',
      type: VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    passwordConfirmation: {
      type: VIRTUAL,
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
  }, {
    indexes: [{ unique: true, fields: ['username'] }],
    instanceMethods: {
      authenticate: function authenticate(value) {
        if (bcrypt.compareSync(value, this.passwordDigest)) return true
        return false
      },
      toJSON: function toJSON() {
        const values = Object.assign({}, this.get())
        delete values.passwordDigest
        return values
      },
    },
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Todo)
      },
    },
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  })
  User.beforeCreate((user, options, callback) => {
    user.username = user.username.toLowerCase()
    if (user.password) {
      return hasSecurePassword(user, options, callback)
    }
    return callback(null, options)
  })
  User.beforeUpdate((user, options, callback) => {
    user.username = user.username.toLowerCase()
    if (user.password) hasSecurePassword(user, options, callback)
    return callback(null, options)
  })

  return {
    User,
  }
}
