import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  userRole: null,
  isAuthReady: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload
    },
    removeUser: (state) => {
      state.currentUser = null
      state.userRole = null
    },
    setAuthReady: (state, action) => {
      state.isAuthReady = action.payload
    },
  },
})

export const { setUser, removeUser, setAuthReady, setUserRole } =
  userSlice.actions
export default userSlice.reducer
