import React, { ReactElement } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown } from '@/components/common'

export const AccountViewDropdown = (): ReactElement => {
  const { data: session } = useSession()
  const sessionU = session?.user.isAdmin ? 'Admin' : 'User'

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
          label: sessionU,
          onClick: () => {}
        }
      ]}
    />
  )
}
