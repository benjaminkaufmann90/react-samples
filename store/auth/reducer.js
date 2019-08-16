import { initialState } from './selectors'
import {
  AUTH_SET,
  AUTH_SET_SIGNED_ID,
  AUTH_SET_REGISTRATION_DATA,
  AUTH_CLEAR_REGISTRATION_DATA,
  AUTH_CLEAR_REGISTRATION_STEPS,
  AUTH_REQUEST_SEND,
  AUTH_REQUEST_ERROR,
  AUTH_REQUEST_SUCCESS,
  AUTH_SUCCESS_CLEAR,
  AUTH_ERROR_CLEAR,
  AUTH_SIGN_OUT,
  AUTH_RESET_INITIAL_STATE,
  AUTH_SET_EMAIL_VERIFY,
  AUTH_RESET_EMAIL_VERIFY,
  AUTH_SET_NEWSLETTER_VERIFY,
  AUTH_RESET_NEWSLETTER_VERIFY,
  AUTH_REG_STEP_INCREMENT,
  AUTH_SET_ZIP_NOT_SUPPORTED,
  AUTH_INCREASE_RESEND_COUNTER,
  AUTH_RESET_RESEND_COUNTER,
} from './constants'

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET:
      localStorage.setItem('jwt', action.accessToken)
      return {
        ...state, signedIn: action.signedIn || false, accessToken: action.accessToken, refreshToken: action.refreshToken,
      }
    case AUTH_SET_SIGNED_ID:
      return {
        ...state, signedIn: action.signedIn,
      }
    case AUTH_REG_STEP_INCREMENT:
      return { ...state, registrationSteps: { ...state.registrationSteps, step: state.registrationSteps.step + 1 } }
    // eslint-disable-next-line no-case-declarations
    case AUTH_SET_REGISTRATION_DATA:
      const { registrationData, registrationSteps } = state
      const {
        step, postCardStep, documentStep, idCardStep, phoneStep,
      } = registrationSteps
      const { signUpStep, payLoad } = action.data
      switch (signUpStep) {
        case 'user':
          return {
            ...state,
            registrationData: {
              ...registrationData,
              userID: payLoad.userID,
              email: payLoad.email,
              firstName: payLoad.firstName,
              lastName: payLoad.lastName,
              password: payLoad.password,
              gender: payLoad.gender,
            },
            registrationSteps: {
              ...registrationSteps,
              step: step + 1,
            },
          }
        case 'address':
          return {
            ...state,
            registrationData: {
              ...registrationData,
              zipcode: payLoad.zipcode,
              city: payLoad.city,
              street: payLoad.street,
            },
            registrationSteps: { ...registrationSteps, step: step < 1 ? 1 : 0 },
          }
        case 'organisation':
          return {
            ...state,
            registrationData: {
              ...registrationData,
              ...payLoad,
            },
          }
        case 'postcard':
          return { ...state, registrationSteps: { ...registrationSteps, postCardStep: postCardStep + 1, locked: true } }
        case 'document':
          return { ...state, registrationSteps: { ...registrationSteps, documentStep: documentStep + 1, locked: true } }
        case 'idcard':
          return { ...state, registrationSteps: { ...registrationSteps, idCardStep: idCardStep + 1, locked: true } }
        case 'phone':
          return {
            ...state,
            registrationData: {
              ...registrationData,
              phoneNumber: {
                countryCode: payLoad.countryCode,
                prefix: payLoad.prefix,
                number: payLoad.number,
              },
            },
            registrationSteps: {
              ...registrationSteps,
              phoneStep: phoneStep + 1,
            },
          }
        case 'phoneBack':
          return { ...state, registrationSteps: { ...state.registrationSteps, phoneStep: phoneStep - 1 } }
        case 'phoneToken':
          return { ...state, registrationSteps: { ...registrationSteps, phoneStep: phoneStep + 1, locked: true } }
        case 'back':
          return { ...state, registrationSteps: { ...registrationSteps, step: step - 1 } }
        case 'setStep':
          return { ...state, registrationSteps: { ...registrationSteps, step: action.data.step } }
        default:
          return { ...state }
      }
    case AUTH_SET_EMAIL_VERIFY:
      return { ...state, emailVerify: action.data }
    case AUTH_RESET_EMAIL_VERIFY:
      return { ...state, emailVerify: null }
    case AUTH_SET_NEWSLETTER_VERIFY:
      return { ...state, newsletterVerify: action.data }
    case AUTH_RESET_NEWSLETTER_VERIFY:
      return { ...state, newsletterVerify: null }
    case AUTH_CLEAR_REGISTRATION_DATA:
      return { ...state, registrationData: initialState.registrationData }
    case AUTH_CLEAR_REGISTRATION_STEPS:
      return { ...state, registrationSteps: initialState.registrationSteps }
    case AUTH_REQUEST_SEND:
      return { ...state, currentlySending: action.sending }
    case AUTH_REQUEST_ERROR:
      return { ...state, errorMessage: action.error }
    case AUTH_REQUEST_SUCCESS:
      return { ...state, successMessage: action.success }
    case AUTH_ERROR_CLEAR:
      return { ...state, errorMessage: '' }
    case AUTH_SUCCESS_CLEAR:
      return { ...state, successMessage: '' }
    case AUTH_SIGN_OUT:
      return {
        ...state, signedIn: false, accessToken: null, refreshToken: null,
      }
    case AUTH_RESET_INITIAL_STATE:
      return { ...state, ...initialState }
    case AUTH_SET_ZIP_NOT_SUPPORTED:
      return {
        ...state,
        registrationData: {
          ...(state.registrationData),
          zipNotSupportedIn: action.zipNotSupportedIn,
        },
      }
    case AUTH_INCREASE_RESEND_COUNTER:
      return {
        ...state,
        resendCounter: (state.resendCounter + 1),
      }
    case AUTH_RESET_RESEND_COUNTER:
      return { ...state, resendCounter: 0 }
    default: return state
  }
}
