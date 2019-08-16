import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import { Attachments } from 'components'
import { IntlProvider } from 'react-intl'


const stories = storiesOf('Atoms/Attachments', module)

stories.addDecorator(withKnobs)

stories
  .add('one attachement', () => (
    <div style={{ width: '300px' }}>
      <IntlProvider locale="en">
        <Attachments
          imageUploading={text('Image Uploading Text', 'Uploading...')}
          imageSuccess={text('Image Success Text', 'Image uploaded!')}
          imageFailure={text('Image Failure Text', 'Couldnt upload image!')}
          minSize={500}
          fullSize
        />
      </IntlProvider>
    </div>
  ))

  .add('more than one attachements', () => (
    <IntlProvider locale="en">
      <Attachments
        imageUploading={text('Image Uploading Text', 'Uploading...')}
        imageSuccess={text('Image Success Text', 'Image uploaded!')}
        imageFailure={text('Image Failure Text', 'Couldnt upload image!')}
        minSize={500}
        maxItems={6}
        fullSize
      />
    </IntlProvider>
  ))

