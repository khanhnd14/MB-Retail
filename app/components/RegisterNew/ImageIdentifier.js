/* eslint-disable default-case */
/* eslint-disable no-duplicate-case */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react'
import { StyleSheet, View, Image, Platform, Linking } from 'react-native'
import RNTrustVisionRnsdkFramework, {
  TVConst, TVErrorCode,
} from 'react-native-trust-vision-SDK';
import { useSelector, useDispatch } from 'react-redux';
import I18n from 'i18n-js'
import _ from 'lodash'
import { Images, Metrics, Colors } from '../../theme'
import * as ekycOperation from '../../state/ekyc/operations'
import { Text } from '..';
import { ekycOperations } from '../../state/ekyc';
import { Config, ConfigJupiter } from './config';
import * as AppConfig from '../../config';
import { Utils } from '../../utilities';

const styles = StyleSheet.create({
  view1: {
    backgroundColor: Colors.white,
    marginBottom: Metrics.tiny * 2,
    marginHorizontal: Metrics.tiny * 2,
    paddingVertical: Metrics.tiny * 2,
    borderRadius: Metrics.tiny

  },
  image: {
    height: 80,
  },
  content: {
    alignItems: 'flex-start'
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny * 4,
    alignSelf: 'center',
    fontSize: 12
  },
  line: {
    flexDirection: 'row',
    paddingVertical: Metrics.tiny,
    paddingHorizontal: Metrics.normal * 2
  },
  text: {
    fontSize: 12,
    color: Colors.black1,
    flex: 9.5 / 10,
  },
})

// Định nghĩa tên log func
const FRONT_FUNC = 'FRON'
const BACK_FUNC = 'BACK'
const SELF_FUNC = 'SELF'
const MATCH_FUNC = 'MATC'

