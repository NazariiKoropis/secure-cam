//styles
import styles from './Engenerring.module.scss'

//components
import Container from '@layout/container/Container'

//icons
import { CloudCheck, WandSparkles, Smartphone } from 'lucide-react'

const FEATURE_ITEMS = [
  {
    id: '24/7 Cloud Recording',
    icon: <CloudCheck />,
    title: '24/7 Cloud Recording',
    desc: 'Redundant storage across global data centers ensures your footage is never lost, even if the physical hardware is damaged.',
  },
  {
    id: 'Professional Installation',
    icon: <WandSparkles />,
    title: 'Professional Installation',
    desc: 'Certified technicians handle every aspect of the setup, from wiring to network optimization and camera positioning.',
  },
  {
    id: 'Smart Mobile Access',
    icon: <Smartphone />,
    title: 'Smart Mobile Access',
    desc: 'Receive instant AI-powered alerts and monitor your property from anywhere in the world via  our encrypted mobile application.',
  },
]

function Engeneering() {
  return (
    <section>
      <Container>
        <div>
          <header>
            <h2>Precision Engineering</h2>
          </header>
          <ul>
            {FEATURE_ITEMS.map(({ id, icon, title, desc }) => (
              <li id={id}>
                <div>
                  {icon}
                  <h3>{title}</h3>
                  <p>{desc}</p>
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
