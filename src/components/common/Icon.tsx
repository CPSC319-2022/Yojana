import * as icons from 'react-bootstrap-icons'

export type IconName = keyof typeof icons

interface IconProps extends icons.IconProps {
  iconName: IconName
}

export const Icon = ({ iconName, ...props }: IconProps) => {
  const BootstrapIcon = icons[iconName]
  return <BootstrapIcon {...props} />
}