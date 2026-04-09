import Container from '@layout/container/Container'
import styles from '../info/InfoPage.module.scss'
import { CONTACTS } from '@constants/contacts'

function About() {
  return (
    <Container>
      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.highlight}>SecureCam</span>
          <h1 className={styles.title}>Про компанію</h1>
          <p className={styles.subtitle}>
            Ми спеціалізуємося на проєктуванні та впровадженні систем відеонагляду
            для дому, бізнесу й комерційних об’єктів.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Наша місія</h2>
            <p className={styles.text}>
              Робити охоронні рішення простими, надійними та доступними. Ми
              поєднуємо сучасні технології та сервіс, щоб ви були впевнені у
              безпеці своєї власності.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Чому нам довіряють</h2>
            <ul className={styles.list}>
              <li>Працюємо лише з перевіреними виробниками.</li>
              <li>Проєктуємо систему під конкретний об’єкт.</li>
              <li>Супроводжуємо після встановлення та даємо гарантію.</li>
            </ul>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Партнерство та сервіс</h2>
            <p className={styles.text}>
              Ми відкриті до співпраці з бізнесами, забудовниками та інтеграторами.
              Надаємо консультації, технічну підтримку й навчання персоналу.
            </p>
          </article>

          <article className={styles.section}>
            <h2 className={styles.sectionTitle}>Контакти</h2>
            <p className={styles.text}>
              Зв’язатися з нами можна за адресою {CONTACTS.ADDRESS}, електронною
              поштою {CONTACTS.EMAIL} або телефоном {CONTACTS.PHONE}.
            </p>
          </article>
        </div>
      </section>
    </Container>
  )
}

export default About
