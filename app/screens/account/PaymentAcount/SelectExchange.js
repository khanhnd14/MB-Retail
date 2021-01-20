import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../../theme'
import { Text } from '../../../components'

const styles = StyleSheet.create({
  container: {
  },
  item: {
    paddingVertical: Metrics.tiny,
  },
  textItem: {
    color: Colors.gray9
  }
})

export default ({ selectExchange, transName }) => {
  const exchanges = [
    {
      name: I18n.t('transfer.all'),
      key: ''
    },
    {
      name: I18n.t('transfer.title_interbank247'),
      key: 'Y'
    },
    {
      name: I18n.t('product.internal'),
      key: 'N'
    },
    {
      name: I18n.t('account.exchange.other_exchange'),
      key: 'S'
    }
  ]
  const [selected, setSelected] = useState(transName || exchanges[0].name)
  const [isShow, setIsShow] = useState(false)

  const onFilter = (id, name) => {
    setSelected(name)
    selectExchange(id, name)
    setTimeout(() => {
      setIsShow(false)
    }, 0);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsShow(true)}>
        <Text>
          {selected}
        </Text>
      </TouchableOpacity>
      {isShow ? (
        <View>
          <Animatable.View
            animation="fadeIn"
            duration={500}
            style={{}}
          >
            {exchanges.map((value, index) => {
              if (value.name === selected) return null
              return (
                <TouchableOpacity
                  onPress={() => onFilter(value.key, value.name)}
                  key={index}
                  style={styles.item}
                >
                  <Text style={styles.textItem}>{value.name}</Text>
                </TouchableOpacity>
                )
            }
            )}
          </Animatable.View>
        </View>
        ) : null}
    </View>
  )
}
