import { StyleSheet } from 'react-native'
import Colors from './Colors'
import Metrics from './Metrics'
import { Utils } from '../utilities'

const width = Utils.getWindowWidth()
export default StyleSheet.create({
  btnPrimary: {
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    paddingVertical: Metrics.small * 0.9,
    paddingHorizontal: Metrics.medium * 1.5,
  },
  confirmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Colors.transparent,
    paddingTop: Metrics.tiny,
    paddingBottom: Metrics.small * 2.5,
  },
  inputPrimary: {
    width: width * 0.85,
    ...Metrics.tinyBottomMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light1,
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: Colors.mainBg,
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.white,
  },
  shadow: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  }
})
