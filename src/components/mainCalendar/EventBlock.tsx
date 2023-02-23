import { useAppSelector } from '@/redux/hooks'
import { isMonthInterval } from '@/redux/reducers/MainCalendarReducer'
import { getTextColor } from '@/utils/color'

interface EventBlockProps {
  color: string
  label: string
  icon: string
}

export const EventBlock = (props: EventBlockProps) => {
  const monthView = useAppSelector(isMonthInterval)

  return (
    <>
      <style jsx>{`
        .event-block {
          background-color: ${props.color};
        }
      `}</style>
      <div
        aria-label={props.label}
        className={
          'event-block mx-1 mt-1 mt-1 min-h-[1vh] overflow-x-hidden whitespace-nowrap rounded-md px-1.5' +
          ' ' +
          getTextColor(props.color)
        }
      >
        {monthView ? props.icon + ' ' + props.label : ''}
      </div>
    </>
  )
}
