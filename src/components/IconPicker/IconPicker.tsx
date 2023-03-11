import { useController } from 'react-hook-form'
import React, { useState } from 'react'
import * as BootstrapIcon from 'react-bootstrap-icons'

interface IconPickerProps {
  control: any
  name: string
  rules?: any
}

export const IconPicker = ({ control, name, rules }: IconPickerProps) => {
  // Add bootstrap icons to the picker
  const iconPickerIcons = [
    <BootstrapIcon.Chat key='chat' />,
    <BootstrapIcon.X key='x' />,
    <BootstrapIcon.Pencil key='pencil' />,
    <BootstrapIcon.Truck key='truck' />,
    <BootstrapIcon.Telephone key='phone' />,
    <BootstrapIcon.ChevronLeft key='chevron-left' />,
    <BootstrapIcon.ChevronRight key='chevron-right' />,
    <BootstrapIcon.ArrowUp key='up-arrow' />,
    <BootstrapIcon.ArrowDown key='down-arrow' />,
    <BootstrapIcon.ArrowClockwise key='refresh' />,
    <BootstrapIcon.Play key='play' />,
    <BootstrapIcon.Envelope key='envelope' />,
    <BootstrapIcon.Folder key='folder' />,
    <BootstrapIcon.VolumeUp key='volume-full' />,
    <BootstrapIcon.CurrencyEuro key='euro' />,
    <BootstrapIcon.Sun key='sun' />,
    <BootstrapIcon.Plus key='plus' />,
    <BootstrapIcon.Square key='square' />,
    <BootstrapIcon.Flag key='flag' />,
    <BootstrapIcon.Eye key='glasses' />,
    <BootstrapIcon.Printer key='printer' />,
    <BootstrapIcon.ChatDots key='chat' />,
    <BootstrapIcon.Map key='map' />,
    <BootstrapIcon.Dash key='minus' />,
    <BootstrapIcon.CheckCircle key='check' />,
    <BootstrapIcon.Star key='star' />,
    <BootstrapIcon.Film key='film' />,
    <BootstrapIcon.Circle key='circle' />,
    <BootstrapIcon.CaretUp key='caret-up' />,
    <BootstrapIcon.CaretDown key='caret-down' />,
    <BootstrapIcon.CaretLeft key='caret-left' />,
    <BootstrapIcon.CaretRight key='caret-right' />,
    <BootstrapIcon.Cloud key='cloud' />
  ]

  const [selectedIcon, setSelectedIcon] = useState(<BootstrapIcon.TelephoneFill />)
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
              fontSize: '15px',
              borderRadius: '50%',
              textAlign: 'center',
              backgroundColor: selectedIcon && selectedIcon.key === icon.key ? '#D1FAE5' : 'white',
              margin: '10px',
              padding: '5px' // Increase the padding
            }}
            onClick={() => {
              setSelectedIcon(icon)
              console.log(selectedIcon)
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
