//styles
import styles from './RangeInput.module.scss'

//react
import { useState, useEffect } from 'react'

//util
import clsx from 'clsx'

function RangeInput({
  min = 0,
  max = 1000,
  value = [0, 1000],
  onChange,
  step = 1,
  label = 'Ціна ($)',
}) {
  const [minValue, setMinValue] = useState(value[0])
  const [maxValue, setMaxValue] = useState(value[1])

  useEffect(() => {
    setMinValue(value[0])
    setMaxValue(value[1])
  }, [value])

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxValue - step)
    setMinValue(val)
    if (onChange) onChange([val, maxValue])
  }

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minValue + step)
    setMaxValue(val)
    if (onChange) onChange([minValue, val])
  }

  const minPercent = ((minValue - min) / (max - min)) * 100
  const maxPercent = ((maxValue - min) / (max - min)) * 100

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.inputsContainer}>
        <div className={styles.inputBox}>
          <input
            type="number"
            value={minValue}
            onChange={handleMinChange}
            className={styles.numInput}
          />
        </div>
        <span className={styles.separator}>-</span>
        <div className={styles.inputBox}>
          <input
            type="number"
            value={maxValue}
            onChange={handleMaxChange}
            className={styles.numInput}
          />
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.track}></div>

        <div
          className={styles.activeTrack}
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        ></div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={clsx(styles.rangeInput, styles.leftThumb)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={clsx(styles.rangeInput, styles.rightThumb)}
        />
      </div>
    </div>
  )
}

export default RangeInput
