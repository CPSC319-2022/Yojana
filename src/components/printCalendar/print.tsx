import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getPreferences, setYearOverflow } from '@/redux/reducers/PreferencesReducer'
import React, { RefObject, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'

interface PrintButtonProps {
  contentRef: RefObject<any>
  className?: string
}

export const PrintButton: React.FC<PrintButtonProps> = ({ contentRef, className }) => {
  const preferences = useAppSelector(getPreferences)
  const dispatch = useAppDispatch()

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint: () => {
      dispatch(setYearOverflow(preferences.yearOverflow.value))
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          transform-origin: top left;
        }
      }
    `
  })

  const handleClick = useCallback(() => {
    handlePrint()
  }, [dispatch, handlePrint])

  return (
    <button onClick={handleClick} className={className}>
      Export
    </button>
  )
}
