/* eslint-disable array-callback-return */
import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native'
import I18n from 'i18n-js'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Radio, Text, AmountLabel, ConfirmButton } from '../../../components'
import * as Navigation from '../../../navigation'
import Note from '../../../components/SaveMoney/Note'
import { odSavingOperations } from '../../../state/overdraftSaving'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: Metrics.medium,
    marginBottom: Metrics.small,
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  itemView: {
    paddingVertical: Utils.getRatioDimension(9),
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: Utils.getRatioDimension(17),
    backgroundColor: Colors.white,
    marginBottom: Metrics.small,
  },
  bottomContainer: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 9,
    paddingVertical: Metrics.tiny,
  },
  checkBox: {
    paddingVertical: Metrics.tiny,
  },
  limit: {
    fontWeight: '600',
    fontSize: 16,
    paddingVertical: Utils.getRatioDimension(13),
  },
  titleLimit: {
    fontSize: 12,
    color: Colors.primary2,
    paddingBottom: Metrics.tiny,
    fontWeight: '600',
  },
  totalLimit: {
    fontWeight: '600',
  },
  totalItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: Utils.getRatioDimension(8),
  },
})

const CloseODScreen = () => {
  const dispatch = useDispatch()
  const { registedInfo, prepareData, prepareError, registedInfoError } = useSelector(
    (state) => state.overdraft
  )
  const { odAccount, odTier } = registedInfo || {}
  const { accountInString, overdraftLimit, accruedInterestOverdraf, ledgerBalance } =
    odAccount || {}

  const [loading, setLoading] = useState(false)
  const [loadata, setLoadData] = useState(false)
  const [checked, setCheck] = useState(true)
  const [listSelect, setListSelect] = useState({})
  const [isShowError, setError] = useState(true)

  useEffect(() => {
    setLoadData(true)
    dispatch(odSavingOperations.getRegistedInfo())
  }, [])
  useEffect(() => {
    if (loadata && !_.isEmpty(registedInfo)) {
      setLoadData(false)
      setError(false)
    }
  }, [registedInfo])

  useEffect(() => {
    if (loadata) {
      setLoadData(false)
      setError(true)
    }
  }, [registedInfoError])

  useEffect(() => {
    if (loading && prepareData) {
      setLoading(false)
      Navigation.push('CloseODVerify')
    }
  }, [prepareData])

  useEffect(() => {
    if (loading && prepareError) {
      setLoading(false)
    }
  }, [prepareError])

  const totalLimit = useMemo(() => {
    let total = 0
    odTier?.map((item, index) => {
      if (!listSelect[item.seqNo]) {
        total += item.drawLimit
      }
    })
    return total
  }, [listSelect, odTier])

  const totalBl = useMemo(() => {
    let total = 0
    odTier?.map((item, index) => {
      if (listSelect[item.seqNo]) {
        total += item.ledgerBalance
      }
    })
    const data = Object.keys(listSelect).filter((key) => listSelect[key])
    if (data?.length === odTier?.length) {
      total += accruedInterestOverdraf
    }
    return total
  }, [listSelect, odTier])

  const onConfirm = () => {
    if (_.isEmpty(listSelect)) {
      Utils.showToast('Vui lòng chọn hạn mức đóng')
      return
    }
    const data = Object.keys(listSelect).filter((key) => listSelect[key])
    if (_.isEmpty(data)) {
      Utils.showToast('Vui lòng chọn hạn mức đóng')
      return
    }
    const body = {}
    data.map((item, index) => {
      body[item] = []
    })
    if (checked) {
      setLoading(true)
      dispatch(odSavingOperations.selectedDataClose({ data: listSelect }))
      dispatch(odSavingOperations.prepareClose({ data: JSON.stringify(body) }))
    } else {
      Navigation.push('CloseODSelect', {
        listSelect,
        totalbl: totalBl - totalLimit > 0 ? totalBl - totalLimit : 0,
      })
    }
  }
  const onSelectItem = (item) => {
    const list = {}
    list[item.seqNo] = !listSelect[item.seqNo]
    setListSelect({ ...listSelect, ...list })
  }

  const renderItemView = (title, value, isAmount = true, isBorder = true) => (
    <View style={[styles.itemView, { borderBottomWidth: isBorder ? 1 : 0 }]}>
      <Text>{title}</Text>
      <Text style={[{ color: Colors.primary2 }]}>
        {isAmount ? `${Utils.displayAmount(value)} VND` : value}
      </Text>
    </View>
  )

  const renderItemLimit = (item, index) => (
    <View style={[styles.itemView, Helpers.row]} key={`${index}`}>
      <Radio
        size={Utils.getRatioDimension(18)}
        checked={!!listSelect[item.seqNo]}
        circle={false}
        onPress={() => onSelectItem(item)}
      />
      <View style={Helpers.fill}>
        <AmountLabel value={item.drawLimit} currency="VND" style={styles.limit} />
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.titleLimit}>Dư nợ thấu chi</Text>
          <Text style={styles.titleLimit}>
            {I18n.t('overdraft.fromOnlineSaving.odInterestRate')}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <AmountLabel value={item.ledgerBalance} currency="VND" />
          <Text>{item.odInterest}%</Text>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <Topbar
        subTitle={I18n.t('overdraft.fromOnlineSaving.closeScreenTitle')}
        background={Colors.mainBg}
        title={I18n.t('overdraft.fromOnlineSaving.title')}
      />
      {loadata && (
        <View style={[Helpers.fill, styles.container, Helpers.center]}>
          <ActivityIndicator
            style={Helpers.mainCenter}
            animating={loadata}
            color={Colors.primary2}
            size="large"
          />
        </View>
      )}
      {!loadata && isShowError && (
        <View style={[Helpers.fill, styles.container]}>
          <Text style={[Helpers.textCenter, { marginTop: Metrics.medium }]}>
            {registedInfoError?.message}
          </Text>
        </View>
      )}
      {!loadata && !isShowError && (
        <ScrollView style={[Helpers.fill, styles.scrollView]}>
          <View style={[styles.headerContainer]}>
            {renderItemView('Tài khoản thấu chi', accountInString, false)}
            {renderItemView('Hạn mức thấu chi', overdraftLimit)}
            {renderItemView('Lãi suất', `${odTier ? odTier[0].odInterest : '-' || ''}%/năm`, false)}
            {renderItemView('Dư nợ thấu chi', ledgerBalance > 0 ? 0 : -ledgerBalance)}
            {renderItemView('Lãi thấu chi dự thu', accruedInterestOverdraf, true, false)}
          </View>
          <View style={[styles.headerContainer, { paddingVertical: Metrics.medium }]}>
            <Text style={{ paddingBottom: Metrics.tiny }}>Chọn hạn mức đóng</Text>
            {odTier?.map((item, index) => renderItemLimit(item, index))}
            <View style={styles.totalItem}>
              <Text style={styles.totalLimit}>Dư nợ cần thanh toán</Text>
              <AmountLabel
                value={totalBl - totalLimit > 0 ? totalBl - totalLimit : 0}
                currency="VND"
                style={[styles.totalLimit, { color: Colors.primary2 }]}
              />
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLimit}>Hạn mức thấu chi còn lại</Text>
              <AmountLabel
                value={totalLimit}
                currency="VND"
                style={[styles.totalLimit, { color: Colors.primary2 }]}
              />
            </View>
          </View>
          <View style={[styles.headerContainer, styles.bottomContainer]}>
            <Radio
              size={Utils.getRatioDimension(18)}
              style={[styles.checkBox]}
              text="Không tất toán sổ tiết kiệm"
              checked={checked}
              onPress={() => {
                setCheck(true)
              }}
            />
            <Radio
              style={[styles.checkBox]}
              size={Utils.getRatioDimension(18)}
              text="Đồng ý tất toán sổ tiết kiệm trực tuyến để thanh toán dư nợ thấu chi"
              checked={!checked}
              onPress={() => {
                setCheck(false)
              }}
            />
            <Note
              text="Sổ tiết kiệm tất toán trước hạn sẽ hưởng lãi suất không kỳ hạn"
              style={{ paddingHorizontal: Metrics.small }}
            />
          </View>
        </ScrollView>
      )}
      <ConfirmButton
        loading={loading}
        onPress={onConfirm}
        disabled={isShowError}
        color={!isShowError ? Colors.primary2 : Colors.gray5}
      />
    </>
  )
}
export default CloseODScreen
