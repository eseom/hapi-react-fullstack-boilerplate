/* eslint prefer-arrow-callback: "off" */

import { expect } from 'chai'
import { describe, it, before, beforeEach } from 'mocha'
import { models, sequelize } from '../core'

const { User } = models

before(async function () {
  await sequelize.sync({ force: true })
})

describe('UserTest', () => {
  let u

  beforeEach(() => {
    u = User.build({
      username: 'example-user',
      password: 'foobar',
      passwordConfirmation: 'foobar',
    })
  })

  it('save an user', async function () {
    const user = await u.save()
    expect(user.username).equal('example-user')
  })

  it('get the saved user', async function () {
    const user = await User.find({
      where: {
        username: 'example-user',
      },
    })
    expect(user.username).equal('example-user')
    expect(user.authenticate('foobar2')).equal(false)
    expect(user.authenticate('foobar')).equal(true)
  })
})
