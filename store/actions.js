const req = require.context('.', true, /\.\/.+\/actions\.js$/)

/**
 * Gather all actions from corresponding files in folder structure and expose them to the rest fo the application
 */

req.keys().forEach((key) => {
  const actions = req(key)

  Object.keys(actions).forEach((name) => {
    module.exports[name] = actions[name]
  })
})
