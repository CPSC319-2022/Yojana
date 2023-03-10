// Adapted from: https://headlessui.com/react/dialog

import { Button } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getIsSelectingDates, resetSelectedDates } from '@/redux/reducers/DateSelectorReducer'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useRef } from 'react'
import Draggable from 'react-draggable'

interface ModalProps {
  buttonText: string
  title?: string
  children: ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handle: string
  isMinimized?: boolean
  setIsMinimized?: (isMinimized: boolean) => void
  bounds?: string | { left: number; top: number; right: number; bottom: number }
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  draggable?: boolean
  direction?: 'top' | 'bottom'
  closeBtn?: boolean
  bodyPadding?: string
  closeWhenClickOutside?: boolean
  buttonClassName?: string
  buttonId?: string
  showCloseBtn?: boolean
  overrideDefaultButtonStyle?: boolean
  closeParent?: () => void
  minimizedButtonText?: string
}

export const Modal = ({
  children: body,
  buttonText,
  title,
  isOpen,
  setIsOpen,
  isMinimized = false,
  setIsMinimized = () => {},
  maxWidth = '50vw',
  maxHeight = '90vh',
  minWidth,
  draggable = false,
  direction,
  closeBtn = true,
  closeWhenClickOutside = true,
  handle,
  bounds,
  buttonClassName,
  buttonId,
  showCloseBtn = true,
  overrideDefaultButtonStyle = false,
  closeParent,
  bodyPadding = 'px-6 pb-6 pt-3',
  minimizedButtonText
}: ModalProps) => {
  const directionClass = direction ? `absolute ${direction}-0 my-10` : ''
  const disable = useAppSelector(getIsSelectingDates)
  const dispatch = useAppDispatch()
  return (
    <>
      <div>
        <Button
          text={buttonText}
          id={buttonId}
          onClick={() => {
            setIsOpen(true)
            title === 'Create Category' && dispatch(resetSelectedDates())
          }}
          className={buttonClassName}
          overrideDefaultStyle={overrideDefaultButtonStyle}
          disabled={disable}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          id={typeof bounds === 'string' ? bounds : undefined}
          className={`pointer-events-none absolute top-0 z-10 flex h-screen w-screen p-5 ${
            isMinimized ? 'items-end justify-start' : 'items-center justify-center'
          }`}
          onClose={() => {
            if (closeWhenClickOutside) {
              setIsOpen(false)
            }
          }}
        >
          {closeWhenClickOutside && <div className='fixed inset-0 bg-black/30' aria-hidden='true' />}
          <DraggableDialog draggable={draggable} bounds={bounds} handleId={handle} isMinimized={isMinimized}>
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
                {!isMinimized ? (
                  <Dialog.Panel
                    className={`${directionClass} w-full max-w-md transform overflow-y-auto rounded-md bg-white text-left align-middle shadow-modal transition-all`}
                    style={{ maxWidth: maxWidth, maxHeight: maxHeight, minWidth: minWidth }}
                  >
                    {showCloseBtn && (
                      <div id={handle} className={`w-full bg-slate-100 ${!isMinimized ? 'cursor-move' : ''}`}>
                        {closeBtn && (
                          <div className='flex justify-end'>
                            {isMinimized ? (
                              <button
                                type='button'
                                className='rotate-45 px-2.5 text-3xl text-slate-400 hover:text-slate-500 focus:outline-none'
                                onClick={() => setIsMinimized(false)}
                              >
                                ×
                              </button>
                            ) : (
                              <button
                                type='button'
                                className='px-2.5 text-3xl text-slate-400 hover:text-slate-500 focus:outline-none'
                                onClick={() => {
                                  setIsOpen(false)
                                  closeParent?.()
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={bodyPadding}>
                      {title && (
                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-slate-900'>
                          {title}
                        </Dialog.Title>
                      )}
                      <Dialog.Description as='div'>{body}</Dialog.Description>
                    </div>
                  </Dialog.Panel>
                ) : (
                  <Button text={minimizedButtonText} onClick={() => setIsMinimized(false)} className='animate-pulse' />
                )}
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
  isMinimized: boolean
  bounds?: string | { left: number; top: number; right: number; bottom: number }
}

const DraggableDialog = ({ children, draggable, handleId, bounds, isMinimized }: DraggableDialogProps) => {
  // Draggable needs a ref to the underlying DOM node: https://stackoverflow.com/a/63603903/8488681
  const nodeRef = useRef(null)
  return draggable ? (
    <Draggable
      handle={`#${handleId}`}
      bounds={typeof bounds === 'string' ? `#${bounds}` : bounds}
      nodeRef={nodeRef}
      disabled={isMinimized}
      position={isMinimized ? { x: 0, y: 0 } : undefined}
    >
      <div ref={nodeRef}>{children}</div>
    </Draggable>
  ) : (
    <>{children}</>
  )
}
