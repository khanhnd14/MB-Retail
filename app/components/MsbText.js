import React, { Component } from 'react'
import { Text } from 'react-native'
import _ from 'lodash'
import { Utils } from '../utilities'
import { Colors } from '../theme'

class MsbText extends Component {
  render() {
    const props = { ...this.props }

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
      if (!props.style.color) {
        props.style = _.assign({}, props.style, { color: Colors.textBlack })
      }
      if (!props.style.fontFamily) {
        props.style = _.assign({}, props.style, { fontFamily: 'Helvetica' })
      } else {
        props.style = _.assign({}, props.style, { fontFamily: props.style.fontFamily })
      }
      // if (props.style.fontWeight) {
      //   const fontFamily = props.style.fontWeight === 'bold' ? 'GothamRounded-Bold' : 'GothamRounded-Light'
      //   props.style = _.assign({}, props.style, { fontFamily })
      // }
      // if (props.style.fontStyle) {
      //   const fontFamily = props.style.fontStyle === 'italic' ? 'GothamRounded-LightItalic' : 'GothamRounded-Light'
      //   props.style = _.assign({}, props.style, { fontFamily })
      // }
    } else {
      props.style = _.assign(
        {},
        {
          fontSize: Utils.getFontSize(14),
          color: Colors.textBlack,
          fontFamily: 'Helvetica',
        },
      )
    }
    const { children } = this.props
    return (
      <Text {...props} allowFontScaling={false}>
        {children}
      </Text>
    )
  }
}

export default MsbText
