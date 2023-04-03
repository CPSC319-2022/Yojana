import { Button, Icon, IconName } from '@/components/common'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { getChildrenByType } from 'react-nanny'

export interface DropdownProps {
  text?: string
  id?: number
  containerClassName?: string
  buttonClassName?: string
  menuClassName?: string
  overrideDefaultButtonStyle?: boolean
  iconName?: IconName
  children?: React.ReactNode
}

/**
 * * The Dropdown component is a reusable component that allows users to select an option from a list of options.
 * * It renders a button that, when clicked, reveals a dropdown menu with the available options.
 * @param text - The text to be displayed on the button.
 * @param containerClassName - A CSS class name to be applied to the container div of the component.
 * @param buttonClassName - A CSS class name to be applied to the button.
 * @param overrideDefaultButtonStyle - A boolean that indicates whether to override the default button style or not.
 * @param iconName - The name of the icon to be displayed next to the text on the button. The default icon is 'CaretDownFill'.
 * @param children - The children of the component, which should be instances of the Dropdown.Button, Dropdown.Accordion, or Dropdown.Divider components.
 * @constructor
 */
export const Dropdown = ({
  text,
  containerClassName = '',
  buttonClassName,
  menuClassName,
  overrideDefaultButtonStyle,
  iconName = 'CaretDownFill',
  children
}: DropdownProps) => {
  const dropdownChildren = getChildrenByType(children, [Dropdown.Button, Dropdown.Accordion, Dropdown.Divider])
  return (
    <div className={containerClassName}>
      <Menu as='div' className='relative inline-block w-full text-left'>
        {({ open, close }) => (
          <>
            <Menu.Button
              as={Button}
              text={text}
              iconName={iconName}
              iconClassName={`mt-1 ml-1.5 ${open ? 'rotate-180' : ''}`}
              onClick={() => open && close()}
              className={buttonClassName}
              overrideDefaultStyle={overrideDefaultButtonStyle}
            />
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                  ${menuClassName}`}
              >
                <div className={`${menuClassName} space-y-1 px-1 py-1`}>{dropdownChildren}</div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

interface DropdownButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  clickable?: boolean
}

const renderDropdownButton = ({ label, onClick, disabled = false, clickable = true }: DropdownButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`group flex w-full items-center rounded-md px-4 py-2 ${disabled && 'text-slate-400'} ${
        clickable ? 'hover:bg-slate-100' : 'cursor-default'
      }`}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

/**
 * The Dropdown.Button component is a child component of the Dropdown component that renders a button inside the dropdown menu.
 */
const DropdownButton = ({ label, onClick, disabled = false, clickable = true }: DropdownButtonProps) => {
  return clickable ? (
    <Menu.Item>{renderDropdownButton({ label, onClick, disabled, clickable })}</Menu.Item>
  ) : (
    renderDropdownButton({ label, onClick, disabled, clickable })
  )
}
Dropdown.Button = DropdownButton

/**
 * The Dropdown.Accordion component is a child component of the Dropdown component that renders an accordion inside the dropdown menu.
 */
const DropdownAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const accordionItems = getChildrenByType(children, [DropdownButton, DropdownDivider])
  return (
    <div className='w-full'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='group mb-1 flex w-full items-center justify-between space-y-1 rounded-md px-4 py-2 hover:bg-slate-100'>
              <span>{title}</span>
              <Icon iconName='ChevronUp' className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
            </Disclosure.Button>
            <Disclosure.Panel className='space-y-1 text-sm'>{accordionItems}</Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
Dropdown.Accordion = DropdownAccordion

/**
 * The Dropdown.Divider component is a child component of the Dropdown component that renders a divider inside the dropdown menu.
 */
const DropdownDivider = () => {
  return <hr className='m-2 border-slate-200' />
}
Dropdown.Divider = DropdownDivider
