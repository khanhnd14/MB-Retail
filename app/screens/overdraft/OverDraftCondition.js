import React, { useState, Fragment, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import HTML from 'react-native-render-html'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import I18n from '../../translations'
import { Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'
import { Text, ConfirmButton, Radio, Topbar } from '../../components'
import * as Navigation from '../../navigation'
import { overdraftOperations } from '../../state/overdraftstaff'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: Metrics.normal,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: Metrics.normal,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    marginTop: Metrics.normal,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    color: Colors.primary2,
  },
  line: {
    marginHorizontal: Metrics.normal,
    marginTop: Metrics.normal,
    height: 1,
    backgroundColor: Colors.line,
  },
  checkBox: {
    marginHorizontal: Metrics.normal,
    paddingVertical: Metrics.normal,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
})

const OverDraftCondition = ({ route }) => {
  const { params } = route
  const dispatch = useDispatch()
  const { prepareData, prepareError, initData } = useSelector((state) => state.overdraftstaff)
  const [checked, setCheck] = useState(false)
  const [loading, setLoading] = useState(false)
  const { terms } = initData || {}
  useEffect(() => {
    if (loading && prepareData) {
      setLoading(false)
      const { body } = params

      Navigation.push('OverDraftVerify', { body })
    }
  }, [prepareData])

  useEffect(() => {
    if (loading && prepareError) {
      setLoading(false)
    }
  }, [prepareError])
  const classesStyles = {
    title: {
      color: Colors.primary2,
      paddingVertical: 10,
      fontWeight: 'bold',
      fontSize: 14,
    },
    content: {
      color: Colors.textBlack,
      fontSize: 14,
      textAlign: 'justify',
    },
  }

  const onRegister = () => {
    setLoading(true)
    const { body } = params
    dispatch(overdraftOperations.prepareRegister(body))
  }

  const onLinkPress = (event, href) => {
    console.log('====================================')
    console.log(href)
    console.log('====================================')
    Utils.openUrl(href)
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('overdraft.title')} subTitle={I18n.t('overdraft.sub_title')} />
      <View style={[Helpers.fill, styles.container]}>
        <ScrollView
          style={Helpers.fullWidth}
          showsVerticalScrollIndicator={false}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{I18n.t('overdraft.title_condition').toUpperCase()}</Text>
          </View>
          <View style={styles.line} />

          <HTML
            ignoredStyles={[...IGNORED_TAGS, 'font-family']}
            allowFontScaling={false}
            classesStyles={classesStyles}
            baseFontStyle={{
              fontSize: Utils.getRatioDimension(14),
            }}
            html={terms}
            onLinkPress={onLinkPress}
            textSelectable
          />
        </ScrollView>
        <View style={styles.line} />
        <Radio
          size={Utils.getRatioDimension(18)}
          style={[styles.checkBox]}
          textStyle={styles.textCheckBox}
          text={I18n.t('overdraft.text_condition')}
          checked={checked}
          onPress={() => {
            setCheck(!checked)
          }}
        />
      </View>

      <ConfirmButton
        onPress={() => onRegister()}
        loading={loading}
        disabled={!checked}
        color={!checked ? Colors.gray4 : Colors.primary2}
      />
    </Fragment>
  )
}

export default OverDraftCondition
