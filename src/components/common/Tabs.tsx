// Adapted from https://headlessui.com/react/tabs

import { Tab } from '@headlessui/react'
import React from 'react'
import { getChildrenByType } from 'react-nanny'

export const Tabs = ({ children, currentIndex }: { children: React.ReactNode; currentIndex: number }) => {
  const titles = getChildrenByType(children, [TabTitle])
  const contents = getChildrenByType(children, [TabContent])
  if (titles.length !== contents.length) {
    throw new Error('Tabs must have the same number of Titles and Contents')
  }

  return (
    <div className='w-full sm:px-0'>
      <Tab.Group defaultIndex={currentIndex}>
        <Tab.List className='flex space-x-1 rounded-xl bg-slate-100 p-1'>{titles.map((title) => title)}</Tab.List>
        <Tab.Panels className='mt-2'>{contents.map((pane) => pane)}</Tab.Panels>
      </Tab.Group>
    </div>
  )
}

const TabContent = ({ children }: { children: React.ReactNode }) => {
  return <Tab.Panel>{children}</Tab.Panel>
}
Tabs.Content = TabContent

export const TabTitle = ({ children, disabled = false }: { children: string; disabled?: boolean }) => {
  return (
    <Tab
      className={({ selected }) => {
        return `w-full rounded-md py-2.5 text-sm font-medium leading-5 text-emerald-900 ${
          selected ? 'bg-emerald-100 shadow' : 'text-slate-400 hover:bg-slate-200/[0.5] hover:text-slate-500'
        }`
      }}
      disabled={disabled}
    >
      {children}
    </Tab>
  )
}
Tabs.Title = TabTitle
