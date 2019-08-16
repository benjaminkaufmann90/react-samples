import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { LoadingAnimation } from 'components'


const stories = storiesOf('Atoms/LoadingAnimation', module)

stories.addDecorator(withKnobs)

stories
  .add('simple loading animation', () => (
    <LoadingAnimation />
  ))
