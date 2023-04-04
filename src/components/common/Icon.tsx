import * as icons from 'react-bootstrap-icons'

export type IconName = keyof typeof icons

interface IconProps extends icons.IconProps {
  iconName: IconName
}

/**
 *  Renders an icon from the `react-icons` library based on the specified `iconName` prop.
 * @param iconName - Name of icon to display.
 * @param props - The props to apply to the icon.
 */
export const Icon = ({ iconName, ...props }: IconProps) => {
  const BootstrapIcon = icons[iconName]
  // set add iconName to className
  props.className = props.className ? `${props.className} ${iconName}` : iconName
  return <BootstrapIcon {...props} />
}
