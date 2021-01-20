/* eslint-disable radix */
import { easeLinear } from 'd3-ease'
import * as _ from 'lodash'
import * as React from 'react'
import Animate from 'react-move/Animate'
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Vibration,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import Icon from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import Text from '../MsbText'
import delay from './delay'
import grid from './grid'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import I18n from '../../translations'

const PinStatus = Object.freeze({
  choose: 'choose',
  confirm: 'confirm',
  enter: 'enter',
  setup: 'setup',
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  viewTitle: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: Metrics.small * 1.5,
  },
  row: {
    flex: 0,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Metrics.normal / 2,
  },
  rowWithEmpty: {
    flexShrink: 0,
    justifyContent: 'center',
  },
  colButtonCircle: {
    flex: 0,
    justifyContent: 'center',
    marginLeft: Metrics.small * 1.4,
    marginRight: Metrics.small * 1.4,
    alignItems: 'center',
    width: Metrics.small * 7.5,
    height: Metrics.small * 7.5,
  },
  colEmpty: {
    flex: 0,
    marginLeft: Metrics.small * 1.4,
    marginRight: Metrics.small * 1.4,
    width: Metrics.small * 7.5,
    height: Metrics.small * 7.5,
  },
  colIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 36,
    color: Colors.white,
  },
  buttonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.small * 7.5,
    height: Metrics.small * 7.5,
    backgroundColor: 'rgb(242, 245, 251)',
    borderRadius: Metrics.tiny * 7.5,
  },
  textTitle: {
    fontSize: 16,
    color: '#333333',
  },
  textSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  flexCirclePassword: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.small,
    marginBottom: Metrics.small * 2,
  },
  topViewCirclePassword: {
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCircles: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDeleteButton: {
    fontWeight: '200',
    marginTop: 5,
  },
  grid: {
    justifyContent: 'flex-start',
    width: '100%',
    flex: 7,
  },
})

