//styles
import styles from './Header.module.scss'

//components
import Button from '@ui/button/Button'
import Counter from '@ui/counter/Counter'

//util
import { getImage } from '@/utils/getImage'
import { useState } from 'react'

function Header({ item }) {
  const [value, setValue] = useState(0)
  const {
    id,
    name,
    price,
    stock,
    description,
    category,
    amenities,
    createdAt,
  } = item

  const imgPath = getImage(id)

  return (
    <section>
      <div>
        <img src={imgPath} alt={`Image for ${name}`} />
      </div>

      <div>
        <h1>{name}</h1>

        <p>{price}</p>
        <p>{stock}</p>

        <p>{description}</p>
        <ul>
          {amenities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div>
          <div>
            <Counter value={value} setValue={setValue} />
            <Button>ADD TO CART</Button>
          </div>
          <Button variant="ghost" fullWidth>
            CALCULATE
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Header
