import { fork } from 'redux-saga/effects'

/**
 * Gather all sagas from corresponding files in folder structure and expose them to the rest fo the application
 */

const req = require.context('.', true, /\.\/.+\/sagas\.js$/)

const sagas = []

req.keys().forEach((key) => {
  sagas.push(req(key).default)
})

export default function* () {
  yield sagas.map(fork)
}
