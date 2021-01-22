/* eslint-disable no-undef */
import React, { useEffect, useState, useRef, createRef } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import EventEmitter from 'react-native-eventemitter'
import TouchID from 'react-native-touch-id'
import DeviceInfo from 'react-native-device-info'
import Communications from 'react-native-communications'
import ImagePicker from 'react-native-image-crop-picker'
import ItemSetting from './ItemSetting'
import { Text, Avatar } from '../../components'
import { Metrics, Helpers, Colors, Images, ApplicationStyles } from '../../theme'
import { Config } from '../../config'
import I18n from '../../translations'
import { appOperations, appTypes } from '../../state/application'
import * as Navigation from '../../navigation'
import { settingOperations } from '../../state/setting'
import { userOperations } from '../../state/user'
import { storeService } from '../../services'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  title: {
    paddingVertical: Metrics.tiny,
    paddingHorizontal: Metrics.small * 1.8,
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  avatar: {
    width: 68,
    height: 68,
    backgroundColor: Colors.gray,
    borderRadius: 68 / 2,
  },
  nameUser: {
    color: '#14203F',
  },
  idUser: {
    fontSize: 18,
    color: '#14203F',
    fontWeight: 'bold',
  },
  buttonLogout: {
    borderRadius: 15,
    backgroundColor: Colors.primary2,
    marginLeft: Metrics.medium * 3,
    alignItems: 'center',
    paddingVertical: Metrics.tiny,
    paddingHorizontal: Metrics.medium,
  },
  textLogout: {
    color: Colors.white,
  },
})

