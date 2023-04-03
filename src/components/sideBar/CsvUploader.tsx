import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiletypeCsv } from 'react-bootstrap-icons'
import csv from 'csv-parser'
import { Button } from '@/components/common'
import { BatchResponse } from '@/types/prisma'

interface CsvEntry {
  CategoryID: string
  Date: string
}

interface EntryMap {
  [key: string]: string[]
}

/**
 * CsvUploader is responsible for rendering the Import Modal.
 * It displays the format of the CSV file that is expected.
 * It also provides a template file to download.
 * It also contains a dropzone for the user to upload the CSV file.
 *
 * @param onSuccess
 * @returns {JSX.Element}
 */
export const CsvUploader = ({ onSuccess }: { onSuccess: (response?: BatchResponse) => void }) => {
  const [csvFileName, setCsvFileName] = useState('')
  const [csvEntries, setCsvEntries] = useState<CsvEntry[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type !== 'text/csv') {
        alert('File not supported')
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        const stream = csv()
        stream.on('data', (data) => {
          setCsvEntries((prev) => [...prev, data])
        })

        stream.write(reader.result)
        stream.end()
      }

      setCsvFileName(file.name)
      reader.readAsText(file)
    })
  }, [])

  const handleSubmit = async () => {
    let entryMap: EntryMap = {}
    try {
      for (let key in csvEntries) {
        if (csvEntries.hasOwnProperty(key)) {
          let entry = csvEntries[key]
          if (entry.CategoryID === undefined || entry.Date === undefined) {
            throw new Error("Make sure the column headings are 'CategoryID' and 'Date' only.")
          }
          entryMap[entry.CategoryID] = [...(entryMap[entry.CategoryID] ?? []), entry.Date]
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        const noEntriesResponse: BatchResponse = {
          success: undefined,
          error: {
            message: error.message,
            code: 400,
            uneditableCategories: []
          }
        }
        onSuccess(noEntriesResponse)
        return
      }
    }

    try {
      const response = await fetch(`/api/cats/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryMap)
      })
      const res = await response.json()
      onSuccess(res)
    } catch (error) {
      console.error(error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className='w-full'>
      {csvFileName ? (
        <div className='flex h-48 w-full cursor-pointer items-center justify-center rounded-lg'>
          <div className='text-center'>
            <div className='mb-6 flex items-center'>
              <FiletypeCsv className='text-green-500' size={18} />
              <p className='ml-2 text-slate-600'>Uploaded: {csvFileName}</p>
            </div>
            <div className='flex space-x-4'>
              <Button onClick={() => handleSubmit()} id='import-submit' text='Import' />
              <button
                type='button'
                className='mr-3 inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-2 px-4 text-slate-900 enabled:hover:bg-slate-200 disabled:opacity-75'
                onClick={() => setCsvFileName('')}
                id='import-cancel'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps({ 'data-cy': 'dropzone' })}
          className='flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-500'
        >
          <input {...getInputProps()} accept='.csv' id='dropzone' />
          <div className='text-center'>
            {isDragActive ? (
              <p className='text-slate-600'>Drop the file here ...</p>
            ) : (
              <>
                <p className='text-slate-600'>Drag and drop a CSV file here</p>
                <p className='text-slate-400'>or</p>
                <p className='text-slate-600'>Click to browse</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
