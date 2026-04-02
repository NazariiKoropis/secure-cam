import { createSlice } from '@reduxjs/toolkit'

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('cartItems')
    if (serializedState === null) {
      return []
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Помилка читання з localStorage', err)
    return []
  }
}

const initialState = {
  items: loadFromLocalStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload
    },

    addItem: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id)

      if (existingItem) {
        existingItem.quantity += newItem.quantity
      } else {
        state.items.push(newItem)
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { setItems, addItem, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
