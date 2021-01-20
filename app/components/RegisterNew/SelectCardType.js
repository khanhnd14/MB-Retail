/* eslint-disable no-mixed-operators */
import * as React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Colors, Metrics } from '../../theme';
import { ModalSelect, Icon, Text } from '..';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {

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
    color: Colors.gray1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    color: Colors.gray2,
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

const SelectCardType = ({ data, setRef, onChoiceCardType }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentAcc, setCurrentAcc] = React.useState(0)
  const ref = React.useRef({ setVisible })
  React.useEffect(() => {
    setRef(ref)
  }, [])
  return (
    <View style={styles.container} onTouchStart={() => setVisible(true)}>
      <ModalSelect title="Chọn loại giấy tờ" visible={isVisible} handleModal={() => setVisible(false)}>
        <ScrollView style={{ height: screenHeight }}>
          {data && data.map((item, index) => (
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
                onChoiceCardType(item)
                // onSelectRolloutAccountNo && onSelectRolloutAccountNo(item.acctNo)
                // changeFromAccount && changeFromAccount(item.acctNo)
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
                  style={{ fontSize: 16, color: Colors.textBlack, marginBottom: Metrics.small }}
                >
                  {item.id}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 14,
                    color: Colors.gray,
                  }}
                >
                  {`${numberWithCommas(item.availableBalance)} VND`}
                </Text> */}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalSelect>
    </View>
  )
}

export default SelectCardType
