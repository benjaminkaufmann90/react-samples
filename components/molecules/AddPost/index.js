import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { Field } from 'redux-form'
import { ReduxField, Button, Attachments, UserIcon } from 'components'
import { messages as attachmentMessages } from 'definitions/attachments'

const messages = defineMessages({
  placeholder: {
    id: 'AddPost.placeholder',
    defaultMessage: 'What\'s happening?',
  },
  feed: {
    id: 'AddPost.feed',
    defaultMessage: 'What\'s happening?',
  },
  group: {
    id: 'AddPost.group',
    defaultMessage: 'Do you have an annotation for this group?',
  },
  classified: {
    id: 'AddPost.classified',
    defaultMessage: 'What\'s happening?',
  },
  place: {
    id: 'AddPost.place',
    defaultMessage: 'What\'s happening?',
  },
  event: {
    id: 'AddPost.event',
    defaultMessage: 'What\'s happening?',
  },
  avatar: {
    id: 'AddPost.avatar',
    defaultMessage: 'You',
  },
  submitBtn: {
    id: 'AddPost.submitBtn',
    defaultMessage: 'Post',
  },
})

/**
 * Component used to render AddPost element used to add posts in feeds
 *
 * Most of the props are coming through container with the same name, see prop types for possible props.
 */
class AddPost extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    user: PropTypes.object,
    currentlySending: PropTypes.bool,
    submitting: PropTypes.bool,
    contentValue: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    groupId: PropTypes.string,
    placeId: PropTypes.string,
    label: PropTypes.string,
    parentId: PropTypes.any,
    contentId: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.state = {
      focusActive: false,
      isUploading: false,
    }
    this.customSubmit = this.customSubmit.bind(this)
    this.isUploading = this.isUploading.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.setFocusActive = this.setFocusActive.bind(this)
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClickEvent, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickEvent, false)
  }

  setFocusActive() {
    this.setState({ focusActive: true })
  }

  handleClickEvent(e) {
    const { contentValue } = this.props
    if (!this.node.contains(e.target) && this.state.focusActive && (contentValue === undefined || contentValue === '')) {
      this.setState({ focusActive: false })
    }
  }

  isUploading(status) {
    this.setState({ isUploading: status })
  }

  /**
   * Custom submit handler for redux-form submission
   *
   * @param {object} data Data object from the submitted form
   * @param {function} dispatch Function taking care of sipatching the action to the redux store
   */
  customSubmit(data, dispatch) {
    const {
      onSubmit,
      groupId,
      placeId,
      parentId,
      label,
      contentId,
    } = this.props
    const attachments = this.attachments.getValue()
    let enhancedData = {}
    if (data.content) {
      enhancedData = {
        ...data,
        group: groupId || null,
        place: placeId || null,
        parent: parentId || null,
        contentId: contentId || null,
        attachments: attachments || null,
      }
    } else {
      delete Object.getPrototypeOf(data).content
      enhancedData = {
        ...data,
        group: groupId || null,
        place: placeId || null,
        parent: parentId || null,
        contentId: contentId || null,
        attachments: attachments || null,
      }
    }
    onSubmit(label, enhancedData, dispatch)
    this.attachments.resetAttachments()
    this.setState({ focusActive: false })
  }

  render() {
    const {
      intl, submitting, currentlySending, handleSubmit, user, label,
    } = this.props
    const { isUploading } = this.state
    return (
      <div className="add-post p-16" ref={(node) => { this.node = node }}>
        <div className="d-flex add-post-area">
          <UserIcon
            className="mr-16"
            user={user}
            title={intl.formatMessage(messages.avatar)}
            width={36}
            height={36}
          />
          <div className="d-flex flex-column flex-full">
            <form
              className="flex-full"
              onSubmit={handleSubmit(this.customSubmit)}
              ref={form => { this.form = form }}
            >
              <Field
                placeholder={intl.formatMessage(label ? messages[label] : messages.placeholder)}
                type="textarea"
                name="content"
                component={ReduxField}
                onFocus={this.setFocusActive}
              />
              {
                this.state.focusActive || (this.attachments && this.attachments.getValue()) ? (
                  <div className="add-post__settings">
                    <Attachments
                      ref={(instance) => {
                        this.attachments = instance
                      }}
                      isUploading={this.isUploading}
                      imageUploading={intl.formatMessage(attachmentMessages.imageUploading)}
                      imageSuccess={intl.formatMessage(attachmentMessages.imageSuccess)}
                      imageFailure={intl.formatMessage(attachmentMessages.imageFailure)}
                    />
                    <Button
                      type="submit"
                      disabled={!user || submitting || currentlySending || isUploading}
                    >{intl.formatMessage(messages.submitBtn)}
                    </Button >
                  </div >
                ) : ('')
              }
            </form>
          </div>
        </div>
      </div >
    )
  }
}

export default injectIntl(AddPost)
