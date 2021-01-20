import React, { useRef, useEffect, useState, useMemo } from 'react'
import { View, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native'
import LottieView from 'lottie-react-native'
import { useDispatch, useSelector } from 'react-redux'
import MenuItem from '../home/MenuItem'
import I18n from '../../translations'
import { Metrics, Colors, Images } from '../../theme'
import { Text, Icon } from '../../components'
import { Utils } from '../../utilities'
import OpenNewAccount from './OpenNewAccount'
import { appOperations } from '../../state/application'

const Transfer = ({ x, y, title, icon, source, content, index, transformEnd }) => {
  const opacity1 = useRef(new Animated.Value(1)).current
  const opacity2 = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const translateXY = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current

  useEffect(() => {
    Animated.timing(translateXY, {
      toValue: {
        x,
        y,
      },
      duration: 500,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity1, {
          toValue: 0,
          duration: 100,
        }).start(() => {
          Animated.timing(scale, {
            toValue: 1,
            duration: 200,
          }).start()
          Animated.timing(opacity2, {
            toValue: 1,
            duration: 200,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(opacity2, {
                toValue: 0,
                duration: 200,
              }).start(() => transformEnd(index))
            }, 1500)
          })
        })
      }, 500)
    })
  }, [translateXY])

  return (
    <>
      <Animated.View
        style={{
          opacity: opacity1,
          transform: translateXY.getTranslateTransform(),
        }}
      >
        <MenuItem title={title} icon={icon} />
      </Animated.View>
      <Animated.View
        style={{
          opacity: opacity2,
          transform: [{ scale }],
          position: 'absolute',
          top: -350,
          width: Dimensions.get('screen').width,
          height: 200,
          backgroundColor: '#fb671980',
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            enableMergePathsAndroidForKitKatAndAbove
            source={source}
            loop
            autoPlay
            style={{
              width: 70,
              height: 70,
            }}
          />
        </View>
        <View>
          <Text style={{ color: Colors.white, marginTop: 10, textAlign: 'center' }}>{title}</Text>
          <Text style={{ color: Colors.white, marginTop: 10, textAlign: 'center' }}>{content}</Text>
        </View>
      </Animated.View>
    </>
  )
}

const MenuTranslate = () => {
  const dispatch = useDispatch()

  const [currentItem, setCurrentItem] = useState(1)
  const [startTutorial, setStartTutorial] = useState(false)
  const [skipTutorial, setSkipTutorial] = useState(false)
  const heightBottom = Metrics.small * 8
  const transformEnd = (val) => {
    setCurrentItem(val)
  }

  useMemo(() => {
    if (currentItem === 8) {
      setTimeout(() => {
        setCurrentItem(9)
      }, 1500)
    }
    if (currentItem === 9) {
      setTimeout(() => {
        setCurrentItem(10)
      }, 1500)
    }
    if (currentItem === 10) {
      setTimeout(() => {
        setCurrentItem(11)
        dispatch(appOperations.tooltipComplete())
      }, 1500)
    }
  }, [currentItem])

  const x = Dimensions.get('screen').width / 2 - Utils.getRatioDimension(95) / 2 - Metrics.tiny
  const y = -300
  const data = [
    null,
    {
      x: x - Utils.getRatioDimension(95) - 2 * Metrics.tiny,
      y,
      title: I18n.t('transfer.transfer_interbank247'),
      icon: 'home_247',
      source: Images.chuyen_khoan,
      content:
        'Chuyển tiền liên ngân hàng, nhận ngay trong tích tắc',
    },
    {
      x: -x + Utils.getRatioDimension(95),
      y,
      title: I18n.t('product.billing'),
      icon: 'home_thanhtoan',
      source: Images.payment,
      content:
        'Thanh toán hóa đơn điện, nước, viễn thông ... nhanh siêu tốc',
    },
    null,
    {
      x,
      y: y - Utils.getRatioDimension(95),
      title: I18n.t('main.saving'),
      icon: 'home_tietkiem',
      source: Images.tiet_kiem,
      content: 'Tặng thêm tới 0,5% lãi suất khi gửi tiết kiệm online',
    },
    {
      x: Utils.getRatioDimension(95) / 2 - Metrics.tiny / 2,
      y: y - Utils.getRatioDimension(95),
      title: I18n.t('main.visa_service'),
      icon: 'home_the',
      source: Images.the,
      content:
        'Dễ dàng theo dõi lịch sử giao dịch thẻ',
    },
    null,
    null,
  ]

  const openTutorials = () => {
    setStartTutorial(true)
  }
  const skipTutorials = () => {
    setSkipTutorial(true)
    setStartTutorial(false)
    dispatch(appOperations.tooltipComplete())
  }
  const convertIndex = (index) => {
    switch (index) {
      case 1:
        return 2
      case 2:
        return 4
      case 4:
        return 5
      case 5:
        return 8
      default:
        break
    }
  }
  return (
    <>
      {!startTutorial && !skipTutorial && (
        <OpenNewAccount openTutorials={openTutorials} skipTutorials={skipTutorials} />
      )}
      {currentItem <= 10 && startTutorial && (
        <TouchableWithoutFeedback onPress={skipTutorials}>
          <View
            style={{
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          >
            <View
              style={{
              alignItems: 'center',
              width: '100%',
              position: 'absolute',
              bottom: heightBottom,
              marginBottom: 10,
            }}
            >
              <View
                style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              >
                {data.map((item, index) => (
                  <>
                    {currentItem === index &&
                  (index === 1 || index === 2 || index === 4 || index === 5) ? (
                    <Transfer
                      x={item.x}
                      y={item.y}
                      title={item.title}
                      icon={item.icon}
                      source={item.source}
                      content={item.content}
                      index={convertIndex(index)}
                      transformEnd={(val) => transformEnd(val)}
                    />
                  ) : (
                    <MenuItem style={{ opacity: 0 }} activeOpacity={0} />
                  )}
                  </>
              ))}
              </View>
            </View>
            <View
              style={{
              flexDirection: 'row',
              position: 'absolute',
              width: '100%',
              height: heightBottom,
              bottom: 0,
            }}
            >
              <View
                style={{
                alignItems: 'center',
                flex: 1,
                paddingTop: 2,
              }}
              />
              <View
                style={{
                alignItems: 'center',
                flex: 1,
                paddingTop: 2,
              }}
              />
              {/* tooltip cho dịch vụ */}
              {currentItem === 8 ? (
                <View
                  style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingTop: Dimensions.get('screen').width <= 375 ? 3 : 2,
                  backgroundColor: Colors.white,
                }}
                >
                  <View
                    style={{
                    position: 'absolute',
                    backgroundColor: Colors.primary2,
                    top: -95,
                    left: -(Dimensions.get('screen').width / 2.5) + 20,
                    width: Dimensions.get('screen').width - 40,
                    height: 80,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: Colors.white, textAlign: 'center' }}>
                      Tìm hiểu các dịch vụ khác như Vay, Ngoại tệ ...
                    </Text>
                    <View
                      style={{
                      borderTopWidth: 10,
                      borderRightWidth: 10,
                      borderBottomWidth: 0,
                      borderLeftWidth: 10,
                      borderTopColor: Colors.primary2,
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: 'transparent',
                      position: 'absolute',
                      bottom: -10,
                      left:
                        Dimensions.get('screen').width / 3 + Dimensions.get('screen').width / 5 / 2,
                    }}
                    />
                  </View>
                  <Icon
                    name="icon-product"
                    size={28}
                    style={{ color: '#999999', padding: Metrics.small * 0.8 }}
                  />
                  <Text style={{ color: '#999999', fontSize: 12, marginTop: Dimensions.get('screen').width <= 375 ? 4 : 2 }}>
                    {I18n.t('main.product')}
                  </Text>
                </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingTop: 2,
                }}
              />
            )}
              <View
                style={{
                alignItems: 'center',
                flex: 1,
                paddingTop: 2,
              }}
              />
              {/* tooltip cho cài đặt */}
              {currentItem === 9 ? (
                <View
                  style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingTop: Dimensions.get('screen').width <= 375 ? 3 : 2,
                  backgroundColor: Colors.white,
                }}
                >
                  <View
                    style={{
                    position: 'absolute',
                    backgroundColor: Colors.primary2,
                    top: -95,
                    right: (Dimensions.get('screen').width / 4) - (Dimensions.get('screen').width / 5),
                    width: Dimensions.get('screen').width - 40,
                    height: heightBottom,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: Colors.white, textAlign: 'center' }}>
                      Khóa thẻ khẩn cấp, điều chỉnh hạn mức giao dịch ...
                    </Text>
                    <View
                      style={{
                      borderTopWidth: 10,
                      borderRightWidth: 10,
                      borderBottomWidth: 0,
                      borderLeftWidth: 10,
                      borderTopColor: Colors.primary2,
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: 'transparent',
                      position: 'absolute',
                      bottom: -10,
                      right: 20,
                    }}
                    />
                  </View>
                  <Icon
                    name="icon-setting"
                    size={28}
                    style={{ color: '#999999', padding: Metrics.small * 0.8 }}
                  />
                  <Text style={{ color: '#999999', fontSize: 12, marginTop: Dimensions.get('screen').width <= 375 ? 4 : 2 }}>
                    {I18n.t('main.setting')}
                  </Text>
                </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  paddingTop: 2,
                }}
              />
            )}
            </View>
            {/* tooltip cho thông báo */}
            {currentItem === 10 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.white,
                position: 'absolute',
                width: 40,
                height: 40,
                top: Dimensions.get('screen').width <= 375 ? 40 : 50,
                right: 21,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: Colors.primary2,
                  bottom: -100,
                  left: -(Dimensions.get('screen').width - 61) + 20,
                  width: Dimensions.get('screen').width - 40,
                  height: heightBottom,
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: Colors.white, textAlign: 'center' }}>
                  Nhận các thông tin & khuyến mại mới nhất từ MSB
                </Text>
                <View
                  style={{
                    borderTopWidth: 0,
                    borderRightWidth: 10,
                    borderBottomWidth: 10,
                    borderLeftWidth: 10,
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: Colors.primary2,
                    borderLeftColor: 'transparent',
                    position: 'absolute',
                    top: -10,
                    right: 12,
                  }}
                />
              </View>
              <Icon name="icon-notification" size={27} style={[{ color: Colors.primary2 }]} />
            </View>
          )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  )
}

export default MenuTranslate
