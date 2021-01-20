import React, { Component } from 'react'
import { View, Modal, StyleSheet } from 'react-native'
import { PropTypes } from 'prop-types'
import LottieView from 'lottie-react-native'
import { Images, Metrics, Colors } from '../../theme'

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: Colors.white,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  loaderContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -45,
    marginTop: -45,
  },
  loaderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'relative',
    left: '50%',
    marginLeft: -35,
    top: '50%',
    marginTop: -35,
  },
})

const Loading = ({ color }) => (
  <View style={[styles.wrapper, { backgroundColor: color || Colors.white }]}>
    <View style={styles.loaderContainer}>
      <LottieView
        style={styles.loaderImage}
        enableMergePathsAndroidForKitKatAndAbove
        source={Images.loading}
        loop
        autoPlay
      />
    </View>
  </View>
)
export default Loading
