import { StyleSheet, Dimensions } from 'react-native'
import { Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'

export default StyleSheet.create({
  container: {},
  menuBoardContainer: {
    ...Helpers.center,
    marginBottom: 10
  },
  menuBoardInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...Helpers.center,
  },
  bgContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  itemContainer: {
    alignItems: 'center',
    width: Utils.getRatioDimension(95),
    height: Utils.getRatioDimension(95),
    borderRadius: 10,
    backgroundColor: 'rgba(251, 104, 24, 0.85)',
    paddingVertical: Metrics.small * 0.7,
    margin: Metrics.tiny / 2,
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.white,
  },
  topbar: {
    backgroundColor: Colors.white,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: Dimensions.get('screen').width,
  },
  notificationContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Metrics.tiny * 2.1,
    width: Metrics.small * 1.4,
    height: Metrics.small * 1.4,
    borderRadius: (Metrics.small * 1.2) / 2,
    backgroundColor: Colors.primary2,
    marginTop: Metrics.small * 0.8,
  },
  itemText: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: Metrics.tiny
  }
})
