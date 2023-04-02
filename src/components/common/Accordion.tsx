import { getChildByType, getChildrenByType } from 'react-nanny'
import { Disclosure } from '@headlessui/react'
import { Icon, IconName } from '@/components/common/Icon'
import React from 'react'
/*
 * This is a TypeScript React component that creates an accordion UI element that can be used to hide or show content,
 * with each item having a header and a body. It includes options for disabling the accordion and setting the default
 * state of each item.
 */

/**
 * * This component is used to create an accordion that can be used to hide or show content. It can contain one or more items.
 * * Each item can have a header and a body. When the header is clicked, the body will be revealed or hidden.
 * @param children: React.ReactNode - The content of the Accordion. Should contain one or more Accordion.Item components.
 * @param disable: boolean - Optional. If true, disables the accordion from being clicked.
 * @constructor
 */
export const Accordion = ({ children, disable }: { children: React.ReactNode; disable?: boolean }) => {
  const items = getChildrenByType(children, Accordion.Item)
  return (
    <div className={`w-full ${disable ? 'pointer-events-none' : ''}`}>
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
  secondIconId?: string
}

const AccordionItem = ({
  children,
  defaultOpen = true,
  size = 'sm',
  id,
  secondIcon,
  secondIconId,
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
                  id={secondIconId}
                  onClick={(e) => {
                    // prevent the accordion from toggling
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
