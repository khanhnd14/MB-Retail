import * as React from 'react'
import { Success } from '../../../components'

const SuccessScreen = (props) => {
  const { redoTransaction, content } = props.route.params
  const onSaveBenefit = () => {

  }
  return (
    <>
      <Success {...props} showButton={false} redoTransaction={redoTransaction} message={content} onSave={onSaveBenefit} />
    </>
  )
}

export default SuccessScreen
