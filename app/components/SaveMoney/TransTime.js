import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import I18n from 'i18n-js'
import { Radio } from '..'
import { Metrics, Colors, Helpers } from '../../theme'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: Metrics.small,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray,
  },
  sendCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.small,
    paddingHorizontal: Metrics.normal,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    marginLeft: Metrics.tiny,
  },
})

const TransTime = ({ changeType, isNow }) => {
  console.log('TransTime:', isNow);
  // const [now, setNow] = useState(isNow)

  const navigateSchedule = () => {
    Navigation.push('ScheduleSaving')
  }

  const onChangeType = (isN) => {
    changeType(isN)
    // setNow(isN)
  }
  return (
    <View style={{ ...styles.cardContainer }}>
      <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
      <View style={Helpers.fillRowCenter}>
        <View style={styles.sendCardContainer}>
          <Radio
            checked={isNow}
            onPress={() => {
              onChangeType(true)
            }}
          />
          <View style={styles.sendCardChild}>
            <Text style={{ fontSize: 14 }}>{I18n.t('transfer.trans_now')}</Text>
          </View>
        </View>
        <View style={styles.sendCardContainer}>
          <Radio
            checked={!isNow}
            onPress={() => {
              // onChangeType(false)
              navigateSchedule()
            }}
          />
          <View style={styles.sendCardChild}>
            <Text style={{ fontSize: 14 }}>{I18n.t('transfer.schedule')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TransTime
