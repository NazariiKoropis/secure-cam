//styles
import styles from './Recomendations.module.scss'

//components
import Loader from '@layout/loader/Loader'
import TechCard from '@shared/tech-card/TechCard'
import ErrorMessage from '@shared/error-message/ErrorMessage'

//query
import { useQuery } from '@tanstack/react-query'

//api
import { getAllProductsExceptById } from '@api/product.service'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function Recomendations({ id }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', 'recomendations', id],
    queryFn: () => getAllProductsExceptById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError || !data || data.length === 0) {
    return (
      <section className={styles.recomendationsSection}>
        <ErrorMessage
          onRetry={refetch}
          message="Не вдалося завантажити рекомендації."
        />
      </section>
    )
  }

  return (
    <section className={styles.recomendationsSection}>
      <h2 className={styles.title}>Вам також може сподобатися</h2>

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className={styles.swiperContainer}
        >
          {data.map((product) => (
            <SwiperSlide key={product.id} className={styles.slide}>
              <TechCard item={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Recomendations
