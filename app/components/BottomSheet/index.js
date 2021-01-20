import React from 'react'
import { TouchableOpacity, View, StyleSheet, Platform, ViewPropTypes } from 'react-native'
import BottomSheetBehavior from 'reanimated-bottom-sheet'
import RBSheet from 'react-native-raw-bottom-sheet'

import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { TapGestureHandler, State } from 'react-native-gesture-handler'
import { Metrics, Colors } from '../../theme'
import Text from '../MsbText'
import Icon from '../MsbIcon'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.transparent,
  },
  header: {
    backgroundColor: Colors.primary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Metrics.medium * 2,
    paddingVertical: Metrics.small * 0.8,
  },
  content: {
    backgroundColor: Colors.white,
    height: 400,
    paddingBottom: Metrics.medium * 2.5,
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
    flex: 1,
  },
  amount: {
    color: Colors.holder,
  },
  accountName: {
    fontSize: 16,
  },
  close: {},
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
})
const { greaterOrEq, cond } = Animated

class BottomSheet extends React.Component {
  sheet = React.createRef()

  renderHeader = () => {
    const { title } = this.props
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <TouchableOpacity onPress={() => this.hide()} style={{ padding: Metrics.tiny }}>
          <Icon name="icon-close" color={Colors.white} size={12} />
        </TouchableOpacity>
      </View>
    )
  }

  renderContent = () => {
    const { children, style, snapPoint } = this.props
    return <View style={[styles.content, style, { height: snapPoint }]}>{children}</View>
  }

  show = () => {
    this.sheet.current && this.sheet.current.snapTo(0)
  }

  hide = () => {
    this.sheet.current && this.sheet.current.snapTo(1)
  }

  sheetOpenValue = new Animated.Value(1)

  overlayOpacity = Animated.interpolate(this.sheetOpenValue, {
    inputRange: [0, 1],
    outputRange: [0.5, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  })

  pointerEvents = cond(greaterOrEq(0.9, this.sheetOpenValue), 'auto', 'none')

  handleTapStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      this.hide()
    }
  }

  render() {
    const { snapPoint, onCloseEnd } = this.props
    return (
      <React.Fragment>
        <TapGestureHandler onHandlerStateChange={this.handleTapStateChange}>
          <Animated.View
            pointerEvents={Platform.OS === 'android' ? 'none' : this.pointerEvents}
            style={[
              StyleSheet.absoluteFill,
              { opacity: this.overlayOpacity, backgroundColor: 'black' },
            ]}
          />
        </TapGestureHandler>
        <BottomSheetBehavior
          onCloseEnd={onCloseEnd}
          initialSnap={1}
          ref={this.sheet}
          snapPoints={[snapPoint, 0]}
          callbackNode={this.sheetOpenValue}
          enabledInnerScrolling={false}
          renderContent={this.renderContent}
          renderHeader={this.renderHeader}
        />
      </React.Fragment>
    )
  }
  // render() {
  //   const { snapPoint, onCloseEnd } = this.props
  //   return (
  //     <React.Fragment>
  //       <RBSheet
  //         onClose={onCloseEnd}
  //         ref={this.sheet}
  //         height={snapPoint}
  //         customStyles={{
  //           container: {
  //             borderTopLeftRadius: 20,
  //             borderTopRightRadius: 20,
  //           },
  //         }}
  //       >
  //         {this.renderHeader()}
  //         {this.renderContent()}
  //       </RBSheet>
  //     </React.Fragment>
  //   )
  // }
}

BottomSheet.defaultProps = {
  title: '',
  snapPoint: Metrics.medium * 20,
}

BottomSheet.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
  snapPoint: PropTypes.number,
}

export default BottomSheet
