import { expect } from 'chai'
import { models, sequelize } from '../core'

const { User } = models

before(async (done) => {
  await sequelize.sync({ force: true })
  done(null)
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

  it('save an user', async () => {
    const user = await u.save()
    expect(user.username).equal('example-user')
  })

  it('get the saved user', async () => {
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
