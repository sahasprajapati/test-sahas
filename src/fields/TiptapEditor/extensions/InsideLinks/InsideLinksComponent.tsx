import { isRTL } from '@/utils/isRTL'
import { ExternalLinkIcon } from '@payloadcms/ui/graphics/ExternalLink'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default (props: any) => {
  return (
    <NodeViewWrapper
      className="react-component"
      onClick={() => {
        props.editor.commands.setNodeSelection(props.getPos())
      }}
    >
      <NodeViewContent contentEditable="false" className="socialMediaContainer">
        {props?.node.type.spec.draggable ? (
          <div draggable="true" data-drag-handle="" style={{ width: '100%' }}>
            {/* @ts-ignore */}
            {!props?.node?.attrs?.id ?? '' ? (
              <div
                className="w-full bg-zinc-100 py-8 px-6 flex items-center justify-center gap-2 socialMediaCard"
                draggable="true"
                data-drag-handle=""
                contentEditable="false"
              >
                <ExternalLinkIcon className="h-6 w-6" />

                <p
                  className="w-full flex items-center justify-start mt-0"
                  style={{
                    marginTop: 0,
                  }}
                >
                  Add Internal Content Links
                  {/* {text} */}
                </p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full  gap-x-6">
                <div className="flex justify-center items-center">
                  <div className="w-[32px] h-[64px] bg-blue-400"></div>
                  <img
                    src={props?.node?.attrs?.thumbnail ?? ''}
                    width={212}
                    height={120}
                    alt={''}
                    className="-ml-6 !w-[212px] !h-[120px] object-cover"
                  />
                </div>
                <div className="flex flex-col justidy-start items-start font-trt gap-y-2 ">
                  <a
                    className="text-black dark:text-white text-lg capitalize w-full"
                    // href={`https://test-payload.trtglobal.tech/en${props?.node?.attrs?.url}` ?? ''}
                    //@ts-ignore
                    dir={isRTL('بیشتر بخوانید' ?? '') ? 'rtl' : 'ltr'}
                  >
                    بیشتر بخوانید
                  </a>
                  <h3
                    className="text-2xl font-bold !mt-0 w-full"
                    dir={isRTL(props?.node?.attrs?.title ?? '') ? 'rtl' : 'ltr'}
                  >
                    {props?.node?.attrs?.title}
                  </h3>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </NodeViewContent>
    </NodeViewWrapper>
  )
}
