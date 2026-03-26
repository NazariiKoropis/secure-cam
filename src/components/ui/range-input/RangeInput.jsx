import styles from './RangeInput.module.scss'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

function RangeInput({
  min = 0,
  max = 10000,
  value = [0, 2000],
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
    let val = Number(e.target.value)
    val = Math.min(val, maxValue - step)
    val = Math.max(val, min)

    setMinValue(val)
    if (onChange) onChange([val, maxValue])
  }

  const handleMaxChange = (e) => {
    let val = Number(e.target.value)
    val = Math.max(val, minValue + step)
    val = Math.min(val, max)

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
