import * as React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import _ from 'lodash'
import { Colors, Metrics } from '../../theme'
import { Icon, ModalSelect, TextInput, Text } from '..'
import Checkbox from '../Checkbox'
import { Utils } from '../../utilities'

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {

  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.gray2,
    fontSize: 16,
  },
  name: {
    color: Colors.gray1,
    fontSize: 16,
  },
  icon: {
    transform: [{ rotate: '180deg' }],
  },
  content: {

  },
  modal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.small * 2,
    marginHorizontal: Metrics.normal,
    borderBottomColor: Colors.gray6,
    borderBottomWidth: 1,
  },
  rate: {
    fontSize: 10,
    color: Colors.gray3
  },
  select: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.normal
  },
  component: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
    marginHorizontal: Metrics.normal * 2,
  },
  itemContent: {
    flexDirection: 'row',
    paddingBottom: Metrics.tiny,
    paddingLeft: Metrics.normal * 3
  },
  dot: {
    color: Colors.primary2,
    paddingRight: Metrics.tiny * 3
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    color: Colors.white,
    borderRadius: Metrics.tiny * 2.5,
    borderColor: Colors.primary2,
  },
  subCheckbox: {
    backgroundColor: Colors.primary2,
    width: Metrics.tiny * 4,
    height: Metrics.tiny * 4,
    borderRadius: Metrics.tiny * 2
  },
})

const Select = ({ data, title, content, choiceItem, component, defaultItem, isSearch }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentAcc, setCurrentAcc] = React.useState(null)
  const [search, setSearch] = React.useState('')

  const onChoice = (item) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    // setCurrentAcc(_.findIndex(data, (e) => e.id === item.id))
    setCurrentAcc(item)
    choiceItem(item)
  }

  React.useEffect(() => {
      // setCurrentAcc(_.findIndex(data, (e) => e.id === defaultItem.id))
      setCurrentAcc(defaultItem)
  }, [defaultItem])

  React.useEffect(() => {
    if (isVisible) {
      setSearch('')
    }
  }, [isVisible])

  console.log('====================================');
  console.log(data, defaultItem);
  console.log('====================================');

  return (
    <TouchableWithoutFeedback onPress={() => setVisible(true)}>
      <View style={styles.container}>

        {(component) ? component(() => setVisible(true)) : (
          <View style={styles.component}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.select}>
              <Text style={[styles.content, { color: currentAcc ? undefined : Colors.gray }]}>{currentAcc?.name || content}</Text>
              <Icon name="icon-back" size={Metrics.normal} color={Colors.buttonPrimary[0]} style={styles.icon} />
            </View>
          </View>
        )}

        <ModalSelect
          title={`${title}`}
          visible={isVisible}
          handleModal={() => setVisible(false)}
          maxHeight={380}
        >
          {isSearch && (
          <View
            style={styles.modal}
          >
            <Icon name="icon-search" size={24} color={Colors.primary} />
            <TextInput
              placeholder="Tìm kiếm"
              style={{ marginLeft: Metrics.normal, fontSize: 14, flex: 1 }}
              onChangeText={(val) => setSearch(val)}
            />
          </View>
)}
          {data && (
          <ScrollView style={{ height: screenHeight }}>
            {_.filter(data, (item) =>
            Utils.getUnicode(item.name.toLowerCase()).includes(Utils.getUnicode(search.trim().toLowerCase()))
          ).map((item, index) => {
            const contents = item.descCombo && item.descCombo.split('*')

            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginHorizontal: Metrics.small * 4,
                  paddingVertical: Metrics.small,
                  ...(index !== data.length - 1 && {
                    borderBottomColor: Colors.gray6,
                    borderBottomWidth: 1,
                  }),
                }}
                onPress={() => {
                  onChoice(item)
                  setVisible(false)
                }}
              >
                {contents ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      name={item.name}
                      onChange={() => {
                      onChoice(item)
                      setVisible(false)
                    }}
                      style={styles.checkbox}
                      size={Metrics.tiny * 5}
                      color={Colors.white}
                    >
                      <View style={styles.subCheckbox} />
                    </Checkbox>
                    <Text style={{ fontSize: 16, color: Colors.textBlack, fontWeight: 'bold', paddingLeft: Metrics.normal }}>{item.name}</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ fontSize: 16, color: Colors.textBlack, paddingLeft: Metrics.normal }}>{item?.name}</Text>
                    {item?.address && <Text style={{ fontSize: 12, color: Colors.gray, paddingLeft: Metrics.normal, paddingTop: Metrics.tiny }}>{item.address.trim()}</Text>}
                  </View>
                )}

                {
                  contents && contents.map((value, index) => value ? (
                    <View style={styles.itemContent}>
                      <Text style={styles.dot}>•</Text>
                      <Text>{value && value.trim()}</Text>
                    </View>
                    ) : null)
                }

              </TouchableOpacity>
            )
          })}
          </ScrollView>
)}
        </ModalSelect>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Select
