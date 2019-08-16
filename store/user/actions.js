import {
  USER_GET_LIST,
  USER_SET_LIST,
  USER_GET_INFO,
  USER_SET_INFO,
  USER_GET_DETAIL,
  USER_SET_DETAIL,
  USER_UPDATE_INFO_REQUEST,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PRIVACY_REQUEST,
  USER_REQUEST_SEND,
  USER_UPDATE_INFO,
  USER_REQUEST_ERROR,
  USER_ERROR_CLEAR,
  USER_CLEAR_SINGLE,
  USER_SET_FILTER,
  USER_DISABLE_WELCOME_POST,
  USER_ENABLE_WELCOME_POST,
  USER_GET_ADMINISTRATED_GROUPS,
  USER_SET_ADMINISTRATED_GROUPS,
  USER_CLEAR_ADMINISTRATED_GROUPS,
  USER_SET_BLOCKED,
  USER_SET_UNBLOCKED,
  USER_RESET_LIST,
  USER_SET_VIEW,
  USER_DEACTIVATE_ACCOUNT,
  USER_DELETE_ACCOUNT, USER_GET_BLOCKED_LIST,
  USER_SET_NEIGHBORHOOD_RADIUS,
  USER_SET_NEIGHBORHOOD_TMP_PRADIUS,
  USER_CLEAR_NEIGHBORHOOD_TMP_PRADIUS,
  USER_FINISH_SETTING_NEIGHBORHOOD_RADIUS,
  USER_SET_FIRST_SIGNIN,
  USER_SET_TOUR_STEP_INTRODUCTION,
} from './constants'

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest(sending) {
  return { type: USER_REQUEST_SEND, sending }
}

export function getUserInfo() {
  return { type: USER_GET_INFO }
}

export function getUserSingle(data) {
  return { type: USER_GET_DETAIL, data }
}

export function setUserInfo(data) {
  return { type: USER_SET_INFO, data }
}

export function setUserSingle(data) {
  return { type: USER_SET_DETAIL, data }
}

export function clearUserSingle() {
  return { type: USER_CLEAR_SINGLE }
}

export function updateUserRequest(data) {
  return { type: USER_UPDATE_INFO_REQUEST, data }
}

export function updateUserInfo(data) {
  return { type: USER_UPDATE_INFO, data }
}

export function changePassword(data) {
  return { type: USER_CHANGE_PASSWORD_REQUEST, data }
}

export function changePrivacy(data) {
  return { type: USER_CHANGE_PRIVACY_REQUEST, data }
}

export function getUserList({
  limit, sortBy, offset, neighborhoodId,
}) {
  return {
    type: USER_GET_LIST, limit, sortBy, offset, neighborhoodId,
  }
}

export function setUserList(data) {
  return { type: USER_SET_LIST, data }
}

export function resetUserList() {
  return { type: USER_RESET_LIST }
}

export function getUserBlockedList() {
  console.log('fired action getUserBlockedList')
  return { type: USER_GET_BLOCKED_LIST }
}

export function removeUserFromBlockedList(userId) {
  console.log('fired action removeUserFromBlockedList', 'userid', userId)
  return { type: USER_SET_UNBLOCKED, data: userId }
}

export function setUserFilter(page, filter, value) {
  return {
    type: USER_SET_FILTER, page, filter, value,
  }
}

export function setUserView(data) {
  return { type: USER_SET_VIEW, data }
}


export function setNeighborhoodRadius(distance) {
  return { type: USER_SET_NEIGHBORHOOD_RADIUS, data: distance }
}

export function setNeighborhoodTmpRadius(tmpDistance) {
  return { type: USER_SET_NEIGHBORHOOD_TMP_PRADIUS, data: tmpDistance }
}

export function finishSettingNeighborhoodRadius(radius) {
  return { type: USER_FINISH_SETTING_NEIGHBORHOOD_RADIUS, data: radius }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function userRequestError(error) {
  return { type: USER_REQUEST_ERROR, error }
}

/**
 * Sets the `error` state as empty
 */
export function userClearError() {
  return { type: USER_ERROR_CLEAR }
}

/**
 * Sets showWelcomePost = null in UserConfig
 */
export function disableWelcomePost() {
  return { type: USER_DISABLE_WELCOME_POST }
}

/**
 * Sets showWelcomePost = true in UserConfig
 */
export function enableWelcomePost() {
  return { type: USER_ENABLE_WELCOME_POST }
}

/**
 * Get groups administrated by user
 */
export function getAdministratedGroups() {
  return { type: USER_GET_ADMINISTRATED_GROUPS }
}

/**
 * Set groups administrated by user in store
 */
export function setAdministratedGroups(administratedGroups) {
  return { type: USER_SET_ADMINISTRATED_GROUPS, administratedGroups }
}

/**
 * Clear administratedGroups in store
 */
export function clearAdministratedGroups() {
  return { type: USER_CLEAR_ADMINISTRATED_GROUPS }
}

export function clearNeighborhoodTmpRadius() {
  return { type: USER_CLEAR_NEIGHBORHOOD_TMP_PRADIUS }
}

/**
 * Block user
 */
export function blockUser(userId) {
  return { type: USER_SET_BLOCKED, userId }
}

/**
 * deactivate profile
 */
export function deactivateAccount() {
  return { type: USER_DEACTIVATE_ACCOUNT }
}

/**
 * delete profile
 */
export function deleteAccount() {
  return { type: USER_DELETE_ACCOUNT }
}

/**
 * set whether user signed in for the first time
 */
export function setFirstSignin(isFirstSignIn) {
  return { type: USER_SET_FIRST_SIGNIN, isFirstSignIn }
}

/**
 * set the step of the guided introduction tour
 */
export function setGuidedTourIntroductionStep(step) {
  return { type: USER_SET_TOUR_STEP_INTRODUCTION, guidedTourStepIntroduction: step }
}
