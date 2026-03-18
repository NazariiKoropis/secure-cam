import { Link } from 'react-router-dom'
import styles from './Button.module.scss'
import clsx from 'clsx'

function Button({
  type = 'button',
  variant = 'primary',
  className,
  fullWidth = false,
  disabled = false,
  to,
  href,
  children,
  ...props
}) {
  const buttonStyle = clsx(
    styles.button,
    styles[`button--${variant}`],
    { [styles['button--fullwidth']]: fullWidth },
    className,
  )

  // component Link for react-router-dom
  if (to) {
    return (
      <Link to={to} className={buttonStyle} {...props}>
        {children}
      </Link>
    )
  }

  // tag <a> for links like social media
  if (href) {
    return (
      <a
        href={href}
        className={buttonStyle}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  //default button
  return (
    <button className={buttonStyle} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

Button.displayName = 'Button'

export default Button
