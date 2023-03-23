import { getChildByType, getChildrenByType } from 'react-nanny'
import { Disclosure } from '@headlessui/react'
import { Icon, IconName } from '@/components/common/Icon'
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

interface AccordionItemProps {
  children: React.ReactNode
  defaultOpen?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
  secondIcon?: IconName
  secondIconOnClick?: () => void
}

const AccordionItem = ({
  children,
  defaultOpen = true,
  size = 'sm',
  id,
  secondIcon,
  secondIconOnClick = () => {}
}: AccordionItemProps) => {
  const header = getChildByType(children, Accordion.Header)
  const body = getChildByType(children, Accordion.Body)
  if (!header || !body) {
    throw new Error('Accordian Item must have a header and a body')
  }
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'

  return (
    <Disclosure defaultOpen={defaultOpen} as='div' id={id}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`flex w-full justify-between rounded-lg bg-emerald-100 px-4 py-2 text-left ${sizeClass} font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none`}
          >
            {header}
            <span className='flex'>
              {secondIcon && (
                <Icon
                  iconName={secondIcon}
                  className={`mr-3 h-5 w-5`}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    secondIconOnClick()
                  }}
                />
              )}
              <Icon iconName='ChevronUp' className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className={`px-4 pb-2 ${sizeClass} text-slate-600`}>{body}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
Accordion.Item = AccordionItem

const AccordionHeader = ({ children }: { children: React.ReactNode }) => {
  return <span>{children}</span>
}
Accordion.Header = AccordionHeader

const AccordionBody = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
Accordion.Body = AccordionBody
