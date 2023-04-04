/**
 * Measures the size of the device, so that the app knows which view to render.
 *
 * Code credit: https://stackoverflow.com/questions/59494037/how-to-detect-the-device-on-react-ssr-app-with-next-js
 */
import { ReactNode } from 'react'
import * as rdd from 'react-device-detect'

interface DeviceProps {
  children: (props: typeof rdd) => ReactNode
}

/**
 * Uses react-device-detect to conditionally renderr components.
 *
 * Note: this should NEVER be imported outside of Device/index.ts.
 * Unfortunately, it needs a default export due to the nature of next/dynamic.
 *
 * @param props - children of Device.
 */
export default function Device(props: DeviceProps) {
  return <div className='device-layout-component'>{props.children(rdd)}</div>
}
