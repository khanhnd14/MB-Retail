import React, { useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Helpers, Colors, Images, Metrics } from '../../theme'
import Text from '../MsbText'
import Icon from '../MsbIcon'
import Topbar from '../Topbar'
import ConfirmButton from '../ConfirmButton'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainLayout: {
    backgroundColor: Colors.primary2,
    width: '100%',
    flex: 1,
    marginTop: Metrics.medium * 5.5,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Helpers.center,
    paddingHorizontal: Metrics.small * 2,
  },
  check: {
    width: Metrics.medium * 8,
    height: Metrics.medium * 8,
    marginTop: -(Metrics.medium * 4.2),
  },
  titleContent: { marginBottom: Metrics.medium * 2 },
  title: { fontSize: 20, color: Colors.white, textAlign: 'center', fontWeight: 'bold' },
  desc: { color: Colors.white, textAlign: 'center', marginTop: Metrics.small },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.medium * 1.5,
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
    ...Helpers.center,
    padding: Metrics.small,
    marginBottom: Metrics.medium * 2.5,
    width: 32.7 * Metrics.small,
  },
  mainBtnText: {
    color: Colors.gray1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 12,
    color: Colors.white,
  },
})

const Success = (props) => {
  const {
    message,
    children,
    route,
    showButton,
    onSave,
    onEmail,
    buttonComfirm,
    hideEmail,
    hideSaveInfo,
    disableLeftIcon,
    textButton,
    messReward,
    onRightPress,
    hideTitle,
    redoTransaction
  } = props
  const { onSwitchTransaction, paramsMessage, hideCongrat } = route.params
  const descReward = typeof messReward === 'object' ? messReward?.wordMessage : messReward;
  useEffect(
    () => () => {
      console.log(props,route.params)
      onSwitchTransaction && onSwitchTransaction()
    },
    []
  )
  const switchTransaction = () => {
    if (redoTransaction) {
      Navigation.replace(redoTransaction)
    } else {
      Navigation.popToPop()
    }
  }

  const save = () => {
    if (onSave) {
      onSave()
    }
  }

  const email = () => {
    if (onEmail) {
      onEmail()
    }
  }

  const renderAnotherButton = () => {
    if (buttonComfirm) {
      return buttonComfirm
    }
    console.log(redoTransaction,onSwitchTransaction);
    
    if (redoTransaction || onSwitchTransaction) {
      return (
        <ConfirmButton
          textColor={Colors.primary2}
          color={Colors.white}
          onPress={() => switchTransaction()}
          text={textButton || I18n.t('application.another_transaction')}
        />
      )
    }
    return null
  }
  console.log('hideTitle:', hideTitle);

  return (
    <>
      <View style={[Helpers.fill, styles.container]}>
        <Topbar
          onRightPress={onRightPress}
          isLogo
          disableLeftIcon={disableLeftIcon}
          background={Colors.white}
        />
        <View style={styles.mainLayout}>
          <Image source={Images.success} resizeMode="contain" style={styles.check} />
          <KeyboardAwareScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
            <View style={styles.titleContent}>
              {/* {!hideCongrat && !hideTitle && (
                <Text style={styles.title}>{I18n.t('application.message_congrat')}</Text>
              )} */}
              <Text style={styles.title}>
                {paramsMessage || message || I18n.t('application.message_success')}
              </Text>
              {!Utils.isStringEmpty(descReward) && <Text style={styles.desc}>{descReward}</Text>}
            </View>
            {children}
            {showButton && (
              <View style={styles.actions}>
                {!hideSaveInfo && (
                  <TouchableOpacity style={styles.actionsBtn} onPress={save}>
                    <Icon name="icon-save" size={26} style={styles.actionsIcon} />
                    <Text style={styles.detail}>{I18n.t('application.save_info')}</Text>
                  </TouchableOpacity>
                )}
                {!hideEmail && (
                  <TouchableOpacity style={styles.actionsBtn} onPress={email}>
                    <Icon name="icon-email" size={26} style={styles.actionsIcon} />
                    <Text style={styles.detail}>{I18n.t('application.send_email')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </KeyboardAwareScrollView>
          {renderAnotherButton()}
        </View>
      </View>
    </>
  )
}

Success.defaultProps = {
  message: null,
  showButton: true,
  hideTitle: false
}

Success.propTypes = {
  message: PropTypes.string,
  showButton: PropTypes.bool,
  onEmail: PropTypes.func,
  onSave: PropTypes.func,
  hideTitle: PropTypes.bool
}

export default Success
