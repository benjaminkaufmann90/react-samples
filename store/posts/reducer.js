import { initialState } from './selectors'
import {
  POST_SET_LIST,
  POST_CLEAR_LIST,
  POST_SET_CHILDREN_LIST,
  POST_SET_DETAIL,
  POST_SET_COMMENTS,
  POST_CREATED_SUCCESS,
  POST_UPDATED_SUCCESS,
  POST_DELETED_SUCCESS,
  POST_REQUEST_SEND,
  POST_REQUEST_ERROR,
  POST_ERROR_CLEAR,
  COMMENT_CREATED_SUCCESS,
  COMMENT_UPDATED_SUCCESS,
  COMMENT_DELETED_SUCCESS,
  SINGLE_POST_COMMENT_CREATED_SUCCESS,
  SINGLE_POST_COMMENT_UPDATED_SUCCESS,
  SINGLE_POST_COMMENT_DELETED_SUCCESS,
  REPLY_CREATED_SUCCESS,
  REPLY_UPDATED_SUCCESS,
  REPLY_DELETED_SUCCESS,
  SINGLE_POST_REPLY_CREATED_SUCCESS,
  SINGLE_POST_REPLY_DELETED_SUCCESS,
  SINGLE_POST_REPLY_UPDATED_SUCCESS,
  POST_COMMENTS_LIST_OPEN,
  POST_COMMENTS_LIST_OPEN_CLEAR, POST_SET_SHOW_OVERLAY,
} from './constants'

import { FEED_REACTION_LIKE } from '../feed/constants'

import {
  updateObjectInArray,
  insertCommentToPost,
  insertReplyToPost,
  insertReplyToComment,
  updateCommentInPost,
  getCommentsToPost,
  updateReplyInPost,
  updateReplyInComment,
  deleteObjectInArray,
  deleteCommentInPost,
  deleteReplyInPost,
  deleteReplyInComment,
  updateFollowInList,
} from '../../utils'

import { FOLLOW_SUCCESS, UNFOLLOW_SUCCESS } from '../follow/constants'

export default (state = initialState, action) => {
  switch (action.type) {
    case POST_SET_LIST:
      return {
        ...state,
        postsList: action.data,
      }
    case POST_CLEAR_LIST:
      return {
        ...state,
        postsList: initialState.postsList,
      }
    case POST_SET_CHILDREN_LIST:
      return {
        ...state,
        postsList: action.data,
      }
    case POST_SET_DETAIL:
      return {
        ...state,
        post: action.data,
      }
    case POST_CREATED_SUCCESS:
      return {
        ...state,
        postsList: [
          action.data,
          ...state.postsList,
        ],
      }
    case POST_UPDATED_SUCCESS:
      return {
        ...state,
        postsList: updateObjectInArray(state.postsList, action.data),
      }
    case POST_DELETED_SUCCESS:
      return {
        ...state,
        postsList: deleteObjectInArray(state.postsList, action.id),
      }
    case COMMENT_CREATED_SUCCESS:
      return {
        ...state,
        postsList: insertCommentToPost(state.postsList, action.postId, action.data),
      }
    case COMMENT_UPDATED_SUCCESS:
      return {
        ...state,
        postsList: updateCommentInPost(state.postsList, action.postId, action.data),
      }
    case POST_SET_COMMENTS:
      return {
        ...state,
        postsList: getCommentsToPost(state.postsList, action.postId, action.data),
      }
    case COMMENT_DELETED_SUCCESS:
      return {
        ...state,
        postsList: deleteCommentInPost(state.postsList, action.postId, action.id),
      }
    case SINGLE_POST_COMMENT_CREATED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [
            ...state.post.comments,
            action.data,
          ],
          comments_count: state.post.comments_count + 1,
        },
        commentsListOpen: action.postId,
      }
    case SINGLE_POST_COMMENT_UPDATED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: updateObjectInArray(state.post.comments, action.data),
          comments_count: state.post.comments_count - 1,
        },
      }
    case SINGLE_POST_COMMENT_DELETED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: deleteObjectInArray(state.post.comments, action.id),
          comments_count: state.post.comments_count - 1,
        },
      }
    case REPLY_CREATED_SUCCESS:
      return {
        ...state,
        postsList: insertReplyToPost(state.postsList, action.postId, action.data),
      }
    case REPLY_UPDATED_SUCCESS:
      return {
        ...state,
        postsList: updateReplyInPost(state.postsList, action.postId, action.commentId, action.data),
      }
    case REPLY_DELETED_SUCCESS:
      return {
        ...state,
        postsList: deleteReplyInPost(state.postsList, action.postId, action.commentId, action.replyId),
      }
    case SINGLE_POST_REPLY_CREATED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: insertReplyToComment(state.post.comments, action.data),
        },
      }
    case SINGLE_POST_REPLY_UPDATED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: updateReplyInComment(state.post.comments, action.commentId, action.data),
        },
      }
    case SINGLE_POST_REPLY_DELETED_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          comments: deleteReplyInComment(state.post.comments, action.commentId, action.replyId),
        },
      }
    case POST_REQUEST_SEND:
      return {
        ...state,
        currentlySending: action.sending,
      }
    case POST_COMMENTS_LIST_OPEN:
      return {
        ...state,
        commentsListOpen: action.data,
      }
    case POST_COMMENTS_LIST_OPEN_CLEAR:
      return {
        ...state,
        commentsListOpen: false,
      }
    case POST_REQUEST_ERROR:
      return {
        ...state,
        errorMessage: action.error,
      }
    case POST_ERROR_CLEAR:
      return {
        ...state,
        errorMessage: '',
      }
    case FOLLOW_SUCCESS:
      return action.entityGroup === 'posts' ? {
        ...state,
        postsList: updateFollowInList(state.postsList, action.id, action.entityGroup, true),
      } : state
    case UNFOLLOW_SUCCESS:
      return action.entityGroup === 'posts' ? {
        ...state,
        postsList: updateFollowInList(state.postsList, action.id, action.entityGroup, false),
      } : state
    case FEED_REACTION_LIKE:
      return {
        ...state,
        postsList: state.postsList.slice().map(item => {
          if (item.id === action.entityId) {
            return {
              ...item,
              reactions: {
                ...item.reactions,
                count: !action.pinned ? item.reactions.count - 1 : item.reactions.count + 1,
                overview: item.reactions.overview.findIndex(item => item.id === action.reactionId) !== -1 ? item.reactions.overview.map(reaction => {
                  if (reaction.id === action.reactionId) {
                    return { ...reaction, is_pinned: action.pinned }
                  }
                  return reaction
                }) : [{ id: action.reactionId, is_pinned: action.pinned }],
              },
            }
          }
          return item
        }),
      }
    case POST_SET_SHOW_OVERLAY:
      return {
        ...state,
        showPostOverlay: action.showPostOverlay,
      }
    default:
      return state
  }
}
