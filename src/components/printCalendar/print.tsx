import React, { RefObject, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getPreferences, setYearOverflow } from '@/redux/reducers/PreferencesReducer'

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
        size: auto;
        year-overflow: expand;
      }
      @media print {
        body {
          transform-origin: top left;
        }
      }
    `
  })

  const handleClick = useCallback(() => {
    dispatch(setYearOverflow('expand'))
    handlePrint()
  }, [dispatch, handlePrint])

  return (
    <button onClick={handleClick} className={className}>
      Export to PDF
    </button>
  )
}
