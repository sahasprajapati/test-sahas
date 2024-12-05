import React from 'react'

import './index.scss'
import { Popup, PopupList } from '@payloadcms/ui/elements/Popup'
import { ChevronDown, MonitorCheck, Tablet, Smartphone, MonitorSmartphone } from 'lucide-react'
import { useLivePreviewContext } from '../../Context/context'
import { EditViewProps } from 'payload/types'
import { Button } from '@/components/ui/button'

const baseClass = 'live-preview-toolbar-controls'
const zoomOptions = [50, 75, 100, 125, 150, 200]
const customOption = {
  label: 'Custom', // TODO: Add i18n to this string
  value: 'custom',
}

export const ToolbarControls: React.FC<EditViewProps> = () => {
  const { breakpoint, breakpoints, setBreakpoint, setPreviewWindowType, setZoom, url, zoom } =
    useLivePreviewContext()
  return (
    <div className={baseClass}>
      {breakpoints &&
        breakpoints?.length > 0 &&
        breakpoints
          .filter((breakpoint) => {
            return breakpoint.label !== 'Responsive'
          })
          .map((bp) => (
            <Button
              key={bp.name}
              onClick={() => {
                setBreakpoint(bp.name)
                close()
              }}
              variant={'ghost'}
            >
              {bp?.label === 'Mobile' ? (
                <Smartphone />
              ) : bp?.label === 'Desktop' ? (
                <MonitorCheck />
              ) : bp?.label === 'Tablet' ? (
                <Tablet />
              ) : null}
              {bp.label}
            </Button>
          ))}
      {/* <div className={`${baseClass}__device-size`}>
        <PreviewFrameSizeInput axis="x" />
        <span className={`${baseClass}__size-divider`}>
          <X />
        </span>
        <PreviewFrameSizeInput axis="y" />
      </div> */}
      <Popup
        className={`${baseClass}__zoom`}
        button={
          <>
            <span>{zoom * 100}%</span>
            &nbsp;
            <ChevronDown className={`${baseClass}__chevron`} />
          </>
        }
        render={({ close }) => (
          <PopupList.ButtonGroup>
            <React.Fragment>
              {zoomOptions.map((zoomValue) => (
                <PopupList.Button
                  key={zoomValue}
                  active={zoom * 100 == zoomValue}
                  onClick={() => {
                    setZoom(zoomValue / 100)
                    close()
                  }}
                >
                  {zoomValue}%
                </PopupList.Button>
              ))}
            </React.Fragment>
          </PopupList.ButtonGroup>
        )}
        showScrollbar
        verticalAlign="bottom"
        horizontalAlign="right"
      />
      {/* <a
        className={`${baseClass}__external`}
        href={url}
        onClick={(e) => {
          e.preventDefault()
          setPreviewWindowType('popup')
        }}
        type="button"
      >
        <ExternalLinkIcon />
      </a> */}
    </div>
  )
}
