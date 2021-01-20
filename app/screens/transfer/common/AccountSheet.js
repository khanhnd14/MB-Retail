import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native-gesture-handler';
import { Metrics, Colors, Helpers } from '../../../theme'
import { Text, Radio, AmountLabel, BottomSheet } from '../../../components'
import I18n from '../../../translations'

const styles = StyleSheet.create({
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
    padding: Metrics.normal,
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
    flex: 1,
  },
  amount: {
    color: Colors.holder,
  },
  accountName: {
    fontSize: 16,
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

class AccountSheet extends React.Component {
  sheet = React.createRef()

  selectItem = (item) => {
    const { onSelect } = this.props
    this.sheet.current && this.sheet.current.hide()
    if (onSelect) {
      onSelect(item)
    }
  }

  renderItem = ({ item }) => {
    const { defaultValue } = this.props
    const checked = item.acctNo === defaultValue
    return (
      <TouchableOpacity
        style={[Helpers.rowCross, { padding: Metrics.normal }]}
        onPress={() => this.selectItem(item)}
      >
        <Radio checked={checked} />
        <View>
          <Text style={{ fontSize: 16, marginRight: Metrics.medium }}>
            {item.accountInString} - {item.alias}
          </Text>
          <AmountLabel
            style={{ color: Colors.holder, marginTop: Metrics.small * 0.8 }}
            value={item.availableBalance}
            currency="VND"
          />
        </View>
      </TouchableOpacity>
    )
  }

  renderSeparator = () => <View style={styles.line} />

  renderContent = () => {
    const { data } = this.props
    return (
      <View style={styles.content}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeparator}
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
        />
      </View>
    )
  }

  show = () => {
    this.sheet.current && this.sheet.current.show()
  }

  render() {
    return (
      <BottomSheet title={I18n.t('transfer.holder_account')} ref={this.sheet}>
        {this.renderContent()}
      </BottomSheet>
    )
  }
}

AccountSheet.defaultProps = {
  data: [],
}

AccountSheet.propTypes = {
  data: PropTypes.array,
  defaultValue: PropTypes.string,
  onSelect: PropTypes.func
}

export default AccountSheet
