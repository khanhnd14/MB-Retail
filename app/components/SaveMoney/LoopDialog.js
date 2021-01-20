import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from '../../translations'
import { Radio, Alert, TextInput, Text } from '..'
import { Metrics, Colors, Helpers } from '../../theme'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  element: {
    paddingVertical: Metrics.small,
    paddingHorizontal: Metrics.tiny,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  text: {
    paddingLeft: Metrics.medium,
  },
  counter: {
    width: Metrics.medium * 5,
    textAlign: 'right',
  },
})

const LoopDialog = (props) => {
  const { onChangeFreqCode, freqCode, freq, onChangeFreq } = props
  const [type, setType] = useState(freqCode)

  const submit = () => {
    if (!freq) {
      Utils.showToast(I18n.t('saving.required_freq'))
      return
    }
    onChangeFreqCode(type)
  }

  const onReset = () => {
    setType(freqCode)
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     onChangeFreqCode('D')
  //   }, 500)
  //   setType('D')
  // }, [])

  useEffect(() => {
    setType(freqCode)
  }, [freqCode])

  return (
    <Alert
      {...props}
      title={I18n.t('transfer.title_loop')}
      onConfirm={() => submit()}
      onModalHide={() => onReset()}
    >
      <View style={styles.element}>
        <Radio
          textStyle={styles.text}
          text={I18n.t('transfer.daily')}
          checked={type === 'D'}
          onPress={() => setType('D')}
        />
      </View>
      <View style={styles.element}>
        <Radio
          textStyle={styles.text}
          text={I18n.t('transfer.monthly')}
          checked={type === 'M'}
          onPress={() => setType('M')}
        />
      </View>
      {type === 'M' && (
        <View
          style={[
            styles.element,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 0
            },
          ]}
        >
          <Text style={{ fontSize: 14 }}>{I18n.t('saving.freq')}</Text>
          <TextInput
            autoCorrect={false}
            placeholderTextColor={Colors.holder}
            placeholder={I18n.t('transfer.holder_end_after')}
            value={freq}
            style={styles.counter}
            onChangeText={(val) => onChangeFreq(val)}
            maxLength={5}
            keyboardType="numeric"
            returnKeyType="done"
            underlineColorAndroid="transparent"
          />
        </View>
      )}
    </Alert>
  )
}
export default LoopDialog
