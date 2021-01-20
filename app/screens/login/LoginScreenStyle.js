import { StyleSheet } from 'react-native'
import { Colors, Helpers, Metrics } from '../../theme'
import { Utils } from '../../utilities'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logo: {
    width: Metrics.small * 16.7,
    height: Metrics.medium * 2,
  },
  logoContainer: {
    paddingVertical: Metrics.medium,
    marginBottom: Metrics.small * 1.2,
  },
  marginTopbar: {
    marginTop: Metrics.medium,
  },
  forgotPass: {
    ...Helpers.row,
    marginTop: Metrics.small * 2.8,
  },
  input: {
    ...Helpers.contentWidth,
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    height: Metrics.tiny * 10,
    marginTop: Metrics.tiny,
    paddingHorizontal: Metrics.small * 2.5,
  },
  inputText: {
  },
  buttonLogin: {
    paddingVertical: Metrics.small * 0.9,
    ...Helpers.contentWidth,
    marginTop: Metrics.normal,
  },
  signup: {
    color: Colors.second,
    marginTop: Utils.getRatioDimension(20),
  },
  containerRegister: {
    padding: Metrics.small,
  },
  hotlineContainer: {
    marginRight: Metrics.medium * 5,
  },
  hotlineText: {
    color: Colors.gray,
    marginTop: Metrics.tiny,
    fontSize: 12

  },
  hotlineIcon: {
    width: Metrics.small * 2,
    height: Metrics.small * 2,
  },
  forgotText: {
    fontSize: 12,
    color: Colors.textBlack,
    textDecorationLine: 'underline'
  },
  registerTest: {
    fontWeight: 'bold',
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.white,
  },
})
