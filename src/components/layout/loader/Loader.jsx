//styles
import styles from './Loader.module.scss'

//util
import clsx from 'clsx'

//loader
import { FidgetSpinner } from 'react-loader-spinner'

function Loader({ fullScreen = true }) {
  return (
    <div
      className={clsx(styles.loader, {
        [styles['loader--fullScreen']]: fullScreen,
      })}
      aria-busy="true"
    >
      <FidgetSpinner
        visible={true}
        height="80"
        width="80"
        ariaLabel="fidget-spinner-loading"
        wrapperClass="fidget-spinner-wrapper"
        backgroundColor="var(--accent-primary)"
      />
    </div>
  )
}

export default Loader
