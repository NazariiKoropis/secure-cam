import Container from '@layout/container/Container'
import styles from '../info/InfoPage.module.scss'
import { CONTACTS } from '@constants/contacts'

function Delivery() {
  return (
    <Container>
      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.highlight}>Доставка</span>
          <h1 className={styles.title}>Доставка та оплата</h1>
          <p className={styles.subtitle}>
            Працюємо по всій Україні. Узгоджуємо кожен етап і тримаємо в курсі
            статусу замовлення.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Способи доставки</h2>
            <ul className={styles.list}>
              <li>Нова Пошта по всій Україні (відділення або адресна доставка).</li>
              <li>Кур’єр по Києву в межах 1–2 робочих днів.</li>
              <li>Самовивіз за попередньою домовленістю.</li>
            </ul>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Оплата</h2>
            <ul className={styles.list}>
              <li>Оплата карткою онлайн після підтвердження менеджером.</li>
              <li>Безготівковий розрахунок для ФОП та юридичних осіб.</li>
              <li>Оплата готівкою або карткою при отриманні (для доступних служб).</li>
            </ul>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Терміни та вартість</h2>
            <p className={styles.text}>
              Термін доставки залежить від регіону та обраної служби. Остаточну
              вартість доставки повідомляємо під час підтвердження замовлення.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Потрібна консультація?</h2>
            <p className={styles.text}>
              Напишіть нам на {CONTACTS.EMAIL} або зателефонуйте за номером
              {` ${CONTACTS.PHONE}`}. Ми допоможемо з підбором та розрахунком.
            </p>
          </article>
        </div>
      </section>
    </Container>
  )
}

export default Delivery
