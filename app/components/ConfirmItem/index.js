import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Metrics, Colors, Helpers } from '../../theme'
import ConfirmIcon from '../ConfirmIcon'
import Text from '../MsbText'
import AmountLabel from '../AmountLabel'

const styles = StyleSheet.create({
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'normal',
    paddingVertical: Metrics.tiny / 2,
  },
  contentAmount: {
    color: Colors.text,
    paddingVertical: Metrics.tiny / 2,
  },
})

const ConfirmItem = (props) => {
  const { title, content, subContent, amount, subAmount, style, contentStyle, icon = true } = props

  return (
    <View style={[styles.element, style || {}]}>
      <View style={Helpers.fill}>
        <Text style={styles.title}>{title}</Text>
        {content !== null && <Text style={[styles.contentBold, contentStyle || {}]}>{content}</Text>}
        {amount !== null && <AmountLabel style={[styles.contentBold, contentStyle || {}]} value={amount} currency="VND" />}
        {subContent !== null && <Text style={styles.contentAmount}>{subContent}</Text>}
        {subAmount !== null && <AmountLabel style={styles.contentAmount} value={subAmount} currency="VND" />}
      </View>
      {icon && <ConfirmIcon />}
    </View>
  )
}

ConfirmItem.defaultProps = {
  title: '',
  content: null,
  subContent: null,
  amount: null,
  subAmount: null,
}

ConfirmItem.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  subContent: PropTypes.string,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  subAmount: PropTypes.number,
}
export default ConfirmItem
