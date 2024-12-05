import { toTranslationKey } from '@/languages'
import React from 'react'

const TableAction = () => {
  return <button className="table-action">{toTranslationKey('edit')}</button>
}

export default TableAction
