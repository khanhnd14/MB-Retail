import * as React from 'react'
import _ from 'lodash'
import { SafeAreaView, TouchableOpacity, StyleSheet, View, TextInput, FlatList } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures';
// import { Text, Icon } from ''
import Text from '../MsbText'
import Icon from '../MsbIcon'
import { Metrics, Colors } from '../../theme'

const styles = StyleSheet.create({
  containerItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.gray6,
    height: '100%',
    marginHorizontal: Metrics.tiny * 2,
    marginVertical: Metrics.tiny
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
  iconItem: {
    color: Colors.white, fontSize: 40, marginRight: 0,
  },
  iconAvatar: {
    backgroundColor: Colors.primary2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    marginVertical: 10,
    borderRadius: 60,
  },
  buttonEditor: {
    backgroundColor: Colors.check,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 11,
  },
  buttonDelete: {
    backgroundColor: Colors.primary2,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 11,
  },
  dotMore: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  containerButtonMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  iconWrapAvatar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapInfo: {
    flexDirection: 'column',
    height: '100%',
    width: '65%',
    justifyContent: 'center',
    left: 11,
    marginVertical: 7,
  },
  wrapSlideMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

})

const HistoryList = (props) => {
  const { data } = props;
  const [search, setSearch] = React.useState('');
  const [itemIndex, setItemIndex] = React.useState(-1)
  const config = {
    velocityThreshold: 0.2,
    directionalOffsetThreshold: 1000,
    gestureIsClickThreshold: 3,
  };
  const onSlideModifyItem = () => {

  }
  const _onSwipeLeft = (index) => {
    setItemIndex(index)
  }
  const _onSwipeRight = () => {
    setItemIndex(-1)
  }
  function _onSwipePress(index) {
    if (index === itemIndex) {
      setItemIndex(-1)
    } else {
      setItemIndex(index)
    }
  }
  const _renderItem = ({ item, index }) => (
    <GestureRecognizer
      onSwipeLeft={() => _onSwipeLeft(index)}
      onSwipeRight={() => _onSwipeRight(index)}
      config={config}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.containerItems}>
        <View style={styles.iconWrapAvatar}>
          <View style={styles.iconAvatar}>
            <Icon name="icon-chuyenkhoan" styles={styles.iconItem} size={20} color={Colors.white} />
          </View>
        </View>
        <View style={styles.wrapInfo}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 14 }}>{item.phone}</Text>
        </View>
        <View style={styles.containerButtonMore}>
          <View style={styles.wrapSlideMore}>
            <View style={styles.dotMore}>
              <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={() => _onSwipePress(index)}
              >
                <Icon name="icon-change-pin" styles={styles.iconItem} size={22} />
              </TouchableOpacity>
            </View>
            {index === itemIndex ? (
              <View style={{ flexDirection: 'row', height: '100%' }}>
                <View style={styles.buttonEditor}>
                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={onSlideModifyItem}
                  >
                    <Icon name="icon-khachsan" styles={styles.iconItem} size={22} />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonDelete}>
                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={onSlideModifyItem}
                  >
                    <Icon name="icon-khachsan" styles={styles.iconItem} size={22} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
            }
          </View>
        </View>
      </View>
    </GestureRecognizer>
  )
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: Metrics.tiny * 1,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Metrics.small * 2,
        marginHorizontal: Metrics.normal,
        marginVertical: Metrics.normal,
        borderBottomColor: Colors.gray6,
      }}
      >
        <Icon name="icon-search" size={24} color={Colors.primary} />
        <TextInput
          placeholder="Tìm kiếm"
          style={{ marginLeft: Metrics.normal, fontSize: 14, flex: 1 }}
          onChangeText={(val) => setSearch(val)}
        />
      </View>
      <SafeAreaView>
        <FlatList
          style={{ flex: 1 }}
          data={_.filter(data, (item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </View>
  )
}
HistoryList.defaultProps = {
  data: null
}
export default HistoryList
