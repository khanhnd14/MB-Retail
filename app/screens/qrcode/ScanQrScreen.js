/* eslint-disable no-lonely-if */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment, useRef } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, Text, QRCodeScanner } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { qrcodeOperations } from '../../state/qrcode'
import QrcodeOptions from './QrcodeOptions'
import ScanPicture from './ScanPicture'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  desc: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Metrics.medium,
    textAlign: 'center',
    marginHorizontal: Metrics.medium * 2,
  },
  rectangle: {
    height: Metrics.small * 30,
    width: Metrics.small * 30,
    marginTop: Platform.OS === 'android' ? Metrics.normal * 5 : Metrics.small * 3.4,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: 'transparent',
  },
})
const ScanQrScreen = ({ navigation }) => {
  const { activeCode } = useSelector((state) => state.user)
  const { parseQrCodeResult, parseQrCodeError } = useSelector((state) => state.qrcode)

  const dispatch = useDispatch()
  const [indexTab, setIndexTab] = useState(0)
  const [stringQR, setQrString] = useState('')
  const [reactivate, setReactivate] = useState(false)
  const [inforPayment, setInforPayment] = useState(null)
  const cameraRef = useRef(null)

  const onBarCodeRead = (e) => {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    parseQrData(e.data)
  }

  const parseQrData = (qrData) => {
    const body = {
      qrData,
      activeCode
    }
    dispatch(qrcodeOperations.parseQrData(body))
    setQrString(qrData)
  }

  const saveAndNext = (info) => {
    if (!inforPayment) {
      setInforPayment(info)
    } else {
      const oldInforPayment = info;
      // check xem co dc scan tiep ko, chi co san pham moi dc scan tiep
      if (!oldInforPayment.scanNext) {
        setInforPayment(info)
      } else {
        if (oldInforPayment.qrType === 'QRSANPHAM') {
          // check QR SP
        } else {
          // CHECK QR KHAC
        }
      }
    }
  }

  useEffect(() => {
    if (inforPayment) {
      Navigation.push('QrcodeExchange', { stringQR, inforPayment })
    }
  }, [inforPayment])

  useEffect(() => {
    console.log('====================================');
    console.log(parseQrCodeResult, inforPayment);
    console.log('====================================');

    if (parseQrCodeResult) {
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
      saveAndNext(inforPayment)
    }
  }, [parseQrCodeResult])

  useEffect(() => {
    if (parseQrCodeError) {
      setTimeout(() => {
        cameraRef.current && cameraRef.current.reactivate()
      }, 3000);
    }
  }, [parseQrCodeError])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      cameraRef.current && cameraRef.current.reactivate()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <Fragment>
      <Topbar title="QRCode" isBottomSubLayout background={Colors.white} />
      {indexTab === 0 && (
      <View style={[Helpers.fillColCross, styles.container]}>
        <Text style={styles.desc}>{I18n.t('softtoken.desc_qr')}</Text>
        <View style={{ flex: 1 }}>
          <QRCodeScanner
            cameraStyle={styles.rectangle}
            onRead={(e) => onBarCodeRead(e)}
            fadeIn
            reactivate={reactivate}
            reactivateTimeout={3000}
            ref={cameraRef}
          />
        </View>

      </View>
      )}
      {indexTab === 1 && (
      <View style={[Helpers.fillColCross, styles.container]}>
        <ScanPicture setIndexTab={setIndexTab} parseQrData={parseQrData} />
      </View>
      )}
      <QrcodeOptions index={indexTab} setIndexTab={setIndexTab} />
    </Fragment>
  )
}

export default ScanQrScreen
