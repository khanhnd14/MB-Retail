import React, { forwardRef, useMemo, useEffect, useImperativeHandle } from 'react'
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import I18n from 'i18n-js'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import { Metrics, Colors } from '../../theme'
import { Icon, Text } from '..'
import Checkbox from '../Checkbox'
import { Utils } from '../../utilities'
import Select from './Select'
import { ekycOperations } from '../../state/ekyc'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingTop: Metrics.normal
  },
  checkbox: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray10,
  },
  top: {
    backgroundColor: Colors.white,
    padding: Metrics.normal,
    marginHorizontal: Metrics.normal,
    marginBottom: Metrics.tiny
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  select: {
    paddingTop: Metrics.normal
  },
  other: {
    textDecorationLine: 'underline',
    color: Colors.second2,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.primary2
  },
  content: {
    paddingTop: Metrics.normal
  },
  itemContent: {
    flexDirection: 'row',
    paddingBottom: Metrics.tiny
  },
  dot: {
    color: Colors.primary2,
    paddingRight: Metrics.tiny
  },
  note: {
    color: Colors.gray12,
    fontSize: 10,
  },
  icon: {
    transform: [{ rotate: '180deg' }],
  },
  choiceBranch: {
    color: Colors.gray12,
  }
})

const ChoiceCombo = forwardRef(({ onNext, onNextTwo, toastAlert, setOpenCard, isExportCard, setIsExportCard, isChoiceAgree, setIsChoiceAgree, setDisableButton, selectedCombo, setSelectedCombo }, ref) => {
  const { resultAdditionInfo, choiceBranch } = useSelector((state) => state.ekyc)
  const [, setBranch] = React.useState(null)
  const [, setAgree] = React.useState(null)

  const suggestItemContents = useMemo(() => selectedCombo && selectedCombo?.descCombo?.split('*'), [selectedCombo])
  console.log('====================================');
  console.log('selectedCombo', selectedCombo);
  console.log('====================================');
  const dispatch = useDispatch()
  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const values = getValues()

  const onChoiceAgree = () => {
    setValue('agree', I18n.t('ekyc.customer_info.addition_sales'))
    setIsChoiceAgree(!isChoiceAgree)
  }

  const onChoiceExportCard = () => {
    setIsExportCard(!isExportCard)
  }

  const choiceCombo = (item) => {
    setValue('combo', item)
    setSelectedCombo(item)
  }

  const onShowPolicy = () => {
    Navigation.push('Policy')
  }

  const submit = () => {
    handleSubmit((data) => {
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      setOpenCard(isExportCard ? 'Y' : 'N')
      onNextTwo()
    })()
  }

  useEffect(() => {
    register('combo', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.combo_required')
      }
    })
    register('branch', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.branch_required')
      }
    })
    register('agree', {
      required: {
        value: true,
        message: `${I18n.t('ekyc.select_acc.agree_privacy')} ${I18n.t('ekyc.select_acc.privacy')} ${I18n.t('ekyc.select_acc.accept_privacy')}`
      }
    })
  }, [register])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log(errors);
    console.log('====================================');
    if (keys.length) {
      toastAlert(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  useEffect(() => {
    if (selectedCombo) {
      choiceCombo(selectedCombo)
      dispatch(ekycOperations.choiceCombo(selectedCombo))
    }
  }, [selectedCombo])

  useImperativeHandle(ref, () => ({

    submit,

  }));

  useEffect(() => {
    if (choiceBranch) {
      setValue('branch', choiceBranch)
      setBranch(choiceBranch)
    }
  }, [choiceBranch])

  useEffect(() => {
    if (resultAdditionInfo && resultAdditionInfo.lstItemSuggest && !selectedCombo) {
      choiceCombo(resultAdditionInfo.lstItemSuggest[0])
    }
  }, [resultAdditionInfo])

  useEffect(() => {
    if (isChoiceAgree) {
      setAgree(I18n.t('ekyc.customer_info.addition_sales'))
      setValue('agree', I18n.t('ekyc.customer_info.addition_sales'))
    } else {
      setValue('agree', null)
      setAgree(null)
    }
  }, [isChoiceAgree])

  useEffect(() => {
    setDisableButton(true)
    return () => {
      setDisableButton(false)
    }
  }, [])

  useEffect(() => {
    if (values.combo && values.branch && values.agree) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [values])

  return (
    <>
      <Select
        title={I18n.t('ekyc.select_acc.choice_branch')}
        component={(onShowSelect) => (
          <View style={styles.top}>
            <View style={styles.row}>
              <Text style={styles.label}>{I18n.t('ekyc.select_acc.hint_acc')}</Text>
              <Text>{selectedCombo?.name || (resultAdditionInfo?.lstItemSuggest && resultAdditionInfo?.lstItemSuggest[0]?.name)}</Text>
            </View>
            <Text style={styles.select}>{I18n.t('ekyc.select_acc.select')} <Text onPress={onShowSelect} style={styles.other}>{I18n.t('ekyc.select_acc.other')}</Text></Text>
          </View>
        )}
        data={resultAdditionInfo && _.difference([...resultAdditionInfo?.lstItemOther, ...resultAdditionInfo.lstItemSuggest], [selectedCombo || resultAdditionInfo?.lstItemSuggest[0]])}
        choiceItem={choiceCombo}
      />

      <View style={styles.top}>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.gray12 }}>
          <Text style={styles.label}>{I18n.t('ekyc.select_acc.detail_acc')} {selectedCombo?.name || (resultAdditionInfo?.lstItemSuggest && resultAdditionInfo?.lstItemSuggest[0]?.name)}</Text>
          <View style={styles.content}>
            {
              suggestItemContents && suggestItemContents.map((value, index) => value ? (
                <View style={styles.itemContent}>
                  <Text key={index} style={styles.dot}>•</Text>
                  <Text>{value && value.trim()}</Text>
                </View>
              ) : null)
            }
          </View>
          <Text onPress={() => Utils.openUrl(selectedCombo.linkDesc || resultAdditionInfo?.lstItemSuggest[0]?.linkDesc)} style={[styles.other, { alignSelf: 'center', paddingVertical: Metrics.tiny * 2 }]}>{I18n.t('ekyc.select_acc.view_detail')}</Text>
        </View>
        {/* <TouchableOpacity onPress={() => onChoiceExportCard()} style={styles.checkboxButton}>
          <Checkbox
            name={I18n.t('ekyc.customer_info.addition_sales')}
            checked={!!isExportCard}
            onChange={onChoiceExportCard}
            style={styles.checkbox}
            size={Metrics.tiny * 4}
            borderRadius={Metrics.tiny}
            color={Colors.primary2}
          />
          <View style={{ paddingLeft: Metrics.normal }}>
            <Text>{I18n.t('ekyc.select_acc.export_card')}</Text>
            <Text style={styles.note}>{I18n.t('ekyc.select_acc.export_card_note')}</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={[styles.top, { borderBottomLeftRadius: Metrics.normal, borderBottomRightRadius: Metrics.normal }]}>
        <Text style={styles.label}>{I18n.t('ekyc.select_acc.exchange_local')}</Text>
        <TouchableWithoutFeedback onPress={onNext}>
          <View style={[styles.row, { paddingTop: Metrics.normal, borderBottomWidth: 0.5, paddingBottom: Metrics.medium, borderBottomColor: Colors.gray12 }]}>
            {choiceBranch ? <Text>{choiceBranch?.name}</Text> : <Text style={styles.choiceBranch}>{I18n.t('ekyc.select_acc.choice_exchange_local') }</Text>}
            <Icon name="icon-back" size={Metrics.normal} color={Colors.primary2} style={styles.icon} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={() => onChoiceAgree()} style={styles.checkboxButton}>
          <Checkbox
            name={I18n.t('ekyc.customer_info.addition_sales')}
            checked={!!isChoiceAgree}
            onChange={onChoiceAgree}
            style={styles.checkbox}
            size={Metrics.tiny * 4}
            color={Colors.primary2}
          />
          <View style={{ paddingLeft: Metrics.normal, maxWidth: Utils.getWindowWidth() / 1.2 }}>
            <Text>{I18n.t('ekyc.select_acc.agree_privacy')}{' '}<Text onPress={onShowPolicy} style={{ color: Colors.second2, textDecorationLine: 'underline' }}>{I18n.t('ekyc.select_acc.privacy')}</Text>{' '}<Text>{I18n.t('ekyc.select_acc.accept_privacy')}</Text></Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
})
export default ChoiceCombo
