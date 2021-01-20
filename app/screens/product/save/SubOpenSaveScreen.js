import React, { Fragment, useRef, useMemo, useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Metrics, Colors } from '../../../theme'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  Button,
  Alert,
  NoteSheet,
  Toast,
  Text,
  ConfirmButton
} from '../../../components'
import { saveOperations } from '../../../state/save'
import {
  InterestRate,
  AmountPayment,
  DueDate,
  TypeSave,
  PaymentMethod,
} from '../../../components/SaveMoney'
import Note from '../../../components/SaveMoney/Note'
import { getProductType, loadRate, createSavingOnline } from '../../../state/save/actions'
import { Utils } from '../../../utilities'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import * as saveTypes from '../../../state/save/types'

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
  btnLayout: {
    padding: Metrics.normal,
  },
  btn: {
    backgroundColor: Colors.primary2,
    height: 50,
    borderRadius: 38,
    marginBottom: Metrics.tiny,
  },
  btnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  note: {
    fontWeight: 'bold',
    marginVertical: Metrics.tiny,
    alignSelf: 'center',
  },
})
const SubOpenSaveScreen = ({ route }) => {
  const { title, typeSave, catCode, index } = route.params
  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const terms = useSelector((state) => state.save.terms).filter((term) => term.category === catCode)
  // console.log('--------------------------------------------------------')
  // console.log('catCode', catCode)
  // console.log('terms', terms)
  // console.log('--------------------------------------------------------')
  const {
    savingResult,
    account,
    } = useSelector((state) => state.save)
  const [fromAcc, setFromAcc] = React.useState('')
  const [isShowAlert, setIsShowAlert] = React.useState(false)
  const [ddAccount, setDdAccount] = React.useState('')
  const [productCode, setProductCode] = React.useState('')
  const [payment, setPayment] = React.useState('')
  const [renewMatter, setRenewMatter] = React.useState('N')
  
  const refToast = useRef()
  const note = useMemo(() => 
  `• Số tiền tối thiểu để mở thẻ tiết kiệm trực tuyến là: 1,000,000 VNĐ. (Riêng sản phẩm rút gốc từng phần tối thiểu là 20,000,000 VNĐ)\n
  • Số tiền tối thiểu để gửi góp tiết kiệm trực tuyến là 50,000 VNĐ.\n
  • Quý khách có thể gửi góp thêm vào các tài khoản tiết kiệm được mở khi lãi suất thay đổi\n
  • Lần gửi góp cuối cùng phải trước ngày đến hạn ít nhất 30 ngày.\n
  `, [])
  const sheetNote = useRef(null)

  const onSubmit = (data) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    // renewMatter = 'Y', isSavingOffer = false, freqCode = 'D'
    dispatch(createSavingOnline(catCode, productCode, fromAcc, payment, ddAccount, Utils.toStringDate(Utils.getTomorrow()), Utils.toStringDate(new Date()),
    renewMatter))
  }

  const changePayment = (text) => {
    setValue('payment', text)
    setPayment(text)
  }

  const setDueDate = (text) => {
    setValue('term', text)
    setProductCode(text)
  }

  const changeFromAccount = (accId) => {
    setValue('account', accId)
    setFromAcc(accId)
  }

  const changeDDAccount = (ddAcc,renewMatter) => {
    console.log('ddAcc,renewMatter',ddAcc,renewMatter);
    setRenewMatter(renewMatter)
    setValue('ddAccount', ddAcc)
    setDdAccount(ddAcc)
  }

  React.useEffect(() => {
    dispatch(saveOperations.getAcount())
    dispatch(getProductType())
  }, [])

  // lấy acct đầu tiên trong danh sách
  React.useEffect(() => {
    if (account.length) {
      const { acctNo } = account[0]
      changeFromAccount(acctNo)
      changeDDAccount(acctNo)
    }
  }, [account])

  React.useEffect(() => {
    if (savingResult) {
      Navigation.push('OpenSaveConfirm', {
        title: route.params.title,
        productCode,
        fromAcc,
        payment,
        account,
        terms,
        ddAccount,
        catCode,
        typeSave,
        lblInterest: savingResult.lblInterest
      })
    }
  }, [savingResult])

    React.useEffect(() => {
      register('account', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_account')
        }
      })
      register('ddAccount', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_account')
        }
      })
      register('payment', {
        required: {
          value: true,
          message: I18n.t('saving.input_payment')
        }
      })
      register('term', {
        required: {
          value: true,
          message: I18n.t('saving.error_term')
        }
      })
    }, [register])

    React.useEffect(() => {
      if (payment && productCode) {
        dispatch(loadRate(productCode, payment))
      }
    }, [payment, productCode])

    React.useEffect(() => {
      const keys = Object.keys(errors)
      console.log('====================================');
      console.log(errors);
      console.log('====================================');
      if (keys.length) {
        refToast.current.show(errors[keys[0]]?.message, 3000)
      }
    }, [errors])

    // unmount
    useEffect(() => () => {
        dispatch([{
          type: saveTypes.GET_SAVING_RATE_COMPLETED,
          payload: 0
        }, {
          type: saveTypes.CREATE_SAVING_FAILED,
          payload: null
        }, {
          type: saveTypes.COMPLETE_SAVING_ONLINE_FAILED,
          payload: null
        }])
      }, [])
  return (
    <Fragment>
      <View style={styles.container}>
        <Topbar subTitle={I18n.t('account.open_save')} title={I18n.t('account.title_saving')} />
        <ScrollView style={styles.scrollView}>
          <SelectAccount onSelectRolloutAccountNo={changeFromAccount} data={account} />
          <View style={styles.contentLayout}>
            <TypeSave typeSave={typeSave} />
            <AmountPayment changePayment={changePayment} />
            <DueDate setDueDate={setDueDate} data={terms.length ? terms : []} />
            <InterestRate />
            <PaymentMethod changeDDAccount={changeDDAccount} fromAcc={fromAcc} />
            <Note
              onPress={() => {
                sheetNote.current.show()
              }}
            />
          </View>
        </ScrollView>
        <ConfirmButton
          onPress={() => handleSubmit(onSubmit)()}
          style={{
              paddingHorizontal: Metrics.medium,
            }}
          styleButton={{ width: '100%' }}
          text={I18n.t('employee.continue').toUpperCase()}
          styleText={{
              fontSize: 14,
            }}
        />
        <Alert visible={isShowAlert} handleModal={setIsShowAlert}>
          <View style={{ paddingTop: Metrics.tiny }}>
            <Text style={styles.note}>{I18n.t('saving.error')}</Text>
            <Text style={styles.note}>{I18n.t('saving.input_payment')}</Text>
          </View>
        </Alert>
      </View>
      <NoteSheet text={note} ref={sheetNote} />
      <Toast ref={refToast} position="bottom" />

    </Fragment>
  )
}

export default SubOpenSaveScreen
