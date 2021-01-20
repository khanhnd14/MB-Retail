import React, { Fragment, useRef, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import I18n from 'i18n-js'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../../theme'
import { Topbar, Toast, Text, AmountLabel, Icon, SelectAccount, DatePicker, ModalSelect, ConfirmButton } from '../../../components'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'
import { SelectFDCollatComponent, SelectPurpose } from '../../../components/Overdraft'
import Note from '../../../components/SaveMoney/Note'
import { odSavingOperations } from '../../../state/overdraftSaving'
import moment from 'moment'

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: Metrics.medium,
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2, paddingVertical: 5 },
  lineItem: {
    borderBottomColor: Colors.lineSep,
    borderBottomWidth: 1,
    marginHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
    height: 70,
    justifyContent: 'center'
  },
  noteView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 0
  },
  noteText: {
    fontSize: 10,
    paddingLeft: 10,
    color: Colors.gray,
  },
  readOnlyText: {
    color: Colors.gray, paddingVertical: 5
  },
  datePicker: {
    flex: 1
  },
  textDetail: {
    color: Colors.primary2
  }
})

const CreateOD = () => {
  const dispatch = useDispatch()
  const { creationInfo, getPaymentAccount, listTCType, purposeList, sendOTPRegister } = useSelector((state) => state.overdraft)
  const [totalTSDB, setTotalTSDB] = React.useState(0)
  const [odLimit, setOdLimit] = React.useState(0)
  const [fDList, setFDList] = React.useState(0)
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)
  const [minDate, setMinDate] = React.useState(null)
  const [maxDate, setMaxDate] = React.useState(null)
  const [paymentAccount, setPaymentAccount] = React.useState(null)
  const [selectedPurpose, setSelectedPurpose] = React.useState(null)
  const [noteVisible, setNoteVisible] = React.useState(false)
  const [collatData, setCollatData] = React.useState(false)
  const momentFormat = "DD/MM/YYYY"
  const note = useMemo(() =>
    `Hạn mức thấu chi bằng 80% giá trị tài sản bảo đảm với tài sản bảo đảm là tiết kiệm trả sau, bằng 70% giá trị TSBĐ với TSBĐ là tiết kiệm trả trước nhưng không vượt quá 1 tỷ VNĐ`, [])
  const refToast = useRef(null)

  React.useEffect(() => {
    dispatch(odSavingOperations.creationInfo())
    dispatch(odSavingOperations.getPaymentAccount())
    dispatch(odSavingOperations.listTCType())
    dispatch(odSavingOperations.purposeList())
    console.log('moment', moment().toDate());
    setStartDate(moment().toDate())
    endDateCal()
  }, [])
  
  React.useEffect(() => {
    setCollatData(creationInfo)
    if (creationInfo?.FDList) {
      setFDList(creationInfo?.FDList)
    }
  }, [creationInfo])

  React.useEffect(() => {
    console.log('sendOTPRegister',sendOTPRegister);
    
  }, [sendOTPRegister])

  React.useEffect(() => {
    if (getPaymentAccount?.isExistOD) {
      let expiredDate = new Date(getPaymentAccount.expiredDate)
      setMaxDate(expiredDate)
      setEndDate(expiredDate)
      setPaymentAccount(getPaymentAccount.accounts)//.accountInString
    }
  }, [getPaymentAccount])

  const endDateCal = () => {
    // let currentDate = new Date()
    let minDate = moment().add(1, 'M').toDate();
    let maxDate = moment().add(12, 'M').toDate();
    setMinDate(minDate)
    setMaxDate(maxDate)
    setEndDate(maxDate)
  }

  const completeFDSelected = (data, total, odl) => {
    console.log(data,total,odl);
    setFDList(data.FDList)
    setTotalTSDB(total)
    setOdLimit(odl)
    setCollatData(data)
  }

  const changeFromAccount = (accId) => {
    console.log(accId);
    getPaymentAccount.accounts.forEach(element => {
      if (element.acctNo == accId) {
        setPaymentAccount(accId)
      }
    });
  }
  const toggleFrqDatePicker = (date) => {
    // console.log(date);
    setEndDate(date)
  }
  const onSelectPurpose = (pp) => {
    setSelectedPurpose(pp)
  }
  const handleSubmit = () => {
    if (!odLimit) {
      refToast.current.show(I18n.t('overdraft.fromOnlineSaving.error_odlimit_null'), 3000)
      return
    }
    if (!paymentAccount) {
      refToast.current.show(I18n.t('overdraft.fromOnlineSaving.error_ca_account_null'), 3000)
      return
    }
    
    let fdListParam = ""
    fDList.forEach(fd => {
      if (fd.isSelected == true) {
        fdListParam += fd.receiptNo + ","
      }
    });
    if (fdListParam.length>0) {
      fdListParam = fdListParam.slice(0,-1)
    }
    console.log('fdListParam',fdListParam);
    // rolloutAcctNo: 11001011414192
    // effectiveDate: 19/01/2021
    // expireDate: 19/01/2022
    // purpose: 41
    let body = {
      fdList:fdListParam,
      rolloutAcctNo:paymentAccount
    }
    // dispatch(odSavingOperations.sendOTPRegister())
  }
  

  if (creationInfo && getPaymentAccount && listTCType && purposeList) {
    console.log(creationInfo, getPaymentAccount, listTCType, purposeList);
  } else {
    return null
  }
  return (
    <>
      <Topbar subTitle={I18n.t('overdraft.fromOnlineSaving.openScreenTitle')} background={Colors.mainBg} title={I18n.t('overdraft.fromOnlineSaving.title')} />
      <ScrollView style={[Helpers.fill, styles.scrollView]}>
        <View style={[Helpers.fill, styles.container]}>

          {/* chọn stk */}
          <SelectFDCollatComponent data={collatData} onSubmit={completeFDSelected} />

          {/* han muc thau chi */}
          <View style={styles.lineItem}>
            <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.overdraftLimit')}</Text>
            <AmountLabel style={styles.readOnlyText} value={odLimit} currency={'VND'} />
          </View>

          {/* note */}
          {/* <View style={[styles.lineItem, styles.noteView]}>
            <Icon size={Metrics.tiny * 2} name="icon-internet" color={Colors.gray3} />
            <View style={{}}>
              <Text style={styles.noteText}>{I18n.t('overdraft.fromOnlineSaving.noteFSRN')}</Text>
            </View>
          </View> */}

          {/* tai khoan thau chi */}
          {creationInfo.odAccount
            ? (
              <View style={[styles.lineItem]}>
                <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odAccount')}</Text>
                <Text style={styles.readOnlyText}>{creationInfo.odAccount.accountInString}</Text>
              </View>
            ) : (
              null
            )
          }

          {/* lai thau chi */}
          <View style={styles.lineItem}>
            <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odInterestRate')}</Text>
            <Text style={styles.readOnlyText}>{creationInfo.laiSuatTC}{' '}{I18n.t('overdraft.fromOnlineSaving.percentYear')}</Text>
          </View>

          {/* chon ngay */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.lineItem, { flex: 1 }]}>
              <Text style={styles.textDetail}>{I18n.t('overdraft.fromOnlineSaving.effectiveDate')}</Text>
              <DatePicker
                dateStyle={styles.text}
                style={{ flex: 1 }}
                date={startDate}
                disable={true}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.lineItem, { flex: 1 }]}>
              <Text style={styles.textDetail}>{I18n.t('overdraft.fromOnlineSaving.expireDate')}</Text>
              <DatePicker
                onPress={toggleFrqDatePicker}
                dateStyle={styles.text}
                style={{ flex: 1 }}
                date={endDate}
                minDate={minDate}
                maxDate={maxDate}
              />
            </TouchableOpacity>
          </View>

          {/* ca account */}
          {getPaymentAccount.isExistOD
            ? (
              <View style={[styles.lineItem]}>
                <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odAccount')}</Text>
                <Text style={styles.readOnlyText}>{paymentAccount.accountInString}</Text>
              </View>
            ) : (
              <SelectAccount onSelectRolloutAccountNo={changeFromAccount} data={getPaymentAccount.accounts} />
            )
          }

          {/* purpose */}
          <SelectPurpose data={purposeList} onSubmit={onSelectPurpose} />
        </View>
        {/* xem ghi chu */}
        <View style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: 'white', paddingBottom: 10 }}>
          <Note onPress={() => {
            setNoteVisible(true)
          }} />
          <ModalSelect
            title={I18n.t('overdraft.fromOnlineSaving.openingPurpose')}
            visible={noteVisible}
            maxHeight={100}
            handleModal={() => setNoteVisible(false)}
          >
            <View style={{ flex: 1, marginHorizontal: 16, justifyContent: 'center' }}>
              <Text style={styles.itemText}>{note}</Text>
            </View>
          </ModalSelect>
        </View>
        <Toast ref={refToast} position="bottom" />
        {/* nut tiep tuc */}
        <ConfirmButton
          onPress={() => handleSubmit()}
          style={{
            paddingHorizontal: Metrics.small,
            paddingBottom: Metrics.small,
            paddingTop: Metrics.small
          }}
          color={Colors.primary2}
          styleButton={{ width: '100%' }}
          text={I18n.t('action.action_continue').toUpperCase()}
          styleText={{
            fontSize: 14,
          }}
        />
      </ScrollView>
    </>
  )
}
export default CreateOD
