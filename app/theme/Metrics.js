import { Platform, StatusBar } from 'react-native'
import { Utils } from '../utilities'

const tiny = Utils.getRatioDimension(5)
const small = tiny * 2 // 10
const normal = tiny * 3 // 15
const medium = small * 2 // 20
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios'
    ? Utils.isIphoneX()
      ? 30
      : 20
    : Platform.Version < 21
    ? 0
    : StatusBar.currentHeight

export default {
  tiny,
  small,
  normal,
  medium,
  STATUSBAR_HEIGHT,
}
