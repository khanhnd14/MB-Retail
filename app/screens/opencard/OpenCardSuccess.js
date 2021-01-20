/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors, Metrics, Helpers } from '../../theme'
import { Text, Success, AmountLabel, ConfirmButton } from '../../components'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: {
    // fontWeight: 'bold',
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
  },
  detailRight: {
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
    textAlign: 'right',
  },
})

const OpenCardSuccess = (props) => {
  const { completeData } = useSelector((state) => state.overdraftstaff)
  const { params } = props.route
  console.log('props OpenCardSuccess:', props)
  const { expireDate, odLimitAmount, interestRate, overDrafAccount } = completeData || {}

  return (
    <>
      <Success
        {...props}
        {...params}
        showButton={false}
        textButton={I18n.t('overdraft.btn_end')}
      >
        <View style={Helpers.colCross}>
          <Text style={styles.detail}>{I18n.t('opencard.mess_succ')}</Text>
        </View>

      </Success>

    </>
  )
}

export default OpenCardSuccess
