import { Button, Icon, IconName } from '@/components/common'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { getChildrenByType } from 'react-nanny'

export interface DropdownProps {
  text?: string
  id?: number
  containerClassName?: string
  buttonClassName?: string
  overrideDefaultButtonStyle?: boolean
  iconName?: IconName
  children?: React.ReactNode
}

export const Dropdown = ({
  text,
  containerClassName = '',
  buttonClassName,
  overrideDefaultButtonStyle,
  iconName = 'CaretDownFill',
  children
}: DropdownProps) => {
  const dropdownChildren = getChildrenByType(children, [Dropdown.Button, Dropdown.Accordion])
  return (
    <div className={containerClassName}>
      <Menu as='div' className='relative inline-block text-left'>
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
                `}
              >
                <div className='px-1 py-1 '>{dropdownChildren}</div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

const DropdownButton = ({
  key,
  label,
  onClick,
  disabled = false
}: {
  key: string
  label: string
  onClick: () => void
  disabled?: boolean
}) => {
  return (
    <Menu.Item key={key}>
      {({ active }) => (
        <button
          type='button'
          onClick={onClick}
          className={`${active && 'bg-slate-100'} group flex w-full items-center rounded-md px-4 py-2 ${
            disabled && 'bg-slate-100 text-slate-400'
          }`}
          disabled={disabled}
        >
          {label}
        </button>
      )}
    </Menu.Item>
  )
}
Dropdown.Button = DropdownButton

const DropdownAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const accordionItems = getChildrenByType(children, [DropdownButton])
  return (
    <div className='w-full'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='group flex w-full items-center justify-between rounded-md px-4 py-2 hover:bg-slate-100'>
              <span>{title}</span>
              <Icon iconName='ChevronUp' className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
            </Disclosure.Button>
            <Disclosure.Panel className='text-sm'>{accordionItems}</Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
Dropdown.Accordion = DropdownAccordion
