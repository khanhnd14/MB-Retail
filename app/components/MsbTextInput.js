/* eslint-disable react/no-string-refs */
import React, { Component } from 'react'
import { TextInput } from 'react-native'
import _ from 'lodash'
import { Utils } from '../utilities'

class MsbTextInput extends Component {
  focus() {
    this.refs.input.focus()
  }

  isFocused() {
    return this.refs.input.isFocused()
  }

  clear() {
    return this.refs.input.clear()
  }

  render() {
    const props = { ...this.props }
    if (props.ref) {
      delete props.ref
    }
    if (props.style) {
      // compute style
      if (_.isArray(props.style)) {
        props.style = _.assign({}, ...props.style)
      }

      if (!props.style.fontSize) {
        props.style = _.assign({}, props.style, { fontSize: Utils.getFontSize(14) })
      } else {
        props.style = _.assign({}, props.style, {
          fontSize: Utils.getFontSize(props.style.fontSize),
        })
      }

      if (!props.style.height) {
        props.style = _.assign({}, props.style, {
          height: Utils.getRatioDimension(55),
        })
      } else {
        props.style = _.assign({}, props.style, {
          height: Utils.getRatioDimension(props.style.height),
        })
      }
      if (!props.style.fontFamily) {
        props.style = _.assign({}, props.style, { fontFamily: 'Helvetica' })
      }
      // if (props.style.fontStyle) {
      //   const fontFamily = props.style.fontStyle === 'italic' ? 'GothamRounded-LightItalic' : 'GothamRounded-Light'
      //   props.style = _.assign({}, props.style, { fontFamily })
      // }
      // if (props.style.fontWeight) {
      //   const fontFamily = props.style.fontWeight === 'bold' ? 'GothamRounded-Bold' : 'GothamRounded-Light'
      //   props.style = _.assign({}, props.style, { fontFamily })
      // }
      props.style = _.assign({}, props.style)
    } else {
      props.style = _.assign(
        {},
        {
          fontSize: Utils.getFontSize(14),
          fontFamily: 'Helvetica',
        },
      )
    }
    const { children } = this.props
    return (
      <TextInput ref="input" {...props} allowFontScaling={false}>
        {children}
      </TextInput>
    )
  }
}

export default MsbTextInput
