import React, { Component } from 'react'
import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { Field } from 'redux-form'
import { injectIntl, defineMessages } from 'react-intl'
import { ReduxField, Button, Link, CustomFormattedErrorMessage } from 'components'
import { ERROR_UNVERIFIED_ADDRESS } from 'utils/constants'
import { messages as messagesError } from 'definitions/errors'
import { push } from 'react-router-redux'

export const messages = merge(defineMessages({
  email: {
    id: 'SignInForm.email',
    defaultMessage: 'Email',
  },
  password: {
    id: 'SignInForm.password',
    defaultMessage: 'Password',
  },
  signIn: {
    id: 'SignInForm.signIn',
    defaultMessage: 'Sign in',
  },
  forgotPassword: {
    id: 'SignInForm.forgotPassword',
    defaultMessage: 'Forgot password?',
  },
}), messagesError)

class SignInForm extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    currentlySendingAuth: PropTypes.bool,
    currentlySendingUser: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    apiErrorMessage: PropTypes.any,
    submitting: PropTypes.bool,
    authClearError: PropTypes.func,
    emailValue: PropTypes.any,
    passwordValue: PropTypes.any,
    dispatch: PropTypes.func,
    clearUserSingle: PropTypes.func,
  }

  componentWillMount() {
    const { authClearError, clearUserSingle } = this.props
    clearUserSingle()
    authClearError()
  }

  componentWillUpdate(nextProps) {
    const { authClearError } = this.props
    if (authClearError && (nextProps.emailValue !== this.props.emailValue || nextProps.passwordValue !== this.props.passwordValue)) {
      authClearError()
    }
  }

  componentWillUnmount() {
    const { authClearError } = this.props

    if (authClearError) {
      authClearError()
    }
  }

  render() {
    const {
      intl,
      handleSubmit,
      submitting,
      currentlySendingAuth,
      currentlySendingUser,
      apiErrorMessage,
      emailValue,
      passwordValue,
      dispatch,
    } = this.props
    const errorCode = ((((apiErrorMessage || {}).data || {}).error || {}).code || false)

    if (apiErrorMessage && apiErrorMessage.data && apiErrorMessage.data.error && apiErrorMessage.data.error.code && apiErrorMessage.data.error.code === ERROR_UNVERIFIED_ADDRESS) {
      const CryptoJS = require('crypto-js')
      const loginToken = (passwordValue && emailValue) ? CryptoJS.AES.encrypt(passwordValue, emailValue).toString() : ''
      const urlSaveLoginToken = encodeURIComponent(loginToken).replace(/'/g, '%27').replace(/"/g, '%22')
      dispatch(push(`/address-verification/${emailValue}/${urlSaveLoginToken}`))
    }

    return (
      <form
        className="sign-form"
        onSubmit={handleSubmit}
        method="POST"
      >
        <CustomFormattedErrorMessage code={errorCode} />
        <div className="form-group">
          <Field
            name="email"
            placeholder={intl.formatMessage(messages.email)}
            component={ReduxField}
          />
        </div>
        <div className="form-group">
          <Field
            name="password"
            type="password"
            placeholder={intl.formatMessage(messages.password)}
            component={ReduxField}
          />
          <Link
            to="/forgotten-password"
            className="small"
          >{intl.formatMessage(messages.forgotPassword)}
          </Link>
        </div>
        <div className="form-group">
          <Button
            type="submit"
            className="w-100"
            disabled={submitting}
            loading={currentlySendingAuth || currentlySendingUser}
          >{intl.formatMessage(messages.signIn)}
          </Button>
        </div>
      </form>
    )
  }
}

export { SignInForm as SignInFormOriginal }

export default injectIntl(SignInForm)
