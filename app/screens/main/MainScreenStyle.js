import { StyleSheet } from 'react-native'
import { Colors, Helpers, Metrics } from '../../theme'
import { Utils } from '../../utilities'

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  tabContainer: {
    borderTopColor: Colors.line,
    borderTopWidth: 1,
    paddingBottom: Utils.isIphoneX() ? Metrics.small * 0.6 : Metrics.small * 0.4,
  },
  tab: {
    ...Helpers.mainSpaceBetween,
    ...Helpers.fillColCross,
    paddingBottom: Metrics.small,
  },
  tabFocus: {
    width: 4.3 * Metrics.small,
    height: Metrics.small * 0.4,
    backgroundColor: Colors.primary2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  tabNormal: {
    width: 0,
  },
  tabTitle: {
    fontSize: 12,
    color: Colors.gray,
  },
  tabTitleFocus: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: 'bold',
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.white,
  },
})
