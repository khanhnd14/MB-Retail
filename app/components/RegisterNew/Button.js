import React, { useMemo, useEffect, useState } from 'react'
import { StyleSheet, View, Keyboard } from 'react-native'
import I18n from 'i18n-js'
import Animated, { Easing } from 'react-native-reanimated';
import { ConfirmButton } from '..'
import { Metrics, Colors } from '../../theme'

const styles = StyleSheet.create({})

const Button = ({ onConfirm, onReAction, loading, disabled, text, isDouble }) => {
  let keyboardDidShowListener = useMemo(() => undefined, [])
  let keyboardDidHideListener = useMemo(() => undefined, [])
  const [animatedMargin, setAnimatedMergin] = useState(new Animated.Value(0))

  const onSubmit = () => {
    Keyboard.dismiss()
    onConfirm()
  }

  const _keyboardDidShow = (event) => {
    Animated.timing(animatedMargin, {
      toValue: event.endCoordinates.height,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }

  const _keyboardDidHide = () => {
    Animated.timing(animatedMargin, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),

    }).start()
  }
  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
      keyboardDidHideListener && keyboardDidHideListener.remove();
    }
  }, [])
  return (
    <Animated.View style={{
      marginBottom: animatedMargin,
    }}
    >

      {isDouble ? (
        <View style={{
        flexDirection: 'row',
        backgroundColor: Colors.mainBg
      }}
        >
          <View style={{
          flex: 1,

        }}
          >
            <ConfirmButton
              onPress={onReAction}
              style={{
                paddingLeft: Metrics.medium,
                paddingRight: Metrics.tiny,
              }}
              styleButton={{ width: '100%' }}
              text={I18n.t('ekyc.customer_info.re_action')}
              styleText={{
                color: Colors.primary2,
                fontSize: 13,
                paddingVertical: 5
              }}
              indicatorStyle={{
                paddingVertical: 5
              }}
              color={Colors.white}
            />
          </View>
          <View style={{
          flex: 1,
        }}
          >
            <ConfirmButton
              onPress={onSubmit}
              loading={loading}
              style={{
                paddingLeft: Metrics.tiny,
                paddingRight: Metrics.medium,
              }}
              styleButton={{ width: '100%' }}
              disabled={disabled || loading}
              text={text}
              color={disabled ? Colors.gray13 : Colors.primary2}
              styleText={{
                fontSize: 13,
                paddingVertical: 5
              }}
              indicatorStyle={{
                paddingVertical: 5
              }}
            />
          </View>
        </View>
) : (
  <ConfirmButton
    onPress={onSubmit}
    loading={loading}
    style={{
      paddingHorizontal: Metrics.medium,
    }}
    styleButton={{ width: '100%' }}

    disabled={disabled}
    text={text}
    color={disabled ? Colors.gray13 : Colors.primary2}
    styleText={{
      fontSize: 15,
      paddingVertical: 5
    }}
    indicatorStyle={{
      paddingVertical: 5
    }}
  />
      )}

    </Animated.View>
    )
}
export default Button
