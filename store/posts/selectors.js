export const initialState = {
  errorMessage: '',
  currentlySending: false,
  postsList: [],
  post: null,
  comment: null,
  commentsListOpen: null,
  showPostOverlay: false,
}

export const getError = (state = initialState) => state.errorMessage || initialState.errorMessage
export const isCurrentlySending = (state = initialState) => state.currentlySending || initialState.currentlySending
export const getPostsList = (state = initialState) => state.postsList || initialState.postsList
export const getPost = (state = initialState) => state.post || initialState.post
export const getComment = (state = initialState) => state.comment || initialState.comment
export const getCommentsListOpen = (state = initialState) => state.commentsListOpen || initialState.commentsListOpen
export const getShowPostOverlay = (state = initialState) => state.showPostOverlay || initialState.showPostOverlay
