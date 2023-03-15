import { useController } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Icon, IconName } from '@/components/common'

interface IconPickerProps {
  control: any
  name: string
  color: string
  rules?: any
}

// List of icons to display in the icon picker
export const iconPickerIcons: IconName[] = [
  'ChatFill',
  'PencilFill',
  'Truck',
  'TelephoneFill',
  'ChevronLeft',
  'ChevronRight',
  'ArrowUp',
  'ArrowDown',
  'ArrowClockwise',
  'EnvelopeFill',
  'FolderFill',
  'VolumeUpFill',
  'CurrencyEuro',
  'CurrencyDollar',
  'SunFill',
  'Square',
  'SquareFill',
  'FlagFill',
  'EyeFill',
  'PrinterFill',
  'ChatDotsFill',
  'MapFill',
  'CheckCircle',
  'Circle',
  'CircleFill',
  'Hexagon',
  'HexagonFill',
  'PuzzleFill',
  'StarFill',
  'Film',
  'CaretUp',
  'CaretDown',
  'CaretLeft',
  'CaretRight',
  'CloudFill',
  'CloudDownloadFill',
  'CloudUploadFill',
  'Code',
  'ClipboardFill',
  'CollectionFill',
  'GearFill',
  'Heart',
  'HouseFill',
  'BalloonFill',
  'AirplaneFill',
  'SuitClubFill',
  'SuitDiamondFill',
  'SuitHeartFill',
  'SuitSpadeFill',
  'CalendarDateFill'
]

export const IconPicker = ({ control, name, color, rules }: IconPickerProps) => {
  // Use react-hook-form's useController to get the onChange and value props
  const {
    field: { onChange, value }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  const [icons, setIcons] = React.useState<IconName[]>(iconPickerIcons)

  useEffect(() => {
    if (!icons.includes(value)) {
      setIcons([value, ...icons])
    }
  }, [value])

  return (
    <div className='flex flex-wrap justify-center shadow-md'>
      {icons.map((icon) => (
        <span
          key={icon}
          className={`m-1 p-2 hover:bg-slate-100 ${value === icon ? 'ring-2' : ''}`}
          onClick={() => onChange(icon)}
        >
          <style jsx>{`
            span {
              --tw-ring-color: ${color};
            }
          `}</style>
          <Icon iconName={icon} color={color} />
        </span>
      ))}
    </div>
  )
}
