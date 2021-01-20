import * as React from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import I18n from 'i18n-js'
import _ from 'lodash';
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import { Icon, Text } from '..'
import { Utils } from '../../utilities'
import ModalSelect from '../ModalSelect'
import { numberWithCommas } from '../../utilities/common'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
    flex: 1,
  },
  contentLayout: {
    marginTop: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.gray1,
    fontSize: 16,
    height: 24,

    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
  },
  checkBox: {
    height: Utils.getWindowHeight() / 35,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Colors.gray10,
    borderRadius: Utils.getWindowHeight() / 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Utils.getWindowHeight() / 70
  },
  viewCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
  },
  textContent: {
    lineHeight: Utils.getWindowHeight() / 45,
    fontFamily: 'Helvetica',
  }
})

const SelectItemCard = ({ title, content, dataCardList, isCheckBox, showIconArrow, onSelectCard, creditCard, indexTab }) => {
  const [indexChecked, setIndexChecked] = React.useState(0)
  const [isVisible, setVisible] = React.useState(false)
  const [currentCard, setCurrentCard] = React.useState(0)
  const _onPress = () => {
    setVisible(true)
  }

  React.useEffect(() => {
    if (creditCard) {
      const index = _.findIndex(dataCardList, (card) => card.cardNo === creditCard.content)
      setCurrentCard(index)
    }
  }, [creditCard, indexTab])
  return (
    <>
      <TouchableOpacity onPress={_onPress}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.contentLayout}>
              {currentCard === null ? (
                <Text style={styles.label}>{I18n.t('account.title_select_card')}</Text>
              ) : (
                <>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.textBlack, marginBottom: Metrics.small, maxWidth: screenWidth * 0.8 }}>
                    {`${dataCardList[currentCard] ? dataCardList[currentCard].cardName : ''} - ${dataCardList[currentCard] ? dataCardList[currentCard].cardNo : ''}`}
                  </Text>
                  <Text style={styles.amount}>
                    {`${numberWithCommas(dataCardList[currentCard] ? dataCardList[currentCard].availableBalance : '')} VND`}
                  </Text>
                </>
                )}
            </View>
            <View
              style={{
                marginTop: Metrics.small,
              }}
            >
              {isCheckBox ? (
                <View>
                  {dataCardList.map((element, index) => (
                    <View style={styles.viewCheckBox} onTouchEnd={() => setIndexChecked(index)}>
                      <View
                        style={{
                          ...styles.checkBox,
                          backgroundColor: indexChecked === index ? Colors.primary2 : Colors.white,
                        }}
                      >
                        <Icon
                          name="icon-check"
                          size={Utils.getWindowHeight() / 100}
                          color={Colors.white}
                        />
                      </View>
                      <View>
                        <Text style={styles.textContent}>{element.title}</Text>
                        <Text style={{ ...styles.textContent, fontWeight: 'bold' }}>{element.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
              <Text style={styles.subValue}>{content}</Text>
            </View>
          </View>
          {showIconArrow ? (
            <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
          ) : null}
        </View>
      </TouchableOpacity>
      <ModalSelect title={I18n.t('account.title_select_card')} visible={isVisible} handleModal={() => setVisible(false)}>
        <ScrollView style={{ height: screenHeight }}>
          {dataCardList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: Metrics.normal * 2,
                paddingVertical: Metrics.normal * 2,
                ...(index !== dataCardList.length - 1 && {
                  borderBottomColor: Colors.gray6,
                  borderBottomWidth: 1,
                }),
              }}
              onPress={() => {
                setCurrentCard(index)
                setVisible(false)
                onSelectCard && onSelectCard(item.contractNumber)
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.primary2,
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Metrics.normal,
                  ...(currentCard !== index
                    ? {
                      borderColor: Colors.gray,
                      borderWidth: 1,
                      backgroundColor: Colors.white,
                    }
                    : {
                      backgroundColor: Colors.primary2,
                    }),
                }}
              >
                <Icon name="icon-check" size={10} color={Colors.white} />
              </View>
              <View>
                <Text
                  style={{ fontSize: 16, color: Colors.textBlack, marginBottom: Metrics.small, maxWidth: screenWidth * 0.8 }}
                >
                  {`${item.cardName} - ${item.cardNo}`}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.gray,
                  }}
                >
                  {`${numberWithCommas(item.availableBalance)} VND`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalSelect>
    </>
  )
}

export default SelectItemCard
