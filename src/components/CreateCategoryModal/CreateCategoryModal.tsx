import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ColorPicker } from '@/components/ColorPicker'
import React, { useState } from 'react'
import { Button, Modal, Tabs } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { Category, Entry } from '@prisma/client'
import { addCategory } from '@/redux/reducers/AppDataReducer'
import { randomColor } from '@/utils/color'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayOfWeekPicker } from '@/components/DayOfWeekPicker/DayOfWeekPicker'
import { Disclosure, Transition } from '@headlessui/react'
import { BsChevronUp } from 'react-icons/bs'
import dayjs from 'dayjs'
import { generateDatesFromCron } from '@/utils/dates'
import { setAlert } from '@/redux/reducers/AlertReducer'

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name cannot be empty' }).max(191),
  description: z.string().trim().max(191).optional(),
  color: z.string().refine((color) => /^#[0-9A-F]{6}$/i.test(color), { message: 'Invalid color' }),
  repeating: z
    .object({
      cron: z.string().optional(),
      startDate: z.string(),
      endDate: z.string()
    })
    .refine(
      (object) => {
        if (object.cron) {
          return dayjs(object.endDate).isAfter(object.startDate)
        }
        return true
      },
      { message: 'End date must be after start date' }
    )
})

type Schema = z.infer<typeof schema>

export const CreateCategoryModal = () => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    shouldUseNativeValidation: true,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      repeating: {
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('year').format('YYYY-MM-DD')
      }
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const onSubmit: SubmitHandler<Schema> = async ({ name, color, description, repeating }) => {
    if (!session) {
      console.error('No session found')
      return
    }

    let dates: string[] = []
    if (repeating.cron) {
      dates = generateDatesFromCron(repeating.cron, repeating.startDate, repeating.endDate)
    }
    const response = await fetch('api/cats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        color: color,
        creatorId: session.user.id,
        cron: repeating.cron,
        startDate: repeating.cron ? repeating.startDate : undefined,
        endDate: repeating.cron ? repeating.endDate : undefined,
        dates: dates
      })
    })
    if (response.ok) {
      const data: Category & { entries: Entry[] } = await response.json()
      dispatch(
        addCategory({
          id: data.id,
          color: data.color,
          name: data.name,
          description: data.description,
          isMaster: data.isMaster,
          icon: data.icon,
          cron: data.cron,
          startDate: data.startDate,
          endDate: data.endDate,
          show: true,
          creator: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            isAdmin: session.user.isAdmin
          },
          entries: data.entries
        })
      )
      reset(() => ({
        name: '',
        description: '',
        color: randomColor(),
        repeating: {
          cron: undefined,
          startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
          endDate: dayjs().endOf('year').format('YYYY-MM-DD')
        }
      }))
      setIsModalOpen(false)
    } else {
      if (response.status !== 500) {
        const text = await response.text()
        dispatch(setAlert({ message: text, type: 'error', show: true }))
      } else {
        dispatch(setAlert({ message: 'Something went wrong. Please try again later.', type: 'error', show: true }))
      }
    }
  }

  return (
    <>
      <Modal
        buttonText='Create Category'
        title='Create Category'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'create-category-modal-handle'}
        bounds={'create-category-modal-wrapper'}
        buttonClassName={'mt-4 ml-5 truncate'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
          <div className='mb-4'>
            <label className='mb-2 block'>Name</label>
            <input
              placeholder='Enter a name for the category'
              className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-500 invalid:bg-red-50 invalid:text-red-500 invalid:placeholder-red-500 focus:outline-none'
              {...register('name')}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2 block'>Description</label>
            <textarea
              placeholder='Enter a description for the category'
              className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
              {...register('description')}
            />
          </div>
          <div className='mb-6'>
            <label className='mb-2 block'>Color</label>
            <ColorPicker control={control} name='color' rules={{ required: true }} />
          </div>
          <div className='mb-4'>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className='flex w-full justify-between rounded-lg py-2 text-left text-slate-800 focus:outline-none'>
                    <span>Repeating</span>
                    <BsChevronUp className={`${open ? 'rotate-180 transform' : ''} mt-0.5 h-5 w-5`} />
                  </Disclosure.Button>
                  <Transition
                    enter='transition duration-100 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-75 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                  >
                    <Disclosure.Panel className='pt-4 pb-2'>
                      <div className='pb-5'>
                        <Tabs>
                          <Tabs.Title>Weekly</Tabs.Title>
                          <Tabs.Content>
                            <DayOfWeekPicker control={control} name='repeating.cron' rules={{ required: false }} />
                          </Tabs.Content>
                          <Tabs.Title>Monthly</Tabs.Title>
                          <Tabs.Content>
                            <code className='text-red-500'>TODO: Month Calendar picker</code>
                          </Tabs.Content>
                        </Tabs>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='mb-2 block text-sm'>Start Date</label>
                          <input className='text-sm' type='date' {...register('repeating.startDate')} />
                        </div>
                        <div>
                          <label className='mb-2 block text-sm'>End Date</label>
                          <input className='text-sm' type='date' {...register('repeating.endDate')} />
                        </div>
                      </div>
                      {errors.repeating && <p className='mt-2 text-sm text-red-500'>{errors.repeating.message}</p>}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </div>
          <div className='flex justify-end'>
            <Button type='button' disabled text='Add Dates' className='mr-3' />
            <Button type='submit' disabled={isSubmitting} text='Create' onClick={handleSubmit(onSubmit)} />
          </div>
        </form>
      </Modal>
    </>
  )
}
