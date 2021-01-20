/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Alert, BackHandler, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux'
import * as Animatable from 'react-native-animatable';
import EventEmitter from 'react-native-eventemitter';
import { Helpers, Colors } from '../../theme'
import { Topbar, Toast } from '../../components'
import I18n from '../../translations'
import Dots from '../../components/RegisterNew/Dots'
import InputNumberPhone from '../../components/RegisterNew/InputNumberPhone'
import OTP from '../../components/RegisterNew/Otp'
import AlertMessage from '../../components/RegisterNew/AlertMessage'
import * as Navigation from '../../navigation'
import ImageIdentifier from '../../components/RegisterNew/ImageIdentifier'
import CustomerInfo from '../../components/RegisterNew/CustomerInfo'
import CustomerInfo2 from '../../components/RegisterNew/CustomerInfo2'
import CustomerInfo3 from '../../components/RegisterNew/CutomerInfo3'
import ChoiceCombo from '../../components/RegisterNew/ChoiceCombo'
import Service from '../../components/RegisterNew/Service'
import Loading from '../../components/RegisterNew/Loading'
import Button from '../../components/RegisterNew/Button'
import { ekycOperations } from '../../state/ekyc'
import { Utils } from '../../utilities'
import * as ekycTypes from '../../state/ekyc/types'
import { Config } from '../../config';