const SettingScreen = () => {
  const avatarRef = useRef(null)
  const user = useSelector((state) => state.user)
  const { fullName, securityTypeMB, loginSecurityType, isOpenSMS } = user || {}
  const { otpVerifyComplete, otpVerifyError } = useSelector((state) => state.setting)
  const { isTimeout } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(false)
  const { language } = useSelector((state) => state.application)
  const languageIcon = language === appTypes.LANGUAGE_CODE.VI ? Images.uk : Images.vn
  const version = DeviceInfo.getVersion()

  const dispatch = useDispatch()

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.push('SettingVerifyOTP')
    }
  }, [otpVerifyComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [otpVerifyError])

  const textLogin = isTimeout ? I18n.t('action.action_login') : I18n.t('action.action_logout')

  const switchAccount = () => {
    EventEmitter.emit(Config.EVENT_NAMES.user_reactive)
  }
  const signInandOut = () => {
    if (isTimeout) {
      if (loginSecurityType === appTypes.SECURITY_TYPE.PIN) {
        Navigation.push('AuthByPin')
      } else {
        Navigation.push('AuthScreen')
      }
    } else {
      dispatch(appOperations.logout())
      EventEmitter.emit(Config.EVENT_NAMES.user_home)
      Utils.showToast(I18n.t('application.logout_success'))
    }
  }

  const signIn = () => {
    if (loginSecurityType === appTypes.SECURITY_TYPE.PIN) {
      Navigation.push('AuthByPin')
    } else {
      Navigation.push('AuthScreen')
    }
  }

  const uploadAvatar = (image) => {
    const body = new FormData()
    body.append('fileData', { uri: image.path, name: 'image.jpg', type: 'image/jpg' })
    dispatch(userOperations.updateAvatar(body))
    dispatch(userOperations.updateLocalAvatar(image.path))
  }

  const getCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      avatarRef && avatarRef.current?.onClose()
      uploadAvatar(image)
    })
  }

  const getGalery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      avatarRef && avatarRef.current?.onClose()
      uploadAvatar(image)
    })
  }

  const changeLimit = () => {
    Navigation.push('ChangeLimit')
  }

  const changeAcount = () => {
    Navigation.push('ChangeAccount')
  }

  const changePass = () => {
    Navigation.push('ChangePassScreen')
  }

  const changePin = () => {
    storeService.getPinCode().then((pin) => {
      if (pin) {
        Navigation.push('ChangePinScreen')
      } else {
        Navigation.push('SetupPinScreen')
      }
    })
  }
  const employee = () => {
    Navigation.push('EmployeeScreen')
  }
  const overdraft = () => {
    Navigation.push('OverDraftScreen')
  }
  const openCard = () => {
    Navigation.push('OpenCardScreen')
  }

  const onMessage = () => {
    Navigation.push('MessageScreen')
  }

  // Verify transactions

  const changeVerify = (sType) => {
    Navigation.push('ChangeVerifyTransaction', { type: sType })
  }

  const turnOnSOVerify = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_verify_so'), () => {
        storeService.getSoftTokenKey().then((key) => {
          if (key) {
            changeVerify(appTypes.SECURITY_TYPE.SOFT_TOKEN)
          } else {
            Navigation.push('SoftTokenScreen')
          }
        })
      })
    }
  }

  const turnOffSOVerify = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_verify_sm'), () => {
        changeVerify(appTypes.SECURITY_TYPE.OTP)
      })
    }
  }

  const turnOnFPVerify = () => {
    if (isTimeout) {
      signIn()
    } else if (loginSecurityType === appTypes.SECURITY_TYPE.FP) {
      Utils.toast(I18n.t('setting.registedBioLogin'))
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_verify_fp'), () => {
        TouchID.isSupported()
          .then(() => {
            TouchID.authenticate('', {})
              .then(() => {
                setLoading(true)
                dispatch(settingOperations.sendOtpVerify())
              })
              .catch((e) => {
                Utils.bioError(e)
              })
          })
          .catch((e) => {
            Utils.bioError(e)
          })
      })
    }
  }
  const turnOffFPVerify = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_verify_sm'), () => {
        changeVerify(appTypes.SECURITY_TYPE.OTP)
      })
    }
  }

  const turnOnSMS = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.sms_on_notify'), () => {
        Utils.showLoading()
        dispatch(userOperations.changeNotifyStatus({ isOn: true }))
        setTimeout(() => {
          Utils.hideLoading()
        }, 300)
      })
    }
  }
  const turnOffSMS = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.sms_off_notify'), () => {
        Utils.showLoading()
        dispatch(userOperations.changeNotifyStatus({ isOn: false }))
        setTimeout(() => {
          Utils.hideLoading()
        }, 300)
      })
    }
  }

  const turnOnPinLogin = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_login_pin'), () => {
        storeService.getPinCode().then((pin) => {
          if (pin) {
            dispatch(settingOperations.turnOnLoginPin())
          } else {
            Navigation.push('SetupPinScreen')
          }
        })
      })
    }
  }

  const turnOnFPLogin = () => {
    if (isTimeout) {
      signIn()
    } else if (securityTypeMB === appTypes.SECURITY_TYPE.FP) {
      Utils.toast(I18n.t('setting.registedBioVerify'))
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_login_fp'), () => {
        storeService.getAuthBioKey().then((pin) => {
          if (pin) {
            dispatch(settingOperations.turnOnLoginFP())
          } else {
            TouchID.isSupported({ unifiedErrors: true })
              .then(() => {
                TouchID.authenticate('', {})
                  .then(() => {
                    setLoading(true)
                    dispatch(settingOperations.getPrivateKeyFP())
                  })
                  .catch((e) => {
                    Utils.bioError(e)
                  })
              })
              .catch((e) => {
                Utils.bioError(e)
              })
          }
        })
      })
    }
  }

  const turnOffPinLogin = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_login_pw'), () => {
        dispatch(settingOperations.turnOffLoginPin())
      })
    }
  }

  const turnOffFPLogin = () => {
    if (isTimeout) {
      signIn()
    } else {
      Utils.confirm(I18n.t('application.title_confirm'), I18n.t('setting.change_login_pw'), () => {
        dispatch(settingOperations.turnOffLoginFP())
        storeService.setAuthBioKey(null)
      })
    }
  }

  const showInfo = () => {
    Navigation.push('InfomationScreen')
  }

  const changeLanguage = () => {
    Utils.confirm(
      I18n.t('application.title_alert_notification'),
      I18n.t('application.change_language'),
      () => {
        if (language === appTypes.LANGUAGE_CODE.VI) {
          dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.EN))
        } else {
          dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.VI))
        }
      }
    )
  }
  return (
    <>
      <View style={ApplicationStyles.statusBar}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      </View>
      <View style={[Helpers.fill, styles.container]}>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: Metrics.small * 1.6,
            paddingVertical: Metrics.small * 1.9,
            elevation: 5,
            shadowColor: '#EEEEEE',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
          <View style={Helpers.rowCross}>
            <Avatar
              ref={avatarRef}
              user={user}
              onPressInfo={showInfo}
              readOnly={false}
              onPressCamera={getCamera}
              onPressGalery={getGalery}
            />
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={styles.nameUser}>{I18n.t('main.welcome')}</Text>
              <Text style={styles.idUser}>{fullName}</Text>
            </View>
          </View>
          <View style={[Helpers.rowCross, { marginTop: Metrics.small * 1.3 }]}>
            <TouchableOpacity style={styles.buttonLogout} onPress={() => signInandOut()}>
              <Text style={styles.textLogout}>{textLogin}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[styles.buttonLogout, { marginLeft: Metrics.small }]}
              onPress={switchAccount}
            >
              <Text style={styles.textLogout}>{I18n.t('action.action_reactive')}</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{I18n.t('setting.signin_setting')}</Text>
          <ItemSetting
            style={styles.line}
            toggle
            onSelectItem={() => {
              if (loginSecurityType !== appTypes.SECURITY_TYPE.FP) {
                turnOnFPLogin()
              } else {
                turnOffFPLogin()
              }
            }}
            icon="setting_biometric"
            onSwitchChange={(onoff) => {
              if (onoff) {
                turnOnFPLogin()
              } else {
                turnOffFPLogin()
              }
            }}
            isOn={loginSecurityType === appTypes.SECURITY_TYPE.FP}
            title={I18n.t('setting.signin_fp')}
          />
          <ItemSetting
            style={styles.line}
            toggle
            onSelectItem={() => {
              if (loginSecurityType !== appTypes.SECURITY_TYPE.PIN) {
                turnOnPinLogin()
              } else {
                turnOffPinLogin()
              }
            }}
            onSwitchChange={(onoff) => {
              if (onoff) {
                turnOnPinLogin()
              } else {
                turnOffPinLogin()
              }
            }}
            isOn={loginSecurityType === appTypes.SECURITY_TYPE.PIN}
            icon="setting_pin"
            title={I18n.t('setting.signin_pin')}
          />
          <ItemSetting
            style={styles.line}
            icon="setting_change_pass"
            title={I18n.t('setting.change_pass')}
            onSelectItem={() => changePass()}
          />
          <ItemSetting
            icon="setting_change_pin"
            title={I18n.t('setting.change_pin')}
            onSelectItem={() => changePin()}
          />

          <Text style={styles.title}>{I18n.t('setting.authen_transaction')}</Text>
          <ItemSetting
            style={styles.line}
            icon="setting_softtoken"
            title={I18n.t('setting.SO')}
            toggle
            onSelectItem={() => {
              if (securityTypeMB !== appTypes.SECURITY_TYPE.SOFT_TOKEN) {
                turnOnSOVerify()
              } else {
                turnOffSOVerify()
              }
            }}
            onSwitchChange={(onoff) => {
              if (onoff) {
                turnOnSOVerify()
              } else {
                turnOffSOVerify()
              }
            }}
            isOn={securityTypeMB === appTypes.SECURITY_TYPE.SOFT_TOKEN}
          />
          <ItemSetting
            icon="setting_biometric"
            title={I18n.t('setting.FP')}
            toggle
            onSelectItem={() => {
              if (securityTypeMB !== appTypes.SECURITY_TYPE.FP) {
                turnOnFPVerify()
              } else {
                turnOffFPVerify()
              }
            }}
            onSwitchChange={(onoff) => {
              if (onoff) {
                turnOnFPVerify()
              } else {
                turnOffFPVerify()
              }
            }}
            isOn={securityTypeMB === appTypes.SECURITY_TYPE.FP}
          />
          <Text style={styles.title}>{I18n.t('setting.payment')}</Text>
          <ItemSetting
            onSelectItem={() => changeLimit()}
            style={styles.line}
            icon="setting_change_limit"
            title={I18n.t('setting.change_limit')}
          />
          <ItemSetting
            onSelectItem={() => changeAcount()}
            icon="setting_change_account"
            title={I18n.t('setting.change_acount')}
          />
          <Text style={styles.title}>{I18n.t('setting.support')}</Text>
          <ItemSetting
            style={styles.line}
            icon="trasoat"
            toggle
            title={I18n.t('setting.sms_notify')}
            onSelectItem={() => {
              if (isOpenSMS === 'N') {
                turnOnSMS()
              } else {
                turnOffSMS()
              }
            }}
            onSwitchChange={(onoff) => {
              if (onoff) {
                turnOnSMS()
              } else {
                turnOffSMS()
              }
            }}
            isOn={isOpenSMS === 'Y'}
          />
          <ItemSetting
            style={styles.line}
            icon="setting_language"
            title={I18n.t('setting.change_language')}
            onSelectItem={() => changeLanguage()}
          >
            <Image
              resizeMode="contain"
              source={languageIcon}
              style={{
                height: Metrics.small * 1.2,
                width: Metrics.small * 2.2,
                marginTop: Metrics.tiny,
              }}
            />
          </ItemSetting>
          <ItemSetting
            style={styles.line}
            icon="icon-247"
            title={I18n.t('login.247')}
            onSelectItem={() => Communications.phonecall(Config.phoneNumber, true)}
          />
          <ItemSetting
            style={styles.line}
            icon="icon-247"
            title="Tra soát"
            onSelectItem={onMessage}
          />
          <ItemSetting
            icon="setting_employee"
            title={I18n.t('action.action_reactive')}
            onSelectItem={() => switchAccount()}
          />
          <Text style={styles.title}>{I18n.t('setting.employee')}</Text>
          <ItemSetting
            style={styles.line}
            icon="setting_employee"
            title={I18n.t('setting.employee_manager')}
            onSelectItem={() => employee()}
          />
          <ItemSetting
            style={styles.line}
            icon="icon-product"
            title={I18n.t('overdraft.title')}
            onSelectItem={() => overdraft()}
          />
          <ItemSetting
            style={styles.line}
            icon="napthe"
            title={I18n.t('opencard.title')}
            onSelectItem={() => openCard()}
          />
          <View style={[Helpers.fullWidth, Helpers.center, { padding: Metrics.normal }]}>
            <Text style={{ color: Colors.primary2 }}>
              {I18n.t('application.version')} {version}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default SettingScreen
