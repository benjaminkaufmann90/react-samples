import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Textarea extends Component {
  static propTypes = {
    invalid: PropTypes.bool,
    autoFocused: PropTypes.bool,
    maxCharacters: PropTypes.number,
    name: PropTypes.string,
    meta: PropTypes.object,
    value: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.clearTextarea = this.clearTextarea.bind(this)
    this.textAreaHandler = this.textAreaHandler.bind(this)
    this.state = {
      defaultHeight: 0,
    }
  }

  componentDidMount() {
    this.textarea.style.height = `${this.textarea.scrollHeight}px`
    this.textarea.style.overflowY = 'hidden'
    this.textarea.addEventListener('input', this.textAreaHandler)
    this.setState({
      defaultHeight: this.textarea.scrollHeight,
    })
    this.props.autoFocused && this.textarea.focus()
  }


  componentWillReceiveProps(nextProps) {
    if (!nextProps.value && this.state.defaultHeight !== 0) {
      this.textarea.style.height = 'auto'
      this.textarea.style.height = `${this.state.defaultHeight}px`
    }
  }

  componentWillUnmount() {
    this.textarea.removeEventListener('input', this.textAreaHandler)
  }

  textAreaHandler = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  clearTextarea() {
    const { meta, name } = this.props
    meta && meta.dispatch({
      type: '@@redux-form/CHANGE',
      payload: null,
      meta: {
        form: meta.form, field: name, touch: false, persistentSubmitErrors: false,
      },
    })
  }

  render() {
    const {
      invalid, maxCharacters, value, className,
    } = this.props
    const maxLengthError = value && maxCharacters ? (maxCharacters && value && value.length > maxCharacters) : false
    const classes = `${invalid || maxLengthError ? 'error' : ''}`
    return (
      <div className={`textarea-pos-wrapper ${classes}`}>
        <textarea {...this.props} className={[classes, className].join(' ')} ref={textarea => { this.textarea = textarea }} />
      </div>
    )
  }
}

export default Textarea
