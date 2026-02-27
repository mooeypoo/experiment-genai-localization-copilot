import { ref } from 'vue'

const viewingUserId = ref(null)

export const useViewingUser = () => {
  const setViewingUser = (userId) => {
    viewingUserId.value = userId
  }

  const getViewingUserId = () => {
    return viewingUserId.value
  }

  return {
    viewingUserId,
    setViewingUser,
    getViewingUserId
  }
}
