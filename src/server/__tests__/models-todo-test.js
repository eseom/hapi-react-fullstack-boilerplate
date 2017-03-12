/* eslint prefer-arrow-callback: "off" */

import { expect } from 'chai'
import { before, beforeEach, describe, it } from 'mocha'
import { models, sequelize } from '../core'

const { User, Todo } = models

before(async function () {
  await sequelize.sync({ force: true })
})

describe('TodoTest', () => {
  let user

  beforeEach(async function () {
    user = await User.create({
      username: 'todo-user',
      password: 'todopassword',
      passwordConfirmation: 'todopassword',
    })
  })

  const saveTodo = () => Todo.create({
    title: 'todo title1',
    userId: user.id,
  })

  it('save a todo', async function () {
    await saveTodo()
    const todo = await Todo.find()
    expect(todo.title).equal('todo title1')
  })
})
