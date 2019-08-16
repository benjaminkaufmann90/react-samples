import { push } from 'react-router-redux'
import { take, call, put, fork, select } from 'redux-saga/effects'
import { reset } from 'redux-form'
import api from 'services/api'
import { purgeStoredState } from 'redux-persist'
import localForage from 'localforage'
import { fromPosts, fromGeocode } from 'store/selectors'
import tracking from 'services/tracking'
import ReactGA from 'react-ga'
import { ROUTE_HOME } from 'config'

import {
  AUTH_REQUEST_SEND,
  AUTH_REQUEST_ERROR,
  AUTH_ERROR_CLEAR,
  AUTH_SIGN_IN,
  AUTH_SIGN_UP,
  AUTH_SIGN_UP_BUSINESS_USER,
  AUTH_SIGN_UP_PERSONAL_DATA,
  AUTH_SIGN_UP_ADDRESS,
  AUTH_SIGN_UP_VERIFICATION_OPTION,
  AUTH_SET_REGISTRATION_DATA,
  AUTH_SET,
  AUTH_SIGN_OUT,
  AUTH_EMAIL_VERIFY,
  AUTH_PHONE_VERIFY,
  AUTH_ADDRESS_VERIFY,
  AUTH_PASSOWRD_RECOVER,
  AUTH_PASSOWRD_RESET,
  AUTH_NEWSLETTER_REGISTER,
  AUTH_SET_EMAIL_VERIFY,
  AUTH_NEWSLETTER_VERIFY,
  AUTH_SET_NEWSLETTER_VERIFY,
  AUTH_RESET_INITIAL_STATE,
  AUTH_CHECK_ZIP_SUPPORTED,
  AUTH_SET_ZIP_NOT_SUPPORTED,
  AUTH_REFRESH_USER_TOKEN, AUTH_SET_SIGNED_ID,
  AUTH_EMAIL_VERIFY_RESEND,
  AUTH_REQUEST_SUCCESS,
  USER_SET_FIRST_SIGNIN,
} from './constants'

import {
  USER_SET_INFO,
  USER_ERROR_CLEAR, USER_RESET_INITIAL_STATE,
} from '../user/constants'
import { getUser } from '../user/sagas'
import { POST_COMMENTS_LIST_OPEN_CLEAR } from '../posts/constants'
import { GEOCODE_CLEAR_STATE } from '../geocode/constants'

export function* register({
  email, password, firstName, lastName, addressStreet, addressCity, addressPostalCode, lat, lng, agb, gender,
}) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })
  try {
    const user = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      address_street: addressStreet,
      address_city: addressCity,
      address_postal_code: addressPostalCode,
      address_lat: lat,
      address_lon: lng,
      agb,
      gender,
      hash: yield tracking.getSecureHash()
        .then((secureHash) => {
          return secureHash
        }),
    }

    const response = yield call(api.post, 'api/users', user)

    if (!response.error) {
      ReactGA.event({
        category: 'user',
        action: 'regFinal',
      })
    }

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })
    return false
  } finally {
    // eslint-disable-next-line no-undef
    _paq.push(['trackEvent', 'SignUp', 'Click', 'RegFinal'])
    // eslint-disable-next-line no-undef
    fbq('track', 'Lead')
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* registerBusinessUser(data) {
  yield put({ type: AUTH_REQUEST_SEND, sending: true })

  try {
    const hash = yield tracking.getSecureHash().then((secureHash) => secureHash)
    return yield call(api.post, 'api/users/scope/business', { ...data.data, hash })
  } catch (error) {
    yield put({ type: AUTH_REQUEST_ERROR, error: error.response })
    return false
  } finally {
    // @TODO implement tracking???
    // eslint-disable-next-line no-undef
    // _paq.push(['trackEvent', 'SignUp', 'Click', 'RegFinal'])
    // eslint-disable-next-line no-undef
    // fbq('track', 'Lead')
    yield put({ type: AUTH_REQUEST_SEND, sending: false })
  }
}


export function* registerPersonalData({
  email, password, firstName, lastName,
}) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })
  try {
    const user = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      hash: tracking.getSecureHash(),
    }

    const response = yield call(api.post, 'api/new/user', user)

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })

    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* registerAddress({
  userID, addressStreet, addressCity, addressPostalCode, lat, lng, agb,
}) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })
  try {
    const user = {
      address_street: addressStreet,
      address_city: addressCity,
      address_postal_code: addressPostalCode,
      address_lat: lat,
      address_lon: lng,
      agb,
    }

    const response = yield call(api.patch, `api/new/user/${userID}`, user)

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* registerVerificationOptions({ userID, verificationMode, verificationData }) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const verificationOptions = {
      verification_mode: verificationMode,
      verification_data: verificationData,
    }

    const response = yield call(api.patch, `api/new/user/${userID}/verification`, verificationOptions)

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* verifyEmail(email, token) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/verify/email', {
      email,
      token,
    })

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* verifyNewsletter(email, token) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/verify-newsletter', {
      email,
      token,
    })
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* verifyAddress(email, token) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/verify/postcard', {
      email,
      token,
    })
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* verifyPhoneNumber(email, token) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/verify/phone', {
      email,
      token,
    })
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* authorize({ email, password }) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const options = {
      email,
      password,
      grant_type: 'password',
      client_id: 'wvh-api-client',
      client_secret: 'QRHZM1337VTXcjWmlNEhdJyB',
      scope: api.scope,
    }
    const response = yield call(api.post, 'security/grantToken', options)
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })

    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* signOut() {
  purgeStoredState({ storage: localForage }, ['auth', 'user'])
  yield put({ type: AUTH_RESET_INITIAL_STATE })
  yield put({ type: USER_RESET_INITIAL_STATE })
}

