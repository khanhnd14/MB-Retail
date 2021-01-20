import { Colors } from '../../theme';
import { Utils } from '../../utilities';

const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({

  bubble: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: Utils.getRatioDimension(15),
    width: Utils.getRatioDimension(300),
    // top: Utils.getRatioDimension(-30),
    // left: Utils.getRatioDimension(-60)
  },
  searchBar: {
    width: Utils.getWindowWidth() - Utils.getRatioDimension(32),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: '#636469',
    borderStyle: 'solid',
    borderRadius: Utils.getRatioDimension(20),
    position: 'absolute',
    marginHorizontal: Utils.getRatioDimension(16),
    top: Utils.getRatioDimension(120),
    height: Utils.getRatioDimension(40),
    zIndex: 1000,
    paddingRight: Utils.getRatioDimension(20),
  },
  searchBarInput: {
    flex: 1,
    color: '#636469',
    paddingHorizontal: Utils.getRatioDimension(10),
    marginHorizontal: Utils.getRatioDimension(10),
    width: Utils.getWindowWidth() - Utils.getRatioDimension(100),
  },
})
export default styles
