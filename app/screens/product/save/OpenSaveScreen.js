import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet } from 'react-native'
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
  icon: { color: Colors.iconGray, fontSize: 40, marginRight: 20 },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  registerTest: {
    fontWeight: 'bold',
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    marginTop: Metrics.normal * 3,
    marginLeft: Metrics.normal * 2
  },
  price: {

    fontFamily: 'Helvetica',
    marginTop: Metrics.tiny
  },
  note: {
    alignSelf: 'center',
    position: 'relative',
    bottom: -Metrics.medium * 10,
    fontWeight: 'bold'
  }
})

const OpenSaveScreen = () => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.save.categories)
  const getNewCategories = () => {
    let newCate = []
    categories.forEach(item => {
      newCate = [
        ...newCate,
        {
          catCode: item.catCode,
          catName: item.catName,
          description: item.description
        }
      ]
    })

    return newCate
  }

  React.useEffect(() => {
    dispatch(
      productOperations.getServiceList({
        moduleType: 'BP',
      })
    )
    dispatch(
      productOperations.getBillAlias()
    )
  }, [])

  return (
    <>
      <Topbar background={Colors.mainBg} title={I18n.t('account.open_save')} />
      <ScrollView style={[Helpers.fill, styles.container]}>

        {
          getNewCategories().map((value, index) => (
            <MenuItem
              key={index}
              onPress={() => Navigation.push('SubOpenSaveScreen', { title: value.catName, typeSave: value.description, catCode: value.catCode, index })}
              text={value.catName}
              leftColor={Colors.yellow}
            />

          ))
        }

        {/* Tạm ẩn đi */}
        {/* <Text style={styles.note}>
          {I18n.t('saving.interesting_rate')}
        </Text> */}
      </ScrollView>
    </>
  )
}
export default OpenSaveScreen
