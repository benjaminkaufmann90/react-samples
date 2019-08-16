import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import uuid from 'uuid/v1'
import { Icon, Image as ImageComp, CustomFormattedMessage, ProgressCircle, UserIcon, Wrapper } from 'components'
import { s3BaseUrl, s3SigningUrl } from 'config'

/**
 * Transform dataURI from browser in to Binary data chunks to send over AJAX call
 */
const dataURItoBlob = (dataURI, type) => {
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i += 1) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type })
}

/**
 * Component used for uploading files to AWS S3
 *
 * Check prop types for possible props.
 *
 * Component has several visual presentation modes:
 * 1. Normally it will display a plus button to select the files form your computer.
 * 2. Component can be used as a wrapper around text input or area by setting 'wrapper' property. This way it will render the icon on the top right corner of the input.
 * 3. Optionally you can set the 'left' property to align image previews starting from left side (by default they appear from right side)
 *
 * By default component only uploads images. However you can support pdf documents upload by adding 'pdf' property
 * By default component supports only single file upload. Howvevr you can support multiple files by adding 'multiple' property
 */
class Attachments extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    multiple: PropTypes.bool,
    pdf: PropTypes.bool,
    left: PropTypes.bool,
    wrapper: PropTypes.bool,
    fullSize: PropTypes.bool,
    value: PropTypes.string,
    user: PropTypes.object,
    className: PropTypes.string,
    isUploading: PropTypes.func,
    isUploadEmpty: PropTypes.func,
    // cannot use internationalization in this component because of references in react, the transaltions need to be provided from parent component
    imageUploading: PropTypes.string,
    imageFailure: PropTypes.string,
    title: PropTypes.string,
    minSize: PropTypes.number,
    maxItems: PropTypes.number,
    onUploadChange: PropTypes.func,
    onUploadDelete: PropTypes.func,
  }

  static defaultProps = {
    multiple: false,
    pdf: false,
    left: false,
    wrapper: false,
    value: '',
    title: '',
    minSize: 0,
  }

  constructor(props) {
    super(props)

    const { value } = props
    const uploadedImages = value && value.split(',').map(image => {
      return { id: image, data: 'uploaded', type: image.split('.').pop() }
    })
    const uploadedUploads = value && value.split(',').map(upload => {
      return { id: upload, progress: 100, status: 'success' }
    })

    this.state = {
      images: [...uploadedImages], // should have structure of { id: generatedUuid, data: dataUrl, type: string }
      uploads: [...uploadedUploads], // should have structure of { id: generatedUuid, progress: number, status: string }
      imageSizeError: false,
    }

    this.onDropHandler = this.onDropHandler.bind(this)
    this.onRemoveHandler = this.onRemoveHandler.bind(this)
    this.onSelectHandler = this.onSelectHandler.bind(this)
    this.getValue = this.getValue.bind(this)
    this.getPresignedUrl = this.getPresignedUrl.bind(this)
    this.setUploadState = this.setUploadState.bind(this)
    this.setUploadProgress = this.setUploadProgress.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleFiles = this.handleFiles.bind(this)
    this.startUpload = this.startUpload.bind(this)
    this.uploadToS3 = this.uploadToS3.bind(this)
    this.resetAttachments = this.resetAttachments.bind(this)
    this.renderRemove = this.renderRemove.bind(this)
    this.renderProgress = this.renderProgress.bind(this)
    this.renderStatus = this.renderStatus.bind(this)
    this.renderImages = this.renderImages.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const { uploads: prevUploads } = prevState
    const { uploads: currentUploads } = this.state
    const { onUploadChange } = this.props

    if (!_.isEqual(prevUploads, currentUploads)) {
      onUploadChange && onUploadChange()
    }
  }

  onDropHandler(event) {
    event.preventDefault()
    this.handleFiles(event.dataTransfer.files)
  }

  onRemoveHandler(id) {
    const { isUploadEmpty, onUploadDelete } = this.props
    this.setState(
      {
        images: _.filter(this.state.images, image => {
          return id !== image.id
        }),
        uploads: _.filter(this.state.uploads, upload => {
          return id !== upload.id
        }),
      },
      isUploadEmpty,
    )
    this.fileInput.value = null
    if (onUploadDelete) {
      onUploadDelete()
    }
  }

  onSelectHandler() {
    this.fileInput && this.fileInput.click()
  }

  /**
   * Fucntion to fetch presignedURL from backend API in order for the component to be able to upload it to the AWS S3
   * @param {object} image object representing image with all the needed data
   */
  getPresignedUrl(image) {
    const queryString = `?objectName=original/${image.id}&contentType=${encodeURIComponent(image.type)}`

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `${s3SigningUrl}${queryString}`, true)
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    xhr.overrideMimeType && xhr.overrideMimeType('text/plain; charset=x-user-defined')

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let result
        try {
          result = JSON.parse(xhr.responseText)
        } catch (error) {
          this.setUploadState(image.id, 'failed')
          return false
        }
        if (result) {
          this.setUploadState(image.id, 'uploading')
          return this.uploadToS3(result, image)
        }
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        this.setUploadState(image.id, 'failed')
        return false
      }
      return false
    }
    return xhr.send()
  }

  /**
   * Get final value of the component, ususally used by parent component referencing the attachaments component
   */
  getValue() {
    const attachments = []
    this.state.uploads.forEach(upload => {
      upload.status === 'success' ? attachments.push(upload.id) : null
    })
    return attachments.join(',')
  }

  setUploadState(id, status) {
    const { isUploading } = this.props
    const newUploadValues = this.state.uploads.map(upload => upload.id === id ? _.extend(upload, { status }) : upload)
    this.setState({
      uploads: [...this.state.uploads, newUploadValues],
    })
    isUploading ? isUploading(_.some(this.state.uploads, upload => {
      return upload.status === 'uploading'
    })) : null
  }

  setUploadProgress(id, progress) {
    this.setState({ uploads: this.state.uploads.map(upload => upload.id === id ? _.extend(upload, { progress }) : upload) })
  }

  /**
   * Preset the original value of the component, ususally used by parent component referencing the attachaments component
   */
  setValue() {
    const attachments = []
    this.state.uploads.forEach(upload => {
      upload.status === 'success' ? attachments.push(upload.id) : null
    })
  }

  /**
   * Function to handle dropped or selected files
   */
  handleFiles(files) {
    const { multiple, minSize } = this.props
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        const newId = `${uuid()}.${files[i].name.split('.').pop()}`
        const newImage = { id: newId, data: '', type: files[i].type }
        const newUpload = { id: newId, progress: 0, status: 'pending' }
        const fileReader = new FileReader()
        this.setState({
          imageSizeError: false,
        })
        fileReader.onload = (event) => {
          const image = new Image()
          image.onload = (img) => {
            if ((img && img.path && img.path.filter((img) => img.width >= minSize && img.height >= minSize).length === img.path.length)
              || (img && img.target && img.target.width >= minSize && img && img.target && img.target.height >= minSize)) {
              newImage.data = event.target.result
              this.setState({
                images: multiple ? [...this.state.images, newImage] : [newImage],
                uploads: multiple ? [...this.state.uploads, newUpload] : [newUpload],
              })
              this.startUpload(newImage)
            } else {
              this.setState({
                imageSizeError: true,
              })
            }
          }
          image.src = event.target.result
        }
        fileReader.readAsDataURL(files[i])
      }
    }
  }

  startUpload(image) {
    this.getPresignedUrl(image)
  }

  uploadToS3(response, image) {
    const { signedUrl } = response

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedUrl, true)
    xhr.setRequestHeader('Content-Type', image.type)

    xhr.onload = () => {
      if (xhr.status === 200) {
        this.setUploadState(image.id, 'success')
        this.setUploadProgress(image.id, 100)
        this.setValue()
      } else {
        this.setUploadState(image.id, 'failed')
        this.setUploadProgress(image.id, 0)
        this.setValue()
      }
    }
    xhr.onerror = () => {
      this.setUploadState(image.id, 'failed')
      this.setUploadProgress(image.id, 0)
      this.setValue()
    }
    xhr.upload.onprogress = (event) => {
      let percentLoaded
      if (event.lengthComputable) {
        percentLoaded = Math.round((event.loaded / event.total) * 100)
        this.setUploadProgress(image.id, percentLoaded)
      }
    }
    return xhr.send(dataURItoBlob(image.data, image.type))
  }

  /**
   * Reset state of the component, ususally used by parent component referencing the attachaments component after the upload has completed or the form has submitted
   */
  resetAttachments() {
    this.setState({
      images: [],
      uploads: [],
    })
  }

  renderRemove(id) {
    const upload = _.find(this.state.uploads, upload => {
      return upload.id === id
    })
    if (upload.status === 'success') {
      return (
        <span
          className="attachments__remove-icon"
          role="button"
          onClick={() => this.onRemoveHandler(id)}
        ><Icon
          title="Delete"
          icon="icn-delete-cross-solid"
          width={16}
          height={16}
        />
        </span >
      )
    }
    return ''
  }

  renderProgress(id) {
    const { fullSize } = this.props
    const upload = _.find(this.state.uploads, upload => {
      return upload.id === id
    })
    if (upload.progress > 0 && upload.progress < 100) {
      return (
        <ProgressCircle
          className="attachments__status-progress"
          progress={upload.progress}
          radius={fullSize && 54}
        />
      )
    }
    return ''
  }

  renderStatus(id) {
    const { imageUploading, imageFailure } = this.props
    const upload = _.find(this.state.uploads, upload => {
      return upload.id === id
    })
    let iconName = ''
    let statusClass = ''
    let tooltip = ''
    if (upload.progress > 0) {
      switch (upload.status) {
        case 'uploading':
          iconName = 'image-uploading'
          statusClass = 'attachments__status-icon text-warning'
          tooltip = imageUploading || 'Uploading...'
          break
        /*
        case 'success':
          iconName = 'image-success'
          statusClass = 'attachments__status-icon text-success'
          tooltip = imageSuccess || 'Success'
          break
        */
        case 'failed':
          iconName = 'image-failed'
          statusClass = 'attachments__status-icon text-danger'
          tooltip = imageFailure || 'Failed'
          break
        default:
          iconName = ''
      }
      if (iconName) {
        return (
          <div className={statusClass}>
            <Icon
              title={tooltip}
              icon={iconName}
            />
          </div >
        )
      }
      return ''
    }
    return ''
  }

  renderImages() {
    const {
      multiple, wrapper, left, title, maxItems, className, user,
    } = this.props
    const { images } = this.state
    const classes = className + (left ? 'attachments__list attachments__list-left' : 'attachments__list')

    return (
      <div>
        <div className={classes}>
          {
            (!wrapper && images.length === 0) &&
            <div
              title={title}
              className={`upload-button${user ? ' border-0' : ''}`}
              role="button"
              onClick={() => this.onSelectHandler()}
            >
              {user ? (
                <div className="attachments__usericon">
                  <div className="attachments__overlay" />
                  <Icon className="attachments__icon" icon="icn-camera-solid" />
                  <UserIcon
                    user={user}
                    width={160}
                    height={160}
                  />
                </div>

              ) : (
                <Wrapper>
                  <div>
                    <Icon
                      icon="icn-upload"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="text-shades-of-grey d-block">Bild hinzufügen</div>
                </Wrapper>
              )}
            </div>
          }
          {
            images.map((image) => {
              let previewImage
              if (image && image.data && image.data === 'uploaded' && image.id && image.id.indexOf('http') === 0) {
                previewImage = image.id
              } else if (image && image.data && image.data === 'uploaded' && image.id && image.id.indexOf('http') === -1) {
                previewImage = `${s3BaseUrl}resized/post/${image.id}`
              } else {
                previewImage = image.data
              }

              return (
                <div
                  className="attachments__preview"
                  key={image.id}
                >
                  {image.type === 'application/pdf' ? (
                    <div className="attachemnts__preview-document">
                      <Icon
                        title="Attachments"
                        icon="file-design-document"
                        width={30}
                        height={30}
                      />
                    </div >
                  ) : (
                    <ImageComp
                      className="attachments__preview-image"
                      src={previewImage}
                    />
                  )}
                  {this.renderProgress(image.id)}
                  {/* this.renderStatus(image.id) */}
                  {this.renderRemove(image.id)}
                </div >
              )
            })
          }
        </div >
        {
          multiple && images && images.length > 0 && images.length < maxItems &&
          <div className="attachments__load-more" onClick={() => this.onSelectHandler()}>
            <Icon
              icon="icn-plus-circle-solid"
              width={20}
              height={20}
            />
            <CustomFormattedMessage
              id="Attachments.loadMore"
              defaultMessage="Pick another picture"
            />
          </div>
        }
      </div>
    )
  }

  render() {
    const {
      wrapper, multiple, pdf, minSize, fullSize, className,
    } = this.props
    const { imageSizeError } = this.state

    const acceptedMimeTypes = pdf ? 'image/*, application/pdf' : 'image/*'
    return (
      <div className={`${fullSize ? 'attachments__photo-icon' : ''} ${className}`}>
        <div
          className="attachments"
          onDrop={(event) => this.onDropHandler(event)}
          onDragOver={event => {
            event.preventDefault()
          }}
        >
          {
            wrapper &&
            <div >
              <span
                className="attachments__select-wrapper"
                role="button"
                onClick={() => this.onSelectHandler()}
              ><Icon icon="icn-camera-line" width={16} height={16} />
              </span >
              <div className="attachments__textarea">
                {this.props.children}
              </div >
            </div >
          }

          <input
            ref={(input) => {
              this.fileInput = input
            }}
            className="attachments__fileinput"
            type="file"
            accept={acceptedMimeTypes}
            multiple={multiple}
            style={{ display: 'none' }}
            onChange={(event) => {
              this.handleFiles(event.target.files)
            }}
          />
          {this.renderImages()}
        </div >
        {
          imageSizeError &&
          <div className="field-error-text">
            <CustomFormattedMessage
              id="Attachments.imageSizeError"
              defaultMessage="Image size is to small"
              values={{
                minSize,
              }}
            />
          </div>
        }
      </div >
    )
  }
}

export default Attachments
