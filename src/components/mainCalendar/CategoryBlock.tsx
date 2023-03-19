import { Icon, IconName } from '@/components/common'
import { CategoryFullState } from '@/types/prisma'
import { getTextColor } from '@/utils/color'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useCallback } from 'react'

interface CategoryBlockProps {
  color: string
  label: string
  icon: IconName
  className?: string
  monthOffset?: number
  dayOffset?: number
  currentDay?: number
  category?: CategoryFullState
  isNested?: boolean
}

export const CategoryBlock = ({
  color,
  label,
  icon,
  className,
  monthOffset,
  currentDay,
  dayOffset,
  category,
  isNested
}: CategoryBlockProps) => {
  const renderPopover = useCallback((catBlock: JSX.Element, category: CategoryFullState) => {
    const descText = category?.description.trim().length === 0 ? 'No description provided!' : category?.description
    const titleLength = category?.name.length + category?.creator.name.length
    const email = 'mailto:' + category?.creator.email
    let translateXClass = (dayOffset ? dayOffset >= 6 : false) ? '-translate-x-60' : 'translate-x-6'
    let translateYClass = (monthOffset ? monthOffset >= 15 : false)
      ? titleLength * 2 + descText.length >= 128
        ? '-translate-y-60'
        : '-translate-y-40'
      : ''
    translateXClass = isNested ? '-translate-x-60' : translateXClass
    translateYClass = isNested
      ? titleLength * 2 + descText.length >= 128
        ? '-translate-y-60'
        : '-translate-y-40'
      : translateYClass

    return (
      <Popover>
        <Popover.Button className='w-full text-left'>{catBlock}</Popover.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-128'
          leave='transition ease-in duration-150'
          leaveFrom={`opacity-128 translate-y-0`}
          leaveTo={`opacity-0 translate-y-1`}
        >
          <Popover.Panel className={`absolute z-40 transform ${translateXClass} ${translateYClass}`}>
            <style jsx>{`
              div {
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                -moz-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
              }
              h1 {
                color: ${category?.color};
              }
            `}</style>
            <div className='font-inherit max-w-60 h-fit max-h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white p-2 pb-3 leading-7'>
              <p className='text-center text-base text-slate-500'>{currentDay}</p>
              <h1 className={`text-base`}>{category?.name + ' #' + category?.id}</h1>
              <p className='text-sm text-slate-700'>{descText}</p>
              <p className='text-xs text-slate-500'>
                creator:{' '}
                <a className=' text-blue-500 underline' href={email}>
                  {category?.creator.name}
                </a>
              </p>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    )
  }, [])

  return category ? (
    renderPopover(
      <>
        <style jsx>{`
          .event-block {
            background-color: ${color};
          }
        `}</style>
        <div
          aria-label={label}
          className={`event-block mx-1 mt-1 overflow-x-hidden whitespace-nowrap rounded-md px-2 
          ${getTextColor(color)} 
          ${className}`}
        >
          <Icon iconName={icon} className='mb-0.5 mr-1 inline' />
          {label}
        </div>
      </>,
      category
    )
  ) : (
    <>
      <style jsx>{`
        .event-block {
          background-color: ${color};
        }
      `}</style>
      <div
        aria-label={label}
        className={`event-block mx-1 mt-1 overflow-x-hidden whitespace-nowrap rounded-md px-2 
          ${getTextColor(color)} 
          ${className}`}
      >
        <Icon iconName={icon} className='mb-0.5 mr-1 inline' />
        {label}
      </div>
    </>
  )
}
