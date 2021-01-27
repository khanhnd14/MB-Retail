/* eslint-disable no-mixed-operators */
import * as React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import I18n from 'i18n-js'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../../theme'
import { Text, Icon } from '..'
import MsbIcon from '../MsbIcon'
import ModalSelect from '../ModalSelect'
import { numberWithCommas } from '../../utilities/common'
import { Utils } from '../../utilities'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.normal,
    paddingHorizontal: Metrics.normal + Metrics.tiny,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentLayout: {
    marginTop: Metrics.small,
    // height: 45,
  },
  label: {
    color: Colors.textBlack,
    fontSize: 16,

  },
  accountNo: {
    color: Colors.textBlack,
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: Utils.getWindowWidth() / 1.3
  },
  amount: {
    color: Colors.textBlack,
    fontSize: 14,
    marginTop: Metrics.tiny,
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: Metrics.normal,
    top: '50%',
  },
  iconChecked: {
    color: Colors.white,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  accountContainer: {
    flexDirection: 'row',
    width: '90%',
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
    width: screenWidth * 90 / 100,
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
  },
  view: {
    margin: 0,
    justifyContent: 'flex-end',
  },
})

const SelectAccount = ({ data, onSelectRolloutAccountNo, changeFromAccount, title, style }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentAcc, setCurrentAcc] = React.useState(0)
  React.useEffect(() => {
    onSelectRolloutAccountNo && onSelectRolloutAccountNo(data[currentAcc] && data[currentAcc].acctNo)
  }, [data])
  return (
    <TouchableWithoutFeedback onPress={() => setVisible(true)}>
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title || I18n.t('transfer.rollout_account')}</Text>
        <View style={styles.contentLayout}>
          {currentAcc === null ? (
            <Text style={styles.label}>{I18n.t('transfer.holder_account')}</Text>
        ) : (
          <>
            <Text style={styles.accountNo}>
              {`${data[currentAcc] ? data[currentAcc].accountInString : ''} - ${data[currentAcc] ? data[currentAcc].alias : ''}`}
            </Text>
            <Text style={styles.amount}>
              {`${numberWithCommas(data[currentAcc] ? data[currentAcc].availableBalance : '')} ${data[currentAcc]?.currencyCode}`}
            </Text>
          </>
          )}
        </View>
        <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
        <ModalSelect maxHeight={300} title="Chọn tài khoản" visible={isVisible} handleModal={() => setVisible(false)}>
          <ScrollView style={{ height: screenHeight }}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: Metrics.normal * 2,
                paddingVertical: Metrics.normal,
                ...(index !== data.length - 1 && {
                  borderBottomColor: Colors.gray6,
                  borderBottomWidth: 1,
                }),
              }}
                onPress={() => {
                setCurrentAcc(index)
                setVisible(false)
                onSelectRolloutAccountNo && onSelectRolloutAccountNo(item.acctNo)
                changeFromAccount && changeFromAccount(item.acctNo)
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
                  ...(currentAcc !== index
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
                    numberOfLines={1}
                    style={{
                    fontSize: 16,
                    color: Colors.textBlack,
                    marginBottom: Metrics.small,
                    width: Utils.getWindowWidth() - (Metrics.medium * 5),
                  }}
                  >
                    {`${item.accountInString} - ${item.alias}`}
                  </Text>
                  <Text
                    style={{
                    fontSize: 14,
                    color: Colors.gray,
                  }}
                  >
                    {`${numberWithCommas(item.availableBalance)} ${item?.currencyCode}`}
                  </Text>
                </View>
              </TouchableOpacity>
          ))}
          </ScrollView>
        </ModalSelect>
      </View>
    </TouchableWithoutFeedback>
  )
}

SelectAccount.defaultProps = {
}

SelectAccount.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object
}
export default SelectAccount
