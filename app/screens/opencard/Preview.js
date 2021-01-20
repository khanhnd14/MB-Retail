import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Utils } from '../../utilities';
import { Config } from '../../config'

const styles = StyleSheet.create({
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    height: '100%',
    width: Utils.getWindowWidth() * 0.701,
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
})
const Preview = ({ item, onPress }) => {
  console.log('item reviw:', Config.API_URL + item.cardImageUrl);
  return (
    <TouchableOpacity style={[styles.videoContainer]} onPress={() => onPress(item)}>
      {/* <Image
        style={[styles.videoPreview]}
        source={{ uri: Config.API_URL.slice(0, -1) + item.cardImageUrl }}
        resizeMode="stretch"
        onError={(e) => console.log('imgeeeee:', e)}

      /> */}
      <FastImage
        style={[styles.videoPreview]}
        source={{
            uri: Config.API_URL.slice(0, -1) + item.cardImageUrl,
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.stretch}
      />
    </TouchableOpacity>
)
}
export default Preview