const ImageIdentifier = forwardRef(({ showAlert, phone, toastAlert, setLoading }, ref) => {
  let logContent = ''
  const configSDK = new Config()
  const configJupiter = new ConfigJupiter()
  const [cardTypes, setCardTypes] = useState(false)
  const [frontCardImage, setFrontCardImage] = useState(null)
  const [backCardImage, setBackCardImage] = useState(null)
  const [selfieImage, setSelfieImage] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const { dataOtpVerified, resultSaveLog, resultTsToken } = useSelector((state) => state.ekyc)
  const infoFrontCard = useMemo(() => {
    const obj = {}
    if (frontCardImage) {
      frontCardImage?.cardInfoResult?.infos.map((value, index) =>
        obj[value.field] = {
          value: value.value,
          confidenceScore: value.confidenceScore,
          confidenceVerdict: value.confidenceVerdict,
        }
      )
    }
    return obj
  }, [frontCardImage])
  const dispatch = useDispatch()

  const openSetting = () => {
    Linking.openURL('app-settings:')
  }

  const checkErrorException = (error) => {
    console.log('Error Exception: ', error.code, ' - ', error.message);
    const errorMessage = _.get(configSDK.MSB_VERDICT, error.code)// returns message error
    let messageJupiter = _.get(configJupiter.MSB_VERDICT, error.code)

    if (errorMessage) {
      switch (error.code) {
        case TVErrorCode.CANCELATION_ERROR: case 'permission_missing_error':
          setLoading(false)
          if (Platform.OS === 'ios' && error.code === 'permission_missing_error') {
            Utils.confirm(I18n.t('ekyc.alert'), 'Vui lòng cho phép ứng dụng quyền truy cập camera.', openSetting)
          }
          break;
        default:
          showErrorCard(error, `${error.code} ${errorMessage}`, messageJupiter)
          break;
      }
    } else {
      messageJupiter = configJupiter.MSB_VERDICT.system_error
      showErrorCard(error, `${error.code} ${I18n.t('ekyc.sdk_error.system_error')}`, messageJupiter)
    }
  }

  const checkErrorIdSanity = (error, funcName) => {
    if (error) {
      const { code, message } = error
      console.log('====================================');
      console.log(code, message);
      console.log('====================================');

      const errorMessage = _.get(configSDK.SANITY_ID_ERROR, code)// returns message error
      const messageJupiter = _.get(configJupiter.SANITY_ID_ERROR, code)

      if (errorMessage) {
        showErrorCard(error, errorMessage, messageJupiter, funcName)
      } else {
        checkErrorSelfiePortraitSanity(error)
      }
    }
  }

  const checkErrorTampering = (error) => {
    if (error) {
      const { code, message } = error
      console.log('====================================');
      console.log(code, message);
      console.log('====================================');

      const errorMessage = _.get(configSDK.TAMPERING_ERROR, code)// returns message error
      const messageJupiter = _.get(configJupiter.TAMPERING_ERROR, code)

      if (errorMessage) {
        showErrorCard(error, errorMessage, messageJupiter, SELF_FUNC)
      } else {
        checkErrorException(error)
      }
    }
  }

  const checkErrorSelfiePortraitSanity = (error) => {
    if (error) {
      const { code, message } = error
      console.log('====================================');
      console.log(code, message);
      console.log('====================================');
      const errorMessage = _.get(configSDK.SELFIE_PORTRAIT_SANITY_ERROR, code)// returns message error
      const messageJupiter = _.get(configJupiter.SELFIE_PORTRAIT_SANITY_ERROR, code)

      if (errorMessage) {
        showErrorCard(error, errorMessage, messageJupiter, SELF_FUNC)
      } else {
        checkErrorTampering(error)
      }
    }
  }

  const saveLog = (code, message) => {
    const { token } = dataOtpVerified
    dispatch(ekycOperation.saveLogError(token, code, message, phone, logContent))
  }

  const saveLogRequest = (code, message, funcName, requestId = 'null') => {
    const { token, xRequest } = dataOtpVerified
    const phoneNumber = `${phone}|${requestId}|${xRequest}`
    dispatch(ekycOperation.saveLogError(token, `${funcName}|${code}`, message, phoneNumber, logContent))
  }

  const showErrorCard = (error, message, messageJupiter, funcName = '') => {
    console.log('====================================');
    console.log('error', error);
    console.log('====================================');
    const callback = submit

    setLoading(false)
    setError(null)
    setErrorMessage(null)
    // showAlert(true, I18n.t('ekyc.alert'), `${error.code} ${message}`, () => callback)
    showAlert(true, I18n.t('ekyc.alert'), `${message}`, () => callback)

    // saveLog(error.code, messageJupiter)
    saveLogRequest(error.code, messageJupiter, funcName, 'null')
  }

  const getError = (error) => {
    const err = new Error(error);
    err.code = error
    return err
  }

  // save log nhưng ko lấy image base 64
  const dispatchLogContent = (result, image, funcName) => {
    const temp = { ...result }
    console.log('dispatchLogContent:', image, result);
    const { cardInfoResult, livenessResult } = result
    const { requestId } = cardInfoResult || livenessResult || {}
    delete temp[image]
    logContent = JSON.stringify(temp)
    // saveLog('', '')
    saveLogRequest('', '', funcName, requestId)
  }

  const checkIsGood = (result) => {
    if (!result.idSanityResult?.isGood) {
      const error = getError(result.idSanityResult.error)
      throw error
    } else if (!result.idTamperingResult?.isGood) {
      const error = getError(result.idTamperingResult.error)
      throw error
    }
  }

  const selfieCapturing = async () => {
    try {
      const config = {
        cameraOption: TVConst.SelfieCameraMode.FRONT,
        isEnableSound: true,
        isEnableSanityCheck: true,
        livenessMode: TVConst.LivenessMode.HYBRID,
        skipConfirmScreen: true,
      };
      logContent = 'startSelfieCapturing'
      const result = await RNTrustVisionRnsdkFramework.startSelfieCapturing(
        config,
      );
      console.log('=============startSelfieCapturing=======================');
      console.log(result);
      console.log('====================================');
      if (!result?.selfieSanityResult?.isGood) {
        const error = getError(result.selfieSanityResult.error)
        throw error
      } else if ((result?.livenessResult) && !result?.livenessResult?.isLive) {
        const error = getError(result.livenessResult.verdict)
        throw error
      }
      const selfieImage = { ...result }
      setSelfieImage(selfieImage)
    } catch (error) {
      logContent = 'startSelfieCapturing'
      checkErrorSelfiePortraitSanity(error)
    }
  }

  const onCapturingFrontCard = async () => {
    try {
      const config = {
        cardType: cardTypes[0],
        cardSide: TVConst.CardSide.FRONT,
        isEnableSound: true,
        isEnableSanityCheck: true,
        isReadBothSide: false,
        isEnableDetectingIdCardTampering: true,
        idTamperingLevel: '1',
        skipConfirmScreen: true,
        idCaptureOnlyMode: false,
      };
      setLoading(true)
      const result = await RNTrustVisionRnsdkFramework.startIdCapturing(config);
      console.log('===============startIdCapturing sss=====================');
      console.log(result);
      console.log('====================================');

      checkIsGood(result)

      const frontImage = { ...result }
      setFrontCardImage(frontImage)
    } catch (error) {
      logContent = 'startIdCapturing'
      console.log('errorerrorerror:', error);
      checkErrorIdSanity(error, FRONT_FUNC)
    }
  };

  const onCapturingBackCard = async () => {
    try {
      const config = {
        cardType: cardTypes[0],
        cardSide: TVConst.CardSide.BACK,
        isEnableSound: true,
        isEnableSanityCheck: true,
        isReadBothSide: false,
        isEnableDetectingIdCardTampering: true,
        idTamperingLevel: '2',
        skipConfirmScreen: true,
        idCaptureOnlyMode: infoFrontCard?.card_type?.value === 'vn.passport',
      };

      const result = await RNTrustVisionRnsdkFramework.startIdCapturing(config);
      console.log('====================================');
      console.log(result);
      console.log('====================================');

      checkIsGood(result)

      const backImage = { ...result }
      setBackCardImage(backImage)
    } catch (error) {
      console.log('====================================');
      console.log('error');
      console.log('====================================');
      logContent = 'startIdCapturing'
      if (error?.code === 'card_expired') {
        reActiveSDK()
        setError(error?.code)
        return
      }
      checkErrorIdSanity(error, BACK_FUNC)
    }
  }

  const refreshTokenSDK = () => {
    const { exprireAt } = resultTsToken
    console.log('====================================');
    console.log(new Date(exprireAt));
    console.log('====================================');
    if (new Date(exprireAt) < new Date()) {
      const { token } = dataOtpVerified
      dispatch(ekycOperations.getTSToken(token))
    }
  }

  const reActiveSDK = () => {
    setFrontCardImage(null)
    setBackCardImage(null)
    setSelfieImage(null)
    refreshTokenSDK()
  }

  const checkMatch = async () => {
    try {
    console.log('=================checkMatch===================');
    console.log(frontCardImage, selfieImage);
    console.log('====================================');
    const result = await RNTrustVisionRnsdkFramework.matchFace(selfieImage.selfieImageId, frontCardImage.idFrontImageId);
    console.log('==================match face==================');
    console.log(result);
    console.log('====================================');
    logContent = JSON.stringify(result)
    if (Platform.OS === 'android') {
      if ((result.faceCompareResult.score * 100 < 50) || result.faceCompareResult.matchResult.toLocaleUpperCase() !== 'matched'.toLocaleUpperCase()) {
        // showAlert(true, I18n.t('ekyc.alert'), I18n.t('ekyc.sdk_error.matched_low'), () => selfieCapturing)
        setError(result.faceCompareResult.matchResult)
        setErrorMessage(I18n.t('ekyc.sdk_error.matched_low'))
        setSelfieImage(null)
        saveLogRequest(result.faceCompareResult.matchResult, _.get(configJupiter.SELFIE_PORTRAIT_SANITY_ERROR, result.faceCompareResult.matchResult), MATCH_FUNC)
        return
      }
      // toastAlert(`${result.faceCompareResult.matchResult} ${(result.faceCompareResult.score * 100).toFixed(1)}%`)
    } else {
      // eslint-disable-next-line no-lonely-if
      if ((result.score * 100 < 50) || result.matchResult.toLocaleUpperCase() !== 'matched'.toLocaleUpperCase()) {
        setError(result.matchResult)
        setErrorMessage(I18n.t('ekyc.sdk_error.matched_low'))
        setSelfieImage(null)
        saveLogRequest(result.matchResult, _.get(configJupiter.SELFIE_PORTRAIT_SANITY_ERROR, result.matchResult), MATCH_FUNC)
        return
      }
      // toastAlert(`${result.matchResult} ${(result.score * 100).toFixed(1)}%`)
    }
    setMatchResult(result)

    const { requestId } = result || {}
    saveLogRequest('', '', MATCH_FUNC, requestId)
    } catch (error) {
      logContent = 'matchFace'
      const errorMessage =
      _.get(configSDK.MSB_VERDICT, error.code,
        _.get(configSDK.SELFIE_PORTRAIT_SANITY_ERROR, error.code,
          _.get(configSDK.SANITY_ID_ERROR, error.code,
            _.get(configSDK.TAMPERING_ERROR, error.code, ''))))// returns message error
      const messageJupiter =
      _.get(configJupiter.MSB_VERDICT, error.code,
        _.get(configJupiter.SELFIE_PORTRAIT_SANITY_ERROR, error.code,
          _.get(configJupiter.SANITY_ID_ERROR, error.code,
            _.get(configJupiter.TAMPERING_ERROR, error.code, ''))))// returns message error
      setError(error.code)
      setErrorMessage(errorMessage)
      setSelfieImage(null)
      saveLogRequest(error.code, messageJupiter, MATCH_FUNC)
    }
  }

  const submit = async () => {
   // Full flow
    if (!cardTypes) {
      console.log('====================================');
      console.log('initing');
      console.log('====================================');
      toastAlert(I18n.t('ekyc.wait_send_otp'), 3000)
      return
    }
      try {
        console.log('====================================');
        console.log(infoFrontCard, frontCardImage, backCardImage);
        console.log('====================================');
        refreshTokenSDK()
        setLoading(true)

        !frontCardImage && onCapturingFrontCard()
        frontCardImage && !backCardImage && onCapturingBackCard()
        frontCardImage && backCardImage && !selfieImage && selfieCapturing()
      } catch (error) {
        console.log('====================================');
        console.log('error', error);
        console.log('====================================');
        checkErrorException(error)
      }
  }

  useEffect(() => {
    async function init() {
      try {
      // You can await here
      // await RNTrustVisionRnsdkFramework.initialize(
      //   '263b4c04-1fb6-4f65-b23e-89e33a1d8304',
      //   'BGyP6JGGCkQC4sMj1T9PI0r7hJkdaVwo',
      //   true,
      // );
      await RNTrustVisionRnsdkFramework.initialize(
        resultTsToken?.accessKey,
        resultTsToken?.secret,
        AppConfig.Config.URL_TRUSTING,
        dataOtpVerified?.xRequest,
        true,
      );
      const cardTypes = await RNTrustVisionRnsdkFramework.getCardTypes();
      setCardTypes(cardTypes)
      console.log('Card type list', cardTypes);
      } catch (error) {
        logContent = 'getCardTypes'
        checkErrorException(error)
      }
    }
    init();

    function destroy() {
      console.log('====================================');
      console.log('destroy');
      console.log('====================================');
    }
    return destroy
  }, [resultTsToken])

  // useEffect(() => {
  //   if (resultTsToken) {
  //     // check nếu token hết hạn thì call api lấy token mới
  //     refreshTokenSDK()
  //   }
  // }, [resultTsToken])

  useEffect(() => {
    if (!frontCardImage && error) {
      logContent = 'startIdCapturing'
      if (error === 'card_expired') {
        showErrorCard({ code: error }, `${I18n.t('ekyc.sdk_error.card_expired')}`, _.get(configJupiter.TAMPERING_ERROR, error))
      } else {
        showErrorCard({ code: error }, `${I18n.t('ekyc.sdk_error.photo_tampered')}`, I18n.t('ekyc.sdk_error.photo_tampered'))
      }
    }
  }, [frontCardImage, error])

  useEffect(() => {
    if (frontCardImage) {
      console.log('====================================');
      console.log('infoFrontCard', infoFrontCard);
      console.log('====================================');
      // nếu chụp số cmt có vẻ sai
      if (infoFrontCard?.id?.confidenceVerdict.toLocaleLowerCase() === 'unsure') {
        setFrontCardImage(null)
        setError(infoFrontCard?.id?.confidenceVerdict)
      // nếu chụp không phải mặt trước
      } else if (infoFrontCard?.card_label.value === `${infoFrontCard?.card_type?.value}.back`) {
        setFrontCardImage(null)
        setError(`${infoFrontCard?.card_type?.value}.back`)
      } else {
        dispatchLogContent(frontCardImage, 'idFrontImage', FRONT_FUNC)

        onCapturingBackCard()
      }

      // nếu chụp hết hạn passport
      // if (infoFrontCard?.expiry_date && (Utils.toDateObject(infoFrontCard?.expiry_date?.value) < new Date())) {
      //   setLoading(false)
      //   showAlert(true, I18n.t('ekyc.alert'), I18n.t('ekyc.sdk_error.card_expired'))
      //   setFrontCardImage(null)
      //   return
      // }
    }
  }, [frontCardImage])

  useEffect(() => {
    if (backCardImage) {
      dispatchLogContent(backCardImage, 'idBackImage', BACK_FUNC)
      selfieCapturing()
    }
  }, [backCardImage])

  useEffect(() => {
    if (selfieImage && !error) {
      dispatchLogContent(selfieImage, 'selfieImage', SELF_FUNC)
      checkMatch()
    } else if (error && errorMessage) {
      setLoading(false)
      showAlert(true, I18n.t('ekyc.alert'), errorMessage, () => selfieCapturing)
    }
  }, [selfieImage, error, errorMessage])

  useEffect(() => {
    if (matchResult) {
      const resultEkycSdk = { frontCardImage, backCardImage, selfieImage }
      console.log('====================================');
      console.log(resultEkycSdk);
      console.log('====================================');
      dispatch(ekycOperation.getResultEkycSdk(resultEkycSdk))
      submitRequestId()
    }
  }, [matchResult])

  useImperativeHandle(ref, () => ({
    submit
  }));

  // Update requestId của các ảnh
  const submitRequestId = () => {
    if (frontCardImage && backCardImage && selfieImage && matchResult) {
      const requestIdFront = frontCardImage.cardInfoResult?.requestId
      const requestIdBack = backCardImage.cardInfoResult?.requestId
      const requestIdSelfie = selfieImage.livenessResult?.requestId
      const requestIdMatch = matchResult?.requestId
      dispatch(ekycOperation.updateRequestId(`${requestIdFront}|${requestIdBack}|${requestIdSelfie}|${requestIdMatch}`))
    }
  }

  return (
    <>
      <View style={styles.view1}>
        <View style={styles.image}>
          <Image style={{ width: '100%', height: '100%', resizeMode: 'contain', }} source={Images.ekyc_identifier} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{I18n.t('ekyc.step1').toLocaleUpperCase()}</Text>
          <View style={styles.line}>
            <Text style={{ color: Colors.primary2, flex: 0.5 / 10 }}>•</Text>
            <Text style={styles.text}>{I18n.t('ekyc.step1_1')}</Text>
          </View>
          <View style={styles.line}>
            <Text style={{ color: Colors.primary2, flex: 0.5 / 10 }}>•</Text>
            <Text style={styles.text}>{I18n.t('ekyc.step1_2')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.view1}>
        <View style={styles.image}>
          <Image style={{ width: '100%', height: '100%', resizeMode: 'contain', }} source={Images.ekyc_face} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{I18n.t('ekyc.step2').toLocaleUpperCase()}</Text>
          <View style={styles.line}>
            <Text style={{ color: Colors.primary2, flex: 0.5 / 10 }}>•</Text>
            <Text style={styles.text}>{I18n.t('ekyc.step2_1')}</Text>
          </View>
          <View style={styles.line}>
            <Text style={{ color: Colors.primary2, flex: 0.5 / 10 }}>•</Text>
            <Text style={styles.text}>{I18n.t('ekyc.step2_2')}</Text>
          </View>
        </View>
      </View>
    </>
  )
})

export default ImageIdentifier
