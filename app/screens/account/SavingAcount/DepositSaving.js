import React, { Fragment, useRef, useMemo, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import I18n from 'i18n-js'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import { Topbar, SelectAccount, ConfirmButton, NoteSheet, Radio, Toast } from '../../../components'
import { AmountPayment, DueDate } from '../../../components/SaveMoney'
import { Colors, Metrics } from '../../../theme'
import Note from '../../../components/SaveMoney/Note'
import DDAccountSave from '../../../components/SaveMoney/DDAccountSave'
import TransTime from '../../../components/SaveMoney/TransTime'
import { Utils } from '../../../utilities'
import { saveOperations } from '../../../state/save'
import * as Navigation from '../../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
  },
  contentLayout: {
    backgroundColor: Colors.white,
    padding: Metrics.normal,
    marginTop: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonConfirm: {
    paddingHorizontal: Metrics.medium,
  },
  sendCardContainer: {
    paddingHorizontal: Metrics.medium * 1.5,
    paddingVertical: Metrics.small,
    flexDirection: 'row',
  },
  cardContainer: {
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11,
  },
})

const DepositSaving = ({ route }) => {
  const { title, typeSave, catCode, index, savingOnlineAccounts, currentAccount } = route.params

  const {
    account,
    resultCheckHoliday,
    resultCreateCAtoFD,
    errorCheckHoliday,
    errorCreateCAtoFD,
    schedule,
  } = useSelector((state) => state.save)
  const { handleSubmit, register, errors, setValue, getValues } = useForm()

  const values = getValues()
  const sheetNote = useRef(null)
  const refToast = useRef(null)
  // • Các giao dịch được thực hiện trong khoảng thời gian từ 6h đến 17h các ngày từ thứ 2 đến thứ 6 sẽ có hiệu lực ngay. Các giao dịch sau 17h các ngày từ thứ 2 đến thứ 6 hoặc giao dịch vào ngày nghỉ/ngày lễ sẽ được hệ thống ghi nhận và có hiệu lực vào ngày làm việc tiếp theo.
  const note = useMemo(
    () => `• Số tiền tối thiểu để mở thẻ tiết kiệm trực tuyến là: 1,000,000 VNĐ. (Riêng sản phẩm rút gốc từng phần tối thiểu là 20,000,000 VNĐ)
• Số tiền tối thiểu để gửi góp tiết kiệm trực tuyến là 50,000 VNĐ.
• Quý khách có thể gửi góp thêm vào các tài khoản tiết kiệm được mở khi lãi suất thay đổi
• Lần gửi góp cuối cùng phải trước ngày đến hạn ít nhất 30 ngày.
    `,
    []
  )

  const [fromAcc, setFromAcc] = React.useState('')
  const [payment, setPayment] = React.useState('')
  const [isNow, setIsNow] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()

  // lấy ra ong vàngs
  const beeAccounts = useMemo(() => _.filter(savingOnlineAccounts, (e) => e.category === 'FSOV'), [
    savingOnlineAccounts,
  ])

  useEffect(() => () => dispatch(saveOperations.dispatchSchedule(null)), [])

  const onSubmit = (data) => {
    setLoading(true)
    dispatch(saveOperations.checkHoliday())
  }

  const changeFromAccount = (accId) => {
    const acc = _.find(account, (e) => e.acctNo === accId)
    setTimeout(() => {
      setValue('lblFromAcc', acc)
    }, 500)
    setFromAcc(acc)
  }

  const changePayment = (text) => {
    setValue('lblAmount', text)
    setPayment(text)
  }

  const setDDAcountSave = (text) => {
    const lblBenefitAcc = _.find(beeAccounts, (e) => e.receiptNoInString === text)
    setTimeout(() => {
      setValue('lblBenefitAcc', lblBenefitAcc)
    }, 500)
  }

  useEffect(() => {
    if (loading && resultCheckHoliday) {
      const { lblFromAcc, lblAmount, lblBenefitAcc } = values
      const body = {
        fromAcc: lblFromAcc?.acctNo,
        toAcc: lblBenefitAcc?.receiptNo,
        amount: lblAmount,
        isNow,
        freqCode: 'D',
        startedTime: Utils.toStringDate(Utils.getTomorrow()),
        expiredTime: Utils.toStringDate(new Date()),
      }
      if (schedule) {
        body.freq = schedule.freq
        body.isNow = false
        body.freqCode = schedule.freqCode
        body.startedTime = Utils.toStringDate(schedule.startedTime)
        body.expiredTime = Utils.toStringDate(schedule.expiredTime)
      }
      dispatch(saveOperations.savingCreateCAtoFD(body))
    }
  }, [resultCheckHoliday])

  useEffect(() => {
    if (loading && errorCheckHoliday) {
      console.log('====================================')
      console.log(errorCheckHoliday)
      console.log('====================================')
      const { lblFromAcc, lblAmount, lblBenefitAcc } = values
      const body = {
        fromAcc: lblFromAcc?.acctNo,
        toAcc: lblBenefitAcc?.receiptNo,
        amount: lblAmount,
        isNow: true,
        freqCode: 'D',
        startedTime: Utils.toStringDate(Utils.getTomorrow()),
        expiredTime: Utils.toStringDate(new Date()),
      }
      if (schedule) {
        body.freq = schedule.freq
        body.freqCode = schedule.freqCode
        body.isNow = false
        body.startedTime = Utils.toStringDate(schedule.startedTime)
        body.expiredTime = Utils.toStringDate(schedule.expiredTime)
      }
      dispatch(saveOperations.savingCreateCAtoFD(body))
    }
  }, [errorCheckHoliday])

  useEffect(() => {
    if (loading && resultCreateCAtoFD) {
      setLoading(false)
      Navigation.push('ConfirmScreen', {
        acctNo: resultCreateCAtoFD?.lblFromAcc,
        amount: resultCreateCAtoFD?.lblAmount,
        fields: [
          {
            label: I18n.t('saving.number_deposit_saving'),
            value: `${resultCreateCAtoFD?.lblCatName} ${resultCreateCAtoFD?.lblBenefitAcc}`,
          },
          {
            label: I18n.t('saving.payment'),
            value: Utils.formatAmountText(resultCreateCAtoFD?.lblAmount),
          },
          {
            label: I18n.t('saving.transfer_date'),
            value: resultCreateCAtoFD?.lblTransDate,
          },
        ],
        ...route.params,
        isNow: !!_.isEmpty(schedule)
      })
    }
  }, [resultCreateCAtoFD])

  useEffect(() => {
    if (loading && errorCreateCAtoFD) {
      // Utils.hideLoading()
      setLoading(false)
    }
  }, [errorCreateCAtoFD])

  React.useEffect(() => {
    register('lblFromAcc', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account'),
      },
    })
    register('lblAmount', {
      required: {
        value: true,
        message: I18n.t('saving.input_payment'),
      },
    })
    register('lblBenefitAcc', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account_bee'),
      },
    })
  }, [register])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    if (keys.length) {
      refToast.current.show(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  const onChangeType = (isN) => {
    if (isN) {
      setIsNow(isN)
      dispatch(saveOperations.dispatchSchedule(null))
    }
  }
  return (
    <Fragment>
      <View style={styles.container}>
        <Topbar subTitle={I18n.t('saving.deposit_saving')} title={I18n.t('account.title_saving')} />
        <ScrollView style={styles.scrollView}>
          <SelectAccount onSelectRolloutAccountNo={changeFromAccount} data={account} />
          <View style={styles.contentLayout}>
            <DDAccountSave
              setDDAcountSave={setDDAcountSave}
              data={beeAccounts}
              currentAccBee={currentAccount}
            />
            <AmountPayment changePayment={changePayment} />
            <TransTime changeType={onChangeType} isNow={!!_.isEmpty(schedule)} />
            <Note
              onPress={() => {
                sheetNote.current.show()
              }}
            />
          </View>
        </ScrollView>
        <ConfirmButton
          onPress={handleSubmit(onSubmit)}
          styleButton={{ width: '100%' }}
          text={I18n.t('employee.continue').toUpperCase()}
          styleText={{
            fontSize: 14,
          }}
          loading={loading}
          style={styles.buttonConfirm}
        />
      </View>
      <NoteSheet text={note} ref={sheetNote} />
      <Toast ref={refToast} position="bottom" />
    </Fragment>
  )
}

export default DepositSaving
