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
  const mainStyle = {
    paddingTop: '0'
  }
  const headerStyle = {
    display: 'flex',
    FlexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    FlexWrap: 'nowrap'
  }
  const closerStyle = {
    background: 'white',
    color: 'black',
    border: 'none'
  }
  const emptyInputStyle = {
    borderBottom: '1px solid #000',
    width: '100%',
    marginTop: '1rem'
  }
  const innerBodyStyle = {
    margin: '1.5rem',
    width: '100%',
    display: 'flex',
    FlexDirection: 'row'
    // alignItems: "center",
  }
  const boxInputStyle = {
    border: '1px solid #00192C',
    borderRadius: '6px',
    width: '82.5%'
  }
  return (
    <div>
      <label htmlFor='my-modal-6' className='btn'>
        Create
      </label>
      <CategoriesMenu />

      <input type='checkbox' id='my-modal-6' className='modal-toggle' />
      <div className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box' style={mainStyle}>
          <div className='modal-header' style={headerStyle}>
            <h3 className='text-lg font-bold' style={{ marginLeft: '0.7rem' }}>
              Create New Category
            </h3>
            <label htmlFor='my-modal-6' className='btn' style={closerStyle}>
              X
            </label>
          </div>

          <div className='modal-body' style={{ padding: '1rems' }}>
            <input
              onChange={(event) => setCategoryName(event.target.value)}
              id='categoryName'
              placeholder=' Name'
              style={emptyInputStyle}
              type='text'
            />

            <div id='categoryDescription' style={innerBodyStyle}>
              <MdOutlineDescription size={32} />
              <input
                onChange={(event) => setCategoryDescription(event.target.value)}
                id='categoryDescription'
                placeholder=' Add Descriptions'
                style={boxInputStyle}
                type='text'
              />
            </div>

            <div id='categoryColor' style={innerBodyStyle}>
              <MdOutlineColorLens size={32} />
              <input
                onChange={(event) => setCategoryColor(event.target.value)}
                defaultValue={categoryColor}
                id='categoryColor'
                type='color'
              />
            </div>
          </div>

          <div className='modal-action'>
            <button className='btn' style={{ background: '#008FFD', border: 'white' }} onClick={handlePOST}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
