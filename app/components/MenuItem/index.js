import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Text from '../MsbText'
import Icon from '../MsbIcon'
import { Metrics, Colors } from '../../theme'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    height: Utils.getRatioDimension(80),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Metrics.normal,
    marginBottom: Metrics.tiny,
  },
  header: {
    width: Metrics.small,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: Metrics.small,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // aspectRatio: 1,
    width: Utils.getRatioDimension(50),
    height: Utils.getRatioDimension(50),
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
    paddingLeft: Metrics.normal,
  },
  icon: {},
  iconDetail: {},
})

const MenuItem = (props) => {
  const { icon, leftColor, text, iconSize, onPress } = props

  const onDetail = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onDetail}>
      <View style={[styles.header, { backgroundColor: leftColor }]} />
      {icon && (
        <View style={styles.iconContainer}>
          <Icon name={icon} size={iconSize} color={Colors.primary2} />
        </View>
      )}
      <Text style={[styles.title]}>{text}</Text>
      <Icon name="icon-detail" size={22} color="#FFB71B" />
    </TouchableOpacity>
  )
}

MenuItem.defaultProps = {
  icon: null,
  leftColor: '#999999',
  text: '',
  iconSize: 40,
}

MenuItem.propTypes = {
  icon: PropTypes.string,
  leftColor: PropTypes.string,
  text: PropTypes.string,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
}
export default MenuItem
