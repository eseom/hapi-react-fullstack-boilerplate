// @flow

import { expect } from 'chai';
import { models, sequelize } from '../core';

const { User, Todo } = models;

before(async (done) => {
  await sequelize.sync({ force: true });
  done(null);
});

describe('TodoTest', () => {
  let user;

  beforeEach(async () => {
    const u = User.build({
      username: 'todo-user',
      password: 'todopassword',
      passwordConfirmation: 'todopassword',
    });
    user = await u.save();
  });

  const saveTodo = async() => {
    await Todo.create({
      title: 'todo title1',
      userId: user.id,
    });
  };

  it('save a todo', async () => {
    saveTodo();

    const todo = await Todo.find();
    expect(todo.title).equal('todo title1');
  });
});
