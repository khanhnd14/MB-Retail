import React, { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import MsbTextInput from '../../components/MsbTextInput'
import { Images } from '../../theme'
import i18n from '../../translations'
import { Utils } from '../../utilities'
import styles from './style'

const SearchBar = ({ setLstBranches, lstBranch, sheetRef }) => {
  const [textInput, setTextInput] = useState('')

  const _onSearch = (text) => {
    setTextInput(text)
  }
  const filterBranches = () => {
    setLstBranches(
      lstBranch.filter((item) =>
        item?.name
          ?.trim()
          ?.toLowerCase()
          ?.includes(textInput?.trim()?.toLowerCase())
      )
    )
    sheetRef?.current?.open()
  }
  return (
    <View style={styles.searchBar}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '90%' }}>
          <MsbTextInput
            autoCorrect={false}
            value={textInput}
            onChangeText={(text) => _onSearch(text)}
            placeholder={i18n.t('product.atm.action_search')}
            placeholderTextColor="#B1B2B2"
            underlineColorAndroid="transparent"
            style={[styles.searchBarInput]}
          />
        </View>
        <TouchableOpacity onPress={filterBranches} style={{ width: '10%' }}>
          <Image
            source={Images.search}
            style={{
              width: Utils.getRatioDimension(25),
              height: Utils.getRatioDimension(25),
              tintColor: 'black',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchBar
