import { take, call, put, fork, select } from 'redux-saga/effects'
import api from 'services/api'
import { fromAuth } from 'store/selectors'
import { reset } from 'redux-form'
import ReactGA from 'react-ga'
import { push } from 'react-router-redux'

import {
  USER_REQUEST_SEND,
  USER_UPDATE_INFO_REQUEST,
  USER_UPDATE_INFO,
  USER_UPDATE_PRIVACY_INFO,
  USER_GET_INFO,
  USER_SET_INFO,
  USER_GET_DETAIL,
  USER_SET_DETAIL,
  USER_GET_LIST,
  USER_SET_LIST,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_PRIVACY_REQUEST_SEND,
  USER_REQUEST_ERROR,
  USER_ERROR_CLEAR,
  USER_CHANGE_PRIVACY_REQUEST,
  USER_DISABLE_WELCOME_POST,
  USER_ENABLE_WELCOME_POST,
  USER_SET_FILTER,
  USER_GET_ADMINISTRATED_GROUPS,
  USER_SET_ADMINISTRATED_GROUPS,
  USER_SET_BLOCKED,
  USER_SET_UNBLOCKED,
  USER_GET_BLOCKED_LIST,
  USER_SET_BLOCKED_LIST,
  USER_SET_VIEW,
  USER_DEACTIVATE_ACCOUNT,
  USER_DELETE_ACCOUNT,
  USER_FINISH_SETTING_NEIGHBORHOOD_RADIUS,
} from './constants'

import {
  USERSETTINGS_NEIGHBORHOOD_RADIUS_ERROR_SET,
  USERSETTINGS_NEIGHBORHOOD_RADIUS_ERROR_CLEAR,
  USERSETTINGS_NEIGHBORHOOD_RADIUS_INFO_SET,
} from '../errors/constants'

import { signOut } from '../auth/sagas'
import { AUTH_SIGN_OUT } from '../auth/constants'
import { gaId } from '../../config'

let secureApi = {}
if (api) {
  secureApi = api.create()
}

const USER_CONFIG_RADIUS_DISTANCE = 10000

function setAuthToken(token) {
  secureApi.setToken(token)
}

