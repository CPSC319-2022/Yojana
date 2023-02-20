import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export const CsvUploader = () => {
  const [csvFileName, setCsvFileName] = useState('')
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        const csvString = reader.result as string
        console.log(csvString)
      }

      setCsvFileName(file.name)
      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className='mx-auto w-full max-w-sm'>
      {csvFileName ? (
        <div className='m-8 flex h-48 cursor-pointer items-center justify-center rounded-lg p-4'>
          <input {...getInputProps()} accept='.csv' />
          <div className='text-center'>
            <p className='mb-2 font-medium text-gray-600'>Uploaded: {csvFileName}</p>
            <div className='flex space-x-4'>
              <button
                className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
                onClick={() => console.log('Publishing new dates...')}
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
        <div className='m-8 flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 hover:border-blue-500'>
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
