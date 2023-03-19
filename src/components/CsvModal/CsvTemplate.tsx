import React, { useState } from 'react'

interface CsvDownloaderProps {
  csvUrl: string
  fileName: string
}

export const CsvDownloader = ({ csvUrl, fileName }: CsvDownloaderProps) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(csvUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
    }
    setIsDownloading(false)
  }

  return (
    <a className='download-link underline' download={fileName} onClick={handleDownload}>
      {isDownloading ? 'Downloading...' : 'Download sample CSV template'}
    </a>
  )
}
CsvDownloader.displayName = 'CsvDownloader'
