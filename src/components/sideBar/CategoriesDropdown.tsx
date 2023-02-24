import { BsThreeDotsVertical } from 'react-icons/bs'
import { DropdownProps } from '../common/Dropdown'
import React, { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CategoryModal } from '@/components/CategoryModal'
import { DeleteCategoryModal } from '@/components/DeleteCategoryModal'
import { Button } from '@/components/common'

export const CategoriesDropdown = (id: { id: number }) => {
  return (
    <HoverDropdown
      Icon={BsThreeDotsVertical}
      id={id.id}
      menuItems={[]}
      overrideDefaultButtonStyle={true}
      buttonClassName='cursor-pointer text-white group-hover:text-slate-500 group-hover:block hidden'
    />
  )
}

// TODO: close after clicking on a Panel, close after moving away from sidebar
const HoverDropdown = ({
  text,
  id,
  Icon,
  containerClassName = '',
  buttonClassName,
  overrideDefaultButtonStyle
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClosePopover = () => {
    setIsOpen(false)
  }

  return (
    <div className={containerClassName}>
      <Popover as='div' className='relative inline-block text-left'>
        <>
          <Popover.Button
            as={Button}
            text={text}
            Icon={Icon}
            onClick={handleButtonClick}
            className={buttonClassName}
            overrideDefaultStyle={overrideDefaultButtonStyle}
          />
          <Transition
            show={isOpen}
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Popover.Panel
              className='w-42 absolute left-0 mt-2 hidden w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block'
              static
            >
              <div className='px-1 py-1'>
                <CategoryModal method='PUT' id={Number(id)} callBack={handleClosePopover} />
                <DeleteCategoryModal id={Number(id)} onClose={handleClosePopover} />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      </Popover>
    </div>
  )
}
