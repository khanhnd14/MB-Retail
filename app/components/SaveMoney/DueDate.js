import * as React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import _ from 'lodash'
import { Colors, Metrics } from '../../theme'
import { Icon, ModalSelect, TextInput, Text } from '..'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
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
    position: 'absolute',
    right: 0,
    top: '45%',
  },
  time: {
    fontWeight: 'bold',
    marginTop: Metrics.tiny,
    fontSize: 16
  },
  modal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.small * 2,
    marginHorizontal: Metrics.normal,
    borderBottomColor: Colors.gray6,
    borderBottomWidth: 1,
    paddingVertical: Metrics.normal
  },
  rate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: Metrics.tiny
  },
  select: {
    color: Colors.gray,
    paddingTop: Metrics.tiny,
    fontSize: 14,
  }
})

const DueDate = ({ data, setDueDate }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentAcc, setCurrentAcc] = React.useState(undefined)
  const [search, setSearch] = React.useState('')
  // console.log('--------------------------------------------------------')
  // console.log('data', data)
  // console.log('--------------------------------------------------------')

  return (
    <TouchableWithoutFeedback onPress={() => setVisible(true)}>
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('account.title_period')}</Text>
        {currentAcc ? <Text style={styles.time}>{currentAcc?.termName}</Text> : <Text style={styles.select}>{I18n.t('account.select')}</Text>}
        <View style={{ marginTop: Metrics.small }}>
          {currentAcc ? <Text style={styles.label}>{I18n.t('saving.choice_duedate')} : {Utils.toStringServerDate(currentAcc?.settlementDate)}</Text> : null}
        </View>
        <Icon name="icon-back" size={24} color={Colors.check} style={styles.icon} />
        <ModalSelect
          title={I18n.t('account.title_select_period')}
          visible={isVisible}
          handleModal={() => setVisible(false)}
        >
          <View
            style={styles.modal}
          >
            <Icon name="icon-search" size={24} color={Colors.primary} />
            <TextInput
              placeholder={I18n.t('application.holder_search')}
              style={{ marginLeft: Metrics.normal, fontSize: 14, flex: 1 }}
              onChangeText={(val) => setSearch(val)}
            />
          </View>
          <ScrollView style={{ height: screenHeight }}>
            {_.filter(data, (item) =>
            item.termName.toLowerCase().includes(search.trim().toLowerCase())
          ).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginHorizontal: Metrics.small * 4,
                paddingVertical: Metrics.small,
                ...(index !== data.length - 1 && {
                  borderBottomColor: Colors.gray6,
                  borderBottomWidth: 1,
                }),
                justifyContent: 'space-between'
              }}
              onPress={() => {
                setCurrentAcc(item)
                setVisible(false)
                setDueDate(item.productCode)
              }}
            >
              <View>
                <Text style={{ fontSize: 16, color: Colors.textBlack }}>{item.termName}</Text>
              </View>
              <View>
                <Text style={styles.rate}>{I18n.t('saving.interest_rate')}: {item.pRate}%/{I18n.t('saving.year')}</Text>
              </View>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </ModalSelect>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DueDate
