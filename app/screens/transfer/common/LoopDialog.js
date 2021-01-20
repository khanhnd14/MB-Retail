import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Colors, Metrics } from '../../../theme'
import I18n from '../../../translations'
import { Radio, Alert } from '../../../components'
import { transferOperations } from '../../../state/transfer'

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
})

const LoopDialog = (props) => {
  const { frqType } = useSelector((state) => state.transfer.editSchedule)
  const [type, setType] = useState(frqType)
  const dispatch = useDispatch()

  const submit = () => {
    dispatch(
      transferOperations.setSchedule({
        frqType: type,
      })
    )
  }

  const onReset = () => {
    setType(frqType)
  }

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
          text={I18n.t('transfer.weekly')}
          checked={type === 'W'}
          onPress={() => setType('W')}
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
      {/* <View style={styles.element}>
      <Radio
        textStyle={styles.text}
        text={I18n.t('transfer.quarterly')}
        checked
        onPress={() => {}}
      />
    </View>
    <View style={styles.element}>
      <Radio
        textStyle={styles.text}
        text={I18n.t('transfer.halfyearly')}
        checked
        onPress={() => {}}
      />
    </View>
    <View style={styles.element}>
      <Radio textStyle={styles.text} text={I18n.t('transfer.yearly')} checked onPress={() => {}} />
    </View> */}
    </Alert>
  )
}
export default LoopDialog
