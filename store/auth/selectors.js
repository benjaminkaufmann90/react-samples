export const initialState = {
  errorMessage: '',
  successMessage: '',
  currentlySending: false,
  signedIn: false,
  accessToken: null,
  refreshToken: null,
  registrationSteps: {
    locked: false,
    step: 0,
    postCardStep: 1,
    documentStep: 1,
    idCardStep: 1,
    phoneStep: 1,
  },
  registrationData: {
    userID: null,
    email: null,
    firstName: null,
    lastName: null,
    gender: null,
    password: null,
    zipNotSupportedIn: '',
    title: '',
    category_id: null,
    website: null,
    phone: null,
    agb: false,
    address: null,
    phoneNumber: {
      countryCode: '',
      prefix: '',
      number: '',
    },
  },
  emailVerify: null,
  newsletterVerify: null,
  resendCounter: 0,
}

export const getRegistrationData = (state = initialState) => state.registrationData || initialState.registrationData
export const getRegistrationSteps = (state = initialState) => state.registrationSteps || initialState.registrationSteps
export const isSignedIn = (state = initialState) => state.signedIn || initialState.signedIn
export const getError = (state = initialState) => state.errorMessage || initialState.errorMessage
export const getSuccessMessage = (state = initialState) => state.successMessage || initialState.successMessage
export const isCurrentlySending = (state = initialState) => state.currentlySending || initialState.currentlySending
export const getToken = (state = initialState) => state.accessToken || initialState.accessToken
export const getRefreshToken = (state = initialState) => state.refreshToken || initialState.refreshToken
export const getEmailVerify = (state = initialState) => state.emailVerify || initialState.emailVerify
export const getNewsletterVerify = (state = initialState) => state.newsletterVerify || initialState.newsletterVerify
export const getZipNotSupportedIn = (state = initialState) => state.registrationData.zipNotSupportedIn || initialState.registrationData.zipNotSupportedIn
export const getResendCounter = (state = initialState) => state.resendCounter || initialState.resendCounter
