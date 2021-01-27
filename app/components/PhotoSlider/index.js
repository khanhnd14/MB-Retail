/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native'
import { Colors, Metrics } from '../../theme'

import { CSS } from './CSS'
import Indicator from './Indicator'

export default class PhotoSlider extends Component {
  constructor(props) {
    super(props)
    this.width = CSS.width()
    this.blockWidth = this.width * 0.701
    this.height = props.height || CSS.pixel(250)
    this.blockHeight = props.height || CSS.pixel(250)
    this.moveDistance = this.width * 0.733
    this.ratio = 0.872
    this.x0 = this.moveDistance - (this.width - this.moveDistance) / 2
    this.currentPageFloat = 0

    this.arr = this.props.data
    this.arrLength = this.arr.length
    this.arr.unshift(this.arr[this.arr.length - 1])
    this.arr.unshift(this.arr[this.arr.length - 2])
    this.arr.push(this.arr[2])
    this.arr.push(this.arr[3])

    const scaleYArr = []
    const translateYArr = []
    for (let i = 0; i < this.arrLength + 4; i++) {
      scaleYArr.push(new Animated.Value(0))
      translateYArr.push(new Animated.Value(0))
    }
    this.state = { scaleYArr, translateYArr, currentPage: 0 }
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.mainScroll) {
        this.mainScroll.scrollTo({ x: this.x0 + this.moveDistance, animated: false })
      }
    }, 0)
    setTimeout(() => {
      if (this.assistScroll) {
        this.assistScroll.scrollTo({ x: this.moveDistance, animated: false })
      }
    }, 0)
    this.props.autoplay &&
      (this.interval = setInterval(() => {
        this._interval()
      }, this.props.interval || 4000))
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  _interval() {
    if (this.assistScroll) {
      this.assistScroll.scrollTo({
        x: this.moveDistance * (this.currentPageFloat + 1),
        animated: true,
      })
    }
  }

  _getItem() {
    return this.arr.map((item, i) => {
      const marginWidth = (this.moveDistance - this.blockWidth) / 2
      return (
        <View key={i} style={{ flexDirection: 'row' }}>
          <View style={{ width: marginWidth }} />
          <Animated.View
            style={{
              width: this.blockWidth,
              height: this.blockHeight,
              backgroundColor: '#ffffff',
              borderWidth: CSS.pixel(1),
              borderColor: '#dfdfe3',
              borderRadius: 8,
              transform: [
                { scaleY: this.state.scaleYArr[i] },
                { translateY: this.state.translateYArr[i] },
              ],
            }}
          >
            {this.props.contentRender ? this.props.contentRender(item) : null}
          </Animated.View>
          <View style={{ width: marginWidth }} />
        </View>
      )
    })
  }

  _getView() {
    const arr = []
    for (let i = 0; i < this.arrLength + 2; i++) {
      arr.push('')
    }
    return arr.map((item, i) => {
      const marginWidth = (this.moveDistance - this.blockWidth) / 2
      return (
        <View key={i} style={{ flexDirection: 'row' }}>
          <View style={{ width: marginWidth }} />
          <TouchableOpacity onPress={() => this.props.onPress(this.arr[i + 1])}>
            <View style={{ width: this.blockWidth, height: this.blockHeight }} />
          </TouchableOpacity>
          <View style={{ width: marginWidth }} />
        </View>
      )
    })
  }

  _onAssistScroll(e) {
    if (this.mainScroll && this.assistScroll) {
      const { x } = e.nativeEvent.contentOffset
      if (Math.abs(x - (this.arrLength + 1) * this.moveDistance) < 1) {
        this.mainScroll.scrollTo({ x: this.moveDistance + this.x0, animated: false })
        this.assistScroll.scrollTo({ x: this.moveDistance, animated: false })
      } else if (Math.abs(x) < 1) {
        this.mainScroll.scrollTo({
          x: this.moveDistance * this.arrLength + this.x0,
          animated: false,
        })
        this.assistScroll.scrollTo({ x: this.moveDistance * this.arrLength, animated: false })
      } else {
        const mainX = x + this.x0
        this.mainScroll.scrollTo({ x: mainX, animated: false })
      }
      this.currentPageFloat = x / this.moveDistance
      this._cardAnimated(this.currentPageFloat)
    }
  }

  _cardAnimated(currentPageFloat) {
    const currentPageInt = parseInt(currentPageFloat)

    for (let i = 0; i < this.arrLength + 4; i++) {
      let ratio = 0
      if (i == 2) {
        ratio = Math.abs(currentPageFloat - (this.arrLength + 1)) < 0.1 ? 1 : 0
      }
      if (i == this.arrLength + 1) {
        ratio = Math.abs(currentPageFloat) < 0.1 ? 1 : 0
      }
      if (i - 1 == currentPageInt) {
        ratio = 1 - (currentPageFloat % 1)
      } else if (i - 1 == currentPageInt + 1) {
        ratio = currentPageFloat % 1
      }
      const scaleY = this.ratio + (1 - this.ratio) * ratio
      const translateY = (this.height * (1 - scaleY)) / 8
      Animated.timing(this.state.scaleYArr[i], {
        toValue: scaleY,
        duration: 0,
        useNativeDriver: true,
      }).start()
      Animated.timing(this.state.translateYArr[i], {
        toValue: translateY,
        duration: 0,
        useNativeDriver: true,
      }).start()
    }

    console.log('currentPageInt:', currentPageInt)
    console.log('currentPage:', this.state.currentPage)
    if (this.state.currentPage !== currentPageInt) {
      this.setState({
        currentPage: currentPageInt,
      })
      if (this.props.onPress) {
        this.props.onPress(this.arr[currentPageInt + 2])
      }
    }
  }

  render() {
    if (this.arr != this.props.data) {
      this.arr = this.props.data
      this.arrLength = this.arr.length
      this.arr.unshift(this.arr[this.arr.length - 1])
      this.arr.unshift(this.arr[this.arr.length - 2])
      this.arr.push(this.arr[2])
      this.arr.push(this.arr[3])
    }
    return (
      <View>
        <ScrollView
          horizontal
          pointerEvents="none"
          ref={(ref) => (this.mainScroll = ref)}
          showsHorizontalScrollIndicator={false}
        >
          {this._getItem()}
        </ScrollView>
        <View
          style={{
            width: (this.width - this.moveDistance) / 2,
            height: this.height,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
        <View
          style={{
            width: (this.width - this.moveDistance) / 2,
            height: this.height,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        />
        <ScrollView
          style={{
            width: this.moveDistance,
            height: this.height,
            position: 'absolute',
            left: (this.width - this.moveDistance) / 2,
            top: 0,
          }}
          horizontal
          pagingEnabled
          ref={(ref) => (this.assistScroll = ref)}
          onScroll={(e) => this._onAssistScroll(e)}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {this._getView()}
        </ScrollView>
        <Indicator
          itemCount={this.arrLength}
          currentIndex={0}
          indicatorStyle={this.props.indicatorStyle}
          indicatorActiveColor={Colors.primary2}
          indicatorInActiveColor="#D0D1D3"
          currentIndex={this.state.currentPage}
        />
      </View>
    )
  }
}
