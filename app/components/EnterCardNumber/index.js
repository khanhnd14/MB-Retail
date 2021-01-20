import * as React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Colors, Metrics } from '../../theme'
import I18n from '../../translations'
import { productOperations } from '../../state/product'
import * as productTypes from '../../state/product/types'
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
    color: Colors.gray,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
})

const EnterCardNumber = ({ onChangeCardNumber, numberCard, placeholder, defaultNumberCard }) => {
  const [value, setValue] = React.useState('')
  const [nameCard, setNameCard] = React.useState(null)
  const dispatch = useDispatch()
  const onChangeText = (e) => {
    setValue(e);
  }
  const onBlur = () => {
    onChangeCardNumber(value)
    setValue(value)
    const body = {
      toCardNumber: value
    }
    value && dispatch(productOperations.getBenefitNameApiCard(body))
  }
  const { benefitNameApiCard } = useSelector((state) => state.product)
  React.useEffect(() => {
    setNameCard(benefitNameApiCard?.name)
  }, [value, benefitNameApiCard])

  React.useEffect(() => () => {
      dispatch({
        type: productTypes.GET_BENEFIT_NAME_API_CARD_COMPLETED,
        payload: null
      })
    }, [])

    React.useEffect(() => {
      if (defaultNumberCard) {
        onChangeCardNumber(defaultNumberCard)
        setValue(defaultNumberCard)
        const body = {
          toCardNumber: defaultNumberCard
        }
        dispatch(productOperations.getBenefitNameApiCard(body))
      }
    }, [defaultNumberCard])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('product.card_number')}</Text>
      <View
        style={{
          marginTop: Metrics.small,
        }}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Nhập giá trị khác'}
          placeholderTextColor={Colors.gray}
          onBlur={onBlur}
        />
        {numberCard ? <Text style={styles.subValue}>{nameCard}</Text> : null}
      </View>
    </View>
  )
}

export default EnterCardNumber
