import { StyleSheet } from 'react-native'
import { Colors, Metrics, Helpers } from '../../../../theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
  },
  contentLayout: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.normal,
    marginTop: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnLayout: {
    padding: Metrics.normal,
  },
  btn: {
    backgroundColor: Colors.primary2,
    height: 50,
    borderRadius: 38,
  },
  btnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingLeft: Metrics.tiny
  },
  formAmount: {
    paddingLeft: Metrics.tiny
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: Metrics.normal,
    top: '50%',
  },
  cardContainer: {
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11
  },
  providerContainer: {
    marginVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11,
    paddingBottom: Metrics.small
  },
  contentProvider: {
    color: Colors.textBlack,
    fontSize: 16,
  },
  sendCardContainer: { paddingHorizontal: Metrics.medium * 1.5, paddingVertical: Metrics.small, flexDirection: 'row' },
  sendCardChild: {
    paddingLeft: Metrics.medium
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
  },
  amountBold: {
    color: Colors.gray,
    paddingVertical: Metrics.tiny * 2,
    marginHorizontal: Metrics.tiny,
    fontSize: 15,
  },
  timeContainer: {
    paddingTop: Metrics.small
  },
  dateSchedule: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: Metrics.tiny,
    paddingVertical: Metrics.small
  },
  buttonConfirm: {
    paddingHorizontal: Metrics.medium * 2
  },
  input: {
    paddingVertical: Metrics.tiny,
  }
})

export default styles
