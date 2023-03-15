import { ColorPicker } from '@/components/ColorPicker'
import { Button, Icon, Modal, Tabs } from '@/components/common'
import { DayOfWeek, DayOfWeekPicker } from '@/components/RecurringDatePickers/DayOfWeekPicker'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { addCategory, getCategory, updateCategory } from '@/redux/reducers/AppDataReducer'
import {
  cancelDateSelection,
  getSelectedDates,
  resetSelectedDates,
  setIndividualDates,
  setIsSelectingDates,
  setRepeatingDates
} from '@/redux/reducers/DateSelectorReducer'
import { EntryWithoutCategoryId } from '@/types/prisma'
import { randomColor } from '@/utils/color'
import { generateDatesFromCron } from '@/utils/dates'
import { Disclosure, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Entry } from '@prisma/client'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { IconPicker, iconPickerIcons } from '@/components/IconPicker'
import {
  DayOfMonthPicker,
  MonthRecurrence,
  monthRecurrenceCrons,
  MonthRecurrenceType
} from '@/components/RecurringDatePickers/DayOfMonthPicker'
import { IconSearchModal } from '@/components/IconPicker/IconSearchModal'

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name cannot be empty' }).max(191),
  description: z.string().trim().max(191).optional(),
  color: z.string().refine((color) => /^#[0-9A-F]{6}$/i.test(color), { message: 'Invalid color' }),
  icon: z.string(),
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

export const CategoryModal = ({ method, id, callBack }: { method: string; id: number; callBack: () => void }) => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const currentState = useAppSelector((state) => getCategory(state, id))
  const selectedDates = useAppSelector(getSelectedDates)
  const [dirtyDates, setDirtyDates] = useState(false)
  const [currentCron, setCurrentCron] = useState<string>('')
  const [selectedDaysOfTheWeek, setSelectedDaysOfTheWeek] = useState<DayOfWeek>([])
  const [selectedMonthRecurrenceCron, setSelectedMonthRecurrenceCron] = useState<MonthRecurrenceType>(
    MonthRecurrence.NONE
  )
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const getInitialMonthlyCronState = useCallback((cron: string | null | undefined): MonthRecurrenceType => {
    if (!cron) return MonthRecurrence.NONE
    if (cron === monthRecurrenceCrons[MonthRecurrence.ON_LAST_DAY]) return MonthRecurrence.ON_LAST_DAY
    if (cron.slice(-1) === 'L') return MonthRecurrence.ON_LAST_XDAY
    if (cron.slice(-2, -1) === '#') return MonthRecurrence.ON_YTH_XDAY
    if (cron.startsWith('0 0 ') && cron.endsWith(' * *')) return MonthRecurrence.ON_DATE_Y
    return MonthRecurrence.NONE
  }, [])

  // these two have to go above the initial load useEffect to avoid overwriting the stored values
  useEffect(() => {
    if (selectedDaysOfTheWeek.length !== 0) setSelectedMonthRecurrenceCron(MonthRecurrence.NONE)
  }, [selectedDaysOfTheWeek])
  useEffect(() => {
    if (selectedMonthRecurrenceCron !== MonthRecurrence.NONE) setSelectedDaysOfTheWeek([])
  }, [selectedMonthRecurrenceCron])

  // intended strictly for initial load
  useEffect(() => {
    if (currentState?.cron?.startsWith('0 0 * * ')) {
      const currentRepeatingDays = method === 'PUT' ? currentState?.cron?.split(' ').at(-1)?.split(',') : []
      // remove empty string from array
      if (currentRepeatingDays?.includes('')) currentRepeatingDays.splice(currentRepeatingDays.indexOf(''), 1)
      setSelectedDaysOfTheWeek(currentRepeatingDays || [])
    }
    const currentMonthly = getInitialMonthlyCronState(currentState?.cron)
    currentMonthly !== MonthRecurrence.NONE ? setCurrentTabIndex(1) : setCurrentTabIndex(0)
    setSelectedMonthRecurrenceCron(currentMonthly)
  }, [currentState?.cron, getInitialMonthlyCronState, method])

  const getInitialDates = (dates: EntryWithoutCategoryId[], isRepeating: boolean) => {
    return dates
      .filter((entry) => entry.isRepeating === isRepeating)
      .map((entry) => {
        return {
          // TODO: Fix this hack to get the correct date, ignore timezones
          date: dayjs(entry.date).add(1, 'day').toISOString(),
          isRepeating: isRepeating
        }
      })
  }

  useEffect(() => {
    dispatch(setIndividualDates(getInitialDates(currentState?.entries || [], false)))
    dispatch(setRepeatingDates(getInitialDates(currentState?.entries || [], true)))
    //   eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const randomIcon = () => {
    return iconPickerIcons[(Math.random() * iconPickerIcons.length) | 0]
  }

  const defaultValues =
    method == 'POST'
      ? {
          name: '',
          description: '',
          icon: randomIcon(),
          repeating: {
            cron: '',
            startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
            endDate: dayjs().endOf('year').format('YYYY-MM-DD')
          }
        }
      : {
          name: currentState?.name,
          description: currentState?.description,
          color: currentState?.color,
          icon: currentState?.icon,
          repeating: {
            cron: currentState?.cron || '',
            startDate:
              currentState?.startDate?.toString().split('T')[0] || dayjs().startOf('year').format('YYYY-MM-DD'),
            endDate: currentState?.endDate?.toString().split('T')[0] || dayjs().endOf('year').format('YYYY-MM-DD')
          }
        }

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors, isDirty },
    getValues,
    reset,
    watch
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    shouldUseNativeValidation: true,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: defaultValues
  })

  const watchColor = watch('color')

  const watchStartDate = watch('repeating.startDate')

  const resetForm = useCallback(() => {
    reset(() => ({
      name: '',
      description: '',
      color: randomColor(),
      icon: randomIcon(),
      repeating: {
        cron: undefined,
        startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('year').format('YYYY-MM-DD')
      }
    }))
    setSelectedDaysOfTheWeek([])
    setSelectedMonthRecurrenceCron(MonthRecurrence.NONE)
    dispatch(resetSelectedDates())
  }, [dispatch, reset])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const onSubmit: SubmitHandler<Schema> = useCallback(
    async ({ name, color, icon, description, repeating }) => {
      if (!session) {
        console.error('No session found')
        return
      }
      const newDates = new Set<{ date: string; isRepeating: boolean }>(selectedDates)
      const response = await fetch('api/cats', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentState?.id,
          name: name,
          description: description,
          color: color,
          icon: icon,
          creatorId: session.user.id,
          cron: repeating.cron ? repeating.cron : method === 'PUT' ? currentCron : undefined,
          startDate: repeating.cron ? repeating.startDate : undefined,
          endDate: repeating.cron ? repeating.endDate : undefined,
          dates: [...newDates],
          toDelete: currentState?.entries
        })
      })
      if (response.ok) {
        const data: Category & { entries: Entry[] } = await response.json()
        const dispatchPayload = {
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
        }
        dispatch(method === 'POST' ? addCategory(dispatchPayload) : updateCategory(dispatchPayload))

        setIsModalOpen(false)
        resetForm()
      } else {
        if (response.status !== 500) {
          const text = await response.text()
          dispatch(setAlert({ message: text, type: 'error', show: true }))
        } else {
          dispatch(setAlert({ message: 'Something went wrong. Please try again later.', type: 'error', show: true }))
        }
      }
      callBack()
    },
    [
      callBack,
      currentCron,
      currentState?.entries,
      currentState?.id,
      dispatch,
      method,
      resetForm,
      selectedDates,
      session
    ]
  )

  const setIsMinimizedCallback = useCallback(
    (minimized: boolean) => {
      setIsMinimized(minimized)
      dispatch(setIsSelectingDates(minimized))
    },
    [dispatch]
  )

  const saveCancelWhenMinimized = useMemo(() => {
    return (
      <Modal.Minimized>
        <button
          type='button'
          className='mr-3 inline-flex animate-pulse items-center justify-center rounded-md border border-transparent bg-slate-100 py-2 px-4 text-slate-900 enabled:hover:bg-slate-200 disabled:opacity-75'
          onClick={() => {
            setIsMinimizedCallback(false)
            dispatch(cancelDateSelection())
          }}
        >
          Cancel
        </button>
        <Button text='Save' onClick={() => setIsMinimizedCallback(false)} className='animate-pulse' />
      </Modal.Minimized>
    )
  }, [dispatch, setIsMinimizedCallback])

  const nameField = useMemo(() => {
    return (
      <div className='mb-4'>
        <label className='mb-2 block'>Name</label>
        <input
          placeholder='Enter a name for the category'
          className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-slate-700 shadow invalid:border-red-500 invalid:bg-red-50 invalid:text-red-500 invalid:placeholder-red-500 focus:outline-none'
          {...register('name')}
        />
      </div>
    )
  }, [register])

  const descriptionField = useMemo(() => {
    return (
      <div className='mb-4'>
        <label className='mb-2 block'>Description</label>
        <textarea
          placeholder='Enter a description for the category'
          className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-slate-700 shadow focus:outline-none'
          {...register('description')}
        />
      </div>
    )
  }, [register])

  const colorPickerField = useMemo(() => {
    return (
      <div className='mb-6'>
        <label className='mb-2 block'>Color</label>
        <ColorPicker control={control} name='color' rules={{ required: true }} />
      </div>
    )
  }, [control])

  const iconPickerField = useMemo(() => {
    return (
      <div className='mb-8'>
        <label className='mb-2 block'>
          Icon
          <IconSearchModal
            buttonClassName='ml-2 inline-block text-xs'
            control={control}
            name='icon'
            color={watchColor}
            rules={{ required: true }}
          />
        </label>
        <IconPicker control={control} name='icon' color={watchColor} rules={{ required: true }} />
      </div>
    )
  }, [control, watchColor])

  const weeklyRecurringField = useMemo(() => {
    return (
      <Tabs.Content>
        <DayOfWeekPicker
          control={control}
          name='repeating.cron'
          rules={{ required: false }}
          selectedDays={selectedDaysOfTheWeek}
          setSelectedDays={setSelectedDaysOfTheWeek}
          updateState={(cron) => {
            setCurrentTabIndex(0)
            setCurrentCron(cron)
          }}
        />
      </Tabs.Content>
    )
  }, [control, selectedDaysOfTheWeek])

  const monthlyRecurringField = useMemo(() => {
    return (
      <Tabs.Content>
        <DayOfMonthPicker
          control={control}
          name='repeating.cron'
          rules={{ required: false }}
          startDate={dayjs(watchStartDate)}
          selectedRecurrenceType={selectedMonthRecurrenceCron}
          setSelectedRecurrenceType={setSelectedMonthRecurrenceCron}
          updateState={(cron) => {
            setCurrentTabIndex(1)
            setCurrentCron(cron)
          }}
        />
      </Tabs.Content>
    )
  }, [control, selectedMonthRecurrenceCron, watchStartDate])

  const startAndEndDatesRecurringField = useMemo(() => {
    return (
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='mb-2 block text-sm'>Start Date</label>
          <input className='cursor-pointer text-sm' type='date' {...register('repeating.startDate')} />
        </div>
        <div>
          <label className='mb-2 block text-sm'>End Date</label>
          <input className='cursor-pointer text-sm' type='date' {...register('repeating.endDate')} />
        </div>
      </div>
    )
  }, [register])

  const recurringDatesFields = useMemo(() => {
    return (
      <div className='mb-4'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg py-2 text-left text-slate-800 hover:text-emerald-700 focus:outline-none'>
                <span>Recurring Dates</span>
                <Icon iconName='CaretDownFill' className={`${open ? 'rotate-180 transform' : ''} mt-0.5 h-5 w-5`} />
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
                    <Tabs currentIndex={currentTabIndex}>
                      <Tabs.Title>Weekly</Tabs.Title>
                      {weeklyRecurringField}
                      <Tabs.Title>Monthly</Tabs.Title>
                      {monthlyRecurringField}
                    </Tabs>
                  </div>
                  {startAndEndDatesRecurringField}
                  {errors.repeating && <p className='mt-2 text-sm text-red-500'>{errors.repeating.message}</p>}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    )
  }, [currentTabIndex, errors.repeating, monthlyRecurringField, startAndEndDatesRecurringField, weeklyRecurringField])

  const buttonsAtBottom = useMemo(() => {
    return (
      <div className='flex justify-end'>
        <Button
          type='button'
          text={'Select Individual Dates'}
          className='mr-3 items-center'
          onClick={() => {
            const startDate = getValues('repeating.startDate')
            const endDate = getValues('repeating.endDate')
            const cron = getValues('repeating.cron')
            dispatch(setRepeatingDates(generateDatesFromCron(cron, startDate, endDate)))
            setIsMinimized(true)
            dispatch(setIsSelectingDates(true))
            dispatch(
              setAlert({
                message: 'Select the dates you want to add to this category by clicking on them.',
                type: 'info',
                show: true,
                showOnce: true,
                cookieName: 'select-dates-alert',
                timeout: 10000
              })
            )
            setDirtyDates(true)
          }}
        />
        <Button
          type='submit'
          className='items-center'
          disabled={isSubmitting || (method === 'PUT' && !isDirty && !dirtyDates)}
          text={method === 'POST' ? 'Create' : 'Update'}
          onClick={() => {
            const startDate = getValues('repeating.startDate')
            const endDate = getValues('repeating.endDate')
            const cron = getValues('repeating.cron')
            dispatch(setRepeatingDates(generateDatesFromCron(cron, startDate, endDate)))
            handleSubmit(onSubmit)
          }}
        />
      </div>
    )
  }, [dirtyDates, dispatch, getValues, handleSubmit, isDirty, isSubmitting, method, onSubmit])

  return (
    <>
      <Modal
        buttonText={method === 'POST' ? 'Create' : 'Edit'}
        title={method === 'POST' ? 'Create Category' : 'Edit Category'}
        isOpen={isModalOpen}
        setIsOpen={(open) => {
          setIsModalOpen(open)
          if (!open) {
            resetForm()
          }
        }}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'create-category-modal-handle'}
        bounds={'create-category-modal-wrapper'}
        buttonClassName={
          method === 'POST' ? 'truncate' : `group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`
        }
        buttonId={method === 'POST' ? 'create-category-btn' : 'edit-category-btn'}
        overrideDefaultButtonStyle={method !== 'POST'}
        closeParent={callBack}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimizedCallback}
      >
        {saveCancelWhenMinimized}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
          {nameField}
          {descriptionField}
          {colorPickerField}
          {iconPickerField}
          {recurringDatesFields}
          {buttonsAtBottom}
        </form>
      </Modal>
    </>
  )
}
