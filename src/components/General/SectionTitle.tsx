import { Icon } from 'phosphor-react'

interface ISectionTitleProps {
  name: string,
  Icon: Icon,
  className?: string
}

const SectionTitle: React.FunctionComponent<ISectionTitleProps> = ({name, Icon, className}) => {
  return <div className={'flex items-center gap-3 text-subtle ' + className}>
    <Icon weight='duotone' size={24} />
    <h1 className={'text-2xl font-medium'}>{name}</h1>
  </div>
}

export default SectionTitle
