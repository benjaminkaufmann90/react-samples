import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'components'

const MultiSelectCheckbox = (props) => {
  const {
    checked, onChange, name, description,
  } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <input
          id={name}
          name={name}
          type="checkbox"
          onChange={onChange}
          checked={checked}
          style={{ display: 'none' }}
        />
        <label htmlFor={name} style={{ marginRight: '8px', cursor: 'pointer' }}>
          {checked ? (
            <Icon icon="icn-checkmark-filled" />
          ) : (
            <Icon icon="icn-checkmark-notfilled" />
          )}
        </label>
      </div>
      <div>
        <label htmlFor={name}>{description}</label>
      </div>
    </div>
  )
}

MultiSelectCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
}

export default MultiSelectCheckbox
