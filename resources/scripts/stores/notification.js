import { defineStore } from 'pinia'

export const useNotificationStore = (useWindow = false) => {
  const defineStoreFunc = useWindow ? window.pinia.defineStore : defineStore

  return defineStoreFunc({
    id: 'notification',

    state: () => ({
      active: false,
      autoHide: true,
      notifications: [],
    }),

    actions: {
      showNotification(notification) {
        const newNotification = {
          ...notification,
          id: (Math.random().toString(36) + Date.now().toString(36)).substr(2),
        }
        this.notifications.push(newNotification)
        return newNotification
      },

      hideNotification(data) {
        this.notifications = this.notifications.filter((notification) => {
          return notification.id != data.id
        })
      }
    }
  })()
}
