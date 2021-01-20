/* eslint-disable react/require-default-props */
import React from 'react'
import { Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Icon from './MsbIcon'
import { Colors, Images, Metrics } from '../theme'
import { Config } from '../config'
import { Utils } from '../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDefault: {
    color: Colors.white,
  },
})

const Avatar = (props) => {
  const onPress = () => {
    if (props.onPress) {
      props.onPress()
    }
  }

  const { size, user, style } = props
  style.width = Utils.getRatioDimension(size)
  style.height = Utils.getRatioDimension(size)
  style.borderRadius = Utils.getRatioDimension(size) / 2
  const uriProfile = user ? `${Config.API_URL}servlet/CmsImageServlet?attachmentId=${user.profilePicture}` : null;
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      {uriProfile ? (
        <Image source={{ uri: uriProfile }} style={style} />
      ) : (
        <Icon name="icon-avatar" size={size / 2} style={styles.avatarDefault} />
      )}
    </TouchableOpacity>
  )
}

Avatar.defaultProps = {
  size: 48,
  style: {},
}

Avatar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  size: PropTypes.number,
}

export default Avatar
