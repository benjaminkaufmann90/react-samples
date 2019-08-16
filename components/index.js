const reqDefault = require.context('.', true, /\.\/[^/]+\/[^/]+\/index\.js$/)

reqDefault.keys().forEach(key => {
  const componentName = key.replace(/^.+\/([^/]+)\/index\.js/, '$1')

  module.exports[componentName] = reqDefault(key).default
})
