import * as React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { Colors, Metrics } from '../../theme'
import { Icon, ModalSelect, TextInput, Text } from '..'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingBottom: Metrics.normal,
    paddingTop: Metrics.normal,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: Colors.gray
  },
  name: {
    color: Colors.gray1,
    fontSize: 14,
  },
  icon: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: 0,
    top: '60%',
  },
})

const SelectSupplier = ({ data, onSelectItemService, serviceNameFill, label }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentAcc, setCurrentAcc] = React.useState(null)
  const [search, setSearch] = React.useState('')
  React.useEffect(() => {
    if (!isVisible) {
      setSearch('')
    }
  }, [isVisible])
  return (
    <View style={styles.container} onTouchStart={() => setVisible(true)}>
      <Text style={styles.title}>{label || I18n.t('product.title_supplier')}</Text>
      <View style={{ marginTop: Metrics.small }}>
        {currentAcc === null ? (
          <>
            {serviceNameFill ? <Text style={[styles.label, { color: Colors.black }]}>{serviceNameFill}</Text> : <Text style={styles.label}>{I18n.t('product.title_select_supplier')}</Text>}
          </>
        ) : (
          <Text style={styles.name}>{currentAcc.serviceName || ''}</Text>
          )}
      </View>
      <Icon name="icon-back" size={24} color={Colors.check} style={styles.icon} />
      <ModalSelect
        title={I18n.t('product.title_select_supplier')}
        visible={isVisible}
        handleModal={() => setVisible(false)}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: Metrics.tiny,
            paddingHorizontal: Metrics.small * 2,
            marginHorizontal: Metrics.normal,
            borderBottomColor: Colors.gray6,
            borderBottomWidth: 1,
          }}
        >
          <Icon name="icon-search" size={20} color={Colors.primary} />
          <TextInput
            placeholder={I18n.t('application.holder_search')}
            style={{
              padding: Metrics.normal
            }}
            onChangeText={(val) => setSearch(val)}
            returnKeyType="done"
            value={search}
          />
        </View>
        <ScrollView style={{ marginBottom: Metrics.normal }}>
          {_.filter(data, (item) =>
            item.serviceName.toLowerCase().includes(search.trim().toLowerCase())
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
              }}
              onPress={() => {
                console.log('====================================');
                console.log('onpress', item);
                console.log('====================================');
                setCurrentAcc(item)
                onSelectItemService(item.serviceId)
                setVisible(false)
              }}
            >
              <View>
                <Text style={{ fontSize: 16, color: Colors.textBlack }}>{item.serviceName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalSelect>
    </View>
  )
}

export default SelectSupplier