export function* updateUser(data) {
  console.log('updateUser - data: ', data)
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/me', data)

    if (!response.error) {
      ReactGA.event({
        category: 'user',
        action: 'updatedProfile',
      })
    }

    return response
  } catch (error) {
    console.log('user update error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}


export function* deactivateAccount() {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    yield call([secureApi, secureApi.delete], 'api/v1/users/me')
    ReactGA.event({
      category: 'user',
      action: 'deactivatedProfile',
    })

    return true
  } catch (error) {
    console.log('user deactivate error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

export function* deleteAccount() {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    yield call([secureApi, secureApi.delete], 'api/v1/users/me?hard_delete')
    ReactGA.event({
      category: 'user',
      action: 'deleteProfile',
    })

    return true
  } catch (error) {
    console.log('user delete error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get change user password
 */
export function* changePassword(data) {
  yield put({ type: USER_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/me/password', data)

    return response
  } catch (error) {
    console.log('user update password error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get set user filter
 */
export function* setFilter(data) {
  yield put({ type: USER_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/config', data)
    return response
  } catch (error) {
    console.log('user set filter error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get change user privacy
 */
export function* changePrivacy(data) {
  yield put({ type: USER_PRIVACY_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/me/privacy', data)
    return response
  } catch (error) {
    console.log('user update privacy error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_PRIVACY_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get user info
 * this is only for the current User
 */
export function* getUser() {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], 'api/v1/users/me?with_neighborhood&with_conversation_ids')
    // hard coded fallback #417
    response.config.radius.distance = response.config.radius.distance || USER_CONFIG_RADIUS_DISTANCE
    // eslint-disable-next-line no-undef
    _paq.push(['setUserId', response.userHash])
    ReactGA.set({ userId: response.userHash })


    if (response.tracking_disabled && response.tracking_disabled === true) {
      window[`ga-disable-${gaId}`] = true

      // eslint-disable-next-line no-undef
      _paq.push(['disableCookies'])

      // disable facebook
      document.cookie = 'fb-custom-disable=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/'
    }

    // ** later eventually important for matching secureHash to UserHash **
    // eslint-disable-next-line no-undef
    // _paq.push(['trackEvent', 'SignIn', 'changeTrackingIdFrom', response.hash])
    ReactGA.event({
      category: 'user',
      action: 'signIn',
    })

    return response
  } catch (error) {
    console.log('getUser - error: ', error.message)
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get single user info
 */
export function* getUserSingle({ id }) {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/users/${id}`)
    return response
  } catch (error) {
    console.log('getUserSingle - error: ', error.message)
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}


/**
 * Get user list saga worker
 */
export function* getUserList(limit, sortBy, offset, neighborhoodId, fields) {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  const fieldFilter = fields ? `&fields=${fields}` : ''
  const neighborhoodFilter = neighborhoodId ? `&neighborhood=${neighborhoodId}` : ''
  const offsetFilter = offset ? `&offset=${offset}` : ''

  let sortByFilter
  switch (sortBy) {
    case 'newest':
      sortByFilter = '&sort=-created_at'
      break
    case 'distance':
      sortByFilter = '&sort=distance'
      break
    default:
      sortByFilter = ''
  }

  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/users/all?limit=${limit}${offsetFilter}${neighborhoodFilter}${fieldFilter}${sortByFilter}`)
    return response
  } catch (error) {
    console.log('get user list error')
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Disable WelcomePost
 */
export function* disableWelcomePost() {
  yield put({ type: USER_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  const data = { showWelcomePost: null }

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/config', data)
    return response
  } catch (error) {
    console.log('user disable WelcomePost error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Enable WelcomePost
 */
export function* enableWelcomePost() {
  yield put({ type: USER_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  const data = { showWelcomePost: true }

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/config', data)
    return response
  } catch (error) {
    console.log('user disable WelcomePost error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Effect to get change user password
 */
export function* getAdministratedGroups() {
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], 'api/v1/search/groups?group_select')

    return response
  } catch (error) {
    console.log('getAdministratedGroups error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  }
}

/**
 * Effect to block a user
 */
export function* blockUser(userId) {
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    yield call([secureApi, secureApi.post], `api/v1/users/${userId}/block`)
    return true
  } catch (error) {
    console.log('blockUser error')
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  }
}

/**
 * Get user blocked list saga worker
 */
export function* getUserBlockedList() {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], 'api/v1/users/me/blocked')
    return response
  } catch (error) {
    console.log('get user blocked list error')
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Set neighborhood radius worker
 */
export function* setNeighborhoodRadius(data) {
  // yield put({ type: USER_REQUEST_SEND, sending: true })
  yield put({ type: USERSETTINGS_NEIGHBORHOOD_RADIUS_ERROR_CLEAR })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], 'api/v1/users/config', {
      radius: {
        distance: data,
      },
    })
    yield put({ type: USERSETTINGS_NEIGHBORHOOD_RADIUS_INFO_SET, info: 'success' })

    return response
  } catch (error) {
    console.log('set neighborhood radius error', error.message)
    yield put({ type: USERSETTINGS_NEIGHBORHOOD_RADIUS_ERROR_SET, error: error.message })

    const user = yield call(getUser)
    if (user) {
      yield put({ type: USER_SET_INFO, data: user })
    }

    return false
  } finally {
    // yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Set user unblocked saga worker
 */
export function* setUserUnblocked(userId) {
  yield put({ type: USER_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.delete], `api/v1/users/${userId}/block`)
    return response
  } catch (error) {
    console.log('set user unblocked error')
    yield put({ type: USER_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: USER_REQUEST_SEND, sending: false })
  }
}

/**
 * Get user blocked list saga watcher
 */
export function* getUserBlockedListFlow() {
  while (true) {
    yield take(USER_GET_BLOCKED_LIST)
    const blockedUsers = yield call(getUserBlockedList)
    if (blockedUsers) {
      yield put({ type: USER_SET_BLOCKED_LIST, data: blockedUsers })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Set user unblocked saga watcher
 */
export function* unblockUserFlow() {
  while (true) {
    const request = yield take(USER_SET_UNBLOCKED)

    const unblockResult = yield call(setUserUnblocked, request.data)
    if (unblockResult !== false) {
      // fetch updated blocked user list
      yield put({ type: USER_GET_BLOCKED_LIST })
      console.log('getUserBlockedListFlow blockedUsers', unblockResult)
      // yield put({ type: USER_SET_BLOCKED_LIST, data: blockedUsers })
      // yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Update user info saga
 */
export function* updateUserFlow() {
  while (true) {
    const request = yield take(USER_UPDATE_INFO_REQUEST)

    const wasSuccessful = yield call(updateUser, request.data)
    if (wasSuccessful) {
      yield put({ type: USER_UPDATE_INFO, data: request.data })
      yield put({ type: USER_ERROR_CLEAR })

      !request.data.context
        ? yield put(push('/profile'))
        : ''
    }
  }
}

/**
 * Update user password saga
 */
export function* changePasswordFlow() {
  while (true) {
    const request = yield take(USER_CHANGE_PASSWORD_REQUEST)

    const wasSuccessful = yield call(changePassword, request.data)
    if (wasSuccessful) {
      yield put(reset('ChangePassword'))
    }
  }
}

/**
 * Update user privacy saga
 */
export function* changePrivacyFlow() {
  while (true) {
    const request = yield take(USER_CHANGE_PRIVACY_REQUEST)

    const wasSuccessful = yield call(changePrivacy, request.data)
    if (wasSuccessful) {
      yield put({ type: USER_UPDATE_PRIVACY_INFO, data: request.data })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Update user filter flags
 */
export function* setFilterFlow() {
  while (true) {
    const request = yield take(USER_SET_FILTER)
    const filterObject = {
      filter: {
        [request.page]: {
          [request.filter]: request.value,
        },
      },
    }
    const response = yield call(setFilter, filterObject)
    // console.log('UserData', response)
    if (response) {
      // yield put({ type: USER_SET_INFO, data: response })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Update user view config
 */
export function* setViewFlow() {
  while (true) {
    const request = yield take(USER_SET_VIEW)
    const response = yield call(setFilter, request.data)
    // console.log('UserData', response)
    if (response) {
      // yield put({ type: USER_SET_INFO, data: response })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}


/**
 * Get user info saga
 */
export function* getUserFlow() {
  while (true) {
    yield take(USER_GET_INFO)

    const user = yield call(getUser)

    if (user) {
      yield put({ type: USER_SET_INFO, data: user })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Get user info saga
 */
export function* getUserSingleFlow() {
  while (true) {
    const request = yield take(USER_GET_DETAIL)
    const user = yield call(getUserSingle, request.data)
    if (user) {
      yield put({ type: USER_SET_DETAIL, data: user })
      yield put({ type: USER_ERROR_CLEAR })
    } else {
      yield put({ type: USER_SET_DETAIL, data: { error: 404, message: 'user not found' } })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Get user list saga watcher
 */
export function* getUserListFlow() {
  while (true) {
    const request = yield take(USER_GET_LIST)

    const users = yield call(getUserList, request.limit, request.sortBy, request.offset, request.neighborhoodId, request.fields)
    if (users) {
      yield put({ type: USER_SET_LIST, data: users })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * Set showWelcomePost = false
 */
export function* disableWelcomePostFlow() {
  while (true) {
    yield take(USER_DISABLE_WELCOME_POST)
    yield call(disableWelcomePost)
  }
}

/**
 * Set showWelcomePost = true
 */
export function* enableWelcomePostFlow() {
  while (true) {
    yield take(USER_ENABLE_WELCOME_POST)
    yield call(enableWelcomePost)
  }
}

/**
 * watcher: get groups administrated by user
 */
export function* getAdministratedGroupsFlow() {
  while (true) {
    yield take(USER_GET_ADMINISTRATED_GROUPS)
    const administratedGroups = yield call(getAdministratedGroups)

    if (administratedGroups) {
      yield put({ type: USER_SET_ADMINISTRATED_GROUPS, administratedGroups })
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

/**
 * watcher: block user
 */
export function* blockUserFlow() {
  while (true) {
    const request = yield take(USER_SET_BLOCKED)
    const result = yield call(blockUser, request.userId)

    if (result) {
      yield put(push('/feed'))
    }
  }
}

/**
 * watcher: deactivate profile
 */
export function* deactivateAccountFlow() {
  while (true) {
    yield take(USER_DEACTIVATE_ACCOUNT)
    const result = yield call(deactivateAccount)

    if (result) {
      yield call(signOut)
      yield put(push('/account-deactivated'))
    }
  }
}

/**
 * watcher: delete profile
 */
export function* deleteAccountFlow() {
  while (true) {
    yield take(USER_DELETE_ACCOUNT)
    const result = yield call(deleteAccount)

    if (result) {
      yield put({ type: AUTH_SIGN_OUT })
    }
  }
}

/**
 * set neighborhood radius watcher
 */
export function* setNeighborhoodRadiusFlow() {
  while (true) {
    const request = yield take(USER_FINISH_SETTING_NEIGHBORHOOD_RADIUS)
    const setRadiusResult = yield call(setNeighborhoodRadius, request.data)
    if (setRadiusResult) {
      yield put({ type: USER_ERROR_CLEAR })
    }
  }
}

export default function* root() {
  yield fork(updateUserFlow)
  yield fork(getUserFlow)
  yield fork(getUserSingleFlow)
  yield fork(changePasswordFlow)
  yield fork(changePrivacyFlow)
  yield fork(getUserListFlow)
  yield fork(setFilterFlow)
  yield fork(setViewFlow)
  yield fork(disableWelcomePostFlow)
  yield fork(enableWelcomePostFlow)
  yield fork(getAdministratedGroupsFlow)
  yield fork(getUserBlockedListFlow)
  yield fork(blockUserFlow)
  yield fork(unblockUserFlow)
  yield fork(deactivateAccountFlow)
  yield fork(deleteAccountFlow)
  yield fork(setNeighborhoodRadiusFlow)
}
