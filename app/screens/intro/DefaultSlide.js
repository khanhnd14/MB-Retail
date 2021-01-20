import React from 'react'
import { StyleSheet, View, ImageBackground } from 'react-native'
import PropTypes from 'prop-types'
import { Text } from '../../components'
import { Colors, Metrics } from '../../theme'

export default class DefaultSlide extends React.PureComponent {
  render() {
    const { item, dimensions, bottomButton } = this.props
    const style = {
      flex: 1,
      backgroundColor: item.backgroundColor,
      width: dimensions.width,
      paddingBottom: bottomButton ? 132 : 64,
    }
    return (
      <ImageBackground style={[styles.mainContent, style]} source={item.image} resizeMode="cover">
        {/* <Image source={item.image} style={[styles.image, item.imageStyle]} resizeMode={'cover'} />
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.title, item.titleStyle]}>{item.title}</Text>
          <Text style={[styles.text, item.textStyle]}>{item.text}</Text>
        </View> */}
      </ImageBackground>
    )
  }
}

DefaultSlide.propTypes = {
  item: PropTypes.object.isRequired,
  dimensions: PropTypes.object.isRequired,
  bottomButton: PropTypes.bool,
}
const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
  },
  // text: {
  //   color: Colors.gray,
  //   fontSize: 15,
  //   textAlign: 'center',
  //   fontFamily: Util.getFontLight(),
  //   paddingHorizontal: 16,
  //   paddingVertical: 7,
  // },
  // image: {
  //   width: Util.getWindowWidth(),
  //   height: Util.getWindowWidth() - 10,
  // },
  // title: {
  //   fontSize: 18,
  //   color: '#231F20',
  //   fontWeight: 'bold',
  //   paddingHorizontal: 16,
  //   fontFamily: Util.getFontBold(),
  //   marginTop: Util.getRatioDimension(20),
  // },
})
