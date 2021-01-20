/* eslint-disable react/require-default-props */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from './MsbIcon'
import { Colors } from '../theme'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: Colors.check,
    position: 'absolute',
  },
  bgCheck: {
    color: '#E6E6E6',
  },
})

const ConfirmIcon = (props) => {
  const { size, color } = props
  return (
    <View style={[styles.container]}>
      <Icon name="icon-circle-check" size={size} style={{ ..._.defaults({ color }, { ...styles.bgCheck }) }} />
      <Icon name="icon-check" size={size / 2} style={[{ ..._.defaults({ color }, { ...styles.check }) }]} />
    </View>
  )
}

ConfirmIcon.defaultProps = {
  size: 28,
}

ConfirmIcon.propTypes = {
  size: PropTypes.number,
}

export default ConfirmIcon
