import React, { Fragment, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, } from '../../../components'
import { gameOperations } from '../../../state/game'
import I18n from '../../../translations'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  no: {
    flex: 1,
    paddingVertical: Metrics.small,
  },
  word: {
    flex: 3,
    paddingVertical: Metrics.small,
  },
  quality: {
    flex: 1,
    paddingVertical: Metrics.small,
  },
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
})

const ListWordsScreen = () => {
  const dispatch = useDispatch()
  const { listWords } = useSelector((state) => state.game)

  useEffect(() => {
    dispatch(gameOperations.getData())
  }, [])

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.no}>{item.no}</Text>
      <Text style={[styles.word, { fontWeight: 'bold' }]}>{item.word}</Text>
      <Text style={[styles.quality, { fontWeight: 'bold' }]}>{item.wordQuantity}</Text>
    </View>
  )
  const renderSeparator = () => <View style={styles.line} />

  return (
    <Fragment>
      <Topbar title={I18n.t('main.loyaty')} subTitle={I18n.t('msbplus.list_words')} />
      <View style={Helpers.fill}>
        <View style={styles.container}>
          <View
            style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.line }}
          >
            <Text style={styles.no}>{I18n.t('msbplus.no')}</Text>
            <Text style={styles.word}>{I18n.t('msbplus.words')}</Text>
            <Text style={styles.quality}>{I18n.t('msbplus.quality')}</Text>
          </View>
          <FlatList
            data={listWords}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
      </View>
    </Fragment>
  )
}
export default ListWordsScreen
