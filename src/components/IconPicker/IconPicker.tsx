import { useController } from 'react-hook-form'
import React from 'react'
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
  'X',
  'PencilFill',
  'Truck',
  'TelephoneFill',
  'ChevronLeft',
  'ChevronRight',
  'ArrowUp',
  'ArrowDown',
  'ArrowClockwise',
  'PlayFill',
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
  'HouseFill'
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

  return (
    <div className='flex flex-wrap justify-center shadow-md'>
      {iconPickerIcons.map((icon) => (
        <span
          key={icon}
          className={`m-1 p-2 hover:bg-slate-100 ${value === icon ? 'ring-2 ring-emerald-500' : ''}`}
          onClick={() => onChange(icon)}
        >
          <Icon iconName={icon} color={color} />
        </span>
      ))}
    </div>
  )
}
