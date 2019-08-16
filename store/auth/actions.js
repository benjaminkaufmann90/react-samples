import ReactGA from 'react-ga'
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
  AUTH_CLEAR_REGISTRATION_DATA,
  AUTH_CLEAR_REGISTRATION_STEPS,
  AUTH_SIGN_OUT,
  AUTH_SET,
  AUTH_PASSOWRD_RECOVER,
  AUTH_PASSOWRD_RESET,
  AUTH_EMAIL_VERIFY,
  AUTH_EMAIL_VERIFY_RESEND,
  AUTH_RESET_EMAIL_VERIFY,
  AUTH_ADDRESS_VERIFY,
  AUTH_NEWSLETTER_REGISTER,
  AUTH_PHONE_VERIFY,
  AUTH_NEWSLETTER_VERIFY,
  AUTH_RESET_NEWSLETTER_VERIFY,
  AUTH_REG_STEP_INCREMENT,
  AUTH_CHECK_ZIP_SUPPORTED,
  AUTH_SET_ZIP_NOT_SUPPORTED,
  AUTH_REFRESH_USER_TOKEN,
  AUTH_REQUEST_SUCCESS,
  AUTH_SUCCESS_CLEAR,
  AUTH_INCREASE_RESEND_COUNTER,
  AUTH_RESET_RESEND_COUNTER,
} from './constants'

/**
 * Actions related to the authentication tasks
 */

/**
 * Sets the authentication state of the application
 * @param  {boolean} signedIn True means a user is logged in, false means no user is logged in
 */
export function setAuthState(signedIn, accessToken, refreshToken) {
  return {
    type: AUTH_SET, signedIn, accessToken, refreshToken,
  }
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest(sending) {
  return { type: AUTH_REQUEST_SEND, sending }
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.username The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 */
export function signInRequest(data) {
  return { type: AUTH_SIGN_IN, data }
}

/**
 * Tells the app we want to log out a user
 */
export function signOut() {
  ReactGA.event({
    category: 'user',
    action: 'signOut',
  })

  return { type: AUTH_SIGN_OUT }
}

/**
 * Tells the app we want to register a user
 * @param  {object} data          The data we're sending for registration
 * @param  {string} data.username The username of the user to register
 * @param  {string} data.password The password of the user to register
 */
export function signUpRequest(data) {
  return { type: AUTH_SIGN_UP, data }
}

export function signUpRequestBusinessUser(data) {
  return { type: AUTH_SIGN_UP_BUSINESS_USER, data }
}

export function signUpPersonalDataRequest(data) {
  return { type: AUTH_SIGN_UP_PERSONAL_DATA, data }
}

export function signUpAddressRequest(data) {
  return { type: AUTH_SIGN_UP_ADDRESS, data }
}

export function signUpVerificationOptionRequest(data) {
  return { type: AUTH_SIGN_UP_VERIFICATION_OPTION, data }
}

export function setRegistrationData(data) {
  console.log('regData: : ', data)
  return { type: AUTH_SET_REGISTRATION_DATA, data }
}

export function authClearRegistrationData() {
  return { type: AUTH_CLEAR_REGISTRATION_DATA }
}

export function authClearRegistrationSteps() {
  return { type: AUTH_CLEAR_REGISTRATION_STEPS }
}

/**
 * Sends the email to user's email address with link to password recovery
 * @param  {object} data                The data we're sending for password recovery
 * @param  {string} data.email          The user's email
 */
export function recoverPasswordRequest(data) {
  return { type: AUTH_PASSOWRD_RECOVER, data }
}

/**
 * Sends the email to user's email address with link to password recovery
 * @param  {object} data                The data we're sending for password recovery
 * @param  {string} data.email          The user's email
 */
export function resetPasswordRequest(data) {
  return { type: AUTH_PASSOWRD_RESET, data }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function authRequestError(error) {
  return { type: AUTH_REQUEST_ERROR, error }
}

export const authRequestSuccess = (success) => {
  return { type: AUTH_REQUEST_SUCCESS, success }
}

/**
 * Sets the `error` state as empty
 */
export function authClearError() {
  return { type: AUTH_ERROR_CLEAR }
}

export function authClearSuccess() {
  return { type: AUTH_SUCCESS_CLEAR }
}

export function authVerifyEmail(email, token) {
  return { type: AUTH_EMAIL_VERIFY, data: { email, token } }
}

export function authVerifyEmailResend(email) {
  return { type: AUTH_EMAIL_VERIFY_RESEND, data: { email } }
}

export function authResetVerifyEmail() {
  return { type: AUTH_RESET_EMAIL_VERIFY }
}

export function authVerifyNewsletter(email, token) {
  return { type: AUTH_NEWSLETTER_VERIFY, data: { email, token } }
}

export function authResetVerifyNewsletter() {
  return { type: AUTH_RESET_NEWSLETTER_VERIFY }
}

export function authVerifyAddress(email, token, password) {
  return { type: AUTH_ADDRESS_VERIFY, data: { email, token, password } }
}

export function authVerifyPhone(email, token) {
  return { type: AUTH_PHONE_VERIFY, data: { email, token } }
}

export function saveNewsletterData(data) {
  return { type: AUTH_NEWSLETTER_REGISTER, data }
}

export function regStepIncrement() {
  return { type: AUTH_REG_STEP_INCREMENT }
}

export function checkZipSupported(zipcode, componentName) {
  return { type: AUTH_CHECK_ZIP_SUPPORTED, zipcode, componentName }
}

export function setZipNotSupported() {
  return { type: AUTH_SET_ZIP_NOT_SUPPORTED }
}

export function refreshUserToken(refreshToken) {
  return { type: AUTH_REFRESH_USER_TOKEN, refreshToken }
}

export const increaseResendCounter = () => ({ type: AUTH_INCREASE_RESEND_COUNTER })
export const resetResendCounter = () => ({ type: AUTH_RESET_RESEND_COUNTER })
