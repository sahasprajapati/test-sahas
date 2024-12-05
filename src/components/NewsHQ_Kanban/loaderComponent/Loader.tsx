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
      <div className="flex w-screen items-center justify-center h-screen">
        <SyncLoader color="#00BFFF" size={35} loading />
      </div>
    )
  } else {
    return (
      <div className="min-h-screen">
        {' '}
        {/* Minimum full height screen */}
        {loaded && children}
      </div>
    )
  }
}

export default Loader
