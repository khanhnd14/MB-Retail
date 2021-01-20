import React, { useState } from 'react'
import Collapsible from 'react-native-collapsible'
import { StyleSheet, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import _ from 'lodash'
import { Colors, Metrics } from '../../theme'
import { Icon, Text } from '..'
import { Utils } from '../../utilities'

const WIN_WIDTH = Dimensions.get('window').width
const WIN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    // marginTop: WIN_HEIGHT / 100,
  },
  viewHeaderCollap: {
    width: '100%',
    height: Utils.getRatioDimension(60),
    backgroundColor: Colors.primary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: WIN_HEIGHT / 75,
    paddingHorizontal: WIN_HEIGHT / 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewLeftTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    height: '100%',
  },
  textTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    maxWidth: Utils.getRatioDimension(100)
  },
  textMoney: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 16
  },
  viewIcon: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: Utils.getRatioDimension(40),
  },
  viewContentCollapsible: {
    backgroundColor: Colors.white,
    marginHorizontal: WIN_WIDTH / 25,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: WIN_WIDTH / 25,
  },
  viewItemCollap: {
    paddingVertical: WIN_WIDTH / 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#BDBDBD',
  },
  viewTextLeftCollap: {
    justifyContent: 'space-between',
  },
  titleItem: {
    color: Colors.primary2,
    maxWidth: Metrics.medium * 9.5,
  },
  contentItem: {
    fontSize: 14,
  },
  amountItem: {
    fontSize: 14,
  },
  whiteView: {
    width: Utils.getWindowWidth(),
    height: 500,
    backgroundColor: Colors.white,
    position: 'absolute',
    top: -500
  }
})

const CollapsibleComponent = ({
  amount,
  title,
  iconName,
  data,
  onItemPress,
  expand,
  currencyCode,
  styleScrollView,
  hidePayment,
  backgroundColor
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!expand)
  const onSetCollapsible = () => {
    setIsCollapsed(!isCollapsed)
  }
  return (
    <View style={_.assign(styles.container)}>
      {backgroundColor && (
      <View style={styles.whiteView} />
      )}
      <View style={{ backgroundColor, marginTop: !backgroundColor ? Metrics.small : 0 }}>
        <TouchableOpacity
          style={styles.viewHeaderCollap}
          onPress={onSetCollapsible}
          activeOpacity={1}
        >
          <View style={styles.viewLeftTitle}>
            <View style={styles.viewIcon}>
              <Icon name={iconName} size={40} color={Colors.white} />
            </View>
            <Text style={styles.textTitle} numberOfLines={2}>
              {title}
            </Text>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={styles.textMoney}>
              {`${Utils.formatAmountText(amount)} `}
              <Text style={styles.textMoney}>{currencyCode}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.viewContentCollapsible}>
          <ScrollView style={[styleScrollView]} showsVerticalScrollIndicator={false}>
            {data &&
              data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.viewItemCollap,
                    borderTopWidth: index !== 0 ? 1 : 0,
                  }}
                  onPress={() => onItemPress(index)}
                >
                  <View style={styles.viewTextLeftCollap}>
                    <Text style={styles.titleItem}>{item.title}</Text>
                    {item.content ? <Text style={styles.contentItem}>{item.content}</Text> : null}
                  </View>
                  {!hidePayment && (
                  <Text style={styles.amountItem}>
                    {item.amount
                      ? `${Utils.formatAmountText(item.amount)} ${item?.currencyCode}`
                      : item?.currencyCode
                      ? `0 ${item?.currencyCode}`
                      : '0 VND'}
                  </Text>
)}
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Collapsible>
    </View>
  )
}

export default CollapsibleComponent
