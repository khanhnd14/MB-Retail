/* eslint-disable no-mixed-operators */
import * as React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../../theme'
import Text from '../MsbText'
import MsbIcon from '../MsbIcon'
import ModalSelect from '../ModalSelect'
import { Utils } from '../../utilities'
import SearchInput from '../SearchInput'

const screenHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  title: {
    color: Colors.primary2,
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: Utils.getRatioDimension(8),
  },
  contentLayout: {
    paddingVertical: Utils.getRatioDimension(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    color: Colors.textBlack,
    flex: 1,
  },
  labelReadOnly: {
    color: '#8E8E93',
    flex: 1,
  },
  accountContainer: {
    flexDirection: 'row',
    width: '90%',
  },
  content: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
  },
  view: {
    margin: 0,
    justifyContent: 'flex-end',
  },
})
var timeOut

const SelectBox = ({
  data,
  onSelect,
  defaultValue,
  title,
  titleModal,
  hideTitle,
  isSearch,
  readOnly,
  textHolder
}) => {
  const [isVisible, setVisible] = React.useState(false)
  const [currentItem, setCurrentItem] = React.useState(defaultValue)
  const [textSearch, setTextSearch] = React.useState('')
  const [lists, setData] = React.useState(data)

  React.useEffect(() => {
    setData(data)
  }, [data])

  const getFilter = (text) => {
    try {
      const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
      const regex = new RegExp(safe, 'i')
      const filter = (row) => regex.test(row.value)
      return data?.filter(filter)
    } catch (error) {
      return []
    }
  }

  const search = (val) => {
    setTextSearch(val)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const listData = getFilter(val)
      setData(listData)
    }, 300)
  }

  const onClose = () => {
    setVisible(false)
    setTextSearch('')
    setData(data)
  }
  return (
    <TouchableWithoutFeedback disabled={readOnly} onPress={() => setVisible(true)}>
      <View style={styles.container}>
        {!hideTitle && <Text style={styles.title}>{title}</Text>}
        <View style={styles.contentLayout}>
          <Text style={readOnly ? styles.labelReadOnly : styles.label}>{defaultValue ? defaultValue.value : textHolder}</Text>
          {!readOnly && <MsbIcon name="icon-detail" size={18} color={Colors.primary2} />}
        </View>
        <ModalSelect
          maxHeight={300}
          title={titleModal || title}
          visible={isVisible}
          handleModal={() => onClose()}
        >
          {isSearch && (
            <SearchInput value={textSearch} onChangeText={search} onSubmitEditing={() => {}} />
          )}
          <ScrollView style={{ height: screenHeight }} showsVerticalScrollIndicator={false}>
            {lists?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: Metrics.normal * 2,
                  paddingVertical: Metrics.normal,
                  ...(index !== data.length - 1 && {
                    borderBottomColor: Colors.gray6,
                    borderBottomWidth: 1,
                  }),
                }}
                onPress={() => {
                  setCurrentItem(item)
                  setVisible(false)
                  onSelect && onSelect(item)
                }}
              >
                <Text numberOfLines={1}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ModalSelect>
      </View>
    </TouchableWithoutFeedback>
  )
}

SelectBox.defaultProps = {
  data: [],
  defaultValue: {},
  title: 'Vui lòng chọn',
  titleModal: null,
  hideTitle: false,
  readOnly: false,
  isSearch: false,
  textHolder: 'Vui lòng chọn',
}

SelectBox.propTypes = {
  data: PropTypes.array,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.object,
  title: PropTypes.string,
  titleModal: PropTypes.string,
  hideTitle: PropTypes.bool,
  readOnly: PropTypes.bool,
  isSearch: PropTypes.bool,
  textHolder: PropTypes.string,
}
export default SelectBox
