//styles
import styles from './Engineering.module.scss'

//components
import Container from '@layout/container/Container'

//icons
import { CloudCheck, WandSparkles, Smartphone } from 'lucide-react'

const FEATURE_ITEMS = [
  {
    id: '24/7 Cloud Recording',
    icon: <CloudCheck />,
    title: 'Цілодобове хмарне запис',
    desc: 'Надмірність сховища в глобальних центрах обробки даних забезпечує те, що ваші записи ніколи не будуть втрачені, навіть якщо фізичне обладнання пошкоджене.',
  },
  {
    id: 'Professional Installation',
    icon: <WandSparkles />,
    title: 'Професійна установка',
    desc: 'Сертифіковані технічні фахівці обробляють кожний аспект установлення, від прокладання кабелів до оптимізації мережі та розташування камери.',
  },
  {
    id: 'Smart Mobile Access',
    icon: <Smartphone />,
    title: 'Розумний мобільний доступ',
    desc: 'Отримуйте миттєві сповіщення на основі штучного інтелекту та контролюйте свою власність звідусіль у світі за допомогою нашої шифрованої мобільної програми.',
  },
]

function Engeneering() {
  return (
    <section className={styles.engeneeringSection}>
      <Container>
        <div>
          <header className={styles.engSection}>
            <h2 className={styles.title}>Точна інженерія</h2>
          </header>
          <ul className={styles.itemsWrapper}>
            {FEATURE_ITEMS.map(({ id, icon, title, desc }) => (
              <li key={id} className={styles.item}>
                <div className={styles.iconWrapper}> {icon}</div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{title}</h3>
                  <p className={styles.itemDesc}>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export default Engeneering
