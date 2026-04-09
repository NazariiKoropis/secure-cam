import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'
import toast from 'react-hot-toast'

import Container from '@layout/container/Container'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Modal from '@ui/modal/Modal'
import Button from '@ui/button/Button'

import {
  createProduct,
  getAllProducts,
  updateProductById,
} from '@api/product.service'

import { getImage } from '@utils/getImage'

import styles from '../admin-shared/AdminSection.module.scss'
import {
  LOW_STOCK_LIMIT,
  formatCurrency,
  getTimestampValue,
  normalizeAmenities,
} from '../admin-shared/admin.helpers'

const productSchema = z.object({
  name: z.string().trim().min(2, { message: 'Вкажіть назву товару' }),
  price: z.coerce.number().min(0, { message: 'Ціна не може бути від’ємною' }),
  stock: z.coerce
    .number()
    .int({ message: 'Залишок має бути цілим числом' })
    .min(0, { message: 'Залишок не може бути від’ємним' }),
  category: z.string().trim().min(1, { message: 'Вкажіть категорію' }),
  description: z.string().trim().max(1000, {
    message: 'Опис не повинен перевищувати 1000 символів',
  }),
  resolution: z.string().trim().max(120, {
    message: 'Занадто довге значення',
  }),
  amenities: z.string().trim(),
  imagePath: z.string().trim().max(300, {
    message: 'Шлях до зображення занадто довгий',
  }),
})

const STOCK_FILTER_OPTIONS = [
  { value: 'all', label: 'Усі залишки' },
  { value: 'in-stock', label: 'Є в наявності' },
  { value: 'low-stock', label: 'Мало на складі' },
  { value: 'out-of-stock', label: 'Немає в наявності' },
]

const isFileSystemUploadSupported = () =>
  typeof window !== 'undefined' && 'showDirectoryPicker' in window

const sanitizeFileName = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || 'product'

const getFileExtension = (fileName) => {
  const parts = fileName.split('.')

  return parts.length > 1 ? parts.pop().toLowerCase() : 'png'
}

const buildProductPayload = (data, imagePath) => {
  const payload = {
    name: data.name.trim(),
    price: Number(data.price),
    stock: Number(data.stock),
    category: data.category.trim(),
    description: data.description.trim(),
    resolution: data.resolution.trim(),
    amenities: normalizeAmenities(data.amenities),
    imagePath: imagePath?.trim() || '',
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim().length > 0

      return value !== undefined && value !== null
    }),
  )
}

const saveImageToProject = async (file, productName) => {
  if (!isFileSystemUploadSupported()) {
    throw new Error(
      'Ваш браузер не підтримує запис файлів у проект. Додайте фото вручну в public/catalog-images і вкажіть шлях.',
    )
  }

  const directoryHandle = await window.showDirectoryPicker({
    mode: 'readwrite',
  })

  if (directoryHandle.name !== 'catalog-images') {
    throw new Error('Оберіть папку public/catalog-images у проекті.')
  }

  const extension = getFileExtension(file.name)
  const fileName = `${sanitizeFileName(productName)}-${Date.now()}.${extension}`
  const fileHandle = await directoryHandle.getFileHandle(fileName, {
    create: true,
  })
  const writable = await fileHandle.createWritable()

  await writable.write(await file.arrayBuffer())
  await writable.close()

  return `/catalog-images/${fileName}`
}

