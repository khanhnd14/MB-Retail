import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Metrics, Colors } from '../../theme'
import { Text, Icon } from '../../components'
import styles from './HomeScreenStyle'

const MenuItem = (props) => {
  const { icon, title, style, activeOpacity } = props

  const onPress = () => {
    if (props.onPress) {
      props.onPress()
    }
  }
  return (
    <TouchableOpacity style={[styles.itemContainer, { ...style }]} onPress={onPress} activeOpacity={activeOpacity}>
      <Icon name={icon} size={55} color={Colors.white} />
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  )
}

MenuItem.defaultProps = {
  title: '',
  icon: '',
}

MenuItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
}

export default MenuItem
