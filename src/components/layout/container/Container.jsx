//styles
import styles from './Container.module.scss'

//utils
import clsx from 'clsx'

function Container({ className, children }) {
  const containerStyled = clsx(styles.container, className)
  return <div className={containerStyled}>{children}</div>
}

export default Container
