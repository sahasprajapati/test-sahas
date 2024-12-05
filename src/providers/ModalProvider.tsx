import React from 'react'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'

export const FacelessModalProvider = ({ children }: any) => {
  return (
    <ModalProvider transTime={250}>
      {children}
      <ModalContainer />
    </ModalProvider>
  )
}
