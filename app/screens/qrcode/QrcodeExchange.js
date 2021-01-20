/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors, Metrics, Helpers } from '../../theme'
import { Topbar, HeaderTop, SelectAccount, ConfirmButton } from '../../components'
import { accountOperations } from '../../state/account'
import FieldsInfo from './FieldsInfo'
import { Utils } from '../../utilities'
import { qrcodeOperations } from '../../state/qrcode'
import * as types from '../../state/qrcode/types'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
  },
})

const QrcodeExchange = ({ route }) => {
  const { accountPayment } = useSelector((state) => state.account)
  const [selectedAcc, setSelectedAcc] = useState('')
  const [amountPayment, setAmountPayment] = useState('')
  const [discount, setAmountDiscount] = useState('')
  const [code, onChangeCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { parseQrCodeResult, promotionCodeResult, promotionCodeError, sendOtpResult, sendOtpError, completeRechargeResult } = useSelector((state) => state.qrcode)
  const { stringQR } = route.params

  const dispatch = useDispatch()
  const changeFromAccount = (acctNo) => {
    console.log('====================================');
    console.log(acctNo);
    console.log('====================================');
    setSelectedAcc(acctNo)
  }

  const getJsonQr = (inforPayment) => {
    var infoPaymentQr = JSON.parse(JSON.stringify(inforPayment));
    delete infoPaymentQr.type;
    infoPaymentQr.item = infoPaymentQr.items;
    delete infoPaymentQr.items;
    delete infoPaymentQr.account;
    delete infoPaymentQr.transaction;
    infoPaymentQr.payCode = '';
    infoPaymentQr.item.forEach((element) => {
        delete element.infoView;
        element.quantity = `${element.quantity}`;
    });
    return JSON.stringify(infoPaymentQr);
  }

  const checkPromotioncode = () => {
    const { inforPayment } = route.params

    if (!code) {
      return
    }
    const jsonQr = getJsonQr(inforPayment)
    console.log('====================================');
    console.log('inforPayment', inforPayment, jsonQr);
    console.log('====================================');
    const body = {
      serviceCode: inforPayment.items[0].infoView.serviceCode,
      code,
      amount: Utils.clearFormatAmount(amountPayment),
      merchantId: inforPayment.items[0].infoView.merchantId,
      jsonQr,
    }
    console.log('====================================');
    console.log(body);
    console.log('====================================');
    setLoading(true)
    dispatch(qrcodeOperations.checkPromotioncode(body))
  }

  const onConfirm = () => {
    const { inforPayment } = route.params

    const jsonQr = getJsonQr(inforPayment)

    const param = {
      rolloutAccountNo: selectedAcc,
      serviceId: parseQrCodeResult.serviceCode,
      amount: Utils.clearFormatAmount(amountPayment),
      contractNo: parseQrCodeResult.billOrProductId || parseQrCodeResult.merchantId,
      tranDate: Utils.toStringServerDate(new Date()),
      isSchedule: false,
      tranLimit: 0,
      code,
      merchantId: parseQrCodeResult.merchantId,
      jsonQr,
    };

    console.log('====================================');
    console.log(param);
    console.log('====================================');
    setLoading(true)
    dispatch(qrcodeOperations.sendOTPQrCode(param))
  }

  const onReScan = () => {
    // Navigation.pop()
  }

  useEffect(() => {
    dispatch(accountOperations.getAcountList())
  }, [])

  useEffect(() => {
    if (promotionCodeResult) {
      setLoading(false)
    }
  }, [promotionCodeResult])

  useEffect(() => {
    if (promotionCodeError) {
      setLoading(false)
    }
  }, [promotionCodeError])

  useEffect(() => {
    if (sendOtpResult) {
      const qrInfo = {
        infoView: parseQrCodeResult,
        qrInfor: stringQR,
        quantity: 1,
        note: '',
      };
      const inforPayment = {
        type: parseQrCodeResult.qrType,
        payType: parseQrCodeResult.payType,
        items: [qrInfo],
      };
      const jsonQr = getJsonQr(inforPayment)
      const { isTrust } = sendOtpResult
      if (!isTrust) {
        setLoading(false)
        Navigation.push('QrcodeVerify', { jsonQr, amount: Utils.clearFormatAmount(amountPayment), discount })
      } else {
        const param = {
          tokenTransaction: sendOtpResult.tokenTransaction,
          sessionId: '',
          otpInput: '',
          payContentdtl: jsonQr,
          merchantId: parseQrCodeResult.merchantId,
          addinfo: parseQrCodeResult.addinfo || '',
          qrType: parseQrCodeResult.qrType,
          merchantName: parseQrCodeResult.merchantName,
          billNo: parseQrCodeResult.billOrProductId || '',
          tag62: parseQrCodeResult.tag62 || '',
        }
        dispatch(qrcodeOperations.completeQrcodeRecharge(param))
      }
    }
  }, [sendOtpResult])

  useEffect(() => {
    if (completeRechargeResult) {
      dispatch(qrcodeOperations.reset())
      Navigation.popToPop()
      Navigation.push('QrcodeSuccess', {
        ...completeRechargeResult.data,
        payment: discount || amountPayment,
        service: parseQrCodeResult.purpose,
        merchant: parseQrCodeResult.merchantName,
        redoTransaction: 'ScanQrScreen',
      })
      setLoading(false)
    }
  }, [completeRechargeResult])

  useEffect(() => {
    if (sendOtpError) {
      setLoading(false)
    }
  }, [sendOtpError])

  // unmount
  useEffect(() => () => {
    dispatch([
      {
        type: types.PARSE_QRCODE_COMPLETED,
        payload: null
      },
      {
        type: types.PARSE_QRCODE_FAILED,
        payload: null
      },
      {
        type: types.CHECK_PROMOTION_CODE_COMPLETED,
        payload: null
      },
      {
        type: types.CHECK_PROMOTION_CODE_FAILED,
        payload: null
      }
    ])
  }, [])
  return (
    <View style={styles.container}>
      <Topbar title={I18n.t('qrcode.title')} />
      <HeaderTop title={I18n.t('qrcode.exchange_info')} />
      <KeyboardAwareScrollView
        style={[Helpers.fullWidth, styles.scrollView]}
        extraHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <SelectAccount onSelectRolloutAccountNo={changeFromAccount} data={accountPayment} />
        <FieldsInfo
          setAmountPayment={setAmountPayment}
          setAmountDiscount={setAmountDiscount}
          onChangeCode={onChangeCode}
          checkPromotioncode={checkPromotioncode}
        />
        <TouchableOpacity
          style={{
          padding: Metrics.normal
        }}
          onPress={onReScan}
        >
          {/* <Text>Re Scan</Text> */}
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <ConfirmButton disabled={loading} onPress={onConfirm} loading={loading} />

    </View>
    )
}
export default QrcodeExchange
