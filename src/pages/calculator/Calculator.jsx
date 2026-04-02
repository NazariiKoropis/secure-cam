import styles from './Calculator.module.scss'
import { useState } from 'react'

// redux & notifications
import { useDispatch } from 'react-redux'
import { addItem } from '@/redux/cart/cartSlice'
import toast from 'react-hot-toast'

// components
import Button from '@ui/button/Button'
import Container from '@layout/container/Container'

// icons
import {
  Shield,
  Zap,
  Wifi,
  Check,
  Plus,
  Minus,
  Camera,
  RadioReceiver,
} from 'lucide-react'

const TIERS = [
  {
    id: 'basic',
    name: 'Базовий',
    desc: 'Мінімальний захист',
    basePrice: 200,
    icon: Wifi,
  },
  {
    id: 'pro',
    name: 'Просунутий',
    desc: 'Оптимальний вибір',
    basePrice: 450,
    icon: Shield,
  },
  {
    id: 'premium',
    name: 'Преміум',
    desc: 'Усе включено',
    basePrice: 850,
    icon: Zap,
  },
]

const EXTRAS = [
  { id: 'install', name: 'Професійний монтаж', price: 150 },
  { id: 'ups', name: 'Блок безперебійного живлення', price: 80 },
  { id: 'cloud', name: 'Хмарний архів записів (1 рік)', price: 60 },
]

const DEVICE_PRICES = {
  camera: 65,
  sensor: 25,
}

function Calculator() {
  const dispatch = useDispatch() // Ініціалізуємо dispatch

  const [tier, setTier] = useState(TIERS[1].id)
  const [cameras, setCameras] = useState(2)
  const [sensors, setSensors] = useState(3)
  const [selectedExtras, setSelectedExtras] = useState([])

  const toggleExtra = (id) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const currentTier = TIERS.find((t) => t.id === tier)
  const tierPrice = currentTier.basePrice

  const devicesPrice =
    cameras * DEVICE_PRICES.camera + sensors * DEVICE_PRICES.sensor

  const extrasPrice = EXTRAS.filter((e) =>
    selectedExtras.includes(e.id),
  ).reduce((sum, e) => sum + e.price, 0)

  const totalPrice = tierPrice + devicesPrice + extrasPrice

  const handleAddKitToCart = () => {
    const kitData = {
      id: `custom-kit-${Date.now()}`,
      name: `Комплект безпеки "${currentTier.name}"`,
      price: totalPrice,
      category: 'Готові рішення',

      imgPath: '/src/assets/images/placeholder.png',
      quantity: 1,

      configDetails: {
        hub: currentTier.name,
        cameras,
        sensors,
        extras: selectedExtras,
      },
    }

    dispatch(addItem(kitData))
    toast.success('Комплект успішно додано до кошика!')
  }

  return (
    <Container>
      <section className={styles.calcSection}>
        <div className={styles.header}>
          <h1 className={styles.title}>Калькулятор системи</h1>
          <p className={styles.subtitle}>
            Зберіть свій ідеальний комплект за 3 хвилини. Змінюйте параметри і
            одразу бачте вартість.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.configurator}>
            <div className={styles.block}>
              <h2>1. Виберіть центральний хаб</h2>
              <div className={styles.tierGrid}>
                {TIERS.map((t) => {
                  const Icon = t.icon
                  const isActive = tier === t.id
                  return (
                    <div
                      key={t.id}
                      className={`${styles.tierCard} ${isActive ? styles.active : ''}`}
                      onClick={() => setTier(t.id)}
                    >
                      <Icon size={32} className={styles.tierIcon} />
                      <div className={styles.tierInfo}>
                        <h3>{t.name}</h3>
                        <p>{t.desc}</p>
                      </div>
                      <span className={styles.tierPrice}>${t.basePrice}</span>
                      {isActive && (
                        <div className={styles.activeCheck}>
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.block}>
              <h2>2. Кількість пристроїв</h2>
              <div className={styles.devicesList}>
                <div className={styles.deviceRow}>
                  <div className={styles.deviceInfo}>
                    <div className={styles.iconWrapper}>
                      <Camera size={20} />
                    </div>
                    <div>
                      <p className={styles.deviceName}>IP Камери</p>
                      <span className={styles.devicePrice}>
                        +${DEVICE_PRICES.camera}/шт
                      </span>
                    </div>
                  </div>
                  <div className={styles.counter}>
                    <button
                      type="button"
                      onClick={() => setCameras((p) => Math.max(0, p - 1))}
                    >
                      <Minus size={18} />
                    </button>
                    <span>{cameras}</span>
                    <button
                      type="button"
                      onClick={() => setCameras((p) => p + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className={styles.deviceRow}>
                  <div className={styles.deviceInfo}>
                    <div className={styles.iconWrapper}>
                      <RadioReceiver size={20} />
                    </div>
                    <div>
                      <p className={styles.deviceName}>
                        Датчики руху/відкриття
                      </p>
                      <span className={styles.devicePrice}>
                        +${DEVICE_PRICES.sensor}/шт
                      </span>
                    </div>
                  </div>
                  <div className={styles.counter}>
                    <button
                      type="button"
                      onClick={() => setSensors((p) => Math.max(0, p - 1))}
                    >
                      <Minus size={18} />
                    </button>
                    <span>{sensors}</span>
                    <button
                      type="button"
                      onClick={() => setSensors((p) => p + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.block}>
              <h2>3. Додаткові опції</h2>
              <div className={styles.extrasList}>
                {EXTRAS.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.id)
                  return (
                    <label
                      key={extra.id}
                      className={`${styles.extraCard} ${isChecked ? styles.active : ''}`}
                    >
                      <div className={styles.checkbox}>
                        {isChecked && <Check size={16} strokeWidth={3} />}
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExtra(extra.id)}
                          hidden
                        />
                      </div>
                      <span className={styles.extraName}>{extra.name}</span>
                      <span className={styles.extraPrice}>+${extra.price}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className={styles.summaryPanel}>
            <h2>Ваш комплект</h2>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Хаб ({currentTier.name})</span>
                <span>${tierPrice}</span>
              </div>

              {cameras > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.subText}>Камери (x{cameras})</span>
                  <span>${cameras * DEVICE_PRICES.camera}</span>
                </div>
              )}

              {sensors > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.subText}>Датчики (x{sensors})</span>
                  <span>${sensors * DEVICE_PRICES.sensor}</span>
                </div>
              )}

              {extrasPrice > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.subText}>Додаткові опції</span>
                  <span>${extrasPrice}</span>
                </div>
              )}

              <hr className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Загальна вартість:</span>
                <span>${totalPrice}</span>
              </div>

              <Button fullWidth onClick={handleAddKitToCart}>
                ДОДАТИ КОМПЛЕКТ У КОШИК
              </Button>
              <p className={styles.guarantee}>
                💳 Безпечна оплата. Гарантія 2 роки.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Container>
  )
}

export default Calculator
