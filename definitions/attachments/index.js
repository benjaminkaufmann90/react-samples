import { defineMessages } from 'react-intl'

/**
 * Module used for definition of image upload states and their translation.
 */
export const messages = defineMessages({
  imageUploading: {
    id: 'Attachments.imageUploading',
    defaultMessage: 'Image is uploading',
  },
  imageSuccess: {
    id: 'Attachments.imageSuccess',
    defaultMessage: 'Image upload successfull',
  },
  imageFailure: {
    id: 'Attachments.imageFailure',
    defaultMessage: 'Image upload failed',
  },
  imageSizeError: {
    id: 'Attachments.imageSizeError',
    defaultMessage: 'Image size is to small',
  },
  loadMore: {
    id: 'Attachments.loadMore',
    defaultMessage: 'Pick another picture',
  },
})

const attachements = []

Object.keys(messages).forEach((key) => {
  attachements.push({ key, interest: messages[key] })
})

export default attachements
