import { useController } from 'react-hook-form'
import React, { useState } from 'react'

interface IconPickerProps {
  control: any
  name: string
  rules?: any
}

export const IconPicker = ({ control, name, rules }: IconPickerProps) => {
  // Add Unicode icons to the picker
  const iconPickerIcons = [
    '☎',
    '←',
    '→',
    '↑',
    '↓',
    '↺',
    '➤',
    '🖂',
    '🗁',
    '🗫',
    '€',
    '☼',
    '⊕',
    '☐',
    '⚐',
    '⛟',
    '✎',
    '✕',
    '✳',
    '❖',
    '⛏',
    '🎞',
    '🏳',
    '🕶',
    '🖨',
    '🗣',
    '🗺',
    '¬',
    '•',
    '🕯',
    '＄',
    '✈',
    '◯',
    '⬡',
    '^',
    '◇',
    '_',
    '( )',
    '⌋',
    '☁'
  ]

  const [selectedIcon, setSelectedIcon] = useState('')
  // Use react-hook-form's useController to get the onChange and value props
  const {
    field: { onChange, value }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  return (
    <div>
      <div style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
        {iconPickerIcons.map((icon, index) => (
          <div
            key={index}
            style={{
              display: 'inline-block',
              cursor: 'pointer',
              fontSize: '25px',
              borderRadius: '50%',
              textAlign: 'center',
              backgroundColor: selectedIcon === icon ? '#D1FAE5' : 'white',
              margin: '10px'
            }}
            onClick={() => {
              setSelectedIcon(icon)
              onChange(icon)
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  )
}
