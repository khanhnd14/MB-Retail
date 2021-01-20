import * as React from 'react'
import { TouchableOpacity, StyleSheet, } from 'react-native'
import { Topbar, Text, Icon } from '../../../components'
import { Metrics, Colors, ApplicationStyles } from '../../../theme'

const styles = StyleSheet.create({
  containerItems: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.gray6,
    height: '100%',
  },
  item: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: Metrics.medium,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    ...ApplicationStyles.shadow,
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2 },
  icon: { color: Colors.iconGray, fontSize: 40, marginRight: 20 },
  recentlyList: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    alignItems: 'stretch',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  itemTop: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: Metrics.medium,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
})
const UtilitiesScreen = () => (
  <>
    <Topbar title="Tiện ích" />
    <TouchableOpacity style={styles.itemTop} onPress={() => {}}>
      <Icon name="icon-more" styles={styles.icon} size={22} />
      <Text style={styles.title}>    Vé máy bay</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon name="icon-tt-hoadon" styles={styles.icon} size={21} />
      <Text style={styles.title}>    Vé tàu xe</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon name="icon-thanhtoan" styles={styles.icon} size={23} />
      <Text style={styles.title}>    Khách sạn</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon name="icon-lichsu" styles={styles.icon} size={26} />
      <Text style={styles.title}>    Vé xem phim</Text>
    </TouchableOpacity>
  </>
)
export default UtilitiesScreen;
