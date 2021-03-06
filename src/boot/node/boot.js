import * as fs from '../../lib/node/fs.js'
import './polyfills.js'
import NodeProcess from './process.js'
import Process from '../../sys/kernel/process.js'
import init from '../init.js'
import Module from 'module'

export default async function boot (options) {
  let nodeProcess = global.process
  let process = new NodeProcess(options)

  process.enter()

  Object.defineProperties(nodeProcess, {
    argv: {get: () => ['/usr/bin/node', Process.current.path, ...Process.current.arguments]},
    cwd: {value: () => Process.current.cwd},
  })

  let modules = {fs: new Module('fs')}

  modules.fs.exports = fs

  Object.assign(require.cache, modules)

  await process.run(() => init(options))
}
