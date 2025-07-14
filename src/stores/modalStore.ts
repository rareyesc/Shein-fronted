import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    show: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'danger' | 'warning' | 'info',
    mode: 'alert' as 'alert' | 'confirm' | 'prompt',
    resolve: ((value: any) => {}) as (value: any) => void,
    inputValue: ''
  }),
  actions: {
    alert(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
      this.title = title
      this.message = message
      this.type = type
      this.mode = 'alert'
      this.show = true
      return new Promise<void>(resolve => {
        this.resolve = resolve
      })
    },
    confirm(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
      this.title = title
      this.message = message
      this.type = type
      this.mode = 'confirm'
      this.show = true
      return new Promise<boolean>(resolve => {
        this.resolve = resolve
      })
    },
    prompt(title: string, message: string, initial: string = '', type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
      this.title = title
      this.message = message
      this.type = type
      this.mode = 'prompt'
      this.inputValue = initial
      this.show = true
      return new Promise<string | null>(resolve => {
        this.resolve = resolve
      })
    },
    close(result: any) {
      this.show = false
      const resolveFn = this.resolve
      this.resolve = () => {}
      resolveFn(result)
    }
  }
})