const Register = () => {
  const refInputPhone = useRef()
  const refOtp = useRef()
  const refIdentifier = useRef()
  const refCustomerInfo = useRef()
  const refCustomerInfo2 = useRef()
  const refCustomerInfo3 = useRef()
  const refChoiceCombo = useRef()
  const refService = useRef()
  const refToast = useRef()

  const headings = [
    {
      index: 0,
      subTitle: I18n.t('ekyc.inputPhone'),
      buttonText: I18n.t('ekyc.confirm')
    },
    {
      index: 1,
      subTitle: I18n.t('ekyc.inputOtp'),
      buttonText: I18n.t('ekyc.confirm')
    },
    {
      index: 2,
      subTitle: I18n.t('ekyc.inputDocs'),
      buttonText: I18n.t('ekyc.start')
    },
    {
      index: 3,
      subTitle: I18n.t('ekyc.cusInfo'),
      buttonText: I18n.t('ekyc.continue')
    },
    {
      index: 4,
      subTitle: I18n.t('ekyc.customer_info.addition_cus_info'),
      buttonText: I18n.t('ekyc.continue')
    },
    {
      index: 5,
      subTitle: I18n.t('ekyc.select_acc.title'),
      buttonText: I18n.t('ekyc.continue')
    },
    {
      index: 6,
      subTitle: I18n.t('ekyc.combo'),
      buttonText: I18n.t('ekyc.continue')
    },
    {
      index: 7,
      subTitle: I18n.t('ekyc.service'),
      buttonText: I18n.t('ekyc.action_complete')
    },

  ]

  const [page, setPage] = useState({ index: 0, subtitle: I18n.t('ekyc.inputPhone'), buttonText: headings[0].buttonText })
  const [isShow, setIsShow] = useState(false)
  const [disableButton, setDisableButton] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [numberPhone, setNumberPhone] = useState('')
  const [openCard, setOpenCard] = useState('')
  const [isExportCard, setIsExportCard] = useState(false)
  const [isChoiceAgree, setIsChoiceAgree] = useState(false)
  const [customerInfoForm, setCustomerInfoForm] = useState(null)
  const [additionInfoForm, setAdditionInfoForm] = useState(null)
  const [choiceBranchForm, setChoiceBranchForm] = useState(null)
  const [loadingSdk, setLoadingSdk] = useState(false)
  const [loadingSdkColor, setLoadingSdkColor] = useState(null)
  const [callBackAlert, setCallBackAlert] = useState(null)
  const [oldDataSendOtpVerify, setOldDataSendOtpVerify] = useState(null)
  const [selectedCombo, setSelectedCombo] = React.useState(null)

  const dispatch = useDispatch()

  const {
    dataOtpVerify,
    loading,
    resultTsToken,
    errorOtpVerify,
    errorOtpVerified,
    resultVerifyCustomer,
    resultAdditionInfo,
    resultSaveLog,
    errorSaveLog,
    resultRegister,
    resultEkycSdk,
    choiceBranch
  } = useSelector((state) => state.ekyc)

  const onConfirm = () => {
    try {
      let i = page.index
    if (++i > headings.length) {
      Navigation.replace('EkycSucess')
      return
    }
    if (loading) {
      return
    }
    console.log('====================================');
    console.log('i', i);
    console.log('====================================');
    switch (i) {
      case 1:
        refInputPhone.current.submit()
        break;
      case 2:
        refOtp.current.submit()
        break;
      case 3:
        setCustomerInfoForm(null)
        refIdentifier.current.submit()
        break;
      case 4:
        setAdditionInfoForm(null)
        refCustomerInfo.current.submit()
        break;
      case 5:
        refCustomerInfo2.current.submit()
        break;
      case 6:
        refChoiceCombo.current.submit()
        break;
      case 7:
        refCustomerInfo3.current.submit()
        onBack(true)
        break;
      case 8:
        refService.current.submit()
      break;
      default:
        break;
    }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  // nút thực hiện lại
  const onReAction = () => {
    refCustomerInfo.current.reActionForm()
  }

  const onRightPress = () => {
    Navigation.replace('Welcome')
  }

  const onBack = (isNotReset) => {
    let i = page.index
    if (!i) {
      Navigation.replace('Welcome')
      return
    }
    switch (i) {
      case 0:
        break;
      case 1:
        setOldDataSendOtpVerify(null)
        break;
      case 2:
        dispatch([{
          type: ekycTypes.EKYC_VERIFY_OTP_COMPLETED,
          payload: null
        }, {
          type: ekycTypes.EKYC_SEND_OTP_COMPLETED,
          payload: null
        }])
        setPage({ index: --i, subtitle: headings[i].subTitle, buttonText: headings[i].buttonText })
        setOldDataSendOtpVerify(null)
        break;
      case 3:
        dispatch({
          type: ekycTypes.VERIFY_CUSTOMER_INFO_FAILED,
          payload: null
        })
        setLoadingSdkColor(null)
        setTimeout(() => {
          refIdentifier.current.submit()
        }, 500);
        break;
      case 4:
        break;
      case 5:
        setSelectedCombo(null)
        setChoiceBranchForm(null)
        setIsExportCard(false)
        setIsChoiceAgree(false)
        dispatch(ekycOperations.choiceBranch(null))
        break;
      case 6:
        !isNotReset && dispatch(ekycOperations.resetchoicedBranch())
        break;
      case 7:
        setPage({ index: --i, subtitle: headings[i].subTitle, buttonText: headings[i].buttonText })
        dispatch([{
          type: ekycTypes.RESET_CHECK_USERNAME,
        }, {
          type: ekycTypes.SEND_REGISTER_FAILED,
          payload: null
        }])
      break;
      default:
        break;
    }
    setPage({ index: --i, subtitle: headings[i].subTitle, buttonText: headings[i].buttonText })
  }

  const onChoiceDot = (index, title) => {
    // setPage({ index, subtitle: title, buttonText: headings[index].buttonText })
  }

  const showAlert = (isShow, title, content, callback) => {
    setCallBackAlert(callback)
    setIsShow(isShow)
    setTitle(title)
    setContent(content)
  }

  const onNext = () => {
    let i = page.index
    if (++i === headings.length) {
      Navigation.push('EkycSucess')
      return
    }
    setPage({ index: i, subtitle: headings[i].subTitle, buttonText: headings[i].buttonText })
  }

  const onNextTwo = () => {
    let i = page.index
    i += 2
    setPage({ index: i, subtitle: headings[i].subTitle, buttonText: headings[i].buttonText })
  }

//   const reset = () => {
//     Navigation.popToPop()
//     dispatch(ekycOperations.reActive())
//  }

 const resendCodeOtp = () => {
  dispatch(ekycOperations.reset())
  dispatch(ekycOperations.sendOTPVerify(numberPhone))
 }

 const toastAlert = (message) => {
  refToast.current.show(message, 3000)
 }

 const unAuthorize = (err) => {
  console.log('====================================');
  console.log('err', err);
  console.log('====================================');
  const data = err.response ? err.response.data : err

  showAlert(true, I18n.t('ekyc.alert'), `${data.message}`, () => onRightPress)
 }

  const eventBinding = () => {
    EventEmitter.on(Config.EVENT_NAMES.user_signout, unAuthorize)
  }

  const unEventBinding = () => {
    EventEmitter.removeListener(Config.EVENT_NAMES.user_signout, unAuthorize)
  }

  useEffect(() => {
    eventBinding()
    return () => {
      unEventBinding()
    }
  }, [])

  useEffect(() => {
    console.log('====================================');
    console.log(oldDataSendOtpVerify);
    console.log('====================================');
    if (dataOtpVerify) {
      if (!oldDataSendOtpVerify) {
        onNext()
      }
      setOldDataSendOtpVerify(dataOtpVerify)
    }
  }, [dataOtpVerify])
  useEffect(() => {
    if (resultTsToken) {
      page.index === 1 && onNext()
    }
  }, [resultTsToken])
  useEffect(() => {
    if (resultEkycSdk) {
      setLoadingSdk(false)
      onNext()
    }
  }, [resultEkycSdk])
  useEffect(() => {
    if (resultVerifyCustomer) {
      onNext()
    }
  }, [resultVerifyCustomer])
  useEffect(() => {
    if (resultAdditionInfo) {
      onNext()
    }
  }, [resultAdditionInfo])
  useEffect(() => {
    if (resultRegister) {
      onNext()
    }
  }, [resultRegister])

  useEffect(() => {
    const check = errorOtpVerify || errorOtpVerified || errorSaveLog
    console.log('====================================');
    console.log(check);
    console.log('====================================');
    if (check) {
      // Alert.alert('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }, [errorOtpVerified, errorOtpVerify, errorSaveLog])

  useEffect(() => {
    if (numberPhone.length === 10) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [numberPhone])

  // reactive
  useEffect(() => () => {
    dispatch(ekycOperations.reActive())
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      onBack()
      return true
    })
  }, [page])

  React.useEffect(() => () => {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      onBack()
      return true
    })
  }, [])

  return (
    <Fragment>

      <Topbar
        onBack={onBack}
        onRightPress={onRightPress}
        title={I18n.t('ekyc.title')}
        subTitle={page.subtitle}
      />
      <View style={[Helpers.fillColCross, { backgroundColor: Colors.mainBg }]}>

        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          {page.index !== 6 && <Dots isActive={page.index === 1 ? 0 : page.index} dots={headings} onChoiceDot={onChoiceDot} />}
          {page.index === 0 && (
            <View>
              <InputNumberPhone
                setNumberPhone={setNumberPhone}
                ref={refInputPhone}
                showAlert={showAlert}
              />
            </View>
          )}
          {page.index === 1 && (
          <OTP
            numberPhone={numberPhone}
            ref={refOtp}
            onBack={onBack}
            setNumberPhone={setNumberPhone}
            resendCode={resendCodeOtp}
            toastAlert={toastAlert}
          />
          )}
          {page.index === 2 && (
            <View>
              <ImageIdentifier
                showAlert={showAlert}
                ref={refIdentifier}
                phone={numberPhone}
                toastAlert={toastAlert}
                setLoading={setLoadingSdk}
              />
            </View>
          )}
          {page.index === 3 && (
            <CustomerInfo
              ref={refCustomerInfo}
              showAlert={showAlert}
              onBack={onBack}
              toastAlert={toastAlert}
              setCustomerInfoForm={setCustomerInfoForm}
              customerInfoForm={customerInfoForm}
              setDisableButton={setDisableButton}
            />
          )}
          {page.index === 4 && (
            <CustomerInfo2
              ref={refCustomerInfo2}
              numberPhone={numberPhone}
              toastAlert={toastAlert}
              showAlert={showAlert}
              setAdditionInfoForm={setAdditionInfoForm}
              additionInfoForm={additionInfoForm}
              customerInfoForm={customerInfoForm}
              setDisableButton={setDisableButton}
            />
          )}
          {page.index === 5 ? (
            <ChoiceCombo
              onNext={onNext}
              onNextTwo={onNextTwo}
              ref={refChoiceCombo}
              showAlert={showAlert}
              setOpenCard={setOpenCard}
              toastAlert={toastAlert}
              isExportCard={isExportCard}
              setIsExportCard={setIsExportCard}
              isChoiceAgree={isChoiceAgree}
              setIsChoiceAgree={setIsChoiceAgree}
              setDisableButton={setDisableButton}
              setSelectedCombo={setSelectedCombo}
              selectedCombo={selectedCombo}
            />
          ) : null}
          {page.index === 6 ? (
            <CustomerInfo3
              setChoiceBranchForm={setChoiceBranchForm}
              choiceBranchForm={choiceBranchForm}
              ref={refCustomerInfo3}
              setDisableButton={setDisableButton}
            />
          ) : null}
          {page.index === 7 && (
            <Service
              openCard={openCard}
              ref={refService}
              showAlert={showAlert}
              numberPhone={numberPhone}
              setDisableButton={setDisableButton}
              setLoading={setLoadingSdk}
              setLoadingSdkColor={setLoadingSdkColor}
            />
          )}

        </KeyboardAwareScrollView>
      </View>
      {page.index !== 1 && (
      <Button
        disabled={disableButton || loading}
        onConfirm={onConfirm}
        onReAction={onReAction}
        loading={loading}
        isDouble={page.index === 3}
        text={page.buttonText}
      />
      )}
      {isShow ? (
        <AlertMessage
          showAlert={showAlert}
          title={title.toLocaleUpperCase()}
          content={content}
          callback={callBackAlert}
        />
      ) : null}
      <Toast ref={refToast} position="bottom" />
      {loadingSdk && <Loading color={loadingSdkColor} />}
    </Fragment>
  )
}
export default Register
