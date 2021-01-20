import React from 'react'
import { TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { Metrics, Colors, Helpers } from '../../../theme'
import { Text, Radio, BottomSheet } from '../../../components'
import I18n from '../../../translations'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.transparent,
  },
  header: {
    backgroundColor: Colors.primary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Metrics.medium * 2,
    paddingVertical: Metrics.small * 0.8,
  },
  content: {
    backgroundColor: Colors.white,
    height: 600,
    padding: Metrics.normal,
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
    flex: 1,
  },
  subTitle: {
    paddingHorizontal: Metrics.normal,
    paddingVertical: Metrics.tiny
  },
  close: {},
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
})

class StockBenefitSheet extends React.Component {
  sheet = React.createRef()

  onSelectItem = (item) => {
    const { selectAcc } = this.props
    if (selectAcc) {
     selectAcc(item)
    }
    this.hide()
  }

  renderItem = ({ item }) => {
    const { defaultValue } = this.props
    const checked = item.acctNo === defaultValue.acctNo
    return (
      <TouchableOpacity style={[Helpers.rowCross, { padding: Metrics.normal }]} onPress={() => this.onSelectItem(item)}>
        <Radio checked={checked} />
        <Text style={{ fontSize: 16 }}>
          {item.acctNo} - {item.acctName}
        </Text>
      </TouchableOpacity>
    )
  }

  renderSeparator = () => <View style={styles.line} />

  renderContent = () => {
    const { data } = this.props
    return (
      <View style={styles.content}>
        <Text style={[styles.subTitle, { color: Colors.primary2 }]}>{I18n.t('stocktransfer.stockCompany')}</Text>
        <Text style={styles.subTitle}>{data ? data.stockAcc : ''}</Text>
        <Text style={[styles.subTitle, { color: Colors.primary2 }]}>{I18n.t('stocktransfer.selectSubAcc')}</Text>
        {data && data.lstAcc && (
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={data.lstAcc}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderItem}
          />
        )}
      </View>
    )
  }

  show = () => {
    this.sheet.current && this.sheet.current.show()
  }

  hide = () => {
    this.sheet.current && this.sheet.current.hide()
  }

  render() {
    return (
      <BottomSheet title={I18n.t('stocktransfer.subAcc')} ref={this.sheet}>
        {this.renderContent()}
      </BottomSheet>
    )
  }
}

StockBenefitSheet.defaultProps = {
  data: {},
  defaultValue: {},
}

StockBenefitSheet.propTypes = {
  data: PropTypes.object,
  defaultValue: PropTypes.object,
}

export default StockBenefitSheet