export function* sendRecoveryMail(data) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  const customData = {
    ...data,
  }

  try {
    const response = yield call(api.post, 'api/users/forgotten-password', customData)
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* refresh({ refreshToken }) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })
  try {
    const options = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_id: 'wvh-api-client',
      client_secret: 'QRHZM1337VTXcjWmlNEhdJyB',
      scope: api.scope,
    }
    const response = yield call(api.post, 'security/grantToken', options)
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.response,
    })
    yield call(signOut)
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* resendVerificationMail(email) {
  yield put({ type: AUTH_REQUEST_SEND, sending: true })
  try {
    return yield call(api.get, `api/users/verify/resend-mail?email=${email}`)
  } catch (error) {
    yield put({ type: AUTH_REQUEST_ERROR, error: error.response })
    return false
  } finally {
    yield put({ type: AUTH_REQUEST_SEND, sending: false })
  }
}

export function* resetPassword(data) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/reset-password', data)
    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* signUpNewsletter(data) {
  yield put({
    type: AUTH_REQUEST_SEND,
    sending: true,
  })

  try {
    const response = yield call(api.post, 'api/users/signup-newsletter', data)

    return response
  } catch (error) {
    yield put({
      type: AUTH_REQUEST_ERROR,
      error: error.message,
    })
    return false
  } finally {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: false,
    })
  }
}

export function* getNeighborhoodByZip(zipCode, componentName) {
  if (componentName !== 'SignUpAddressForm') {
    yield put({
      type: AUTH_REQUEST_SEND,
      sending: true,
    })
  }

  try {
    const response = yield call(api.get, `api/v1/neighborhoods/for-zip/${zipCode}`)

    return response
  } catch (error) {
    yield put({
      type: AUTH_SET_ZIP_NOT_SUPPORTED,
      zipNotSupportedIn: componentName,
    })
    return false
  } finally {
    if (componentName !== 'SignUpAddressForm') {
      yield put({
        type: AUTH_REQUEST_SEND,
        sending: false,
      })
    }
  }
}

export function* signUpFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_UP)

    // take address from reviewedAddress??
    const structuredAddress = {
      addressStreet: request.data.addressStreet,
      addressCity: request.data.addressCity,
      addressPostalCode: request.data.addressPostalCode,
    }

    const coordinates = yield select(fromGeocode.getLocation)
    const signupRequest = yield call(register, {
      ...request.data,
      lat: coordinates.lat,
      lng: coordinates.lng,
    })

    if (signupRequest) {
      const { userHash } = signupRequest
      // eslint-disable-next-line no-undef
      _paq.push(['setUserId', userHash])
      // ReactGA.set({ userId: userHash })

      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_REGISTRATION_DATA,
        data: {
          signUpStep: 'address',
          payLoad: structuredAddress,
        },
      })
      yield put({ type: GEOCODE_CLEAR_STATE })
      yield put(push('/sign-up/success'))
    }
  }
}

export function* signUpBusinessFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_UP_BUSINESS_USER)
    const businessUser = yield call(registerBusinessUser, request)

    if (businessUser) {
      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({ type: GEOCODE_CLEAR_STATE })
      yield put(push('/sign-up/success'))
      // @TODO tracking???
    }
  }
}

