import React from 'react'
import { connect } from 'react-redux'
import { fromAuth, fromPosts, fromUser } from 'store/selectors'
import { createPost } from 'store/actions'
import { reduxForm, formValueSelector } from 'redux-form'
import { AddPost } from 'components'

let AddPostContainer = props => <AddPost {...props} />

const onSubmit = (label, data, dispatch) => {
  dispatch(createPost(label, data))
}

AddPostContainer = reduxForm({
  form: 'AddPost',
  destroyOnUnmount: true,
  onSubmit,
  initialValues: {
    category: 'post',
  },
})(AddPostContainer)

const selector = formValueSelector('AddPost')

const mapStateToProps = (state) => ({
  currentlySending: fromPosts.isCurrentlySending(state),
  apiErrorMessage: fromPosts.getError(state),
  contentValue: selector(state, 'content'),
  groupValue: selector(state, 'group'),
  user: fromUser.getUser(state),
  accessToken: fromAuth.getToken(state),
})

export default connect(mapStateToProps)(AddPostContainer)
