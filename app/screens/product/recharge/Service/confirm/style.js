import { StyleSheet } from 'react-native';
import { Colors, Metrics } from '../../../../../theme';

const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.normal,
    paddingLeft: Metrics.normal,
    paddingRight: Metrics.tiny,
    marginHorizontal: Metrics.normal + Metrics.tiny,
    marginBottom: Metrics.small + Metrics.tiny,
  },
  container2: {
    backgroundColor: Colors.white,
    paddingLeft: Metrics.normal,
    paddingRight: Metrics.normal,
    marginHorizontal: Metrics.normal + Metrics.tiny,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal
  },
  contentContainer: {
    marginTop: Metrics.small,
    backgroundColor: Colors.white,
    width: '100%',
    paddingHorizontal: Metrics.small * 1.8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingBottom: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: Metrics.tiny * 2
  },
  contentLayout: {
    marginBottom: Metrics.small,
    // height: 45,
  },
  label: {
    color: Colors.textBlack,
    fontSize: 16,

  },
  accountNo: {
    color: Colors.gray1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.tiny,
  },
  iconChecked: {
    color: Colors.white,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  accountContainer: {
    // flexDirection: 'row',
    width: '85%',
  },
  accountContainerChild1: {
    width: '25%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  accountContainerChild2: {
    width: '75%',
  },
  accountText: {
    fontSize: 16,
    fontFamily: 'Calibri',
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  accountText2: {
    color: '#878E9C',
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Calibri',
    marginBottom: 8,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'lightgray',
    alignSelf: 'flex-end',
    marginRight: Metrics.normal + 1,
  },
  hr: {
    // width: screenWidth * 90 / 100,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderStyle: 'solid',
  },
  header: {
    backgroundColor: Colors.primary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 37,
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: Colors.white,
    fontWeight: 'bold',
  },
  headerIconClose: {
    marginRight: Metrics.normal,
  },
  content: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11,
    paddingVertical: Metrics.normal,
  },
  view: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  iconCheckContainer: {
    alignItems: 'flex-end',
    width: '15%',
  },
  iconCheck: {
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    top: '7%',
    right: '5%'
  },
  iconCheck2: {
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    top: '15%',
    right: '5%'
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonConfirm: {
    paddingHorizontal: Metrics.medium * 2
  },
  contentValue: {
    fontWeight: 'bold',
  },
})

export default styles
