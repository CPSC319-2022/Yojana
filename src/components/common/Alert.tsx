import React, { Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getAlert, setShow } from '@/redux/reducers/AlertReducer'

/**
 * * Displays an alert with a message and a close button. There is also a timeout to close the alert after a certain
 * amount of time.
 */
export const Alert = () => {
  const { message, textColor, backgroundColor, type, show, timeout } = useAppSelector(getAlert)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(setShow(false))
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [show, dispatch, timeout])

  return (
    <Transition appear show={show} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter='ease-out duration-200'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div className='fixed top-10 left-0 right-0 z-50 mx-auto w-3/4 md:w-1/2' id='alert'>
          <style jsx>
            {`
              .alert {
                background-color: ${backgroundColor};
                color: ${textColor};
              }

              .alert button {
                color: ${textColor};
              }
            `}
          </style>
          <div className={`alert flex items-center justify-center rounded-md py-3 px-4`} role='alert'>
            {type === 'error' && <strong className='px-3 font-bold'>Error:</strong>}{' '}
            <span className='block px-3 sm:inline'>{message}</span>
            <button type='button' className={`float-right font-bold`} onClick={() => dispatch(setShow(false))}>
              &times;
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  )
}
