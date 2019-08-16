const reqDefault = require.context('.', true, /\.\/[^/]+\/index\.js$/)

reqDefault.keys().forEach(key => {
  const containerName = key.replace(/^.+\/([^/]+)\/index\.js/, '$1')

  module.exports[containerName] = reqDefault(key).default
})
