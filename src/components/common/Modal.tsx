// Adapted from: https://headlessui.com/react/dialog

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'
import { Button } from '@/components/common'
import Draggable from 'react-draggable'

interface ModalProps {
  buttonText: string
  title?: string
  children: ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handle: string
  bounds?: string | { left: number; top: number; right: number; bottom: number }
  maxWidth?: string
  maxHeight?: string
  draggable?: boolean
  direction?: 'top' | 'bottom'
  closeBtn?: boolean
  bodyPadding?: string
  closeWhenClickOutside?: boolean
}

export const Modal = ({
  children: body,
  buttonText,
  title,
  isOpen,
  setIsOpen,
  maxWidth = '50vw',
  maxHeight = '100vh',
  draggable = false,
  direction,
  closeBtn = true,
  closeWhenClickOutside = true,
  handle,
  bounds
}: ModalProps) => {
  const directionClass = direction ? `absolute ${direction}-0 my-10` : ''

  return (
    <>
      <div>
        <Button text={buttonText} onClick={() => setIsOpen(!isOpen)} />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          id={typeof bounds === 'string' ? bounds : undefined}
          className='pointer-events-none absolute top-0 z-10 flex h-screen w-screen items-center justify-center p-5'
          onClose={() => {
            if (closeWhenClickOutside) {
              setIsOpen(false)
            }
          }}
        >
          <DraggableDialog draggable={draggable} bounds={bounds} handleId={handle}>
            <div className='pointer-events-auto'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className={`${directionClass} w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow-modal transition-all`}
                  style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
                >
                  <div id={handle} className='w-full cursor-move bg-slate-100'>
                    {closeBtn && (
                      <div className='flex justify-end'>
                        <button
                          type='button'
                          className='px-2.5 text-3xl text-slate-400 hover:text-slate-500 focus:outline-none'
                          onClick={() => setIsOpen(false)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='px-6 pb-6 pt-3'>
                    {title && (
                      <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                        {title}
                      </Dialog.Title>
                    )}
                    <Dialog.Description as='div'>{body}</Dialog.Description>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </DraggableDialog>
        </Dialog>
      </Transition>
    </>
  )
}

interface DraggableDialogProps {
  children: ReactNode
  draggable: boolean
  handleId: string
  bounds?: string | { left: number; top: number; right: number; bottom: number }
}

const DraggableDialog = ({ children, draggable, handleId, bounds }: DraggableDialogProps) => {
  return draggable ? (
    <Draggable handle={`#${handleId}`} bounds={typeof bounds === 'string' ? `#${bounds}` : bounds}>
      {children}
    </Draggable>
  ) : (
    <>{children}</>
  )
}
