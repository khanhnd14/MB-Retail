import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'

import _ from 'underscore'
import MsbIcon from '../MsbIcon';
import { Colors } from '../../theme';

let BACKGROUND_COLOR;
  let BORDER_RADIUS;
  let BORDER_WIDTH;
  let COLOR;
  let SIZE;
  let BORDER_COLOR

export default class Checkbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: '#FFF',
      borderWidth: 1,
      checked: false,
      color: '#FFF',
      size: 20,
      borderColor: '#000',
      autoChangeSelected : props.autoChangeSelected ?? true
    }
  }

  componentDidMount() {
    const { style } = this.props;

    this.setState(_.extend({}, style, _.omit(this.props, 'style')))
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps
    this.setState({ checked: nextProps.checked })
  }

  render() {
    const { backgroundColor, borderWidth, color, size, borderRadius, borderColor, checked, children, disabled } = this.state
    BACKGROUND_COLOR = backgroundColor
    BORDER_RADIUS = borderRadius || size
    BORDER_WIDTH = borderWidth
    COLOR = color
    SIZE = size
    BORDER_COLOR = borderColor
    return (
      <TouchableOpacity
        onPress={() => {
          !disabled && this._toggleCheck()
        }}
        style={{
          backgroundColor: checked ? COLOR : BACKGROUND_COLOR,
          borderColor: BORDER_COLOR,
          borderRadius: BORDER_RADIUS,
          borderWidth: BORDER_WIDTH,
          height: SIZE,
          width: SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && (children || (
          <MsbIcon name="icon-check" size={size / 3} color={Colors.white} />
        ))}

      </TouchableOpacity>
    )
  }

  _toggleCheck() {
    const { onChange, name } = this.props
    const { checked } = this.state    
    if (!this.state.autoChangeSelected) {
      onChange && onChange(name, checked)
      return
    }
    this.setState({ checked: !checked })
    onChange && onChange(name, !checked)
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.object
}
