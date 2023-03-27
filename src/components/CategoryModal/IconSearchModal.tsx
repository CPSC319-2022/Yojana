import { useController } from 'react-hook-form'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Icon, IconName, Modal } from '@/components/common'
import { Tab } from '@headlessui/react'

interface IconPickerProps {
  buttonClassName?: string
  control: any
  name: string
  color: string
  rules?: any
}

interface Icons {
  [category: string]: [
    {
      name: IconName
      tags: string[]
    }
  ]
}

export const IconSearchModal = ({ buttonClassName, control, name, color, rules }: IconPickerProps) => {
  const [icons, setIcons] = React.useState<Icons>({})

  useEffect(() => {
    const fetchIcons = async () => {
      const response = await fetch('/icons.json')
      const icons = await response.json()
      setIcons(icons)
    }
    fetchIcons()
  }, [])

  // Use react-hook-form's useController to get the onChange and value props
  const {
    field: { onChange, value }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  const [isOpen, setIOpen] = React.useState(false)

  const [inputValue, setInputValue] = React.useState('')

  const renderIcon = useCallback(
    (icon: IconName) => {
      return (
        <div
          key={icon}
          className='flex cursor-pointer flex-col items-center justify-center'
          onClick={() => {
            onChange(icon)
          }}
        >
          <style jsx>{`
            div {
              --tw-ring-color: ${color};
            }
          `}</style>
          <div className={`p-2 hover:bg-slate-100 ${value === icon ? 'ring-2' : ''}`}>
            <div className='flex items-center justify-center'>
              <Icon iconName={icon} color={color} />
            </div>
            <div className='text-xs text-slate-500'>{icon}</div>
          </div>
        </div>
      )
    },
    [value, color, onChange]
  )

  const searchIcons = useMemo(() => {
    const input = inputValue.toLowerCase().trim()
    const results = new Set<IconName>()

    Object.entries(icons).map(([category, icons]) => {
      icons.forEach(({ name, tags }) => {
        if (name.toLowerCase().includes(input) || tags.some((keyword) => keyword.includes(input))) {
          results.add(name)
        }
      })
    })

    const resultsArray = [...results]

    if (resultsArray.length === 0) {
      return (
        <div className='flex items-center justify-center'>
          <div className='text-slate-500'>No results found</div>
        </div>
      )
    } else {
      return <div className='grid grid-cols-6 gap-4'>{resultsArray.map((icon) => renderIcon(icon))}</div>
    }
  }, [inputValue, icons, renderIcon])

  return (
    <Modal
      buttonText=''
      title=''
      buttonIcon='Search'
      isOpen={isOpen}
      setIsOpen={setIOpen}
      draggable={false}
      closeWhenClickOutside={true}
      closeParent={() => setIOpen(false)}
      handle={'icons-modal-handle'}
      bounds={'icons-modal-wrapper'}
      showCloseBtn={false}
      overrideDefaultButtonStyle={true}
      buttonClassName={buttonClassName}
      minWidth='75vw'
      bodyPadding=''
      scrollable={false}
    >
      <div className='h-[80vh] p-4'>
        <div className='flex'>
          <input
            id='search-bar'
            placeholder='Start typing to search...'
            className='focus:shadow-outline static w-full appearance-none rounded-md border py-2 px-3 leading-tight text-slate-700 shadow invalid:border-red-500 invalid:bg-red-50 invalid:text-red-500 invalid:placeholder-red-500 focus:outline-none'
            defaultValue={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
          />
        </div>
        <div className='flex h-[94%] pt-4'>
          <Tab.Group vertical>
            <div className='flex'>
              <div className='overflow-y-scroll'>
                <Tab.List className='flex flex-col space-y-1'>
                  {Object.keys(icons).map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        `${selected ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}
                          relative cursor-pointer rounded-lg py-2 px-3 hover:bg-slate-100 focus:outline-none`
                      }
                      onClick={() => {
                        setInputValue('')
                      }}
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>
            <div className='flex grow'>
              {inputValue ? (
                <div className='grow overflow-y-scroll p-1' id='icon-result'>
                  {searchIcons}
                </div>
              ) : (
                <Tab.Panels className='grow overflow-y-scroll p-1'>
                  {Object.entries(icons).map(([category, icon]) => (
                    <Tab.Panel key={category}>
                      <div className='grid grid-cols-5 gap-1'>{icon.map(({ name }) => renderIcon(name))}</div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              )}
            </div>
          </Tab.Group>
        </div>
      </div>
    </Modal>
  )
}
