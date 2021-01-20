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
    fontSize: 14,
  },
  name: {
    color: Colors.gray1,
    fontSize: 14,
  },
  icon: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: 0,
    top: '45%',
  },
  time: {
    fontSize: 14
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

const DDAccountSave = ({ data, setDDAcountSave, currentAccBee }) => {
  const [currentAcc, setCurrentAcc] = React.useState(undefined)
  console.log('--------------------------------------------------------')
  console.log('data', data)
  console.log('--------------------------------------------------------')

  React.useEffect(() => {
    if (currentAccBee) {
      const acc = _.find(data, (e) => e.receiptNoInString === currentAccBee.content)
      setCurrentAcc(acc)
      setDDAcountSave(acc.receiptNoInString)
    }
  }, [currentAccBee])

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('saving.number_deposit_saving')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Metrics.small }}>
          {currentAcc ? <Text style={styles.label}>{currentAcc.receiptNoInString}{' '}</Text> : null}
          {currentAcc ? <Text style={styles.time}>{currentAcc?.alias}</Text> : <Text style={styles.select}>{I18n.t('account.select')}</Text>}
        </View>

      </View>
    </TouchableWithoutFeedback>
  )
}

export default DDAccountSave
