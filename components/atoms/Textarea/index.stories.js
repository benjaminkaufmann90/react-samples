import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs/react'
import { Textarea } from 'components'


const stories = storiesOf('Atoms/Textarea', module)

stories.addDecorator(withKnobs)

stories
  .add('Multiline Textbox', () => (
    <Textarea disabled={boolean('disabled', false)} />
  ))
