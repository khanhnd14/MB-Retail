import React from 'react'
import { View, Image } from 'react-native'
import LottieView from 'lottie-react-native'
import styles from './SplashScreenStyle'
import { Helpers, Images, Metrics } from '../../theme'

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={[Helpers.fillColCross, styles.container]}>
        <Image
          resizeMode="contain"
          source={Images.logo}
          style={{ width: 200, marginTop: Metrics.medium * 5 }}
        />
        <LottieView
          style={{ width: Metrics.medium * 30, marginTop: Metrics.medium * 2 }}
          enableMergePathsAndroidForKitKatAndAbove
          source={Images.welcome}
          loop={false}
          autoPlay
        />
        {/* <Image resizeMode="contain" source={Images.wellcome} style={{ width: 200, marginTop: Metrics.medium * 10 }} /> */}
      </View>
    )
  }
}
