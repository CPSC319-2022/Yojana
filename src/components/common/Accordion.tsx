import { getChildByType, getChildrenByType } from 'react-nanny'
import { Disclosure } from '@headlessui/react'
import { Icon } from '@/components/common/Icon'
import React from 'react'

export const Accordion = ({ children }: { children: React.ReactNode }) => {
  const items = getChildrenByType(children, Accordion.Item)
  return (
    <div className='w-full'>
      {items.map((item, index) => (
        <div key={`accordion-item-${index}`} className={index !== 0 ? 'mt-2' : ''}>
          {item}
        </div>
      ))}
    </div>
  )
}

const AccordionItem = ({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) => {
  const header = getChildByType(children, Accordion.Header)
  const body = getChildByType(children, Accordion.Body)
  if (!header || !body) {
    throw new Error('Accordian Item must have a header and a body')
  }
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full justify-between rounded-lg bg-emerald-100 px-4 py-2 text-left text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500 focus-visible:ring-opacity-75'>
            <span>{header}</span>
            <Icon iconName='ChevronUp' className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
          </Disclosure.Button>
          <Disclosure.Panel className='px-4 pb-2 text-sm text-slate-600'>{body}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
Accordion.Item = AccordionItem

const AccordionHeader = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
Accordion.Header = AccordionHeader

const AccordionBody = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
Accordion.Body = AccordionBody
