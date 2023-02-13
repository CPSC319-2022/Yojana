import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown } from '@/components/common'

export const AccountViewDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  return (
    <Dropdown
      title='Account'
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
        }
      ]}
    />
  )
}
