import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MultiSelectCheckbox } from 'components'

class MultiSelect extends Component {
  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    onApply: PropTypes.func,
    label: PropTypes.string,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.self = null

    this.state = {
      options: [...props.options.map(option => 'checked' in option ? option : { ...option, checked: false })],
      open: false,
    }

    this.closePanel = this.closePanel.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
    this.getSelectedOptionsCount = this.getSelectedOptionsCount.bind(this)
    this.onChange = this.onChange.bind(this)
    this.deselectAll = this.deselectAll.bind(this)
    this.selectAll = this.selectAll.bind(this)
    this.apply = this.apply.bind(this)
    this.onCloseHandler = this.onCloseHandler.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.onCloseHandler, false)

    this.updateToggleButtonState()
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onCloseHandler)
  }

  onCloseHandler(e) {
    if (e.target !== this.self.getElementsByClassName('multiSelectToggle')[0]) {
      this.apply()
    }
  }

  onChange(e) {
    const { options } = this.state
    const { onChange } = this.props
    const { name, checked } = e.target

    this.setState({
      options: [
        ...options.map(option => option.name === e.target.name ? { ...option, checked: e.target.checked } : option),
      ],
    }, () => {
      this.updateToggleButtonState()
      onChange && onChange({
        name,
        checked,
        selectAll: this.selectAll,
        deselectAll: this.deselectAll,
      })
    })
  }

  getSelectedOptionsCount() {
    const { options } = this.state
    let result = 0
    options.forEach(option => { !option.noData && option.checked && (result += 1) })
    return result
  }

  updateToggleButtonState() {
    const { self, getSelectedOptionsCount } = this
    // const { open } = this.state

    // if (self && (getSelectedOptionsCount() > 0 || open)) {
    if (self && getSelectedOptionsCount() > 0) {
      self.getElementsByClassName('multiSelectToggle')[0].classList.add('active')
    } else {
      self.getElementsByClassName('multiSelectToggle')[0].classList.remove('active')
    }
  }

  selectAll() {
    const { options } = this.state
    this.setState({
      options: [
        ...options.map(option => ({ ...option, checked: true })),
      ],
    }, () => {
      this.updateToggleButtonState()
    })
  }

  deselectAll() {
    const { options } = this.state
    this.setState({
      options: [
        ...options.map(option => ({ ...option, checked: false })),
      ],
    }, () => {
      this.updateToggleButtonState()
    })
  }

  apply() {
    const { onApply } = this.props
    const { options } = this.state
    onApply && onApply(options)
    this.closePanel()
  }

  closePanel() {
    const { open } = this.state

    open && this.setState({ open: false }, () => {
      this.updateToggleButtonState()
    })
  }

  togglePanel() {
    const { open } = this.state
    const nextStateOpen = !open
    this.setState({ open: nextStateOpen }, () => {
      this.updateToggleButtonState()
    })
  }

  render() {
    const { open, options } = this.state
    const { label, className } = this.props
    const { getSelectedOptionsCount } = this
    const selectedOptionsText = getSelectedOptionsCount() > 0 ? ` · ${getSelectedOptionsCount()}` : ''
    console.log('Options', options)
    return (
      <div className="multiSelect" ref={(self) => { this.self = self }}>
        <div className={className ? `${className} multiSelectToggle btn-toggle` : 'multiSelectToggle btn-toggle'} onClick={this.togglePanel}>
          {`${label} ${selectedOptionsText}`}
        </div>
        <div className="multiSelectPanel" style={{ display: open === false && 'none' }} onClick={(e) => { e.stopPropagation() }}>
          <div className="checkBoxContainer">
            {
              options.map(option => {
                return (
                  <MultiSelectCheckbox key={option.name} name={option.name} checked={option.checked} description={option.name} onChange={this.onChange} />
                )
              })
            }
          </div>
          <div className="multiSelectButtons">
            <div onClick={this.deselectAll} className="multiSelectButton">Löschen</div>
            <div onClick={this.apply} className="multiSelectButton btn-apply">Anwenden</div>
          </div>
        </div>
      </div>
    )
  }
}
MultiSelect.defaultProps = {
  options: [],
  label: 'Kategorie',
}

export default MultiSelect
