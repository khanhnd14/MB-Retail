import * as React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { Text } from '..'

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
  input: {
    color: Colors.gray1,
    fontSize: 16,
    height: 24,

    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeHolder: {
    color: Colors.gray4,
    fontSize: 16,
    fontWeight: 'normal',
  },
})

const InterestRate = () => {
  const rate = useSelector((state) => state.save.rate)
  const loadingRate = useSelector((state) => state.save.loadingRate)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('account.interest_rate')}</Text>
      <View
        style={{
          marginTop: Metrics.small,
        }}
      >
        {rate ? (
          <Text style={styles.subValue}>{rate} %/{I18n.t('saving.year')}</Text>
        ) : (
          !loadingRate && <Text style={styles.placeHolder} />
        )}
        {loadingRate ? <ActivityIndicator /> : null}
      </View>
    </View>
  )
}
export default InterestRate
