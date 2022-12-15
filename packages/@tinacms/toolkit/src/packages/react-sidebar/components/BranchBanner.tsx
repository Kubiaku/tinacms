import * as React from 'react'
import { BranchSwitcher, useBranchData } from '../../../plugins/branch-switcher'
import { useCMS } from '../../../react-tinacms'
import { Modal, ModalBody, ModalHeader, ModalPopup } from '../../react-modals'

export const BranchBanner = () => {
  const { branch } = useCMS().api.tina || 'main'
  const [open, setOpen] = React.useState(false)
  return (
    <>
      {' '}
      <div className="flex-grow-0 flex w-full text-xs items-center py-1 px-4 text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200 cursor-pointer">
        Working from{' '}
        <strong
          onClick={() => setOpen(true)}
          className="ml-1 font-bold text-yellow-700"
        >
          {branch}
        </strong>
      </div>
      {open && (
        <BranchModal
          close={() => {
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

interface SubmitModalProps {
  close(): void
}

const BranchModal = ({ close }: SubmitModalProps) => {
  const tinaApi = useCMS().api.tina
  const { setCurrentBranch } = useBranchData()

  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Choose Workspace</ModalHeader>
        <ModalBody padded={true}>
          <BranchSwitcher
            listBranches={tinaApi.listBranches.bind(tinaApi)}
            createBranch={() => {
              return Promise.resolve('')
            }}
            chooseBranch={setCurrentBranch}
          />
        </ModalBody>
      </ModalPopup>
    </Modal>
  )
}