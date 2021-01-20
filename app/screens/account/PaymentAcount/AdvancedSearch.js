/* eslint-disable no-shadow */
import React, { useCallback, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import I18n from 'i18n-js'
import { Metrics, Colors } from '../../../theme'
import { Utils } from '../../../utilities'
import { numberWithCommas } from '../../../utilities/common'
import SelectExchange from './SelectExchange'
import { AmountInputText, DatePicker, Text } from '../../../components'
import { accountOperations } from '../../../state/account'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginBottom: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Metrics.tiny * 2,
    borderBottomWidth: 0.5,
    marginHorizontal: Metrics.tiny * 2,
    borderBottomColor: Colors.gray9,
  },
  left: {
    flex: 6 / 10,
  },
  right: {
    flex: 4 / 10,
  },
  time: {
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textBlack,
    fontWeight: 'bold',
  },
})
const FIELD_TYPE = {
  TIME_FROM: 0,
  TIME_TO: 1,
}

export default forwardRef(
  (
    { acctNo, setIsShowAdvancedSearch, valueSearch, setValueSearch, isCredit, contractNoEncode, setLoadingSearch },
    ref
  ) => {
    const { handleSubmit, register, errors, setValue, getValues } = useForm()

    let fieldType
    let transType
    let transName
    let fromAmount = Number(valueSearch.fromAmount) || 0
    let toAmount = Number(valueSearch.toAmount) || 0

    const [fromDay, setDayFrom] = useState(
      valueSearch.fromDay ||
        new Date(
          moment()
            .subtract('months', 3)
            .unix() * 1000
        )
    )
    const [toDay, setDayTo] = useState(valueSearch.toDay || new Date())
    const dispatch = useDispatch()

    const handleSelectDate = (date) => {
      switch (fieldType) {
        case FIELD_TYPE.TIME_FROM:
          setDayFrom(date)
          break
        case FIELD_TYPE.TIME_TO:
          setDayTo(date)
          break
        default:
          break
      }
    }

    const onSelectDayFrom = useCallback((field) => {
      fieldType = field
    }, [])

    const selectExchange = (id, name) => {
      transType = id
      transName = name
    }

    const onAmountFromChange = (amount) => {
      fromAmount = amount.replace(/,/g, '')
      setValue('fromAmount', fromAmount)
    }

    const onAmountToChange = (amount) => {
      toAmount = amount.replace(/,/g, '')
      setValue('toAmount', toAmount)
    }

    const onSearch = (page) => {
      handleSubmit((data) => {
        const { fromAmount, toAmount } = data
        setLoadingSearch(true)
        setValueSearch({
          transType,
          transName,
          fromAmount,
          toAmount,
          fromDay,
          toDay,
          acctNo
        })
        if (!isCredit) {
          dispatch(
            accountOperations.onAdvancedSearch(
              transType,
              Utils.toStringDate(fromDay),
              Utils.toStringDate(toDay),
              fromAmount || 0,
              toAmount || 99999999999999,
              acctNo,
              page,
              -1
            )
          )
        } else {
          dispatch(
            accountOperations.getCardHistory(
              contractNoEncode,
              Utils.toStringDate(toDay),
              Utils.toStringDate(fromDay)
            )
          )
        }
        setIsShowAdvancedSearch(false)
      })()
    }

    useImperativeHandle(ref, () => ({
      onSearch,
    }))

    useEffect(() => {
      register('fromAmount')
      register('toAmount')
    }, [])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log(errors);
    console.log('====================================');
    if (keys.length) {
      Utils.showToast(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.time}>{I18n.t('account.card_payment.time')}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.left}>
            <View style={{ height: Metrics.medium * 2.5 }}>
              <Text style={styles.label}>{I18n.t('account.card_payment.from_date')}</Text>
              <DatePicker
                dateStyle={styles.text}
                style={{ flex: 1 }}
                date={fromDay}
                minDate={new Date(
                  moment()
                    .subtract('months', 3)
                    .unix() * 1000
                )}
                maxDate={new Date()}
                onPressConfirm={(date) => {
                  onSelectDayFrom(FIELD_TYPE.TIME_FROM)
                  handleSelectDate(date)
                }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.right}>
            <View style={{ height: Metrics.medium * 2.5 }}>
              <Text style={styles.label}>{I18n.t('account.card_payment.to_date')}</Text>
              <DatePicker
                dateStyle={styles.text}
                style={{ flex: 1 }}
                date={toDay}
                maxDate={new Date()}
                onPressConfirm={(date) => {
                  onSelectDayFrom(FIELD_TYPE.TIME_TO)
                  handleSelectDate(date)
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        {!isCredit && (
          <View style={styles.row}>
            <View style={styles.left}>
              <Text style={styles.time}>{I18n.t('account.card_payment.type_exchange')}</Text>
            </View>
            <View style={styles.right}>
              <SelectExchange transName={valueSearch.transName} selectExchange={selectExchange} />
            </View>
          </View>
        )}
        {!isCredit && (
          <>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.time}>{I18n.t('product.amount')}</Text>
              </View>
            </View>
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={styles.left}>
                <Text style={styles.label}>{I18n.t('account.card_payment.from_amount')}</Text>
                <AmountInputText
                  defaultVal={numberWithCommas(valueSearch.fromAmount)}
                  rightText="VND"
                  onChangeText={onAmountFromChange}
                  returnKeyType="done"
                  maxLength={16}
                />
              </View>
              <View style={styles.right}>
                <Text style={styles.label}>{I18n.t('account.card_payment.to_amount')}</Text>
                <AmountInputText
                  defaultVal={numberWithCommas(valueSearch.toAmount)}
                  rightText="VND"
                  onChangeText={onAmountToChange}
                  returnKeyType="done"
                  maxLength={16}
                />
              </View>
            </View>
          </>
        )}
      </View>
    )
  }
)
