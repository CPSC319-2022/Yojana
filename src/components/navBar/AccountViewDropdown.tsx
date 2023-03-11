import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown } from '@/components/common'

export const AccountViewDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  return (
    <Dropdown
      text='Account'
      containerClassName='w-[12vw]'
      menuItems={[
        {
          key: 'Logout',
          label: 'Logout',
          onClick: () => signOut()
        },
        {
          key: 'User',
          label: name,
          onClick: () => {}
        },
        {
          key: 'Export iCal',
          label: 'Export iCal',
          onClick: () => iCalendarLink()
        }
      ]}
    />
  )
}

function iCalendarLink() {
  fetch('/api/dates/ical')
    .then((response) => response.text())
    .then(() => {
      window.open('http://127.0.0.1:8080/')
      // do something with the iCal data
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
