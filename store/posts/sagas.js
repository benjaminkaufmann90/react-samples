import { take, call, put, fork, select } from 'redux-saga/effects'
import { reset } from 'redux-form'
import api from 'services/api'
import { fromAuth } from 'store/selectors'
import ReactGA from 'react-ga'


import {
  POST_REQUEST_SEND,
  POST_GET_LIST,
  POST_SET_LIST,
  POST_GET_CHILDREN_LIST,
  POST_SET_CHILDREN_LIST,
  POST_GET_COMMENTS,
  POST_SET_COMMENTS,
  POST_GET_DETAIL,
  POST_SET_DETAIL,
  POST_CREATE,
  POST_DELETE,
  POST_UPDATE,
  POST_REQUEST_ERROR,
  POST_ERROR_CLEAR,
  POST_CREATED_SUCCESS,
  POST_DELETED_SUCCESS,
  POST_UPDATED_SUCCESS,
  REPLY_REQUEST_SEND,
  REPLY_CREATE,
  REPLY_CREATED_SUCCESS,
  REPLY_DELETED_SUCCESS,
  REPLY_UPDATED_SUCCESS,
  SINGLE_POST_REPLY_CREATED_SUCCESS,
  SINGLE_POST_REPLY_DELETED_SUCCESS,
  SINGLE_POST_REPLY_UPDATED_SUCCESS,
  REPLY_ERROR_CLEAR,
  REPLY_UPDATE,
  REPLY_DELETE,
  COMMENT_CREATE,
  COMMENT_UPDATE,
  COMMENT_DELETE,
  COMMENT_REQUEST_SEND,
  COMMENT_REQUEST_ERROR,
  COMMENT_ERROR_CLEAR,
  COMMENT_SENDING_ERROR,
  COMMENT_CREATED_SUCCESS,
  COMMENT_UPDATED_SUCCESS,
  COMMENT_DELETED_SUCCESS,
  SINGLE_POST_COMMENT_CREATED_SUCCESS,
  SINGLE_POST_COMMENT_UPDATED_SUCCESS,
  SINGLE_POST_COMMENT_DELETED_SUCCESS,

  POST_COMMENTS_LIST_OPEN,

} from './constants'

import {
  FEED_POST_SET_COMMENTS,
  FEED_POST_CREATED_SUCCESS,
  FEED_POST_UPDATED_SUCCESS,
  FEED_POST_DELETED_SUCCESS,
  FEED_COMMENT_CREATED_SUCCESS,
  FEED_COMMENT_UPDATED_SUCCESS,
  FEED_COMMENT_DELETED_SUCCESS,
  FEED_REPLY_CREATED_SUCCESS,
  FEED_REPLY_UPDATED_SUCCESS,
  FEED_REPLY_DELETED_SUCCESS,
} from '../feed/constants'

let secureApi = {}
if (api) {
  secureApi = api.create()
}

function setAuthToken(token) {
  secureApi.setToken(token)
}

/**
 * Get content posts list saga worker
 */
