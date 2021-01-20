/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Success } from '../../../components'
import I18n from '../../../translations'

const AddBenefitSuccess = (props) => (
  <>
    <Success {...props} message={I18n.t('transfer.saveSuccess')} showButton={false} />
  </>
)

export default AddBenefitSuccess
