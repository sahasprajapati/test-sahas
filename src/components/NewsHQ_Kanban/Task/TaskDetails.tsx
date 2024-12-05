import Dialog from "@/components/Dialog/Dialog";
import ModalHeader from "../dialogTemplet";

export const TaskDetails = ({ openDialog, task, styleClass, isRtl, column, closeDialog }: any) => {
  if (!openDialog) return;
  return (
    <Dialog
      position={{
        content: 'end',
        items: 'start'
      }}
      templete={
        <ModalHeader
          cmsTrue={false}
          cmsUrl={''}
          onClose={() => closeDialog()}
          isRtl={isRtl}
          styleClass={styleClass}
          task={task}
          column={column}
        />
      }
      onClose={() => closeDialog()}
      width={'md'}
      height={'full'}
    />
  )
}
