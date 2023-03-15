import { CategoryModal } from '@/components/CategoryModal'
import { Button } from '@/components/common'
import { DeleteCategoryModal } from '@/components/DeleteCategoryModal'
import { useAppSelector } from '@/redux/hooks'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { Popover, Transition } from '@headlessui/react'
import { Dispatch, Fragment, useState } from 'react'
import { DropdownProps } from '../common/Dropdown'

export const CategoriesDropdown = (props: {
  id: number
  setKeepFocus: Dispatch<React.SetStateAction<number>>
  keepOpen: boolean
}) => {
  const { id, setKeepFocus, keepOpen } = props
  const disable = useAppSelector(getIsSelectingDates)

  return (
    <HoverDropdown
      iconName='ThreeDotsVertical'
      id={id}
      overrideDefaultButtonStyle={true}
      buttonClassName={`z-0 focus:outline-none cursor-pointer
      ${!disable && 'group-hover:text-slate-500'} 
      ${keepOpen ? 'text-slate-500' : 'text-white'}`}
      setKeepFocus={setKeepFocus}
      keepPanelOpen={keepOpen}
    />
  )
}

interface HoverDropdownProps extends DropdownProps {
  setKeepFocus: Dispatch<React.SetStateAction<number>>
  keepPanelOpen: boolean
}

const HoverDropdown = ({
  text,
  id,
  iconName,
  containerClassName = '',
  buttonClassName,
  overrideDefaultButtonStyle,
  setKeepFocus,
  keepPanelOpen
}: HoverDropdownProps) => {
  const [closeWhenClickOutside, setCloseWhenClickOutside] = useState(false)
  const handleButtonClick = () => {
    keepPanelOpen ? handleClosePopover() : setKeepFocus?.(Number(id))
    setCloseWhenClickOutside(!closeWhenClickOutside)
  }
  const handleClosePopover = () => {
    setKeepFocus && setKeepFocus(-1)
    setCloseWhenClickOutside(false)
  }
  const disable = useAppSelector(getIsSelectingDates)
  return (
    <div className={containerClassName}>
      {closeWhenClickOutside && (
        <div
          className='fixed absolute inset-0 z-10 flex h-screen w-screen bg-transparent'
          aria-hidden='true'
          onClick={handleClosePopover}
        />
      )}
      <Popover as='div' className='relative inline-block text-left'>
        <>
          <Popover.Button
            as={Button}
            disabled={disable}
            text={text}
            iconName={iconName}
            onClick={handleButtonClick}
            className={buttonClassName}
            id={`category-dropdown-${id}`}
            overrideDefaultStyle={overrideDefaultButtonStyle}
          />
          <Transition
            show={keepPanelOpen}
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Popover.Panel
              className={`w-42 absolute left-0 z-10 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
              ${disable || !closeWhenClickOutside ? 'visibility: collapse' : ''}`}
              onClick={() => {
                setCloseWhenClickOutside(false)
              }}
              static
            >
              <div className={`px-1 py-1 `}>
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
