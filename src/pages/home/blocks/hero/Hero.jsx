//styles
import styles from './Hero.module.scss'

//components
import Container from '@layout/container/Container'
import Button from '@ui/button/Button'

import img from './../../../../assets/images/home/home-hero-img.png'

function Hero() {
  return (
    <section>
      <Container>
        <div>
          <div>
            <h1>
              Professional Security Solutions for{' '}
              <span> Your Peace of Mind</span>
            </h1>
            <p>
              Design, install, and support CCTV systems with ease. Our Al-driven
              surveillance provides uncompromising clarity and 24/7 reliability.
            </p>
            <div>
              <Button>Open Catalog</Button>
              <Button>Calculate cost</Button>
            </div>
          </div>
          <div>
            <img src={img} alt="Камера" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero
