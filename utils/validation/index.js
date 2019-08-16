import React from 'react'
import isEmail from 'validator/lib/isEmail'
import isInt from 'validator/lib/isInt'
import isCurrency from 'validator/lib/isCurrency'
import isIn from 'validator/lib/isIn'
import isURL from 'validator/lib/isURL'
import { isYoutubeLink, isVimeoLink } from 'utils/regex'
import { ERROR_INVALID_ADDRESS } from 'utils/constants'
import { messages as errorMessages } from 'definitions/errors'
import { supportEmailAddress } from 'config'
import { difference } from 'lodash'

const isEmpty = (value) => value === undefined || value === null || value === ''
const join = (rules) => (value, data) =>
  rules.map((rule) => rule(value, data)).filter((error) => !!error)[0]

export const youtubeOrVimeoLink = (value) => {
  if (value) {
    const trimmedValue = value.trim()
    if (!isEmpty(trimmedValue) && !isYoutubeLink(trimmedValue) && !isVimeoLink(trimmedValue)) {
      return {
        key: 'Field.youtubeOrVimeoLink',
        defaultMessage: 'Ungültige Video URL',
      }
    }
  }
  return false
}

export const youtubeLink = (value) => {
  if (value) {
    const trimmedValue = value.trim()
    if (!isEmpty(trimmedValue) && !isYoutubeLink(trimmedValue)) {
      return {
        key: 'Field.youtubeLink',
        defaultMessage: 'Ungültige Video URL',
      }
    }
  }
  return false
}

export const vimeoLink = (value) => {
  if (value) {
    const trimmedValue = value.trim()
    if (!isEmpty(trimmedValue) && !isVimeoLink(trimmedValue)) {
      return {
        key: 'Field.vimeoLink',
        defaultMessage: 'Ungültige Video URL',
      }
    }
  }
  return false
}

export const email = (value) => {
  if (value) {
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isEmpty(trimmedValue) && !isEmail(trimmedValue)) {
      return {
        key: 'Field.email',
        defaultMessage: 'Invalid email address',
      }
    }
    return false
  }
  return false
}
export const url = (value) => {
  if (value) {
    // const trimmedValue = value.trim()
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isEmpty(trimmedValue) && !isURL(trimmedValue)) {
      return {
        key: 'Field.url',
        defaultMessage: 'Invalid URL',
      }
    }
    return false
  }
  return false
}
export const required = (value) => {
  if (value) {
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isEmpty(trimmedValue)) {
      return false
    }
  }
  return {
    status: false,
    key: 'Field.required',
    defaultMessage: 'Required field',
  }
}
export const minLength = (min) => (value) => {
  if (value) {
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isEmpty(trimmedValue) && trimmedValue.length < min) {
      return {
        key: 'Field.minLength',
        defaultMessage: 'Must be at least {min} characters',
        values: { min },
      }
    }
    return false
  }
  return false
}
export const maxLength = (max) => (value) => {
  if (value) {
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isEmpty(trimmedValue) && trimmedValue.length > max) {
      return {
        key: 'Field.maxLength',
        defaultMessage: 'Must be no more than {max} characters',
        values: { max },
      }
    }
    return false
  }
  return false
}
export const integer = (value) => {
  if (value) {
    const trimmedValue = value.trim()
    if (!isInt(trimmedValue)) {
      return {
        key: 'Field.integer',
        defaultMessage: 'Must be an integer',
      }
    }
    return false
  }
  return false
}

const currencyOptions = {
  thousands_separator: '.',
  decimal_separator: ',',
  symbol: '€',
  allow_negatives: false,
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false,
}

export const number = (value) => {
  if (value) {
    const trimmedValue = value.trim()
    if (!isCurrency(trimmedValue, currencyOptions)) {
      return {
        key: 'Field.currency',
        defaultMessage: 'Please enter a valid amount of money',
      }
    }
    return false
  }
  return false
}

export const numberAndEuroSign = (value) => {
  if (value) {
    let trimmedValue = value.toString().replace('€', '').replace('.', ',')
    trimmedValue = trimmedValue.trim()
    if (!isCurrency(trimmedValue, currencyOptions)) {
      return {
        key: 'Field.currency',
        defaultMessage: 'Please enter a valid amount of money',
      }
    }
    return false
  }
  return false
}

export const oneOf = (values) => (value) => {
  if (value) {
    const trimmedValue = typeof value === 'string' ? value.trim() : value
    if (!isIn(trimmedValue, values)) {
      return {
        key: 'Field.oneOf',
        defaultMessage: 'Must be one of: {items}',
        values: { items: values.join(', ') },
      }
    }
    return false
  }
  return false
}
export const match = (field) => (value, data) => {
  if (value) {
    const trimmedValue = value.trim()
    if (data && trimmedValue !== data[field]) {
      return {
        key: 'Field.match',
        defaultMessage: 'Must match',
      }
    }
    return false
  }
  return false
}

export const address = (value) => {
  const compareSubsetType = ['postal_code', 'route', 'street_number', 'locality']
  const compareTypes = value &&
    value.address &&
    value.address.address_components &&
    value.address.address_components.length > 0 &&
    value.address.address_components
      .reduce((acc, currentValue) => {
        return [...acc, ...currentValue.types]
      }, [])
  const result = difference(compareSubsetType, compareTypes)

  if (result.length > 0) {
    return {
      ...errorMessages[ERROR_INVALID_ADDRESS],
      key: `error.${ERROR_INVALID_ADDRESS}`,
      values: { supportEmailAddress: (<a className="underline text-reported" href={`mailto:${supportEmailAddress}`}>{supportEmailAddress}</a>) },
    }
  }
  return false
}

export const createValidator = (rules) => (data = {}) => {
  const errors = {}
  Object.keys(rules).forEach((key) => {
    const rule = join([].concat(rules[key]))
    const error = rule(data[key], data)
    if (error) {
      errors[key] = error
    }
  })
  return errors
}
