import {
  POST_GET_LIST,
  POST_SET_LIST,
  POST_CLEAR_LIST,
  POST_GET_CHILDREN_LIST,
  POST_SET_CHILDREN_LIST,
  POST_GET_COMMENTS,
  POST_SET_COMMENTS,
  POST_GET_DETAIL,
  POST_SET_DETAIL,
  POST_CREATE,
  POST_UPDATE,
  POST_DELETE,
  POST_REQUEST_SEND,
  POST_REQUEST_ERROR,
  POST_ERROR_CLEAR,

  COMMENT_GET_DETAIL,
  COMMENT_SET_DETAIL,
  COMMENT_CREATE,
  COMMENT_UPDATE,
  COMMENT_DELETE,
  COMMENT_REQUEST_SEND,
  COMMENT_REQUEST_ERROR,
  COMMENT_ERROR_CLEAR,
  REPLY_GET_DETAIL,
  REPLY_SET_DETAIL,
  REPLY_CREATE,
  REPLY_UPDATE,
  REPLY_DELETE,
  REPLY_REQUEST_SEND,
  REPLY_ERROR_CLEAR,
  REPLY_REQUEST_ERROR,

  POST_COMMENTS_LIST_OPEN,
  POST_COMMENTS_LIST_OPEN_CLEAR,

  POST_SET_SHOW_OVERLAY,
} from './constants'

// Posts

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function postSendingRequest(sending) {
  return { type: POST_REQUEST_SEND, sending }
}

export function createPost(label, data) {
  return { type: POST_CREATE, label, data }
}

export function getPostsList(data) {
  return { type: POST_GET_LIST, data }
}

export function setPostsList(data) {
  return { type: POST_SET_LIST, data }
}

export function clearPostsList() {
  return { type: POST_CLEAR_LIST }
}

export function getPostsWithChildren(data) {
  return { type: POST_GET_CHILDREN_LIST, data }
}

export function setPostsChildrenList(data) {
  return { type: POST_SET_CHILDREN_LIST, data }
}

export function getPost(data) {
  return { type: POST_GET_DETAIL, data }
}

export function setPost(data) {
  return { type: POST_SET_DETAIL, data }
}

export function getPostComments(data) {
  return { type: POST_GET_COMMENTS, data }
}

export function setPostComments(id, data) {
  return { type: POST_SET_COMMENTS, id, data }
}

export function updatePost(label, id, data) {
  return {
    type: POST_UPDATE, label, id, data,
  }
}

export function deletePost(label, id) {
  return { type: POST_DELETE, label, id }
}

export function commentsListOpen(data) {
  return { type: POST_COMMENTS_LIST_OPEN, data }
}
export function commentsListOpenClear() {
  return { type: POST_COMMENTS_LIST_OPEN_CLEAR }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function postRequestError(error) {
  return { type: POST_REQUEST_ERROR, error }
}

/**
 * Sets the `error` state as empty
 */
export function postClearError() {
  return { type: POST_ERROR_CLEAR }
}

// Comments

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function commentSendingRequest(sending) {
  return { type: COMMENT_REQUEST_SEND, sending }
}

export function createComment(label, postId, data) {
  return {
    type: COMMENT_CREATE, label, postId, data,
  }
}

export function getComment(data) {
  return { type: COMMENT_GET_DETAIL, data }
}

export function setComment(data) {
  return { type: COMMENT_SET_DETAIL, data }
}

export function updateComment(label, postId, id, data) {
  return {
    type: COMMENT_UPDATE, label, postId, id, data,
  }
}

export function deleteComment(label, id, postId) {
  return {
    type: COMMENT_DELETE, label, id, postId,
  }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function commentRequestError(error) {
  return { type: COMMENT_REQUEST_ERROR, error }
}

/**
 * Sets the `error` state as empty
 */
export function commentClearError() {
  return { type: COMMENT_ERROR_CLEAR }
}

// Replies

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function replySendingRequest(sending) {
  return { type: REPLY_REQUEST_SEND, sending }
}

export function createReply(label, postId, data) {
  return {
    type: REPLY_CREATE, label, postId, data,
  }
}

export function getReply(postId, data) {
  return { type: REPLY_GET_DETAIL, postId, data }
}

export function setReply(data) {
  return { type: REPLY_SET_DETAIL, data }
}

export function updateReply(label, postId, id, data) {
  return {
    type: REPLY_UPDATE, label, postId, id, data,
  }
}

export function deleteReply(label, id, postId, replyId) {
  return {
    type: REPLY_DELETE, label, id, postId, replyId,
  }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function replyRequestError(error) {
  return { type: REPLY_REQUEST_ERROR, error }
}

/**
 * Sets the `error` state as empty
 */
export function replyClearError() {
  return { type: REPLY_ERROR_CLEAR }
}

export function setShowPostOverlay(data) {
  return { type: POST_SET_SHOW_OVERLAY, showPostOverlay: data }
}
