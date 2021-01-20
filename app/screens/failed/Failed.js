import React, { useEffect } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import PropTypes from 'prop-types'
import I18n from 'i18n-js'
import { Helpers, Colors, Images, Metrics } from '../../theme'
import { Text, Button, Topbar, ConfirmButton } from '../../components'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainLayout: {
    backgroundColor: '#999999',
    width: '100%',
    flex: 1,
    marginTop: Metrics.medium * 6.5,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Helpers.center,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.medium,
  },
  titleContent: { marginVertical: Metrics.medium * 2, flex: 1 },
  title: { fontWeight: 'bold', fontSize: 24, color: Colors.white, textAlign: 'center' },

  mainBtn: {
    backgroundColor: Colors.white,
    borderRadius: 38,
    marginTop: Metrics.medium,
    ...Helpers.fullWidth,
    ...Helpers.center,
    padding: Metrics.small,
    marginBottom: Metrics.medium * 2.5,
  },
  mainBtnText: {
    color: Colors.gray1,
    fontSize: 18,
    fontWeight: 'bold',
  },

})

const Failed = (props) => {
  const { message, route } = props
  const { redoTransaction, onSwitchTransaction } = route.params

  const switchTransaction = () => {
    if (redoTransaction) {
      Navigation.replace(redoTransaction)
    } else {
      Navigation.popToPop()
    }
  }

  useEffect(() => () => {
    onSwitchTransaction && onSwitchTransaction()
  }, [])

  return (
    <>
      <View style={[Helpers.fill, styles.container]}>
        <Topbar isLogo background={Colors.white} />
        <View style={styles.mainLayout}>
          <View
            style={{
              marginTop: -Metrics.normal * 5,
              height: Metrics.medium * 7.5,
              overflow: 'hidden',
              width: Metrics.medium * 7.5,
              borderRadius: Metrics.medium * 3.75,
            }}
          >
            <Image
              source={Images.failed}
              resizeMode="contain"
              style={{
                overflow: 'hidden',
                backgroundColor: Colors.white,
                width: Metrics.medium * 7.55,
                height: Metrics.medium * 7.55,
              }}
            />
          </View>
          <View style={styles.titleContent}>
            <Text style={styles.title}>{I18n.t('fail.failed_exchange')}</Text>
            <Text style={styles.title}>{message}</Text>
          </View>
          <ConfirmButton
            textColor={Colors.textBlack}
            color={Colors.white}
            onPress={() => switchTransaction()}
            text={I18n.t('fail.other')}
            styleButton={{ width: '100%' }}

          />
        </View>
      </View>
    </>
  )
}

Failed.defaultProps = {
  message: '',
}

Failed.propTypes = {
  message: PropTypes.string,
}
export default Failed
