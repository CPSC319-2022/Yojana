import { CategoriesMenu } from '@/components/categoriesMenu'
import { getSession } from 'next-auth/react'
import { ReactElement, useState } from 'react'
import { MdOutlineColorLens, MdOutlineDescription } from 'react-icons/md'

export const SideBar = (): ReactElement => {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryColor, setCategoryColor] = useState('')

  const handlePOST = async () => {
    const session = await getSession()

    const response = await fetch('api/cats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription,
        color: categoryColor,
        creatorId: session?.user.id,
        dates: []
      })
    })
    const data = await response.json()
  }

  return (
    <div>
      <label htmlFor='my-modal-6' className='btn'>
        Create
      </label>
      <CategoriesMenu />

      <input type='checkbox' id='my-modal-6' className='modal-toggle' />
      <div className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box py-5'>
          <div className='modal-header flex items-center justify-between'>
            <h3 className='ml-7 text-lg font-bold'>Create New Category</h3>
            <label htmlFor='my-modal-6' className='close-btn btn border-white bg-white text-black'>
              X
            </label>
          </div>

          <div className='modal-body px-5'>
            <input
              onChange={(event) => setCategoryName(event.target.value)}
              id='categoryName'
              placeholder=' Name'
              className='mb-5 w-full border-b-2'
              type='text'
            />

            <div id='categoryDescription' className='mb-5 flex items-center'>
              <MdOutlineDescription size={32} />
              <input
                onChange={(event) => setCategoryDescription(event.target.value)}
                id='categoryDescription'
                placeholder=' Add Descriptions'
                className='ml-5 w-full border border-gray-400 p-2'
                type='text'
              />
            </div>

            <div id='categoryColor' className='flex items-center'>
              <MdOutlineColorLens size={32} />
              <input
                onChange={(event) => setCategoryColor(event.target.value)}
                defaultValue={categoryColor}
                id='categoryColor'
                className='ml-5'
                type='color'
              />
            </div>
          </div>

          <div className='modal-action'>
            <label
              htmlFor='my-modal-6'
              className='btn'
              style={{ background: '#008FFD', border: 'white' }}
              onClick={handlePOST}
            >
              Save
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
