import { LivePreviewConfig } from 'payload/config'
import { fieldSchemaToJSON } from 'payload/utilities'
import type { Dispatch } from 'react'

import { createContext, useContext } from 'react'
import { usePopupWindow } from '../usePopupWindow'
import { SizeReducerAction } from './sizeReducer'

export interface LivePreviewContextType {
  appIsReady: boolean
  breakpoint: string
  breakpoints: LivePreviewConfig['breakpoints']
  fieldSchemaJSON?: ReturnType<typeof fieldSchemaToJSON>
  iframeHasLoaded: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement | null>
  isPopupOpen?: boolean
  measuredDeviceSize: {
    height: number
    width: number
  }
  openPopupWindow: ReturnType<typeof usePopupWindow>['openPopupWindow']
  popupRef?: React.MutableRefObject<Window | null>
  previewWindowType: 'iframe' | 'popup'
  setAppIsReady: (appIsReady: boolean) => void
  setBreakpoint: (breakpoint: string) => void
  setHeight: (height: number) => void
  setIframeHasLoaded: (loaded: boolean) => void
  setMeasuredDeviceSize: (size: { height: number; width: number }) => void
  setPreviewWindowType: (previewWindowType: 'iframe' | 'popup') => void
  setSize: Dispatch<SizeReducerAction>
  setToolbarPosition: (position: { x: number; y: number }) => void
  setWidth: (width: number) => void
  setZoom: (zoom: number) => void
  size: {
    height: number
    width: number
  }
  toolbarPosition: {
    x: number
    y: number
  }
  url: string | undefined
  zoom: number
}

export const LivePreviewContext = createContext<LivePreviewContextType>({
  appIsReady: false,
  breakpoint: 'responsive',
  breakpoints: undefined,
  fieldSchemaJSON: undefined,
  iframeHasLoaded: false,
  iframeRef: undefined,
  isPopupOpen: false,
  measuredDeviceSize: {
    height: 0,
    width: 0,
  },
  openPopupWindow: () => {},
  popupRef: undefined,
  previewWindowType: 'iframe',
  setAppIsReady: () => {},
  setBreakpoint: () => {},
  setHeight: () => {},
  setIframeHasLoaded: () => {},
  setMeasuredDeviceSize: () => {},
  setPreviewWindowType: () => {},
  setSize: () => {},
  setToolbarPosition: () => {},
  setWidth: () => {},
  setZoom: () => {},
  size: {
    height: 0,
    width: 0,
  },
  toolbarPosition: {
    x: 0,
    y: 0,
  },
  url: undefined,
  zoom: 1,
})

export const useLivePreviewContext = () => useContext(LivePreviewContext)
