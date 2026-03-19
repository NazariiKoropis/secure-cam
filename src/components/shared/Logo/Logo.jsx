import clsx from 'clsx'

function Logo({ className, width = '240', height = '60' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 60"
      fill="none"
      width={width}
      height={height}
      className={clsx(className)}
    >
      <path
        d="M 30 8 L 10 16 V 32 C 10 44 18 52 30 56 C 42 52 50 44 50 32 V 16 L 30 8 Z"
        stroke="var(--accent-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="30"
        cy="33"
        r="9"
        stroke="var(--text-primary)"
        strokeWidth="3"
      />
      <circle cx="30" cy="33" r="3.5" fill="var(--accent-primary)" />

      <circle cx="42" cy="22" r="2.5" fill="var(--error)" />

      <text
        x="65"
        y="42"
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        fontSize="28"
      >
        <tspan fill="var(--text-primary)">Secure</tspan>
        <tspan fill="var(--accent-primary)">Cam</tspan>
      </text>
    </svg>
  )
}

export default Logo
