// @flow

import { command, modules } from './server/core'

modules.install()
command.execute(process.argv[2], process.argv[3])
