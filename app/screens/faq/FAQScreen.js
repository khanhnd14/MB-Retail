import React, { Fragment, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { Helpers, Metrics, Colors } from '../../theme'
import { Topbar, Text } from '../../components'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    marginBottom: Metrics.medium,
  },
  itemContainer: {
    paddingHorizontal: Metrics.normal * 2,
    paddingVertical: Metrics.small,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.line,
    backgroundColor: Colors.mainBg,
  },
  contentContainer: {
    paddingHorizontal: Metrics.normal * 2,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    height: Metrics.small * 13,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.textBlack,
  },
  itemContent: {
    fontSize: 14,
    marginVertical: Metrics.tiny,
    color: '#4F4F4F',
  },
  itemTime: {
    fontSize: 10,
    color: '#4F4F4F',
  },
  itemIcon: {
    width: Metrics.normal * 1.6,
    height: Metrics.normal * 1.6,
    borderRadius: Metrics.normal,
    backgroundColor: Colors.primary2,
  },
})
const customData = require('../../assets/data/qa.json')

const FAQScreen = () => {
  const [activeSections, setActiveSection] = useState([])

  const _renderHeader = (section) => (
    <View style={[styles.itemContainer]}>
      <Text style={styles.itemTitle}>
        {section.stt}. {section.question}
      </Text>
    </View>
  )

  const _renderContent = (section) => (
    <Text style={[styles.contentContainer]}>{section.answer}</Text>
  )

  const _updateSections = (actS) => {
    setActiveSection(actS)
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('faq.title')} subTitle={I18n.t('faq.desc')} />

      <ScrollView style={[Helpers.fill, styles.container]} showsVerticalScrollIndicator={false}>
        <Accordion
          sections={customData}
          touchableComponent={TouchableOpacity}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
    </Fragment>
  )
}
export default FAQScreen
