import React, { Component } from 'react'
import { FRESHDESK_JS_SRC, FRESHDESK_TOKEN, FRESHDESK_HOST, FRESHDESK_LOCALE } from 'utils/constants'

export default function withFreshdeskChat(ComposedComponent) {
  const config = {
    content: {
      placeholders: {
        search_field: 'Suchen...',
        reply_field: 'Antworte hier...',
      },
      actions: {
        csat_yes: 'Ja',
        csat_no: 'Nein',
        push_notify_yes: 'Ja',
        push_notify_no: 'Nein',
        csat_submit: 'Einreichen',
      },
      headers: {
        push_notification: 'Verpasse keine Antworten! Push-Benachrichtigungen zulassen?',
        channel_response: {
          offline: 'Wir sind gerade nicht zu erreichen. Bitte hinterlasse uns eine Nachricht',
        },
      },
    },
  }

  return class FreshdeskChat extends Component {
    constructor(props) {
      super(props)

      this.state = {
        isLoaded: false,
        isInitialized: false,
        isDestroyed: false,
        widget: false,
      }
    }

    componentWillMount() {
      this.initFreshdesk()
    }

    componentWillUnmount() {
      this.destroy()
    }

    initFreshdesk() {
      const { isLoaded } = this.state

      if (!isLoaded) {
        const freshdeskScript = document.createElement('script')

        freshdeskScript.onload = () => {
          this.setState({ isLoaded: true })
        }

        freshdeskScript.setAttribute('id', 'freshdesk-script')
        freshdeskScript.setAttribute('type', 'text/javascript')
        freshdeskScript.setAttribute('defer', true)
        freshdeskScript.setAttribute('src', FRESHDESK_JS_SRC)

        document.head.appendChild(freshdeskScript)
      }
    }
    show = () => {
      const { isLoaded, isInitialized } = this.state

      if (isLoaded && !isInitialized && window.fcWidget) {
        window.fcWidget.init({
          token: FRESHDESK_TOKEN,
          host: FRESHDESK_HOST,
          locale: FRESHDESK_LOCALE,
          config,
        })
        this.setState({
          isInitialized: true,
          isDestroyed: false,
        })
      }
    }

    destroy = () => {
      const { isLoaded, isInitialized } = this.state

      if (isInitialized) {
        window.fcWidget.destroy()
      }

      if (isLoaded) {
        document.getElementById('freshdesk-script').remove()
      }

      this.setState({
        isLoaded: false,
        isInitialized: false,
        isDestroyed: true,
      })
    }

    render() {
      return (
        <ComposedComponent
          {...this.state}
          {...this.props}
          showfreshdeskchat={this.show}
          destroyfreshdeskchat={this.destroy}
        />
      )
    }
  }
}
