import { Gutter } from '@payloadcms/ui/elements/Gutter'
import { EditViewComponent } from 'payload/types'
import { ContentCurationListProvider } from '../../providers/ContentCurationListProvider'
import EditContentCurationList from './EditContentCurationList'
import { AddContentCurationList } from './AddContentCurationList/AddContentCurationList'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { CreateNewCheck } from './CreateCheckNew'

const ContentCurationListEditView: EditViewComponent = ({}) => {
  return (
    <div
      style={{
        alignItems: 'start',
        marginTop: '1rem',
        margin: 'auto',
        justifyContent: 'start',
      }}
    >
      <ContentCurationListProvider>
        <>
          <Gutter>{<EditContentCurationList />}</Gutter>
          <AddContentCurationList />
          <CreateNewCheck />
        </>
      </ContentCurationListProvider>
    </div>
  )
}

export default ContentCurationListEditView
