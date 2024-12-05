import SyncLoader from 'react-spinners/SyncLoader'
import * as React from 'react'

interface IPropTypes {
  loaded: boolean
  onlySpinner: boolean
  children?: React.ReactNode
}

function Loader(props: IPropTypes): React.ReactNode {
  const { loaded, onlySpinner, children } = props

  if (!loaded || onlySpinner) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <SyncLoader color="#00BFFF" size={35} loading />
      </div>
    )
  } else {
    return (
      <div className="h-full">
        {' '}
        {/* Minimum full height screen */}
        {loaded && children}
      </div>
    )
  }
}

export default Loader