export function* signUpPersonalDataFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_UP_PERSONAL_DATA)
    const signupPersonalDataRequest = yield call(registerPersonalData, request.data)

    if (signupPersonalDataRequest) {
      // eslint-disable-next-line no-undef
      _paq.push(['trackEvent', 'SignUp', 'Click', 'RegStep1'])

      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_REGISTRATION_DATA,
        data: {
          signUpStep: 'user',
          payLoad: {
            userID: signupPersonalDataRequest.id,
            email: request.data.email,
            firstName: request.data.firstName,
            lastName: request.data.lastName,
          },
        },
      })
    }
  }
}

export function* signUpAddressFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_UP_ADDRESS)

    const {
      userID, addressStreet, addressCity, addressPostalCode, agb,
    } = request.data
    const structuredAddress = {
      addressStreet,
      addressCity,
      addressPostalCode,
    }
    const reviewedAddress = yield select(fromGeocode.getReviewedAddress)
    const coordinates = yield select(fromGeocode.getLocation)

    if (reviewedAddress && reviewedAddress.reviewed) {
      const signupAddressRequest = yield call(registerAddress, {
        userID,
        ...structuredAddress,
        lat: coordinates.lat(),
        lng: coordinates.lng(),
        agb,
      })

      if (signupAddressRequest) {
        // eslint-disable-next-line no-undef
        _paq.push(['trackEvent', 'SignUp', 'Click', 'RegFinal'])
        // eslint-disable-next-line no-undef
        fbq('track', 'Lead')

        yield put({ type: AUTH_ERROR_CLEAR })
        yield put({
          type: AUTH_SET_REGISTRATION_DATA,
          data: { signUpStep: 'address' },
        })
      }
    }
  }
}

export function* signUpVerificationOptionFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_UP_VERIFICATION_OPTION)
    const signupVerificationOptionRequest = yield call(registerVerificationOptions, request.data)
    const { verificationMode, verificationData } = request.data
    if (signupVerificationOptionRequest) {
      // eslint-disable-next-line no-undef
      _paq.push(['trackEvent', 'SignUp', 'Click', verificationMode])

      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_REGISTRATION_DATA,
        data: {
          signUpStep: verificationMode,
          payLoad: verificationData,
        },
      })
    }
  }
}

export function* resendVerificationEmailFlow() {
  while (true) {
    const request = yield take(AUTH_EMAIL_VERIFY_RESEND)

    const wasSucessfulResend = yield call(resendVerificationMail, request.data.email)
    if (wasSucessfulResend) {
      yield put({ type: AUTH_REQUEST_SUCCESS, success: wasSucessfulResend.code })
      yield put({ type: AUTH_ERROR_CLEAR })
    }
  }
}

export function* verifyEmailFlow() {
  while (true) {
    const request = yield take(AUTH_EMAIL_VERIFY)

    const response = yield call(verifyEmail, request.data.email, request.data.token)
    if (response) {
      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_EMAIL_VERIFY,
        data: response,
      })
    }
  }
}

export function* verifyNewsletterFlow() {
  while (true) {
    const request = yield take(AUTH_NEWSLETTER_VERIFY)

    const response = yield call(verifyNewsletter, request.data.email, request.data.token)
    if (response) {
      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_NEWSLETTER_VERIFY,
        data: response,
      })
    }
  }
}

export function* verifyAddressFlow() {
  while (true) {
    const request = yield take(AUTH_ADDRESS_VERIFY)
    const response = yield call(verifyAddress, request.data.email, request.data.token)
    if (response) {
      const CryptoJS = require('crypto-js')
      const input = request.data.password
      const decryptedObject = yield call(decodeURIComponent, input)
      const decryptedText = yield call(CryptoJS.AES.decrypt, decryptedObject, request.data.email)
      const currentPassword = decryptedText.toString(CryptoJS.enc.Utf8)
      yield put({
        type: AUTH_SIGN_IN,
        data: {
          email: request.data.email,
          password: currentPassword,
        },
      })
      yield put({ type: AUTH_ERROR_CLEAR })
      yield put(push(ROUTE_HOME))
    }
  }
}

export function* verifyPhoneFlow() {
  while (true) {
    const request = yield take(AUTH_PHONE_VERIFY)
    const response = yield call(verifyPhoneNumber, request.data.email, request.data.token)

    if (response) {
      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET_REGISTRATION_DATA,
        data: { signUpStep: 'phoneToken' },
      })
    }
  }
}