class PinCode extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      moveData: { x: 0, y: 0 },
      showError: false,
      textButtonSelected: '',
      colorDelete: props.styleDeleteButtonColorHideUnderlay,
      attemptFailed: false,
      changeScreen: false,
    }
    this._circleSizeEmpty = props.styleCircleSizeEmpty || Metrics.small * 1.25
    this._circleSizeFull =
      props.styleCircleSizeFull ||
      (props.pinCodeVisible ? Metrics.small * 1.25 : Metrics.small * 1.25)
  }

  componentDidMount = () => {
    const { getCurrentLength } = this.props
    if (getCurrentLength) {
      getCurrentLength(0)
    }
  }

  componentDidUpdate = (prevProps) => {
    const { pinCodeStatus } = this.props
    if (prevProps.pinCodeStatus !== 'failure' && pinCodeStatus === 'failure') {
      this.failedAttempt()
    }
    if (prevProps.pinCodeStatus !== 'locked' && pinCodeStatus === 'locked') {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ password: '' })
    }
  }

  failedAttempt = async () => {
    await delay(300)
    this.setState({
      showError: true,
      attemptFailed: true,
      changeScreen: false,
    })
    this.doShake()
    await delay(300)
    this.newAttempt()
  }

  newAttempt = async () => {
    this.setState({ changeScreen: true })
    await delay(200)
    this.setState({
      changeScreen: false,
      showError: false,
      attemptFailed: false,
      password: '',
    })
  }

  validatePin = (pin) => {
    const temp = parseInt(pin)
    if (temp % 1111 === 0) {
      return false
    }
    const tempString = '123456789|987654321'
    if (tempString.indexOf(pin) > -1) {
      return false
    }
    return true
  }

  onPressButtonNumber = async (text) => {
    const { password } = this.state
    const {
      getCurrentLength,
      passwordLength,
      status,
      validationRegex,
      previousPin,
      endProcess,
    } = this.props
    const currentPassword = password + text
    this.setState({ password: currentPassword })
    if (getCurrentLength) getCurrentLength(currentPassword.length)
    if (currentPassword.length === passwordLength) {
      switch (status) {
        case PinStatus.choose:
          if (validationRegex && validationRegex.test(currentPassword)) {
            this.showError(true)
          } else {
            this.endProcess(currentPassword)
          }
          break
        case PinStatus.confirm:
          if (currentPassword !== previousPin) {
            this.showError()
          } else {
            this.endProcess(currentPassword)
          }
          break
        case PinStatus.enter:
          endProcess(currentPassword)
          // await delay(300)
          break
        case PinStatus.setup:
          if (!this.validatePin(currentPassword)) {
            Utils.toast(I18n.t('application.pinCommon'))
            this.newAttempt()
          } else {
            endProcess(currentPassword)
            // await delay(300)
          }
          break
        default:
          break
      }
    }
  }

  renderButtonNumber = (text) => {
    const { password, showError, attemptFailed, textButtonSelected } = this.state
    const {
      passwordLength,
      colorCircleButtons,
      styleButtonCircle,
      numbersButtonOverlayColor,
      styleTextButton,
      styleColorButtonTitleSelected,
      styleColorButtonTitle,
    } = this.props
    const disabled = (password.length === passwordLength || showError) && !attemptFailed
    return (
      <Animate
        show
        start={{
          opacity: 1,
        }}
        update={{
          opacity: [showError && !attemptFailed ? 0.5 : 1],
          timing: { duration: 200, ease: easeLinear },
        }}
      >
        {({ opacity }) => (
          <TouchableOpacity
            style={[
              styles.buttonCircle,
              { backgroundColor: colorCircleButtons },
              styleButtonCircle,
            ]}
            underlayColor={numbersButtonOverlayColor}
            disabled={disabled}
            onShowUnderlay={() => this.setState({ textButtonSelected: text })}
            onHideUnderlay={() => this.setState({ textButtonSelected: '' })}
            onPress={() => {
              this.onPressButtonNumber(text)
            }}
            accessible
            accessibilityLabel={text}
          >
            <Text
              style={[
                styles.text,
                styleTextButton,
                {
                  opacity,
                  color:
                    textButtonSelected === text
                      ? styleColorButtonTitleSelected
                      : styleColorButtonTitle,
                },
              ]}
            >
              {text}
            </Text>
          </TouchableOpacity>
        )}
      </Animate>
    )
  }

  endProcess = (pwd) => {
    setTimeout(() => {
      const { endProcess } = this.props
      this.setState({ changeScreen: true })
      setTimeout(() => {
        endProcess(pwd)
      }, 300)
    }, 200)
  }

  async doShake() {
    const { vibrationEnabled, getCurrentLength } = this.props
    const duration = 70
    if (vibrationEnabled) Vibration.vibrate(500, false)
    const length = Dimensions.get('window').width / 3
    await delay(duration)
    this.setState({ moveData: { x: length, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: length / 2, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length / 2, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: length / 4, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length / 4, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: 0, y: 0 } })
    if (getCurrentLength) {
      getCurrentLength(0)
    }
  }

  async showError(isErrorValidation = false) {
    const { endProcess, password } = this.state
    this.setState({ changeScreen: true })
    await delay(300)
    this.setState({ showError: true, changeScreen: false })
    this.doShake()
    await delay(3000)
    this.setState({ changeScreen: true })
    await delay(200)
    this.setState({ showError: false, password: '' })
    await delay(200)
    endProcess(password, isErrorValidation)
    if (isErrorValidation) this.setState({ changeScreen: false })
  }

  renderCirclePassword = () => {
    const { password, moveData, showError, changeScreen, attemptFailed } = this.state
    const {
      colorPasswordError,
      colorPassword,
      colorPasswordEmpty,
      styleCircleHiddenPassword,
      passwordLength,
      pinCodeVisible,
      stylePinCodeCircle,
      textPasswordVisibleFamily,
      textPasswordVisibleSize,
      loading,
    } = this.props
    const colorPwdErr = colorPasswordError
    const colorPwd = colorPassword
    const colorPwdEmp = colorPasswordEmpty || colorPwd
    return (
      <View style={[styles.topViewCirclePassword, styleCircleHiddenPassword]}>
        {_.range(passwordLength).map((val, index) => {
          if (loading) {
            return (
              <ActivityIndicator
                style={{ marginHorizontal: 4 }}
                key={index}
                animating
                color={Colors.primary2}
              />
            )
          }
          const lengthSup =
            ((password.length >= val + 1 && !changeScreen) || showError) && !attemptFailed
          return (
            <Animate
              key={val}
              show
              start={{
                opacity: 1,
                height: this._circleSizeEmpty,
                width: this._circleSizeEmpty,
                borderRadius: this._circleSizeEmpty / 2,
                color: colorPwdEmp,
                marginRight: 10,
                marginLeft: 10,
                x: 0,
                y: 0,
              }}
              update={{
                x: [moveData.x],
                opacity: [lengthSup ? 1 : 1],
                height: [lengthSup ? this._circleSizeFull : this._circleSizeEmpty],
                width: [lengthSup ? this._circleSizeFull : this._circleSizeEmpty],
                color: [
                  showError
                    ? colorPwdErr
                    : lengthSup && password.length > 0
                    ? colorPwd
                    : colorPwdEmp,
                ],
                borderRadius: [lengthSup ? this._circleSizeFull / 2 : this._circleSizeEmpty / 2],
                marginRight: [
                  lengthSup ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2 : 10,
                ],
                marginLeft: [
                  lengthSup ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2 : 10,
                ],
                y: [moveData.y],
                timing: { duration: 200, ease: easeLinear },
              }}
            >
              {({ opacity, x, height, width, color, borderRadius, marginRight, marginLeft }) => (
                <View style={styles.viewCircles}>
                  {((!pinCodeVisible || (pinCodeVisible && !lengthSup)) && (
                    <View
                      style={[
                        {
                          left: x,
                          height,
                          width,
                          opacity,
                          borderRadius,
                          marginLeft,
                          marginRight,
                          borderColor: lengthSup ? Colors.transparent : Colors.black,
                          backgroundColor: lengthSup ? color : Colors.transparent,
                          borderWidth: 1,
                        },
                        stylePinCodeCircle,
                      ]}
                    />
                  )) || (
                    <View
                      style={{
                        left: x,
                        opacity,
                        marginLeft,
                        marginRight,
                      }}
                    >
                      <Text
                        style={{
                          color,
                          fontFamily: textPasswordVisibleFamily,
                          fontSize: textPasswordVisibleSize,
                        }}
                      >
                        {password[val]}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Animate>
          )
        })}
      </View>
    )
  }

  renderButtonDelete = (opacity) => {
    const { password, colorDelete } = this.state
    const {
      styleDeleteButtonColorHideUnderlay,
      styleDeleteButtonColorShowUnderlay,
      getCurrentLength,
      buttonDeleteText,
      styleColumnDeleteButton,
      customBackSpaceIcon,
      iconButtonDeleteDisabled,
      styleDeleteButtonIcon,
      styleDeleteButtonSize,
    } = this.props
    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled={password.length === 0}
        underlayColor="transparent"
        onHideUnderlay={() =>
          this.setState({
            colorDelete: styleDeleteButtonColorHideUnderlay,
          })
        }
        onShowUnderlay={() =>
          this.setState({
            colorDelete: styleDeleteButtonColorShowUnderlay,
          })
        }
        onPress={() => {
          if (password.length > 0) {
            const newPass = password.slice(0, -1)
            this.setState({ password: newPass })
            if (getCurrentLength) getCurrentLength(newPass.length)
          }
        }}
        accessible
        accessibilityLabel={buttonDeleteText}
      >
        <View style={[styles.colIcon, styleColumnDeleteButton]}>
          {customBackSpaceIcon ? (
            customBackSpaceIcon({ colorDelete, opacity })
          ) : (
            <>
              {!iconButtonDeleteDisabled && (
                <Icon
                  name={styleDeleteButtonIcon}
                  size={styleDeleteButtonSize}
                  color={colorDelete}
                  style={{ opacity }}
                />
              )}
              {/* <Text
                style={[
                  styles.textDeleteButton,
                  this.props.styleDeleteButtonText,
                  { color: this.state.colorDelete, opacity: opacity }
                ]}>
                {this.props.buttonDeleteText}
              </Text> */}
            </>
          )}
        </View>
      </TouchableHighlight>
    )
  }

  renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
    const {
      styleTextTitle,
      titleAttemptFailed,
      titleConfirmFailed,
      titleValidationFailed,
      sentenceTitle,
    } = this.props
    return (
      <Text style={[styles.textTitle, styleTextTitle, { opacity: opacityTitle }]}>
        {(attemptFailed && titleAttemptFailed) ||
          (showError && titleConfirmFailed) ||
          (showError && titleValidationFailed) ||
          sentenceTitle}
      </Text>
    )
  }

  renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
    const { styleTextSubtitle, subtitleError, subtitle } = this.props
    return (
      <Text
        style={[
          styles.textSubtitle,
          styleTextSubtitle,
          { color: colorTitle, opacity: opacityTitle },
        ]}
      >
        {attemptFailed || showError ? subtitleError : subtitle}
      </Text>
    )
  }

  render() {
    const { password, showError, attemptFailed, changeScreen } = this.state
    const {
      styleContainer,
      styleColorTitle,
      styleColorSubtitle,
      styleColorTitleError,
      styleColorSubtitleError,
      styleViewTitle,
      titleComponent,
      subtitleComponent,
      passwordComponent,
      styleRowButtons,
      styleColumnButtons,
      buttonNumberComponent,
      styleEmptyColumn,
      emptyColumnComponent,
      passwordLength,
      buttonDeleteComponent,
      getCurrentLength,
    } = this.props
    return (
      <View style={[styles.container, styleContainer]}>
        <Animate
          show
          start={{
            opacity: 0,
            colorTitle: styleColorTitle,
            colorSubtitle: styleColorSubtitle,
            opacityTitle: 1,
          }}
          enter={{
            opacity: [1],
            colorTitle: [styleColorTitle],
            colorSubtitle: [styleColorSubtitle],
            opacityTitle: [1],
            timing: { duration: 200, ease: easeLinear },
          }}
          update={{
            opacity: [changeScreen ? 0 : 1],
            colorTitle: [showError || attemptFailed ? styleColorTitleError : styleColorTitle],
            colorSubtitle: [
              showError || attemptFailed ? styleColorSubtitleError : styleColorSubtitle,
            ],
            opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
            timing: { duration: 200, ease: easeLinear },
          }}
        >
          {({ opacity, colorTitle, colorSubtitle, opacityTitle }) => (
            <View style={[styles.viewTitle, styleViewTitle, { opacity }]}>
              {titleComponent
                ? titleComponent()
                : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError)}
              {subtitleComponent
                ? subtitleComponent()
                : this.renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)}
            </View>
          )}
        </Animate>
        <View style={styles.flexCirclePassword}>
          {passwordComponent ? passwordComponent() : this.renderCirclePassword()}
        </View>
        <Grid style={styles.grid}>
          <Row style={[styles.row, styleRowButtons]}>
            {_.range(1, 4).map((i) => (
              <Col key={i} style={[styles.colButtonCircle, styleColumnButtons]}>
                {buttonNumberComponent
                  ? buttonNumberComponent(i, this.onPressButtonNumber)
                  : this.renderButtonNumber(i.toString())}
              </Col>
            ))}
          </Row>
          <Row style={[styles.row, styleRowButtons]}>
            {_.range(4, 7).map((i) => (
              <Col key={i} style={[styles.colButtonCircle, styleColumnButtons]}>
                {buttonNumberComponent
                  ? buttonNumberComponent(i, this.onPressButtonNumber)
                  : this.renderButtonNumber(i.toString())}
              </Col>
            ))}
          </Row>
          <Row style={[styles.row, styleRowButtons]}>
            {_.range(7, 10).map((i) => (
              <Col key={i} style={[styles.colButtonCircle, styleColumnButtons]}>
                {buttonNumberComponent
                  ? buttonNumberComponent(i, this.onPressButtonNumber)
                  : this.renderButtonNumber(i.toString())}
              </Col>
            ))}
          </Row>
          <Row style={[styles.row, styles.rowWithEmpty, styleRowButtons]}>
            <Col style={[styles.colEmpty, styleEmptyColumn]}>{emptyColumnComponent || null}</Col>
            <Col style={[styles.colButtonCircle, styleColumnButtons]}>
              {buttonNumberComponent
                ? buttonNumberComponent('0', this.onPressButtonNumber)
                : this.renderButtonNumber('0')}
            </Col>
            <Col style={[styles.colButtonCircle, styleColumnButtons]}>
              <Animate
                show
                start={{
                  opacity: 0.5,
                }}
                update={{
                  opacity: [password.length === 0 || password.length === passwordLength ? 0.5 : 1],
                  timing: { duration: 400, ease: easeLinear },
                }}
              >
                {({ opacity }) =>
                  buttonDeleteComponent
                    ? buttonDeleteComponent(() => {
                        if (password.length > 0) {
                          const newPass = password.slice(0, -1)
                          this.setState({ password: newPass })
                          if (getCurrentLength) getCurrentLength(newPass.length)
                        }
                      })
                    : this.renderButtonDelete(opacity)
                }
              </Animate>
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}
PinCode.defaultProps = {
  colorCircleButtons: Colors.primary2,
  styleDeleteButtonColorHideUnderlay: Colors.primary2,
  numbersButtonOverlayColor: '#FB671990',
  styleDeleteButtonColorShowUnderlay: '#FB671990',
  styleColorButtonTitleSelected: Colors.white,
  styleColorButtonTitle: Colors.white,
  colorPasswordError: Colors.primary,
  colorPassword: Colors.primary2,
  styleDeleteButtonIcon: 'backspace',
  styleDeleteButtonSize: 30,
  buttonDeleteText: 'delete',
  styleColorTitle: Colors.textBlack,
  styleColorSubtitle: Colors.textBlack,
  styleColorTitleError: Colors.error,
  styleColorSubtitleError: Colors.error,
  textPasswordVisibleFamily: 'system font',
  textPasswordVisibleSize: 22,
  vibrationEnabled: true,
  status: 'confirm',
  pinCodeStatus: 'initial',
  passwordLength: 4,
  loading: false,
}
PinCode.propTypes = {
  buttonDeleteText: PropTypes.string,
  colorCircleButtons: PropTypes.string,
  colorPassword: PropTypes.string,
  colorPasswordError: PropTypes.string,
  numbersButtonOverlayColor: PropTypes.string,
  passwordLength: PropTypes.number,
  pinCodeStatus: PropTypes.oneOf(['initial', 'success', 'failure', 'locked']),
  status: PropTypes.oneOf(['choose', 'confirm', 'enter', 'setup']),
  styleColorButtonTitle: PropTypes.string,
  styleColorButtonTitleSelected: PropTypes.string,
  styleColorSubtitle: PropTypes.string,
  styleColorSubtitleError: PropTypes.string,
  styleColorTitle: PropTypes.string,
  styleColorTitleError: PropTypes.string,
  styleDeleteButtonColorHideUnderlay: PropTypes.string,
  styleDeleteButtonColorShowUnderlay: PropTypes.string,
  styleDeleteButtonIcon: PropTypes.string,
  styleDeleteButtonSize: PropTypes.number,
  textPasswordVisibleFamily: PropTypes.string,
  textPasswordVisibleSize: PropTypes.number,
  vibrationEnabled: PropTypes.bool,
  loading: PropTypes.bool,
}

export default PinCode
