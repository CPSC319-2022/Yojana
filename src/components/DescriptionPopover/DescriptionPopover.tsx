import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'
import { CategoryFullState } from '@/types/prisma'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useCallback } from 'react'

interface DescriptionPopover {
  type: 'block' | 'icon'
  component: JSX.Element
  category: CategoryFullState
  className?: string
  monthOffset: number
  dayOffset: number
  currentDay: number
  isNested?: boolean
}

export const DescriptionPopover = ({
  type,
  component,
  category,
  className,
  monthOffset,
  dayOffset,
  currentDay,
  isNested
}: DescriptionPopover) => {
  const currentInterval = useAppSelector(getInterval)

  const renderPopover = useCallback(
    (catComponent: JSX.Element, category: CategoryFullState) => {
      const descText = category?.description.trim().length === 0 ? 'No description provided!' : category?.description
      const titleLength = category?.name.length + category?.creator.name.length
      const email = 'mailto:' + category?.creator.email

      let translateXClass
      let translateYClass
      if (type === 'icon') {
        switch (currentInterval) {
          case CalendarInterval.YEAR:
            translateXClass = monthOffset >= 8 ? '-translate-x-60' : currentDay >= 15 ? 'translate-x-5' : ''
            translateYClass =
              currentDay >= 15 ? (titleLength * 2 + descText.length >= 128 ? '-translate-y-40' : '-translate-y-32') : ''
            break
          case CalendarInterval.FOUR_MONTHS:
            translateXClass =
              monthOffset % 2 !== 0 ? '-translate-x-60' : monthOffset && monthOffset === 2 ? 'translate-x-5' : ''
            translateYClass =
              monthOffset >= 2 ? (titleLength * 2 + descText.length >= 128 ? '-translate-y-40' : '-translate-y-32') : ''
            break
          case CalendarInterval.MONTH:
            translateXClass = dayOffset && dayOffset >= 6 ? '-translate-x-60' : ''
            translateYClass =
              monthOffset >= 15
                ? titleLength * 2 + descText.length >= 128
                  ? '-translate-y-40'
                  : '-translate-y-32'
                : ''
            break
          case CalendarInterval.QUARTERLY:
            translateXClass = '-translate-x-60'
            translateYClass =
              monthOffset === 0
                ? titleLength * 2 + descText.length >= 128
                  ? '-translate-y-40'
                  : '-translate-y-32'
                : monthOffset && monthOffset === -1
                ? '-translate-y-12'
                : ''
            break
        }
        translateXClass = isNested ? '-translate-x-60' : translateXClass
        translateYClass = isNested ? '-translate-y-40' : translateYClass
      } else if (type === 'block') {
        translateXClass = dayOffset >= 6 ? '-translate-x-60' : 'translate-x-6'
        translateYClass =
          monthOffset >= 15 ? (titleLength * 2 + descText.length >= 128 ? '-translate-y-40' : '-translate-y-32') : ''
        translateXClass = isNested ? '-translate-x-60' : translateXClass
        translateYClass = isNested
          ? titleLength * 2 + descText.length >= 128
            ? '-translate-y-40'
            : '-translate-y-32'
          : translateYClass
      }

      return (
        <Popover className={`relative overflow-x-visible ${type === 'icon' ? 'inline-flex ' + className : ''}`}>
          <Popover.Button className={`w-full text-left ${type === 'icon' ? 'focus:outline-none' : ''}`}>
            {catComponent}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
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
              <div className='max-w-60 h-fit max-h-60 w-60 overflow-y-auto break-words rounded-lg rounded-md bg-white p-3 font-normal leading-7'>
                <p className='text-center text-base text-slate-400'>{currentDay}</p>
                <h1 className='pt-1 text-base'>{category?.name + ' #' + category?.id}</h1>
                <p className='pt-1 text-sm text-slate-700'>{descText}</p>
                <p className='pt-2 text-xs text-slate-500'>
                  creator:{' '}
                  <a className='text-blue-600 underline visited:text-purple-600 hover:text-blue-800' href={email}>
                    {category?.creator.name}
                  </a>
                </p>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      )
    },
    [currentInterval, className, currentDay, dayOffset, isNested, monthOffset, type]
  )

  return renderPopover(component, category)
}
