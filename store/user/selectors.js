import { supportWebUser } from 'config'
import { initialState } from './selectors'

export const getError = (state = initialState) => state.errorMessage || initialState.errorMessage
export const isCurrentlySending = (state = initialState) => state.currentlySending || initialState.currentlySending
export const isCurrentlySendingPrivacy = (state = initialState) => state.currentlySendingPrivacy || initialState.currentlySendingPrivacy
export const getUserList = (state = initialState) => state.userList || initialState.userList
export const getUser = (state = initialState) => state.user || initialState.user
export const getBlockedUsers = (state = initialState) => state.blockedUsers || initialState.blockedUsers
export const getUserSingle = (state = initialState) => state.userSingle || initialState.userSingle
export const getSupportUserID = () => supportWebUser
export const getFilterConfig = (state = initialState) => state.user.config.filter || initialState.user.config.filter
export const getAdministratedGroups = (state = initialState) => state.user.administratedGroups || initialState.user.administratedGroups
export const getNeighborhoodRadius = (state = initialState) => state.user.config.radius.distance || initialState.user.config.radius.distance
export const getNeighborhoodTmpRadius = (state = initialState) => state.userTmpRadius || initialState.userTmpRadius
export const getIsFirstSignIn = (state = initialState) => state.isFirstSignIn || initialState.isFirstSignIn
export const getGuidedTourStepIntroduction = (state = initialState) => state.guidedTourStepIntroduction || initialState.guidedTourStepIntroduction

