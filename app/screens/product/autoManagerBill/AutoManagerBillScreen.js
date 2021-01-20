import React, { useEffect, useMemo } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  FlatList
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Text, } from '../../../components'
import { Metrics, Colors } from '../../../theme'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'
import I18n from '../../../translations'

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Metrics.medium * 0.7,
    paddingHorizontal: Metrics.medium,
    minHeight: Metrics.medium * 3.1,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  content: {
    width: '100%',
    backgroundColor: Colors.mainBg,
    minHeight: Dimensions.get('window').height,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: -1,
  },
  headerTop: {
    marginLeft: Metrics.normal * 1.3,
    marginTop: Metrics.medium * 1.4,
    marginBottom: Metrics.medium * 0.8,
    fontWeight: 'normal',
    fontSize: 15,
    color: Colors.textBlack
  },
  typeService: {

  },
  providerService: {
    color: Colors.textBlack,
    marginVertical: Metrics.tiny * 0.55,
    maxWidth: Dimensions.get('window').width * 0.5
  },
  nameService: {
    fontWeight: 'normal',
    fontSize: 14,
    color: Colors.textBlack
  },
  code: {
    fontWeight: 'bold',
    color: Colors.textBlack,
    maxWidth: Dimensions.get('window').width * 0.3

  }
})

const AutoManagerBillScreen = ({ route }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(productOperations.getDataQueryScheduleBill())
  }, [])
  const { dataQueryScheduleBill } = useSelector((state) => state.product)
  const { title_topBar, title_history, type_screen } = route.params

  const itemsIsBP = useMemo(() => dataQueryScheduleBill ? dataQueryScheduleBill.filter((data) => type_screen === 'BP' ? data.isBP === true : data.isBP === false) : null, [dataQueryScheduleBill])
  return (
    <ScrollView style={styles.container}>
      <Topbar background={Colors.white} title={I18n.t(title_topBar)} />
      <View style={styles.content}>
        <Text style={styles.headerTop}>{I18n.t(title_history)}</Text>
        <FlatList
          data={itemsIsBP}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => Navigation.push('DetailAutoManagerBillScreen',
            {
              items: item,
              routes: route,
              titleServices: I18n.t(title_topBar)
            })}
            >
              <View style={styles.typeService}>
                <Text style={styles.providerService}>{item.serviceType}</Text>
                <Text style={styles.nameService}>{item.serviceName}</Text>
              </View>
              <Text style={styles.code}>{item.customerCode}</Text>
            </TouchableOpacity>
          )
          }
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </ScrollView>
  )
}
export default AutoManagerBillScreen;
