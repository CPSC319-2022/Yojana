import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { BsFillFileEarmarkBarGraphFill } from 'react-icons/bs'
import { useSession } from 'next-auth/react'
import csv from 'csv-parser'
import { Button } from '@/components/common'
import { Entry } from '@prisma/client'

interface CsvEntry {
  Category: string
  Date: string
}

interface EntryMap {
  [key: string]: string[]
}

export const CsvUploader = ({ onSuccess }: { onSuccess: (createdEntries?: Entry[], error?: string) => void }) => {
  const { data: session } = useSession()
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
    if (!session) {
      console.error('No session found')
      return
    }

    let entryMap: EntryMap = {}
    try {
      for (let key in csvEntries) {
        if (csvEntries.hasOwnProperty(key)) {
          let entry = csvEntries[key]
          entryMap[entry.Category] = [...(entryMap[entry.Category] ?? []), new Date(entry.Date).toISOString()]
        }
      }
    } catch (error) {
      onSuccess([], 'make sure your csv file is formatted correctly')
      return
    }

    try {
      const response = await fetch('/api/cats/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryMap)
      })

      const data = await response.json()
      onSuccess(data.createdEntries, undefined)
    } catch (error) {
      console.error(error)
      onSuccess(undefined, "couldn't add entries")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className='w-full'>
      {csvFileName ? (
        <div className='flex h-48 w-full cursor-pointer items-center justify-center rounded-lg'>
          <div className='text-center'>
            <div className='mb-6 flex items-center'>
              <BsFillFileEarmarkBarGraphFill className='text-green-500' size={18} />
              <p className='ml-2 text-slate-600'>Uploaded: {csvFileName}</p>
            </div>
            <div className='flex space-x-4'>
              <Button onClick={() => handleSubmit()} text='Import' />
              <button
                type='button'
                className='mr-3 inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-2 px-4 text-slate-900 enabled:hover:bg-slate-200 disabled:opacity-75'
                onClick={() => setCsvFileName('')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className='flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-500'
        >
          <input {...getInputProps()} accept='.csv' />
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
