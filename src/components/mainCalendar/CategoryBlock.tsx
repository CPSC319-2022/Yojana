import { Icon, IconName } from '@/components/common'
import { CalendarInterval } from '@/constants/enums'
import { CategoryFullState } from '@/types/prisma'
import { getTextColor } from '@/utils/color'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useCallback } from 'react'

interface CategoryBlockProps {
  color: string
  label: string
  icon: IconName
  className?: string
  calInterval?: CalendarInterval
  monthOffset?: number
  dayOffset?: number
  currentDay?: number
  category?: CategoryFullState
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
  calInterval
}: CategoryBlockProps) => {
  const renderPopover = useCallback((catBlock: JSX.Element, category: CategoryFullState) => {
    let translateXClass = (dayOffset ? dayOffset >= 6 : false) ? '-translate-x-60' : 'translate-x-6'
    let translateYClass = (monthOffset ? monthOffset >= 15 : false) ? '-translate-y-60' : ''

    return (
      <Popover>
        <Popover.Button className='w-full text-left'>{catBlock}</Popover.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition ease-in duration-150'
          leaveFrom={`opacity-100 translate-y-0`}
          leaveTo={`opacity-0 translate-y-1`}
        >
          <Popover.Panel className={`z-100 absolute transform ${translateXClass} ${translateYClass}`}>
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
            <div className='h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white p-5 leading-7'>
              <p className='text-m text-center font-bold text-slate-500'>{currentDay}</p>
              <h1 className={`truncate text-base font-bold`}>{category?.name}</h1>
              <p className='text-sm font-bold text-slate-700'>{category?.description}</p>
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
          className={`event-block mx-1 mt-1 overflow-x-hidden whitespace-nowrap rounded-md px-1.5 
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
        className={`event-block mx-1 mt-1 overflow-x-hidden whitespace-nowrap rounded-md px-1.5 
          ${getTextColor(color)} 
          ${className}`}
      >
        <Icon iconName={icon} className='mb-0.5 mr-1 inline' />
        {label}
      </div>
    </>
  )
}
