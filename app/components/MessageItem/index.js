import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import moment from 'moment'
import { Utils } from '../../utilities'
import { Metrics, Colors, Images } from '../../theme'

export const TIME_FORMAT = 'HH:mm'

const styles = StyleSheet.create({
  container: {
    marginTop: Utils.getRatioDimension(15),
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Utils.getRatioDimension(20),
  },
  icon: {
    width: Metrics.medium,
    height: Metrics.medium,
    marginRight: Metrics.normal,
  },
  messageText: {
    fontSize: 12,
    paddingRight: Metrics.small,
  },
})

const MessageItem = ({ message }) => (
  <View style={[styles.container, { justifyContent: 'flex-start' }]}>
    <Image
      resizeMode="contain"
      source={Images.icon_msb}
      style={styles.icon}
    />
    <Text style={[styles.messageText]}>{message.content?.replace(/\s+$/, '')}</Text>
  </View>
)
export default MessageItem
