import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { Metrics, Colors } from '../../theme'
import BottomSheet from '../BottomSheet'
import Text from '../MsbText'
import I18n from '../../translations'

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.white,
    height: Metrics.medium * 15,
    paddingVertical: Metrics.normal,
    paddingHorizontal: Metrics.small * 2.5,
  },
})

class NoteSheet extends React.Component {
  sheet = React.createRef()

  renderContent = () => {
    const { text } = this.props
    return (
      <ScrollView style={styles.content}>
        <Text style={{ fontSize: 16 }}>{text}</Text>
      </ScrollView>
    )
  }

  show = () => {
    this.sheet.current && this.sheet.current.show()
  }

  render() {
    const { title } = this.props
    return (
      <BottomSheet title={title || I18n.t('application.note')} ref={this.sheet} snapPoint={Metrics.medium * 15}>
        {this.renderContent()}
      </BottomSheet>
    )
  }
}

NoteSheet.defaultProps = {
  text: [],
}

NoteSheet.propTypes = {
  text: PropTypes.string,
}

export default NoteSheet
