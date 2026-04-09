import Container from '@layout/container/Container'
import styles from '../info/InfoPage.module.scss'
import { CONTACTS } from '@constants/contacts'

function Faq() {
  return (
    <Container>
      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.highlight}>FAQ</span>
          <h1 className={styles.title}>Часті питання</h1>
          <p className={styles.subtitle}>
            Зібрали найпопулярніші запитання про обладнання, встановлення та
            сервіс. Якщо відповіді не знайдете, напишіть нам на {CONTACTS.EMAIL}.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Як швидко ви підтверджуєте замовлення?</h2>
            <p className={styles.text}>
              Зазвичай ми зв’язуємося протягом 1 робочої години після оформлення.
              Якщо замовлення надійшло ввечері, підтвердження буде наступного ранку.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Чи допомагаєте з підбором обладнання?</h2>
            <p className={styles.text}>
              Так. Ми підбираємо конфігурацію під ваші цілі, площу та бюджет.
              Можемо запропонувати готові комплекти або індивідуальний проєкт.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Скільки триває встановлення?</h2>
            <p className={styles.text}>
              Зазвичай 1–2 дні, залежно від кількості камер, складності кабелювання
              та інтеграцій із існуючою мережею.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Чи є гарантія на обладнання?</h2>
            <p className={styles.text}>
              Так, гарантія від виробника становить 24 місяці. За бажанням можна
              оформити розширену гарантію.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Чи працюють камери без інтернету?</h2>
            <p className={styles.text}>
              Локальний запис працює без інтернету. Для віддаленого доступу потрібне
              підключення до мережі.
            </p>
          </article>
        </div>
      </section>
    </Container>
  )
}

export default Faq
