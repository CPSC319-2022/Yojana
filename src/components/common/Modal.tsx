// Adapted from: https://headlessui.com/react/dialog

import { Button, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getIsSelectingDates, resetSelectedDates } from '@/redux/reducers/DateSelectorReducer'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useRef } from 'react'
import Draggable from 'react-draggable'
import { getChildByType, removeChildrenByType } from 'react-nanny'

/*
 * This file is a React component that renders a modal dialog box.
 * It allows for customisation of various properties such as the content to be displayed, the title of the modal,
 * its size and position, and the behaviour of the close button. It also allows for dragging of the modal window and
 * customisation of the button that opens the modal.
 */
interface ModalProps {
  buttonText: string
  buttonIcon?: IconName
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
  scrollable?: boolean
  showOverflow?: boolean
  id?: string
}

/**
 * * Component that renders a modal dialog box.
 * @param children - Content to be displayed inside the modal.
 * @param buttonText - The text to be displayed on the button that opens the modal.
 * @param buttonIcon - The icon name to be displayed on the button that opens the modal.
 * @param title - The title of the modal.
 * @param isOpen - A boolean indicating whether the modal is currently open or not.
 * @param setIsOpen - A function to set the state of the isOpen property.
 * @param isMinimized - A boolean indicating whether the modal is currently minimized or not.
 * @param maxWidth - The maximum width of the modal.
 * @param maxHeight - The maximum height of the modal.
 * @param minWidth - The minimum width of the modal.
 * @param draggable - A boolean indicating whether the modal can be dragged or not.
 * @param direction - The direction in which the modal should be aligned.
 * @param closeBtn - A boolean indicating whether the close button should be displayed or not.
 * @param closeWhenClickOutside - A boolean indicating whether the modal should be closed when clicked outside.
 * @param handle - The id of the handle used to drag the modal.
 * @param bounds - The id of the element used to set the bounds of the modal.
 * @param buttonClassName - The CSS class to be applied to the button that opens the modal.
 * @param buttonId - The ID to be applied to the button that opens the modal.
 * @param showCloseBtn - A boolean indicating whether the close button should be displayed or not.
 * @param overrideDefaultButtonStyle - A boolean indicating whether the default styles for the button that opens the modal should be overridden.
 * @param closeParent -  A function to close the parent component when the modal is closed.
 * @param bodyPadding - The padding applied to the body of the modal.
 * @param scrollable - A boolean indicating whether the modal should be scrollable or not.
 * @param showOverflow - A boolean indicating whether the modal should show overflow or not.
 * @param id - The ID to be applied to the modal.
 */
export const Modal = ({
  children,
  buttonText,
  buttonIcon,
  title,
  isOpen,
  setIsOpen,
  isMinimized = false,
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
  scrollable = true,
  showOverflow = false,
  id
}: ModalProps) => {
  const directionClass = direction ? `absolute ${direction}-0 my-10` : ''
  const disable = useAppSelector(getIsSelectingDates)
  const dispatch = useAppDispatch()
  const minimized = getChildByType(children, Minimized)
  const body = removeChildrenByType(children, Minimized)

  return (
    <>
      <Button
        text={buttonText}
        iconName={buttonIcon}
        id={buttonId}
        onClick={() => {
          setIsOpen(true)
          title === 'Create Category' && dispatch(resetSelectedDates())
        }}
        className={buttonClassName}
        overrideDefaultStyle={overrideDefaultButtonStyle}
        disabled={disable}
      />

      {isOpen && (
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
                closeParent?.()
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
                      className={`${directionClass} w-full max-w-md transform ${
                        scrollable ? 'overflow-y-auto' : showOverflow ? 'overflow-visible' : 'overflow-y-hidden'
                      } rounded-md bg-white text-left align-middle shadow-modal transition-all`}
                      style={{ maxWidth: maxWidth, maxHeight: maxHeight, minWidth: minWidth }}
                      id={id}
                    >
                      {showCloseBtn && (
                        <div
                          id={handle}
                          className={`sticky top-0 z-20 w-full bg-slate-100 ${!isMinimized ? 'cursor-move' : ''}`}
                        >
                          {closeBtn && (
                            <div className='flex justify-end'>
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
                    <>{minimized}</>
                  )}
                </Transition.Child>
              </div>
            </DraggableDialog>
          </Dialog>
        </Transition>
      )}
    </>
  )
}

const Minimized = ({ children, className }: { children: ReactNode; className?: string }) => {
  // headlessui 1.17.13 sets that main div (__next) to inert (unresponsive) when Modal is open (over the main div)
  document.getElementById('__next')?.removeAttribute('inert')
  return <div className={className}>{children}</div>
}

Modal.Minimized = Minimized

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
