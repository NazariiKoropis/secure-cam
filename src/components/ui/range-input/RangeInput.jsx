import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import styles from './RangeInput.module.scss'

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

const normalizeRange = (range, min, max, step) => {
  const safeRange = Array.isArray(range) ? range : [min, max]
  const rawMin = Number(safeRange[0])
  const rawMax = Number(safeRange[1])
  const safeMin = clampValue(Number.isFinite(rawMin) ? rawMin : min, min, max)
  const safeMax = clampValue(Number.isFinite(rawMax) ? rawMax : max, min, max)

  if (safeMin === safeMax) {
    return [safeMin, clampValue(safeMin + step, min, max)]
  }

  return safeMin < safeMax
    ? [safeMin, safeMax]
    : [clampValue(safeMax - step, min, safeMax), safeMax]
}

function RangeInput({
  min = 0,
  max = 10000,
  value = [0, 2000],
  onChange,
  step = 1,
  label = 'Ціна ($)',
}) {
  const safeMax = max > min ? max : min + step
  const normalizedValue = useMemo(
    () => normalizeRange(value, min, safeMax, step),
    [min, safeMax, step, value],
  )

  const [minValue, setMinValue] = useState(normalizedValue[0])
  const [maxValue, setMaxValue] = useState(normalizedValue[1])

  useEffect(() => {
    setMinValue(normalizedValue[0])
    setMaxValue(normalizedValue[1])
  }, [normalizedValue])

  const emitChange = (nextMin, nextMax) => {
    if (onChange) onChange([nextMin, nextMax])
  }

  const handleMinChange = (event) => {
    const nextValue = clampValue(
      Number(event.target.value),
      min,
      maxValue - step,
    )

    setMinValue(nextValue)
    emitChange(nextValue, maxValue)
  }

  const handleMaxChange = (event) => {
    const nextValue = clampValue(
      Number(event.target.value),
      minValue + step,
      safeMax,
    )

    setMaxValue(nextValue)
    emitChange(minValue, nextValue)
  }

  const rangeSize = Math.max(safeMax - min, step)
  const minPercent = ((minValue - min) / rangeSize) * 100
  const maxPercent = ((maxValue - min) / rangeSize) * 100

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.inputsContainer}>
        <div className={styles.inputBox}>
          <input
            type="number"
            min={min}
            max={safeMax - step}
            step={step}
            inputMode="numeric"
            aria-label="Мінімальна ціна"
            value={minValue}
            onChange={handleMinChange}
            className={styles.numInput}
          />
        </div>

        <span className={styles.separator}>-</span>

        <div className={styles.inputBox}>
          <input
            type="number"
            min={min + step}
            max={safeMax}
            step={step}
            inputMode="numeric"
            aria-label="Максимальна ціна"
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
          max={safeMax}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          aria-label="Мінімальна межа ціни"
          className={clsx(styles.rangeInput, styles.leftThumb)}
        />

        <input
          type="range"
          min={min}
          max={safeMax}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          aria-label="Максимальна межа ціни"
          className={clsx(styles.rangeInput, styles.rightThumb)}
        />
      </div>
    </div>
  )
}

export default RangeInput
