import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Text from '../MsbText'
import FloatingLabel from '../FloatingLabel'
import { Metrics, Colors, ApplicationStyles } from '../../theme'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: 'bold',
  },

  formButton: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 10,
    paddingBottom: 30,
  },

  button: {
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  groupDetailLimit: {
    paddingVertical: Metrics.small * 0.8,
    paddingHorizontal: Metrics.medium,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  groupLimit: {
    marginHorizontal: Metrics.medium,
    marginVertical: Metrics.tiny,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  defaultScreen: {
    backgroundColor: Colors.mainBg,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
  },
  labelStyle: {
    fontSize: 12, color: Colors.holder, fontWeight: 'normal', marginBottom: Metrics.tiny
  }
})

const LimitItem = (props) => {
  const { item, onChangeValue, index } = props
  const [lmDay, setLimitDay] = useState(`${item.limitDay}`)
  const [lmTime, setLimitTime] = useState(`${item.limitDealMax}`)

  useEffect(() => {
    setLimitTime(`${item.limitDealMax}`)
    setLimitDay(`${item.limitDay}`)
  }, [item])

  const onDayChange = (limitD) => {
    setLimitDay(limitD)
    if (onChangeValue) {
      const data = { ...item, limitDay: Number(limitD), limitDealMax: Number(lmTime) }
      onChangeValue(index, data)
    }
  }

  const onTimeChange = (limitT) => {
    setLimitTime(limitT)
    if (onChangeValue) {
      const data = { ...item, limitDay: Number(lmDay), limitDealMax: Number(limitT) }
      onChangeValue(index, data)
    }
  }

  return (
    <View style={[styles.groupLimit]}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.title}>{item.displayName}</Text>
      </TouchableOpacity>
      <View style={styles.groupDetailLimit}>
        <FloatingLabel
          value={lmDay}
          editable
          labelStyle={styles.labelStyle}
          isAmount
          inputStyle={{ justifyContent: 'center' }}
          rightText="VND"
          onChangeText={onDayChange}
          maxLength={20}
        >
          {I18n.t('setting.limitDay')}
        </FloatingLabel>
      </View>
      <View style={styles.groupDetailLimit}>
        <FloatingLabel
          value={lmTime}
          editable
          isAmount
          labelStyle={styles.labelStyle}
          inputStyle={{ justifyContent: 'center' }}
          rightText="VND"
          onChangeText={onTimeChange}
          maxLength={20}
        >
          {I18n.t('setting.limitTime')}
        </FloatingLabel>
      </View>
    </View>
  )
}

LimitItem.propTypes = {
  onChangeValue: PropTypes.func,
  item: PropTypes.object,
  index: PropTypes.number,
}
export default LimitItem