export function* getContentPostsList({ contentId }) {
  yield put({ type: POST_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  console.log(contentId)
  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/content/associations/${contentId}/posts`)
    return response
  } catch (error) {
    console.log('get posts list error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Get posts list saga worker
 */
export function* getPostsList({ field, contentId }) {
  yield put({ type: POST_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  console.log(field)

  const apiRoute = field
    ? `api/v1/posts?${field}&with_comments`
    : `api/v1/content/associations/${contentId}/posts?with_comments`

  try {
    const response = yield call([secureApi, secureApi.get], apiRoute)
    return response
  } catch (error) {
    console.log('get posts list error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Get posts children list saga worker
 */
export function* getPostsWithChildren({ id }) {
  yield put({ type: POST_REQUEST_SEND, sending: true })
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/posts/${id}/children?with_comments`)
    return response
  } catch (error) {
    console.log('get posts list error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Create post saga worker
 */
export function* createPost(data) {
  yield put({ type: POST_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  try {
    const response = yield call([secureApi, secureApi.post], 'api/v1/posts', data)

    return response
  } catch (error) {
    console.log('create post error')

    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Update post saga worker
 */
export function* updatePost(id, data) {
  yield put({ type: POST_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  try {
    const response = yield call([secureApi, secureApi.patch], `api/v1/posts/${id}`, data)
    return response
  } catch (error) {
    console.log('update post error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Delete post saga worker
 */
export function* deletePost(id) {
  yield put({ type: POST_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.delete], `api/v1/posts/${id}`)

    return response
  } catch (error) {
    console.log('delete post error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}


/**
 * Create comment saga worker
 */
export function* createComment(postId, data) {
  yield put({ type: COMMENT_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.post], `api/v1/posts/${postId}/comments`, data)

    return response
  } catch (error) {
    yield put({ type: COMMENT_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: COMMENT_REQUEST_SEND, sending: false })
  }
}

/**
 * Update comment saga worker
 */
export function* updateComment(id, data) {
  yield put({ type: COMMENT_REQUEST_SEND, sending: true })
  console.log(id)

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.patch], `api/v1/comments/${id}`, data)

    return response
  } catch (error) {
    console.log('update comment error')
    yield put({ type: COMMENT_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: COMMENT_REQUEST_SEND, sending: false })
  }
}

/**
 * Delete comment saga worker
 */
export function* deleteComment(id) {
  yield put({ type: COMMENT_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)
  try {
    const response = yield call([secureApi, secureApi.delete], `api/v1/comments/${id}`)

    return response
  } catch (error) {
    console.log('delete comment error')
    yield put({ type: COMMENT_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: COMMENT_REQUEST_SEND, sending: false })
  }
}


/**
 * Create reply saga worker
 */
export function* createReply(postId, data) {
  yield put({ type: REPLY_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.post], `api/v1/posts/${postId}/comments`, data)
    return response
  } catch (error) {
    console.log('create comment error')
    yield put({ type: COMMENT_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: REPLY_REQUEST_SEND, sending: false })
  }
}

/**
 * Get single comment saga worker
 */
export function* getComment({ id }) {
  yield put({ type: COMMENT_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/comments/${id}`)

    return response
  } catch (error) {
    console.log('get single comment error')
    yield put({ type: COMMENT_SENDING_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: COMMENT_REQUEST_SEND, sending: false })
  }
}

/**
 * Get single post saga worker
 */
export function* getPost({ id }) {
  yield put({ type: POST_REQUEST_SEND, sending: true })

  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/posts/${id}?with_comments`)

    return response
  } catch (error) {
    console.log('get single post error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Get post comments saga worker
 */
export function* getComments({ id }) {
  yield put({ type: POST_REQUEST_SEND, sending: true })
  console.log(id)
  const token = yield select(fromAuth.getToken)
  yield call(setAuthToken, token)

  try {
    const response = yield call([secureApi, secureApi.get], `api/v1/posts/${id}/comments`)

    return response
  } catch (error) {
    console.log('get comments error')
    yield put({ type: POST_REQUEST_ERROR, error: error.message })

    return false
  } finally {
    yield put({ type: POST_REQUEST_SEND, sending: false })
  }
}

/**
 * Create post saga watcher
 */
export function* createPostFlow() {
  while (true) {
    const request = yield take(POST_CREATE)
    console.log(request)
    const label = request && request.label
    const post = yield call(createPost, request.data)
    console.log(post)
    if (post) {
      // eslint-disable-next-line no-undef
      _paq.push(['trackEvent', 'posts', 'Create', 'createPost'])

      const attachments = post.attachments ? post.attachments : []
      if (label === 'feed') {
        yield put({
          type: FEED_POST_CREATED_SUCCESS,
          data: {
            ...post, comments: [], attachments, is_following: true,
          },
        })
        ReactGA.event({
          category: 'user',
          action: 'createPost',
        })
      } else {
        if (post.parent && post.parent.type && post.parent.type === 'event') {
          ReactGA.event({
            category: 'event',
            action: 'createComment',
          })
          console.log('Track Comment of Event')
        } else if (post.group) {
          ReactGA.event({
            category: 'group',
            action: 'createComment',
          })
          console.log('Track Comment of Group')
        }

        console.log('Hello Comment Data:', post)

        yield put({
          type: POST_CREATED_SUCCESS,
          data: {
            ...post, comments: [], attachments, is_following: true,
          },
        })
      }

      yield put(reset('AddPost')) // Clear form
    }
  }
}


/**
 * Update post saga watcher
 */
export function* updatePostFlow() {
  while (true) {
    const request = yield take(POST_UPDATE)
    const label = request && request.label
    const post = yield call(updatePost, request.id, request.data)
    console.log(post)
    if (post) {
      const attachments = post.attachments ? post.attachments : []
      if (label === 'feed') {
        yield put({ type: FEED_POST_UPDATED_SUCCESS, data: { ...post, attachments } })
      } else yield put({ type: POST_UPDATED_SUCCESS, data: { ...post, attachments } })
    }
  }
}

/**
 * Delete post saga watcher
 */
export function* deletePostFlow() {
  while (true) {
    const request = yield take(POST_DELETE)
    const label = request && request.label
    yield call(deletePost, request.id)
    if (label === 'feed') {
      yield put({ type: FEED_POST_DELETED_SUCCESS, id: request.id })
    } else yield put({ type: POST_DELETED_SUCCESS, id: request.id })
  }
}

/**
 * Create comment saga watcher
 */
export function* createCommentFlow() {
  while (true) {
    const request = yield take(COMMENT_CREATE)
    const label = request && request.label
    const comment = yield call(createComment, request.postId, request.data)

    if (comment) {
      yield put({ type: POST_COMMENTS_LIST_OPEN, data: request.postId })
      if (label === 'feed') {
        yield put({ type: FEED_COMMENT_CREATED_SUCCESS, postId: request.postId, data: { ...comment, replies: [] } })
      } else if (label === 'singlePost') {
        yield put({ type: SINGLE_POST_COMMENT_CREATED_SUCCESS, postId: request.postId, data: { ...comment, replies: [] } })
      } else {
        yield put({ type: COMMENT_CREATED_SUCCESS, postId: request.postId, data: { ...comment, replies: [] } })
      }
      yield put({ type: COMMENT_ERROR_CLEAR })
    }
  }
}

/**
 * Update comment saga watcher
 */
export function* updateCommentFlow() {
  while (true) {
    const request = yield take(COMMENT_UPDATE)
    const label = request && request.label
    const comment = yield call(updateComment, request.id, request.data)
    console.log(comment)
    if (comment) {
      yield put({ type: POST_COMMENTS_LIST_OPEN, data: request.postId })
      if (label === 'feed') {
        yield put({ type: FEED_COMMENT_UPDATED_SUCCESS, postId: request.postId, data: comment })
      } else if (label === 'singlePost') {
        yield put({ type: SINGLE_POST_COMMENT_UPDATED_SUCCESS, data: comment })
      } else {
        yield put({ type: COMMENT_UPDATED_SUCCESS, postId: request.postId, data: comment })
      }
      yield put({ type: COMMENT_ERROR_CLEAR })
    }
  }
}

/**
 * Delete comment saga watcher
 */
export function* deleteCommentFlow() {
  while (true) {
    const request = yield take(COMMENT_DELETE)
    const label = request && request.label
    yield call(deleteComment, request.id)
    yield put({ type: POST_COMMENTS_LIST_OPEN, data: request.postId })
    if (label === 'feed') {
      yield put({ type: FEED_COMMENT_DELETED_SUCCESS, postId: request.postId, id: request.id })
    } else if (label === 'singlePost') {
      yield put({ type: SINGLE_POST_COMMENT_DELETED_SUCCESS, id: request.id })
    } else {
      yield put({ type: COMMENT_DELETED_SUCCESS, postId: request.postId, id: request.id })
    }
    yield put({ type: COMMENT_ERROR_CLEAR })
  }
}

/**
 * Reply comment saga watcher
 */
export function* createReplyFlow() {
  while (true) {
    const request = yield take(REPLY_CREATE)
    const label = request && request.label
    const reply = yield call(createReply, request.postId, request.data)
    if (reply) {
      yield put({ type: POST_COMMENTS_LIST_OPEN, data: request.postId })
      if (label === 'feed') {
        yield put({ type: FEED_REPLY_CREATED_SUCCESS, postId: request.postId, data: reply })
      } else if (label === 'singlePost') {
        console.log('reply: ', reply)
        yield put({ type: SINGLE_POST_REPLY_CREATED_SUCCESS, data: reply })
      } else {
        yield put({ type: REPLY_CREATED_SUCCESS, postId: request.postId, data: reply })
      }
      yield put({ type: REPLY_ERROR_CLEAR })
      yield put(reset('AddReply'))
    }
  }
}

/**
 * Update reply saga watcher
 */
export function* updateReplyFlow() {
  while (true) {
    const request = yield take(REPLY_UPDATE)
    const label = request && request.label
    const reply = yield call(updateComment, request.id, request.data)

    if (reply) {
      yield put({ type: POST_COMMENTS_LIST_OPEN, data: request.postId })
      if (label === 'feed') {
        yield put({
          type: FEED_REPLY_UPDATED_SUCCESS, postId: request.postId, commentId: reply.reply_to, data: reply,
        })
      } else if (label === 'singlePost') {
        yield put({
          type: SINGLE_POST_REPLY_UPDATED_SUCCESS, commentId: reply.reply_to, data: reply,
        })
      } else {
        yield put({
          type: REPLY_UPDATED_SUCCESS, postId: request.postId, commentId: reply.reply_to, data: reply,
        })
      }
      yield put({ type: REPLY_ERROR_CLEAR })
    }
  }
}

/**
 * Delete reply saga watcher
 */
export function* deleteReplyFlow() {
  while (true) {
    const request = yield take(REPLY_DELETE)
    const label = request && request.label
    if (label === 'feed') {
      yield put({
        type: FEED_REPLY_DELETED_SUCCESS, postId: request.postId, commentId: request.id, replyId: request.replyId,
      })
    } else if (label === 'singlePost') {
      yield put({
        type: SINGLE_POST_REPLY_DELETED_SUCCESS, commentId: request.id, replyId: request.replyId,
      })
    } else {
      yield put({
        type: REPLY_DELETED_SUCCESS, postId: request.postId, commentId: request.id, replyId: request.replyId,
      })
    }
    yield call(deleteComment, request.id)
  }
}

/**
 * Get posts list saga watcher
 */
export function* getPostsListFlow() {
  while (true) {
    const request = yield take(POST_GET_LIST)
    const posts = yield call(getPostsList, request.data)
    if (posts) {
      yield put({ type: POST_SET_LIST, data: posts })
      yield put({ type: POST_ERROR_CLEAR })
    }
  }
}

/**
 * Get posts with children list saga watcher
 */
export function* getPostsWithChildrenFlow() {
  while (true) {
    const request = yield take(POST_GET_CHILDREN_LIST)
    const posts = yield call(getPostsWithChildren, request.data)

    if (posts) {
      yield put({ type: POST_SET_CHILDREN_LIST, data: posts })
      yield put({ type: POST_ERROR_CLEAR })
    }
  }
}

/**
 * Get single post saga watcher
 */
export function* getPostFlow() {
  while (true) {
    const request = yield take(POST_GET_DETAIL)

    const post = yield call(getPost, request.data)

    if (post) {
      yield put({ type: POST_SET_DETAIL, data: post })
      yield put({ type: POST_ERROR_CLEAR })
    }
  }
}

/**
 * Get post comments saga watcher
 */
export function* getCommentsFlow() {
  while (true) {
    const request = yield take(POST_GET_COMMENTS)
    const { id } = request.data
    const label = request && request.data && request.data.label
    const comments = yield call(getComments, request.data)
    if (comments) {
      if (label === 'feed') {
        yield put({ type: FEED_POST_SET_COMMENTS, postId: id, data: comments })
      } else yield put({ type: POST_SET_COMMENTS, postId: id, data: comments })
      yield put({ type: POST_ERROR_CLEAR })
    }
  }
}

export default function* root() {
  yield fork(createPostFlow)
  yield fork(createCommentFlow)
  yield fork(createReplyFlow)
  yield fork(updateReplyFlow)
  yield fork(updatePostFlow)
  yield fork(updateCommentFlow)
  yield fork(deleteCommentFlow)
  yield fork(deleteReplyFlow)
  yield fork(deletePostFlow)
  yield fork(getPostsListFlow)
  yield fork(getPostsWithChildrenFlow)
  yield fork(getPostFlow)
  yield fork(getCommentsFlow)
}
