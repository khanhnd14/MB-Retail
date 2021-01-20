import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../../theme'
import { Topbar, MenuItem } from '../../../components'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.medium
  },
  item: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 2.8,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...ApplicationStyles.shadow,
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2 },
  
})

const ODServiceScreen = () => {
  // const dispatch = useDispatch()
  

  // React.useEffect(() => {
    
  // }, [])

  return (
    <>
      <Topbar background={Colors.mainBg} title={I18n.t('overdraft.fromOnlineSaving.title')} />
      <View style={[Helpers.fill, styles.container]}>

        <View>
          <MenuItem
            onPress={() => Navigation.push('CreateOD')}
            text={I18n.t('overdraft.fromOnlineSaving.openScreenTitle')}
            leftColor={Colors.yellow}
          />
          {/* <MenuItem
            onPress={() => Navigation.push('ODServiceScreen')}
            text={I18n.t('overdraft.fromOnlineSaving.closeScreenTitle')}
            leftColor={Colors.yellow}
          /> */}
        </View>
      </View>
    </>
  )
}
export default ODServiceScreen
