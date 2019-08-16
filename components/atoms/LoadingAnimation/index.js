import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const LoadingAnimation = ({ className, style }) => {
  return (
    <div className={`${!className ? 'preview-container' : className}`} style={style}>
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube" />
        <div className="sk-cube2 sk-cube" />
        <div className="sk-cube4 sk-cube" />
        <div className="sk-cube3 sk-cube" />
      </div >
    </div >
  )
}

LoadingAnimation.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
}

LoadingAnimation.defaultProps = {
  className: '',
}

export default LoadingAnimation
