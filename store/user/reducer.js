import {
  USER_SET_LIST,
  USER_RESET_LIST,
  USER_SET_BLOCKED_LIST,
  USER_SET_INFO,
  USER_SET_DETAIL,
  USER_UPDATE_INFO,
  USER_UPDATE_PRIVACY_INFO,
  USER_REQUEST_SEND,
  USER_REQUEST_ERROR,
  USER_ERROR_CLEAR,
  USER_RESET_INITIAL_STATE,
  USER_CLEAR_SINGLE,
  USER_SET_FILTER,
  USER_DISABLE_WELCOME_POST,
  USER_ENABLE_WELCOME_POST,
  USER_SET_ADMINISTRATED_GROUPS,
  USER_CLEAR_ADMINISTRATED_GROUPS,
  USER_SET_VIEW,
  USER_SET_NEIGHBORHOOD_RADIUS,
  USER_PRIVACY_REQUEST_SEND,
  USER_SET_NEIGHBORHOOD_TMP_PRADIUS,
  USER_CLEAR_NEIGHBORHOOD_TMP_PRADIUS,
  USER_SET_FIRST_SIGNIN,
  USER_SET_TOUR_STEP_INTRODUCTION,
} from './constants'

export const initialState = {
  errorMessage: '',
  currentlySending: false,
  currentlySendingPrivacy: false,
  user: {
    config: {
      filter: null,
      radius: {
        distance: 10000,
      },
    },
    administratedGroups: [],
  },
  userTmpRadius: null,
  userSingle: null,
  userList: {
    list: [],
  },
  blockedUsers: [],
  isFirstSignIn: false,
  guidedTourStepIntroduction: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_SET_LIST:
      if (action.data.page === 1) {
        return { ...state, userList: action.data }
      }
      return { ...state, userList: { ...state.userList, list: [...state.userList.list, ...action.data.list] } }
    case USER_RESET_LIST:
      return { ...state, userList: { ...initialState.userList } }
    case USER_SET_BLOCKED_LIST:
      return { ...state, blockedUsers: action.data }
    case USER_UPDATE_INFO: {
      return { ...state, user: { ...state.user, ...action.data } }
    }
    case USER_UPDATE_PRIVACY_INFO: {
      const newUser = { ...state.user }
      if (action.data.privacy) newUser.privacy = action.data.privacy
      return { ...state, user: { ...newUser } }
    }
    case USER_SET_INFO:
      return { ...state, user: { ...state.user, ...action.data } }
    case USER_SET_DETAIL:
      return { ...state, userSingle: action.data }
    case USER_REQUEST_SEND:
      return { ...state, currentlySending: action.sending }
    case USER_PRIVACY_REQUEST_SEND:
      return { ...state, currentlySendingPrivacy: action.sending }
    case USER_REQUEST_ERROR:
      return { ...state, errorMessage: action.error }
    case USER_ERROR_CLEAR:
      return { ...state, errorMessage: '' }
    case USER_RESET_INITIAL_STATE:
      return { ...state, ...initialState }
    case USER_CLEAR_SINGLE:
      return { ...state, userSingle: null }
    case USER_SET_NEIGHBORHOOD_TMP_PRADIUS:
      return { ...state, userTmpRadius: action.data }
    case USER_CLEAR_NEIGHBORHOOD_TMP_PRADIUS:
      return { ...state, userTmpRadius: initialState.userTmpRadius }
    case USER_SET_NEIGHBORHOOD_RADIUS: {
      if (state.user && state.user.config && state.user.config.radius) {
        return {
          ...state,
          user: {
            ...state.user,
            config: {
              ...state.user.config,
              radius: {
                ...state.user.config.radius,
                distance: action.data,
              },
            },
          },
        }
      }
      return {
        ...state,
        user: {
          ...state.user,
          config: {
            ...state.user.config,
            radius: {
              distance: action.data,
            },
          },
        },
      }
    }
    case USER_SET_FILTER: {
      if (state.user && state.user.config && state.user.config.filter) {
        return {
          ...state,
          user: {
            ...state.user,
            config: {
              ...state.user.config,
              filter: {
                ...state.user.config.filter,
                [action.page]: {
                  ...state.user.config.filter[action.page],
                  [action.filter]: action.value,
                },
              },
            },
          },
        }
      }
      return {
        ...state,
        user: {
          ...state.user,
          config: {
            ...state.user.config,
            filter: {
              [action.page]: {
                [action.filter]: action.value,
              },
            },
          },
        },
      }
    }
    case USER_SET_VIEW: {
      return { ...state, user: { ...state.user, config: { ...state.user.config, view: action.data.view } } }
    }
    case USER_SET_ADMINISTRATED_GROUPS: {
      return { ...state, user: { ...state.user, administratedGroups: action.administratedGroups } }
    }
    case USER_CLEAR_ADMINISTRATED_GROUPS:
      return { ...state, user: { ...state.user, administratedGroups: initialState.user.administratedGroups } }
    case USER_DISABLE_WELCOME_POST:
      return {
        ...state,
        user: {
          ...state.user,
          config: {
            ...state.user.config,
            showWelcomePost: null,
          },
        },
      }
    case USER_ENABLE_WELCOME_POST:
      return {
        ...state,
        user: {
          ...state.user,
          config: {
            ...state.user.config,
            showWelcomePost: true,
          },
        },
      }
    case USER_SET_FIRST_SIGNIN:
      return {
        ...state, isFirstSignIn: action.isFirstSignIn,
      }
    case USER_SET_TOUR_STEP_INTRODUCTION:
      return {
        ...state, guidedTourStepIntroduction: action.guidedTourStepIntroduction,
      }
    default: return state
  }
}
