import { useController } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Icon, IconName } from '@/components/common'
import { iconPickerIcons } from '@/constants/icons'

interface IconPickerProps {
  control: any
  name: string
  color: string
  rules?: any
}

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
  }, [value, icons])

  return (
    <div className='flex flex-wrap justify-center shadow-md' id='icon-picker'>
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
