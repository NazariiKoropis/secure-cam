import Container from '@layout/container/Container'
import styles from '../info/InfoPage.module.scss'
import { CONTACTS } from '@constants/contacts'

function Privacy() {
  return (
    <Container>
      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.highlight}>Політика</span>
          <h1 className={styles.title}>Політика конфіденційності</h1>
          <p className={styles.subtitle}>
            Ми дбаємо про безпеку ваших даних і використовуємо їх лише для
            обробки замовлень та покращення сервісу.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Які дані ми збираємо</h2>
            <ul className={styles.list}>
              <li>Контактні дані: ім’я, телефон, електронна пошта.</li>
              <li>Адреса доставки для оформлення замовлення.</li>
              <li>Історія замовлень та налаштувань профілю.</li>
            </ul>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Навіщо нам ці дані</h2>
            <p className={styles.text}>
              Ми використовуємо дані для підтвердження та доставки замовлень,
              технічної підтримки, гарантійних звернень і покращення якості
              сервісу.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Кому ми передаємо дані</h2>
            <p className={styles.text}>
              Дані можуть передаватися лише службам доставки або платіжним
              системам для виконання замовлення. Ми не продаємо дані третім
              особам.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Як ми захищаємо інформацію</h2>
            <p className={styles.text}>
              Використовуємо захищені канали передачі, регулярні оновлення та
              доступ лише для авторизованих співробітників.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Зв’язок з нами</h2>
            <p className={styles.text}>
              Якщо маєте запитання щодо обробки даних, пишіть на {CONTACTS.EMAIL}.
            </p>
          </article>
        </div>
      </section>
    </Container>
  )
}

export default Privacy
