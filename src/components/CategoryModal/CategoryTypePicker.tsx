import { useController } from 'react-hook-form'

/*
 *  This code provides UI for picking either to add the category to the master
 *  or the personal calendar in the Create Category modal
 *  It will update the value of the category isMaster on click
 *  This will only be show if the user logged in is Admin
 */

interface CategoryTypePicker {
  control: any
  name: string
  rules?: any
}

const CategoryTypePicker = ({ control, name, rules }: CategoryTypePicker) => {
  // Use react-hook-form's useController to get the onChange and value props
  const {
    field: { onChange, value }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  return (
    <div className='flex space-x-4'>
      <button
        type='button'
        className={`${
          value ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-slate-100 hover:bg-slate-200'
        } rounded-md px-4 py-2 text-left `}
        onClick={() => onChange(true)}
        id='master-calendar-type-btn'
      >
        Master Calendar
      </button>
      <button
        type='button'
        className={`${
          !value ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-slate-100 hover:bg-slate-200'
        } rounded-md px-4 py-2 text-left`}
        onClick={() => onChange(false)}
        id='personal-calendar-type-btn'
      >
        Personal Calendar
      </button>
    </div>
  )
}

export default CategoryTypePicker
