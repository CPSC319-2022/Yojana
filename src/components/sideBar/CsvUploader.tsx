import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export const CsvUploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        const csvString = reader.result as string
        console.log(csvString)
      }

      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} accept='.csv' />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag &apos;n&apos; drop a CSV file here, or click to select file</p>
      )}
    </div>
  )
}
