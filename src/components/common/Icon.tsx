import * as icons from 'react-bootstrap-icons'

export type IconName = keyof typeof icons

interface IconProps extends icons.IconProps {
  iconName: IconName
}

export const Icon = ({ iconName, ...props }: IconProps) => {
  const BootstrapIcon = icons[iconName]
  // set title prop to iconName if not set
  if (!props.title) {
    props.title = iconName
  }
  return <BootstrapIcon {...props} />
}
