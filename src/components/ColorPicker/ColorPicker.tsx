import { useController } from 'react-hook-form'
// import { CompactPicker } from 'react-color'
import tcolors from 'tailwindcss/colors'
import { DefaultColors } from 'tailwindcss/types/generated/colors'
import { CompactPicker } from 'react-color'
import React from 'react'
import { randomColor } from '@/utils/color'

interface ColorPickerProps {
  control: any
  name: string
  rules?: any
}

export const ColorPicker = ({ control, name, rules }: ColorPickerProps) => {
  // Add colors from tailwind to the color picker
  const tailwindColors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
  ]
  const colorPickerColors = []
  for (const c of tailwindColors) {
    colorPickerColors.push(tcolors[c as keyof DefaultColors][200])
    colorPickerColors.push(tcolors[c as keyof DefaultColors][400])
    colorPickerColors.push(tcolors[c as keyof DefaultColors][600])
  }

  // Use react-hook-form's useController to get the onChange and value props
  // if defaultValue is not provided, pick a random color from the colorPickerColors array
  const {
    field: { onChange, value }
  } = useController({
    name: name,
    control: control,
    rules: rules,
    defaultValue: randomColor()
  })

  return (
    <CompactPicker
      color={value}
      onChange={(c) => onChange(c.hex)}
      colors={colorPickerColors}
      styles={{
        default: {
          compact: {
            width: '100%'
          }
        }
      }}
    />
  )
}
