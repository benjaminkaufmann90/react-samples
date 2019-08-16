import React from 'react'
import { connect } from 'react-redux'
import { fromAuth, fromUser } from 'store/selectors'
import { isCurrentlySending, signInRequest, authClearError, clearUserSingle } from 'store/actions'

import { reduxForm, formValueSelector } from 'redux-form'
import { createValidator, required, email, minLength } from 'utils/validation'

import { SignInForm } from 'components'

let SignInFormContainer = props => <SignInForm {...props} />

const onSubmit = (data, dispatch) => {
  const currentData = { ...data }
  currentData.email = data.email.trim()

  dispatch(signInRequest(currentData))
}

const validate = createValidator({
  email: [required, email],
  password: [required, minLength(6)],
})

SignInFormContainer = reduxForm({
  form: 'SignInForm',
  destroyOnUnmount: false,
  onSubmit,
  validate,
})(SignInFormContainer)

const selector = formValueSelector('SignInForm')

const mapStateToProps = (state) => ({
  apiErrorMessage: fromAuth.getError(state),
  currentlySendingAuth: fromAuth.isCurrentlySending(state),
  currentlySendingUser: fromUser.isCurrentlySending(state),
  emailValue: selector(state, 'email'),
  passwordValue: selector(state, 'password'),
})

const mapDispatchToProps = (dispatch) => ({
  isCurrentlySending: () => dispatch(isCurrentlySending()),
  signInRequest: (email, password) => dispatch(signInRequest({ email, password })),
  authClearError: () => dispatch(authClearError()),
  clearUserSingle: () => dispatch(clearUserSingle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInFormContainer)
