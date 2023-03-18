import { CalendarInterval } from '@/constants/enums'
import { CategoryFullState } from '@/types/prisma'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useCallback } from 'react'
import * as icons from 'react-bootstrap-icons'

export type IconName = keyof typeof icons

interface IconProps extends icons.IconProps {
  iconName: IconName
  calInterval?: CalendarInterval
  monthOffset?: number
  dayOffset?: number
  currentDay?: number
  category?: CategoryFullState
}

export const Icon = ({ iconName, calInterval, monthOffset, dayOffset, currentDay, category, ...props }: IconProps) => {
  const BootstrapIcon = icons[iconName]

  const renderPopover = useCallback((BootstrapIcon: JSX.Element, category: CategoryFullState) => {
    let translateXClass
    let translateYClass
    switch (calInterval) {
      case CalendarInterval.YEAR:
        translateXClass = (monthOffset ? monthOffset >= 8 : false)
          ? '-translate-x-60'
          : (currentDay ? currentDay >= 15 : false)
          ? 'translate-x-5'
          : ''
        translateYClass = (currentDay ? currentDay >= 15 : false) ? '-translate-y-60' : ''
        break
      case CalendarInterval.FOUR_MONTHS:
        translateXClass = (monthOffset ? monthOffset % 2 !== 0 : false)
          ? '-translate-x-60'
          : (monthOffset ? monthOffset === 2 : false)
          ? 'translate-x-5'
          : ''
        translateYClass = (monthOffset ? monthOffset >= 2 : false) ? '-translate-y-60' : ''
        break
      case CalendarInterval.MONTH:
        translateXClass = (dayOffset ? dayOffset >= 6 : false) ? '-translate-x-60' : ''
        translateYClass = (monthOffset ? monthOffset >= 15 : false) ? '-translate-y-60' : ''
        break
      case CalendarInterval.QUARTERLY:
        translateXClass = '-translate-x-60'
        translateYClass = (monthOffset ? monthOffset >= 2 : false) ? '-translate-y-60' : ''
        break
    }

    return (
      <Popover className='inline'>
        <Popover.Button className='focus:outline-none'>{BootstrapIcon}</Popover.Button>
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
            `}</style>
            <div className='h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white p-5 leading-7'>
              <p className='text-m text-center text-slate-500'>{currentDay}</p>
              <p className='truncate text-base'>{category?.name}</p>
              <p className='text-sm text-slate-700'>{category?.description}</p>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    )
  }, [])

  return category ? renderPopover(<BootstrapIcon {...props} />, category) : <BootstrapIcon {...props} />
}
