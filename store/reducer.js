import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { intlReducer as intl } from 'react-intl-redux'
import { reducer as form } from 'redux-form'

const reducers = {
  routing,
  intl,
  form,
}

/**
 * Gather all reducers from corresponding files in folder structure and expose them to the rest fo the application
 */

const req = require.context('.', true, /\.\/.+\/reducer\.js$/)

req.keys().forEach((key) => {
  const storeName = key.replace(/\.\/(.+)\/.+$/, '$1')
  reducers[storeName] = req(key).default
})

const appReducer = combineReducers(reducers)

const rootReducer = (state, action) => {
/**
 * reset state on sign out
 */
  let appState = state
  if (action.type === 'AUTH_SIGN_OUT') {
    appState = {
      intl: state.intl,
    }
  }

  return appReducer(appState, action)
}

export default rootReducer
