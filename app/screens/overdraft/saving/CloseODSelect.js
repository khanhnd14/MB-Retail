/* eslint-disable radix */
/* eslint-disable array-callback-return */
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import I18n from 'i18n-js'
import moment from 'moment'
import _ from 'lodash'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../../theme'
import {
  Topbar,
  Radio,
  Text,
  AmountLabel,
  Loader,
  SelectAccount,
  DatePicker,
  CheckBox,
  ConfirmButton,
} from '../../../components'
import * as Navigation from '../../../navigation'
import { SelectFDCollatComponent, SelectPurpose } from '../../../components/Overdraft'
import Note from '../../../components/SaveMoney/Note'
import { odSavingOperations } from '../../../state/overdraftSaving'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: Metrics.medium,
    marginBottom: Metrics.small,
  },
  container: {
    paddingHorizontal: Metrics.medium,
    flex: 1,
  },
  itemView: {
    paddingVertical: Metrics.medium,
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
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  checkBox: {
    paddingVertical: Metrics.tiny,
  },
  limitContent: {
    fontWeight: '600',
    color: '#1C1939',
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
    width: '100%',
  },
  line: {
    marginHorizontal: Metrics.normal,
    marginTop: Metrics.normal,
    height: 1,
    backgroundColor: Colors.line,
  },
})

const CloseODSelect = ({ route }) => {
  const { listSelect, totalbl } = route.params
  const dispatch = useDispatch()
  const { registedInfo, prepareData, prepareError } = useSelector((state) => state.overdraft)
  const { odAccount, odTier } = registedInfo || {}

  const [loading, setLoading] = useState(false)
  const [checked, setCheck] = useState(false)
  const [selects, setListSelect] = useState({})

  useEffect(() => {
    dispatch(odSavingOperations.getRegistedInfo())
  }, [])

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

  const listSaving = useMemo(() => {
    let list = []
    odTier?.map((item, index) => {
      if (listSelect[item.seqNo]) {
        list = [...list, ...item.listCollat]
      }
    })
    return list
  }, [odTier])

  const totalSaving = useMemo(() => {
    let total = 0
    listSaving?.map((item, index) => {
      if (selects[item.receiptNo]) {
        const { receiptInfo } = item
        total += parseInt(
          receiptInfo.principal + receiptInfo.interestAmount - receiptInfo.penaltyAmount
        )
      }
    })
    return total
  }, [selects])

  const onSelectItem = (item) => {
    const list = {}
    list[item.receiptNo] = !selects[item.receiptNo]
    setListSelect({ ...selects, ...list })
  }

  const onConfirm = () => {
    if (_.isEmpty(listSelect)) {
      Utils.showToast('Vui lòng chọn sổ')
      return
    }
    const data = Object.keys(listSelect).filter((key) => listSelect[key])
    if (_.isEmpty(data)) {
      Utils.showToast('Vui lòng chọn sổ')
      return
    }
    const body = {}
    data.map((item, index) => {
      body[item] = Object.keys(selects).filter((key) => selects[key])
    })
    setLoading(true)
    dispatch(odSavingOperations.prepareClose({ data: JSON.stringify(body) }))
  }

  const renderItemLimit = (item, index) => {
    const { receiptInfo } = item
    const { alias, receiptNoInString, settlementDate, principal } = receiptInfo || {}
    return (
      <View style={[styles.itemView, Helpers.row]} key={`${index}`}>
        <Radio
          size={Utils.getRatioDimension(18)}
          checked={!!selects[item.receiptNo]}
          circle={false}
          onPress={() => onSelectItem(item)}
        />
        <View style={Helpers.fill}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginBottom: Metrics.small,
            }}
          >
            <Text style={styles.titleLimit}>{alias}</Text>
            <Text style={[styles.titleLimit, { color: '#8B97A8', fontWeight: 'normal' }]}>
              {settlementDate}
            </Text>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.limitContent}>{receiptNoInString}</Text>
            <AmountLabel
              style={[styles.limitContent, { fontWeight: 'normal' }]}
              value={principal}
              currency="VND"
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      <Topbar
        subTitle={I18n.t('overdraft.fromOnlineSaving.selectCollateral')}
        background={Colors.mainBg}
        title={I18n.t('overdraft.fromOnlineSaving.title')}
      />
      <View style={styles.container}>
        <View style={[styles.bottomContainer, Helpers.fill]}>
          <ScrollView style={[Helpers.fill, Helpers.fullWidth]}>
            {listSaving?.map((item, index) => renderItemLimit(item, index))}
          </ScrollView>
          <View style={styles.totalItem}>
            <Text style={styles.totalLimit}>Dư nợ cần thanh toán</Text>
            <AmountLabel
              value={totalbl}
              currency="VND"
              style={[styles.totalLimit, { color: Colors.primary2 }]}
            />
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLimit}>Tổng số tiền tất toán</Text>
            <AmountLabel
              value={totalSaving}
              currency="VND"
              style={[styles.totalLimit, { color: Colors.primary2 }]}
            />
          </View>
          <Note text="Số tiền tất toán sẽ được chuyển vào tài khoản thấu chi đã được đăng ký" />

          <View style={styles.line} />
          <Radio
            size={Utils.getRatioDimension(18)}
            style={[styles.checkBox]}
            textStyle={styles.textCheckBox}
            text="Đồng ý tất toán trước hạn và hưởng lãi suất không kỳ hạn"
            checked={checked}
            onPress={() => {
              setCheck(!checked)
            }}
          />
        </View>
      </View>

      <ConfirmButton
        loading={loading}
        onPress={onConfirm}
        disabled={!checked}
        color={checked ? Colors.primary2 : Colors.gray5}
      />
    </>
  )
}
export default CloseODSelect
