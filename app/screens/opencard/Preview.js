/* eslint-disable no-undef */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Utils } from '../../utilities'
import { Config } from '../../config'

const styles = StyleSheet.create({
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    height: '100%',
    width: Utils.getWindowWidth() * 0.68,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
})
const Preview = ({ item }) => (
  <View style={[styles.videoContainer]}>
    <FastImage
      style={[styles.videoPreview]}
      source={{
          uri: `${Config.API_URL}${item.cardImageUrl}`,
          priority: FastImage.priority.normal,
        }}
      resizeMode={FastImage.resizeMode.stretch}
      onError={(e) => {
          console.log('error:', e);
          console.log('error:', e.nativeEvent);
        }}
    />
  </View>
  )
export default Preview
