import React, { Fragment, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'
import moment from 'moment'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Toast, Text, AmountLabel, Loader, SelectAccount, DatePicker, ModalSelect, ConfirmButton } from '../../../components'
import * as Navigation from '../../../navigation'
import { SelectFDCollatComponent, SelectPurpose } from '../../../components/Overdraft'
import Note from '../../../components/SaveMoney/Note'
import { odSavingOperations } from '../../../state/overdraftSaving'

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
  },

  containerAlert: {
    minHeight: Metrics.small * 23.2,
    width: Metrics.small * 29.6,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 10,
  },
  header: {
    backgroundColor: Colors.primary2,
    padding: Metrics.small * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleAlert: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: Metrics.small * 1.8,
  },
  button: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.gray4,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 0.7,
    marginVertical: Metrics.normal,
  },
  input: {
    marginTop: Metrics.normal * 2,
    marginHorizontal: Metrics.normal,
    textAlign: 'center',
    flex: 1,
  },
})

const CreateOD = () => {
  const dispatch = useDispatch()
  const { creationInfo, getPaymentAccount, listTCType, purposeList, sendOTPRegister, creationInfoError } = useSelector((state) => state.overdraft)
  const [, setTotalTSDB] = React.useState(0)
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
  const [loading, setLoading] = React.useState(false)
  const [isSetup, setIsSetup] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const momentFormat = 'DD/MM/YYYY'
  const note = useMemo(() =>
    'Hạn mức thấu chi bằng 80% giá trị tài sản bảo đảm với tài sản bảo đảm là tiết kiệm trả sau, bằng 70% giá trị TSBĐ với TSBĐ là tiết kiệm trả trước nhưng không vượt quá 1 tỷ VNĐ', [])
  const refToast = useRef(null)

  const endDateCal = () => {
    // let currentDate = new Date()
    const minDate = moment().add(1, 'M').toDate();
    const maxDate = moment().add(12, 'M').toDate();
    setMinDate(minDate)
    setMaxDate(maxDate)
    setEndDate(minDate)
    console.log('endDateCal');
  }

  React.useEffect(() => {
    dispatch(odSavingOperations.creationInfo())
    dispatch(odSavingOperations.getPaymentAccount())
    dispatch(odSavingOperations.listTCType())
    dispatch(odSavingOperations.purposeList())
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
    // console.log('creationInfoError',creationInfoError);
    // let msg = creationInfoError.message
    setShowAlert(true)
  }, [creationInfoError])

  React.useEffect(() => {
    if (purposeList) {
      setSelectedPurpose(purposeList[0])
    }
  }, [purposeList])

  React.useEffect(() => {
    if (getPaymentAccount) {
      if (getPaymentAccount.isExistOD) {
        const expiredDate = new Date(getPaymentAccount.expiredDate)
        setMaxDate(expiredDate)
        setEndDate(expiredDate)
        console.log('React.useEffect getPaymentAccount');
        setPaymentAccount(getPaymentAccount.accounts)// .accountInString
      } else {
        setPaymentAccount(getPaymentAccount?.accounts[0])
        // console.log('getPaymentAccount',getPaymentAccount);
      }
    }
  }, [getPaymentAccount])

  const completeFDSelected = (data, total, odl) => {
    console.log(data, total, odl);
    setFDList(data.FDList)
    setTotalTSDB(total)
    setOdLimit(odl)
    setCollatData(data)
  }

  const changeFromAccount = (accId) => {
    console.log(accId);
    getPaymentAccount.accounts.forEach(element => {
      if (element.acctNo === accId) {
        setPaymentAccount(element)
      }
    });
  }
  const toggleFrqDatePicker = (date) => {
    setEndDate(date)
  }
  const onSelectPurpose = (pp) => {
    console.log(pp);
    setSelectedPurpose(pp)
  }
  const handleSubmit = () => {
    if (!odLimit) {
      refToast.current.show(I18n.t('overdraft.fromOnlineSaving.error_odlimit_null'), 3000)
      return
    }
    console.log('paymentAccount', paymentAccount);

    if (!paymentAccount) {
      refToast.current.show(I18n.t('overdraft.fromOnlineSaving.error_ca_account_null'), 3000)
      return
    }

    let fdListParam = ''
    fDList.forEach(fd => {
      if (fd.isSelected === true) {
        fdListParam += `${fd.receiptNo},`
      }
    });
    if (fdListParam.length > 0) {
      fdListParam = fdListParam.slice(0, -1)
    }

    // rolloutAcctNo: 11001011414192
    // effectiveDate: 19/01/2021
    // expireDate: 19/01/2022
    // purpose: 41

    const body = {
      fdList: fdListParam,
      rolloutAcctNo: paymentAccount.acctNo,
      effectiveDate: moment(startDate).format(momentFormat),
      expireDate: moment(endDate).format(momentFormat),
      purpose: selectedPurpose.code,
      notSendOTP: true
    }
    setLoading(true)
    setIsSetup(true)
    dispatch(odSavingOperations.sendOTPRegister(body))
  }

  React.useEffect(() => {
    setLoading(false)
    // console.log('sendOTPRegister', sendOTPRegister);
    if (isSetup && sendOTPRegister) {
      // set cho man thanh cong
      const openInfo = {
        odLimit,
        expireDate: endDate,
        rate: creationInfo?.laiSuatTC
      }
      dispatch(odSavingOperations.openODInfo(openInfo))

      setIsSetup(false)
      Navigation.push('CreateODConfirm', { title: 'CreateODConfirm' })
    }
  }, [sendOTPRegister])

  const onHide = () => {
    Navigation.pop()
  }

  if (getPaymentAccount && listTCType && purposeList) {
    // console.log(creationInfo, getPaymentAccount, listTCType, purposeList);
  } else {
    return null
  }
  return (
    <>
      <Topbar subTitle={I18n.t('overdraft.fromOnlineSaving.openScreenTitle')} background={Colors.mainBg} title={I18n.t('overdraft.fromOnlineSaving.title')} />
      {creationInfoError && (
        <View style={[Helpers.fill, styles.scrollView]}>
          {showAlert && (
            <Modal isVisible={showAlert} onBackdropPress={() => onHide()} onModalHide={() => onHide()}>
              <TouchableWithoutFeedback accessible={false}>
                <View style={[styles.containerAlert, {}]}>
                  <View style={styles.header}>
                    <Text style={styles.titleAlert}>{I18n.t('application.title_alert_notification').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.input}>{creationInfoError?.message}</Text>
                  <TouchableOpacity onPress={() => onHide()} style={styles.button}>
                    <Text style={styles.titleAlert}>{I18n.t('action.action_close').toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>
      )}
      {!creationInfoError && (
        <ScrollView style={[Helpers.fill, styles.scrollView]}>
          <View style={[Helpers.fill, styles.container]}>

            {/* chọn stk */}
            <SelectFDCollatComponent data={collatData} onSubmit={completeFDSelected} />

            {/* han muc thau chi */}
            <View style={styles.lineItem}>
              <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.overdraftLimit')}</Text>
              <AmountLabel style={styles.readOnlyText} value={odLimit} currency="VND" />
            </View>

            {/* note */}
            {/* <View style={[styles.lineItem, styles.noteView]}>
            <Icon size={Metrics.tiny * 2} name="icon-internet" color={Colors.gray3} />
            <View style={{}}>
              <Text style={styles.noteText}>{I18n.t('overdraft.fromOnlineSaving.noteFSRN')}</Text>
            </View>
          </View> */}

            {/* tai khoan thau chi */}
            {creationInfo?.odAccount
              ? (
                <View style={[styles.lineItem]}>
                  <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odAccount')}</Text>
                  <Text style={styles.readOnlyText}>{creationInfo?.odAccount?.accountInString}</Text>
                </View>
              ) : (
                null
              )
            }

            {/* lai thau chi */}
            <View style={styles.lineItem}>
              <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odInterestRate')}</Text>
              <Text style={styles.readOnlyText}>{creationInfo?.laiSuatTC}{' '}{I18n.t('overdraft.fromOnlineSaving.percentYear')}</Text>
            </View>

            {/* chon ngay */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.lineItem, { flex: 1 }]}>
                <Text style={styles.textDetail}>{I18n.t('overdraft.fromOnlineSaving.effectiveDate')}</Text>
                <DatePicker
                  dateStyle={{ color: Colors.gray }}
                  style={{ flex: 1 }}
                  date={startDate}
                  disable="true"
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.lineItem, { flex: 1 }]}>
                <Text style={styles.textDetail}>{I18n.t('overdraft.fromOnlineSaving.expireDate')}
                </Text>
                <DatePicker
                  onPress={toggleFrqDatePicker}
                  dateStyle={getPaymentAccount?.expiredDate ? { color: Colors.gray } : {}}
                  style={{ flex: 1 }}
                  date={endDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  disable={getPaymentAccount?.expiredDate != null}
                />
              </TouchableOpacity>
            </View>

            {/* ca account */}
            {getPaymentAccount.isExistOD
              ? (
                <View style={[styles.lineItem]}>
                  <Text style={styles.title}>{I18n.t('overdraft.account')}</Text>
                  <Text style={styles.readOnlyText}>{paymentAccount?.accountInString}</Text>
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
            }}
            />
            <ModalSelect
              title={I18n.t('application.note')}
              visible={noteVisible}
              maxHeight={100}
              handleModal={() => setNoteVisible(false)}
            >
              <View style={{ flex: 1, marginHorizontal: 16, justifyContent: 'center' }}>
                <Text style={styles.itemText}>{note}</Text>
              </View>
            </ModalSelect>
          </View>

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
      )}

      <Toast ref={refToast} position="bottom" />
      <Loader modalVisible={loading} />
      {/* alert */}

    </>
  )
}
export default CreateOD
