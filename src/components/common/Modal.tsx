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
  maxWidth?: string
  maxHeight?: string
  draggable?: boolean
  direction?: 'top' | 'bottom'
  closeBtn?: boolean
  bodyPadding?: string
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
  bodyPadding = 'p-6'
}: ModalProps) => {
  const directionClass = direction ? `absolute ${direction}-0 my-10` : ''

  return (
    <>
      <div>
        <Button text={buttonText} onClick={() => setIsOpen(true)} />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0' />
          </Transition.Child>

          <DraggableDialog draggable={draggable}>
            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center p-4 text-center'>
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
                    className={`${directionClass} ${bodyPadding} w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow-modal transition-all`}
                    style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
                  >
                    {closeBtn && (
                      <div className='absolute top-0 right-2'>
                        <button
                          type='button'
                          className='text-3xl text-gray-400 hover:text-gray-500 focus:outline-none'
                          onClick={() => setIsOpen(false)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {title && (
                      <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                        {title}
                      </Dialog.Title>
                    )}
                    <Dialog.Description as='div'>{body}</Dialog.Description>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </DraggableDialog>
        </Dialog>
      </Transition>
    </>
  )
}

const DraggableDialog = ({ children, draggable }: { children: ReactNode; draggable: boolean }) => {
  return draggable ? <Draggable>{children}</Draggable> : <>{children}</>
}
