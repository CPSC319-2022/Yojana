import React, { RefObject } from 'react'
import { useReactToPrint } from 'react-to-print'

interface PrintButtonProps {
  contentRef: RefObject<any>
  className?: string
}

export const PrintButton: React.FC<PrintButtonProps> = ({ contentRef, className }) => {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint: () => {},
    pageStyle: `
            @page {
                size: auto;
                margin: 10mm;
            }
            @media print {
                body {
                    transform: scale(0.8);
                    transform-origin: top left;
                }
            }
        `
  })

  return (
    <button onClick={handlePrint} className={className}>
      Print to PDF
    </button>
  )
}