function AdminProducts() {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createImageFile, setCreateImageFile] = useState(null)

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: getAllProducts,
  })

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    control: createControl,
    formState: {
      errors: createErrors,
      isSubmitting: isCreateFormSubmitting,
    },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      resolution: '',
      amenities: '',
      imagePath: '',
    },
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: {
      errors: editErrors,
      isSubmitting: isEditFormSubmitting,
    },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      resolution: '',
      amenities: '',
      imagePath: '',
    },
  })

  useEffect(() => {
    if (!selectedProduct) return

    resetEdit({
      name: selectedProduct.name || '',
      price: Number(selectedProduct.price) || 0,
      stock: Number(selectedProduct.stock) || 0,
      category: selectedProduct.category || '',
      description: selectedProduct.description || '',
      resolution: selectedProduct.resolution || '',
      amenities: Array.isArray(selectedProduct.amenities)
        ? selectedProduct.amenities.join(', ')
        : '',
      imagePath: selectedProduct.imagePath || '',
    })
  }, [resetEdit, selectedProduct])

  const createImagePreview = useMemo(() => {
    if (!createImageFile) return ''

    return URL.createObjectURL(createImageFile)
  }, [createImageFile])

  useEffect(() => {
    if (!createImagePreview) return undefined

    return () => URL.revokeObjectURL(createImagePreview)
  }, [createImagePreview])

  const createProductMutation = useMutation({
    mutationFn: async (payload) => {
      const result = await createProduct(payload)

      if (!result) {
        throw new Error('Failed to create product')
      }

      return result
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }),
      ])

      toast.success('Новий товар успішно додано.')
      resetCreate()
      setCreateImageFile(null)
      setIsCreateModalOpen(false)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Не вдалося створити новий товар.',
      )
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const result = await updateProductById(id, payload)

      if (!result) {
        throw new Error('Failed to update product')
      }

      return result
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] }),
      ])

      toast.success('Товар успішно оновлено.')
      setSelectedProduct(null)
    },
    onError: () => {
      toast.error('Не вдалося зберегти зміни товару.')
    },
  })

  const categoryOptions = useMemo(() => {
    if (!products) return []

    return Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    ).sort((first, second) => first.localeCompare(second, 'uk'))
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    const normalizedSearch = searchValue.trim().toLowerCase()

    return [...products]
      .filter((product) => {
        const stockValue = Number(product.stock) || 0

        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
          return false
        }

        if (stockFilter === 'in-stock' && stockValue <= 0) return false
        if (
          stockFilter === 'low-stock' &&
          !(stockValue > 0 && stockValue <= LOW_STOCK_LIMIT)
        ) {
          return false
        }
        if (stockFilter === 'out-of-stock' && stockValue > 0) return false

        if (!normalizedSearch) {
          return true
        }

        const haystack = [
          product.name,
          product.category,
          product.description,
          product.resolution,
          product.imagePath,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
      .sort((a, b) => {
        const dateDiff =
          getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt)

        if (dateDiff !== 0) return dateDiff

        return a.name.localeCompare(b.name, 'uk')
      })
  }, [products, searchValue, categoryFilter, stockFilter])

  const createImagePathValue = useWatch({
    control: createControl,
    name: 'imagePath',
  })
  const createPreviewSource =
    createImagePreview || getImage(createImagePathValue || null)

  const onCreateImageChange = (event) => {
    const [file] = event.target.files || []
    setCreateImageFile(file || null)
  }

  const onCreateSubmit = async (data) => {
    let finalImagePath = data.imagePath.trim()

    if (createImageFile) {
      finalImagePath = await saveImageToProject(createImageFile, data.name)
    }

    await createProductMutation.mutateAsync(
      buildProductPayload(data, finalImagePath),
    )
  }

  const onEditSubmit = async (data) => {
    if (!selectedProduct) return

    await updateProductMutation.mutateAsync({
      id: selectedProduct.id,
      payload: buildProductPayload(data, data.imagePath),
    })
  }

  if (isLoading) return <Loader />

  if (isError || !products) {
    return (
      <Container>
        <ErrorMessage
          message="Не вдалося завантажити товари для адмінки."
          onRetry={refetch}
        />
      </Container>
    )
  }

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length
  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock)

    return stock > 0 && stock <= LOW_STOCK_LIMIT
  }).length

  return (
    <Container>
      <section className={styles.section}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Товари</span>
            <h2 className={styles.title}>Оновлюйте каталог без окремої CMS</h2>
            <p className={styles.subtitle}>
              Фільтруйте позиції за категорією та залишком, редагуйте наявні
              товари та додавайте нові записи разом із фото для каталогу.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Додати товар
            </Button>
          </div>
        </div>

        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.search}
            placeholder="Пошук за назвою, категорією або описом"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <div className={styles.filterGroup}>
            <select
              className={styles.select}
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">Усі категорії</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
            >
              {STOCK_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Усього товарів</p>
            <h3 className={styles.statValue}>{products.length}</h3>
            <p className={styles.statHint}>Позицій у каталозі</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Категорії</p>
            <h3 className={styles.statValue}>{categoryOptions.length}</h3>
            <p className={styles.statHint}>Окремих груп товарів</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Низький залишок</p>
            <h3 className={styles.statValue}>{lowStockCount}</h3>
            <p className={styles.statHint}>До {LOW_STOCK_LIMIT} одиниць на складі</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Немає в наявності</p>
            <h3 className={styles.statValue}>{outOfStockCount}</h3>
            <p className={styles.statHint}>Позицій варто поповнити</p>
          </article>
        </div>

        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Каталог товарів</h3>
              <p className={styles.panelSubtitle}>
                Знайдено {filteredProducts.length} позицій за поточними фільтрами
              </p>
            </div>
          </header>

          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              Жоден товар не збігається з пошуком або вибраними фільтрами.
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => {
                const stockValue = Number(product.stock) || 0
                const isOutOfStock = stockValue <= 0
                const isLowStock =
                  stockValue > 0 && stockValue <= LOW_STOCK_LIMIT

                return (
                  <article key={product.id} className={styles.productCard}>
                    <div className={styles.productHeader}>
                      <div>
                        <h4 className={styles.cardTitle}>{product.name}</h4>
                        <p className={styles.cardMeta}>
                          {product.category || 'Без категорії'}
                        </p>
                      </div>

                      <p className={styles.productPrice}>
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className={styles.productMetaRow}>
                      <span className={styles.pill}>Залишок: {stockValue} шт.</span>
                      {product.resolution ? (
                        <span className={styles.pill}>
                          Роздільна здатність: {product.resolution}
                        </span>
                      ) : null}
                      <span
                        className={`${styles.badge} ${styles[isOutOfStock ? 'badgedanger' : isLowStock ? 'badgewarning' : 'badgesuccess']}`}
                      >
                        {isOutOfStock
                          ? 'Немає в наявності'
                          : isLowStock
                            ? 'Мало на складі'
                            : 'В наявності'}
                      </span>
                    </div>

                    {product.imagePath ? (
                      <p className={styles.helperText}>
                        Фото: <strong>{product.imagePath}</strong>
                      </p>
                    ) : null}

                    <p className={styles.description}>
                      {product.description || 'Опис для цього товару ще не додано.'}
                    </p>

                    {Array.isArray(product.amenities) && product.amenities.length ? (
                      <div className={styles.tags}>
                        {product.amenities.slice(0, 5).map((amenity) => (
                          <span key={amenity} className={styles.tag}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className={styles.actionsRow}>
                      <Button onClick={() => setSelectedProduct(product)}>
                        Редагувати товар
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            resetCreate()
            setCreateImageFile(null)
          }}
          title="Додати новий товар"
        >
          <form
            className={styles.modalBody}
            onSubmit={handleSubmitCreate(onCreateSubmit)}
          >
            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="create-product-name">
                  Назва
                </label>
                <input id="create-product-name" {...registerCreate('name')} />
                {createErrors.name && (
                  <span className={styles.fieldError}>
                    {createErrors.name.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label
                  className={styles.fieldLabel}
                  htmlFor="create-product-category"
                >
                  Категорія
                </label>
                <input
                  id="create-product-category"
                  {...registerCreate('category')}
                />
                {createErrors.category && (
                  <span className={styles.fieldError}>
                    {createErrors.category.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="create-product-price">
                  Ціна
                </label>
                <input
                  id="create-product-price"
                  type="number"
                  min="0"
                  step="1"
                  {...registerCreate('price')}
                />
                {createErrors.price && (
                  <span className={styles.fieldError}>
                    {createErrors.price.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="create-product-stock">
                  Залишок
                </label>
                <input
                  id="create-product-stock"
                  type="number"
                  min="0"
                  step="1"
                  {...registerCreate('stock')}
                />
                {createErrors.stock && (
                  <span className={styles.fieldError}>
                    {createErrors.stock.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label
                  className={styles.fieldLabel}
                  htmlFor="create-product-resolution"
                >
                  Роздільна здатність
                </label>
                <input
                  id="create-product-resolution"
                  {...registerCreate('resolution')}
                />
                {createErrors.resolution && (
                  <span className={styles.fieldError}>
                    {createErrors.resolution.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label
                  className={styles.fieldLabel}
                  htmlFor="create-product-amenities"
                >
                  Переваги через кому
                </label>
                <input
                  id="create-product-amenities"
                  {...registerCreate('amenities')}
                />
                {createErrors.amenities && (
                  <span className={styles.fieldError}>
                    {createErrors.amenities.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalField}>
              <label className={styles.fieldLabel} htmlFor="create-product-description">
                Опис
              </label>
              <textarea
                id="create-product-description"
                className={styles.textarea}
                {...registerCreate('description')}
              />
              {createErrors.description && (
                <span className={styles.fieldError}>
                  {createErrors.description.message}
                </span>
              )}
            </div>

            <div className={styles.modalField}>
              <label className={styles.fieldLabel} htmlFor="create-product-image-path">
                Шлях до існуючого фото
              </label>
              <input
                id="create-product-image-path"
                placeholder="/catalog-images/example.png"
                {...registerCreate('imagePath')}
              />
              {createErrors.imagePath && (
                <span className={styles.fieldError}>
                  {createErrors.imagePath.message}
                </span>
              )}
              <p className={styles.helperText}>
                Якщо фото вже лежить у проєкті, вкажіть шлях на кшталт
                ` /catalog-images/camera.png`.
              </p>
            </div>

            <div className={styles.modalField}>
              <label className={styles.fieldLabel} htmlFor="create-product-image-file">
                Або завантажити нове фото в проєкт
              </label>
              <input
                id="create-product-image-file"
                className={styles.fileInput}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={onCreateImageChange}
              />
              <p className={styles.helperText}>
                Якщо вибрати файл, браузер попросить обрати папку
                `public/catalog-images`. Це працює локально в браузерах із
                File System Access API.
              </p>
            </div>

            {createPreviewSource ? (
              <div className={styles.previewCard}>
                <span className={styles.fieldLabel}>Попередній перегляд</span>
                <img
                  src={createPreviewSource}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            ) : null}

            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetCreate()
                  setCreateImageFile(null)
                }}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                disabled={
                  isCreateFormSubmitting || createProductMutation.isPending
                }
              >
                {isCreateFormSubmitting || createProductMutation.isPending
                  ? 'Створення...'
                  : 'Створити товар'}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct ? `Редагування: ${selectedProduct.name}` : ''}
        >
          <form className={styles.modalBody} onSubmit={handleSubmitEdit(onEditSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-name">
                  Назва
                </label>
                <input id="product-name" {...registerEdit('name')} />
                {editErrors.name && (
                  <span className={styles.fieldError}>{editErrors.name.message}</span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-category">
                  Категорія
                </label>
                <input id="product-category" {...registerEdit('category')} />
                {editErrors.category && (
                  <span className={styles.fieldError}>
                    {editErrors.category.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-price">
                  Ціна
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="1"
                  {...registerEdit('price')}
                />
                {editErrors.price && (
                  <span className={styles.fieldError}>{editErrors.price.message}</span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-stock">
                  Залишок
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  {...registerEdit('stock')}
                />
                {editErrors.stock && (
                  <span className={styles.fieldError}>{editErrors.stock.message}</span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-resolution">
                  Роздільна здатність
                </label>
                <input id="product-resolution" {...registerEdit('resolution')} />
                {editErrors.resolution && (
                  <span className={styles.fieldError}>
                    {editErrors.resolution.message}
                  </span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.fieldLabel} htmlFor="product-amenities">
                  Переваги через кому
                </label>
                <input id="product-amenities" {...registerEdit('amenities')} />
                {editErrors.amenities && (
                  <span className={styles.fieldError}>
                    {editErrors.amenities.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.modalField}>
              <label className={styles.fieldLabel} htmlFor="product-image-path">
                Шлях до фото
              </label>
              <input
                id="product-image-path"
                placeholder="/catalog-images/example.png"
                {...registerEdit('imagePath')}
              />
              {editErrors.imagePath && (
                <span className={styles.fieldError}>
                  {editErrors.imagePath.message}
                </span>
              )}
              <p className={styles.helperText}>
                Для нових локальних фото використовуй шлях із папки
                `public/catalog-images`.
              </p>
            </div>

            <div className={styles.modalField}>
              <label className={styles.fieldLabel} htmlFor="product-description">
                Опис
              </label>
              <textarea
                id="product-description"
                className={styles.textarea}
                {...registerEdit('description')}
              />
              {editErrors.description && (
                <span className={styles.fieldError}>
                  {editErrors.description.message}
                </span>
              )}
            </div>

            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedProduct(null)}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                disabled={isEditFormSubmitting || updateProductMutation.isPending}
              >
                {isEditFormSubmitting || updateProductMutation.isPending
                  ? 'Збереження...'
                  : 'Зберегти зміни'}
              </Button>
            </div>
          </form>
        </Modal>
      </section>
    </Container>
  )
}

export default AdminProducts
