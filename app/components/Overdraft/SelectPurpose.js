import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../theme'
import { Topbar, MenuItem } from '..'
import * as Navigation from '../../navigation'
import { productOperations } from '../../state/product'
import { Icon, ModalSelect, TextInput, Text, ConfirmButton,AmountLabel } from '..'
import CheckBox from '../Checkbox'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.lineSep,
    borderBottomWidth: 1,
    marginHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2 },
  select: {
    color: Colors.gray,
    fontSize: 14,
  },
  selectCollatView:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop: Metrics.small
  },
  fdRowView:{
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:Colors.lineSep,
    paddingVertical:10
  },
  itemText:{
    paddingHorizontal:10,
    fontWeight:'bold'
  },
  selectedText:{
    // color:'black'
  }
})
const SelectPurpose = ({data,onSubmit}) => {
  const [isVisible, setVisible] = React.useState(false)
  const [selectedPurpose, setSelectedPurpose] = React.useState(null)
  React.useEffect(() => {
    // console.log('data',data,onSubmit);
    if (data && data.length) {
      setSelectedPurpose(data[0])
    }
  }, [])

  function handleSubmit(pp){
    setSelectedPurpose(pp)
    onSubmit(pp)
    setVisible(false)
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setVisible(true)}>
        <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.openingPurpose')}</Text>
        <View style={styles.selectCollatView}>
          {selectedPurpose ? 
          <Text style={[styles.selectedText,{}]}>{selectedPurpose.desc}</Text>
          :
          <Text style={styles.select}>{I18n.t('overdraft.fromOnlineSaving.openingPurposePlaceHolder')}</Text>
          }
          <Icon name="icon-detail" size={20} color={Colors.check} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <ModalSelect
          title={I18n.t('overdraft.fromOnlineSaving.openingPurpose')}
          visible={isVisible}
          handleModal={() => setVisible(false)}
      >
        <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow: 1}} bounces={false}>
          <View style={{flex:1,marginHorizontal:16}}>
            {data?.map((pp, index) => {
              return (
                <TouchableOpacity key={pp.code} style={styles.fdRowView} onPress={() => handleSubmit(pp)}>
                  <View>
                    <Text style={styles.itemText}>{pp.desc}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </ModalSelect>
    </>
  )
}
export default SelectPurpose
