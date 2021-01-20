import { Colors } from '../../theme'
import { Utils } from '../../utilities'

const { StyleSheet } = require('react-native')

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
    borderTopRightRadius: Utils.getRatioDimension(20),
    borderTopLeftRadius: Utils.getRatioDimension(20),
    paddingLeft: Utils.getRatioDimension(14),
    paddingRight: Utils.getRatioDimension(19),
    paddingTop: Utils.getRatioDimension(4),
  },
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray4,
    paddingBottom: Utils.getRatioDimension(16),
    paddingTop: Utils.getRatioDimension(13),
  },
  childWidth: {
    width: '33.3%',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailStyle: {
    fontSize: 12,
  },
  detailStyleBold: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})
export default styles
