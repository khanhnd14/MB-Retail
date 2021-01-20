import React, { useMemo, useEffect } from 'react'
import { View } from 'react-native'
import PureChart from 'react-native-pure-chart'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { Utils } from '../../../utilities'
import { Colors } from '../../../theme'

let series1 = new Map()
let series2 = new Map()
let months = []

export default () => {
  const { historyExchange, loadingHistoryExchange } = useSelector((state) => state.account)
  console.log('--------------------------------------------------------')
  console.log('historyExchange', historyExchange)
  console.log('--------------------------------------------------------')

  useEffect(
    () => () => {
      series1 = new Map()
      series2 = new Map()
      months = []
    },
    []
  )
  useMemo(() => {
    months = _.map(historyExchange, (num) => moment(num.postTime).months() + 1)
    console.log('--------------------------------------------------------')
    console.log('months', months)
    console.log('--------------------------------------------------------')
    months = _.take(_.reverse(_.sortBy(_.uniq(months))), 3)
  }, [historyExchange, loadingHistoryExchange])

  useMemo(() => {
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0
    let sum5 = 0
    let sum6 = 0
    _.map(historyExchange, (num) => {
      const month = new Date(num.postTime).getMonth() + 1
      if (month === months[0]) {
        num.dcSign === 'D'
          ? series1.set(month, (sum1 += num.amount))
          : series2.set(month, (sum4 += num.amount))
      } else if (month === months[1]) {
        num.dcSign === 'D'
          ? series1.set(month, (sum2 += num.amount))
          : series2.set(month, (sum5 += num.amount))
      } else {
        num.dcSign === 'D'
          ? series1.set(month, (sum3 += num.amount))
          : series2.set(month, (sum6 += num.amount))
      }
    })
  }, [historyExchange, loadingHistoryExchange])

  const arr1 = useMemo(() => {
    const _months = months
    return _.reverse(_months).map((month) => ({
      x: `Tháng ${month}`,
      y: series1.get(month) ? series1.get(month) : 0,
    }))
  }, [months])
  const arr2 = useMemo(() => {
    const _months = months.reverse()
    return _.reverse(_months).map((month) => ({
      x: `Tháng ${month}`,
      y: series2.get(month) ? series2.get(month) : 0,
    }))
  }, [months])

  const sampleData = useMemo(
    () => [
      {
        seriesName: 'series1',
        data: arr1,
        color: Colors.primary2,
      },
      {
        seriesName: 'series2',
        data: arr2,
        color: Colors.second2,
      },
    ],
    [arr1, arr2]
  )

  return (
    <View
      style={[
        { width: '100%', alignItems: 'center' },
        Utils.isArrayEmpty(arr1) ? { height: Utils.getWindowHeight() / 6 } : {},
      ]}
    >
      {!Utils.isArrayEmpty(arr1) && (
        <PureChart
          data={sampleData}
          width="100%"
          height={Utils.getWindowHeight() / 6}
          type="bar"
          numberOfYAxisGuideLine={5}
          defaultColumnMargin={Utils.getWindowWidth() / 7}
        />
      )}
    </View>
  )
}
