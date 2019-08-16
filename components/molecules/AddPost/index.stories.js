import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { AddPost } from 'containers'
import configureStore from 'store/configure'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

const store = configureStore()
const stories = storiesOf('Molecules/AddPost', module)

stories.addDecorator(withKnobs)
stories.addDecorator(story => <Provider store={store}>{story()}</Provider>)

stories
  .add('with text', () => (
    <IntlProvider locale="en">
      <AddPost />
    </IntlProvider>
  ))
