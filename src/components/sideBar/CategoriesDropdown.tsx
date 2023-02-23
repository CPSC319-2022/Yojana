import { BsThreeDotsVertical } from 'react-icons/bs'
import { HoverDropdown } from '../common/Dropdown'

export const CategoriesDropdown = (id: { id: number }) => {
  return (
    <HoverDropdown
      title={<BsThreeDotsVertical />}
      id={id.id}
      containerClassName='mt-1 cursor-pointer group-hover:text-black'
      menuItems={[]}
    />
  )
}
