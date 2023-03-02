import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiFile } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import csv from 'csv-parser'

interface CsvEntry {
  Category: string
  Date: string
}

interface EntryMap {
  [key: string]: string[]
}

export const CsvUploader = ({
  onSuccess
}: {
  onSuccess: (added: number | undefined, error: string | undefined) => void
}) => {
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
      onSuccess(0, 'make sure your csv file is formatted correctly')
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
      onSuccess(data.entriesAdded, undefined)
    } catch (error) {
      console.error(error)
      onSuccess(undefined, "couldn't add entries")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className='mx-auto w-full max-w-sm'>
      {csvFileName ? (
        <div className='m-8 flex h-48 cursor-pointer items-center justify-center rounded-lg p-4'>
          <div className='text-center'>
            <div className='mb-2 flex items-center'>
              <FiFile className='text-green-500' size={18} />
              <p className='ml-2 font-medium text-gray-600'>Uploaded: {csvFileName}</p>
            </div>
            <div className='flex space-x-4'>
              <button
                className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
                onClick={() => handleSubmit()}
              >
                Publish
              </button>
              <button
                className='rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700'
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
          className='m-8 flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 hover:border-blue-500'
        >
          <input {...getInputProps()} accept='.csv' />
          <div className='text-center'>
            {isDragActive ? (
              <p className='font-medium text-gray-600'>Drop the file here ...</p>
            ) : (
              <>
                <p className='font-medium text-gray-600'>Drag and drop a CSV file here</p>
                <p className='text-gray-400'>or</p>
                <p className='font-medium text-gray-600'>Click to browse</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
