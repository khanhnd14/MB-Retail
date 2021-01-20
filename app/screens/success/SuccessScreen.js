import * as React from 'react'
import {
  View,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { useDispatch } from 'react-redux'
import I18n from 'i18n-js'
import { Helpers, Colors, Metrics } from '../../theme'
import { Text, Success } from '../../components'
import * as Navigation from '../../navigation'

import { productOperations } from '../../state/product'
import { numberWithCommas, getTypeService } from '../../utilities/common'
import { Utils } from '../../utilities'
import SendMailDialog from '../transfer/common/SendMailDialog'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingTop: Metrics.medium + 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    position: 'relative',
    flexDirection: 'row',
    ...Helpers.center,
    width: '100%',
  },
  logo: { width: Metrics.medium * 6 },
  btnHome: { marginRight: Metrics.medium, position: 'absolute', right: 0 },
  btnHomeIcon: { color: Colors.gray1, fontSize: 26 },
  mainLayout: {
    backgroundColor: Colors.primary2,
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Helpers.center,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.medium,
    height: Utils.getWindowHeight() / 1.5
  },
  check: {
    width: Metrics.medium * 6,
    marginTop: -(Metrics.medium * 4),
  },
  titleContent: { marginBottom: Metrics.medium },
  title: { fontWeight: 'bold', fontSize: 24, color: Colors.white, textAlign: 'center' },
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: { fontWeight: 'bold', fontSize: 14, color: Colors.white, textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.medium,
  },
  actionsBtn: {
    alignItems: 'center',
    marginHorizontal: Metrics.medium + 10,
  },
  actionsIcon: {
    color: Colors.white,
    fontSize: 36,
    marginBottom: Metrics.tiny,
  },
  mainBtn: {
    backgroundColor: Colors.white,
    borderRadius: 38,
    marginTop: Metrics.medium,
    ...Helpers.fullWidth,
    ...Helpers.center,
    padding: Metrics.small,
  },
  mainBtnText: {
    color: Colors.gray1,
    fontSize: 18,
    fontWeight: 'bold',
  },
})

const SuccessScreen = (props) => {
  const { route } = props
  const { amount, customerInfo, titleServices, typeService, hideSaveInfo, hideEmail, typeModule } = route.params
  const titleService = getTypeService(typeService)
  const { redoTransaction, content, onSwitchTransaction, tokenTransaction, disableLeftIcon, textButton, messReward } = route.params
  const [isSendEmail, setSendEmail] = React.useState(false)

  const dispatch = useDispatch()
  const resetStore = () => {
    dispatch(productOperations.setProduct())
  }

  React.useEffect(() => {
    resetStore()
  }, [])

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
      resetStore()
    })
  }, [])
  const onSaveBenefit = () => {

  }

  const onSendEmail = (email) => {
    const body = {
      tokenTransaction,
      email
    }
    typeModule === 'BP' && dispatch(productOperations.paymentSendEmail(body))
    typeModule === 'RG' && dispatch(productOperations.rechargeSendEmail(body))
  }

  React.useEffect(() => () => {
    onSwitchTransaction && onSwitchTransaction()
  }, [])

  return (
    <>
      <Success
        {...props}
        onEmail={() => setSendEmail(true)}
        hideEmail={hideEmail}
        hideSaveInfo={hideSaveInfo}
        redoTransaction={redoTransaction}
        message={content}
        onSave={onSaveBenefit}
        disableLeftIcon={disableLeftIcon}
        textButton={textButton}
        messReward={messReward}
      >
        <View style={styles.detailContent}>
          <Text style={styles.detail}>{I18n.t('product.amount')}</Text>
          <Text style={styles.detail}>{`${numberWithCommas(amount)} VND`}</Text>
        </View>
        <View style={styles.detailContent}>
          <Text style={styles.detail}>{titleService}</Text>
          <Text style={styles.detail}>{customerInfo}</Text>
        </View>
        <View style={styles.detailContent}>
          <Text style={styles.detail}>Loại hình dịch vụ</Text>
          <Text style={styles.detail}>{titleServices}</Text>
        </View>
      </Success>
      <SendMailDialog
        visible={isSendEmail}
        handleModal={() => setSendEmail(false)}
        tokenTransaction={tokenTransaction}
        onSendEmail={onSendEmail}
      />
    </>
  )
}

export default SuccessScreen
