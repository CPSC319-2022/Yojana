import { Fragment, ReactNode, useEffect } from 'react'
import { Transition } from '@headlessui/react'

export interface AlertProps {
  children: ReactNode
  type: 'success' | 'error' | 'warning' | 'info'
  setShow: (show: boolean) => void
  show: boolean
}

export const Alert = ({ children: message, type, show, setShow }: AlertProps) => {
  const bgColor =
    type === 'error'
      ? 'bg-red-200'
      : type === 'warning'
      ? 'bg-yellow-200'
      : type === 'info'
      ? 'bg-blue-200'
      : 'bg-green-200'
  const textColor =
    type === 'error'
      ? 'text-red-700'
      : type === 'warning'
      ? 'text-yellow-700'
      : type === 'info'
      ? 'text-blue-700'
      : 'text-green-700'

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, setShow])

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
        <div className='fixed top-10 left-0 right-0 z-50 mx-auto w-3/4 md:w-1/2'>
          <div className={`rounded-md ${bgColor} py-3 px-4 text-center ${textColor}`} role='alert'>
            {message}
            <button type='button' className={`float-right font-bold ${textColor}`} onClick={() => setShow(false)}>
              &times;
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  )
}