export function* signInFlow() {
  while (true) {
    const request = yield take(AUTH_SIGN_IN)
    const { email, password } = request.data

    const response = yield call(authorize, { email, password })
    if (response) {
      // eslint-disable-next-line camelcase
      const { access_token, refresh_token } = response

      yield put({ type: AUTH_ERROR_CLEAR })
      yield put({
        type: AUTH_SET,
        signedIn: false,
        accessToken: access_token,
        refreshToken: refresh_token,
      })
      const user = yield call(getUser)
      if (user) {
        if (user.config && user.config.showWelcomePost) {
          yield put({
            type: USER_SET_FIRST_SIGNIN,
            isFirstSignIn: true,
          })
        }
        yield put({
          type: USER_SET_INFO,
          data: user,
        })
        yield put({
          type: AUTH_SET_SIGNED_ID,
          signedIn: true,
        })
        yield put({ type: USER_ERROR_CLEAR })

        // eslint-disable-next-line no-undef
        _paq.push(['trackEvent', 'SignUp', 'openFeed', 'login'])

        ReactGA.event({
          category: 'user',
          action: 'openFeed',
        })

        yield put(reset('SignInForm'))
        yield put(push(ROUTE_HOME))
      }
    }
  }
}

export function* refreshFlow() {
  while (true) {
    const request = yield take(AUTH_REFRESH_USER_TOKEN)
    const response = yield call(refresh, { refreshToken: request.refreshToken })
    if (response) {
      // eslint-disable-next-line camelcase
      const { access_token, refresh_token } = response
      if (response.access_token) {
        yield put({
          type: AUTH_SET,
          signedIn: true,
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      } else {
        yield call(signOut)
      }
    }
  }
}

export function* signOutFlow() {
  while (true) {
    // console.log('signOutFlow')
    const request = yield take(AUTH_SIGN_OUT)
    yield put(push('/sign-in'))
    yield call(signOut, request.data)
  }
}

export function* forgottenPasswordFlow() {
  while (true) {
    const request = yield take(AUTH_PASSOWRD_RECOVER)

    const recoveryMailSent = yield call(sendRecoveryMail, request.data)

    if (recoveryMailSent) yield put(push('/forgotten-password/notice'))
  }
}

export function* resetPasswordFlow() {
  while (true) {
    const request = yield take(AUTH_PASSOWRD_RESET)

    const recoveryMailSent = yield call(resetPassword, request.data)

    if (recoveryMailSent) {
      yield put(push('/reset-password/notice'))
    }
  }
}

export function* signUpNewsletterFlow() {
  while (true) {
    const request = yield take(AUTH_NEWSLETTER_REGISTER)

    const registerNewsletter = yield call(signUpNewsletter, request.data)

    if (registerNewsletter) {
      yield put(push('/newsletter-entry/success'))
    }
  }
}

export function* routerFlow() {
  while (true) {
    const request = yield take('@@router/LOCATION_CHANGE')
    // console.log('router flow', request)
    const commentsListState = yield select(fromPosts.getCommentsListOpen)
    if (commentsListState) {
      yield put({ type: POST_COMMENTS_LIST_OPEN_CLEAR })
    }
    if (request.payload.hash) {
      if (request.payload.hash.indexOf('/email-verification/') > -1) console.log('redirecting', request.payload.hash.substring(1))
      yield put(push(request.payload.hash.substring(1)))
      // if (request.payload.hash.indexOf('/address-verification/') > -1) console.log('redirecting', request.payload.hash.substring(1)); yield put(push(request.payload.hash.substring(1)))
      if (request.payload.hash.indexOf('/reset-password/') > -1) console.log('redirecting', request.payload.hash.substring(1))
      yield put(push(request.payload.hash.substring(1)))
    }
  }
}

export function* getNeighborhoodByZipFlow() {
  while (true) {
    const request = yield take(AUTH_CHECK_ZIP_SUPPORTED)
    const neighborhood = yield call(getNeighborhoodByZip, request.zipcode, request.componentName)

    if (neighborhood) {
      // handle Neighborhood and special Backgrounds here, if necessary
      yield put({
        type: AUTH_SET_ZIP_NOT_SUPPORTED,
        zipNotSupported: '',
      })
    }
  }
}

export default function* root() {
  yield fork(signOutFlow)
  yield fork(signUpFlow)
  yield fork(signUpBusinessFlow)
  yield fork(signUpPersonalDataFlow)
  yield fork(signUpAddressFlow)
  yield fork(signUpVerificationOptionFlow)
  yield fork(verifyEmailFlow)
  yield fork(verifyNewsletterFlow)
  yield fork(verifyAddressFlow)
  yield fork(verifyPhoneFlow)
  yield fork(signInFlow)
  yield fork(refreshFlow)
  yield fork(forgottenPasswordFlow)
  yield fork(resetPasswordFlow)
  yield fork(routerFlow)
  yield fork(signUpNewsletterFlow)
  yield fork(getNeighborhoodByZipFlow)
  yield fork(resendVerificationEmailFlow)
}
