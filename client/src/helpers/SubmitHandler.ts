import Framework7 from 'framework7'
import { tr } from 'src/components/Tr'
import logger from 'src/helpers/logger'
import { JSONAPIError } from 'src/types'

export default class SubmitHandler<T = any> {
  f7: Framework7

  submittingMessage: string

  errorTitle: string

  errorMessage: string

  successMessage?: string

  onSuccess: (result?: T) => void

  onSubmit: () => Promise<any>

  onError: (error: any) => void

  constructor(f7: Framework7, options: Partial<SubmitHandler> = {}) {
    this.f7 = f7

    this.submittingMessage = options.submittingMessage || tr({ en: 'Submitting...', es: 'Enviando...' })
    this.onSubmit = options.onSubmit || (() => Promise.resolve())
    this.onSuccess = options.onSuccess || (() => {})
    this.successMessage = options.successMessage
    this.onError = options.onError || (() => {})
    this.errorTitle = options.errorTitle || tr({ en: 'Submission Failed', es: 'Envío Fallido' })
    this.errorMessage = options.errorMessage || tr({ en: 'Something went wrong', es: 'Algo salió mal' })
  }

  setOptions(options: Partial<SubmitHandler>) {
    this.submittingMessage = options.submittingMessage || tr({ en: 'Submitting...', es: 'Enviando...' })
    this.onSubmit = options.onSubmit || (() => Promise.resolve())
    this.onSuccess = options.onSuccess || (() => {})
    this.successMessage = options.successMessage
    this.onError = options.onError || (() => {})
    this.errorTitle = options.errorTitle || tr({ en: 'Submission Failed', es: 'Envío Fallido' })
    this.errorMessage = options.errorMessage || tr({ en: 'Something went wrong', es: 'Algo salió mal' })
  }

  async submit(action?: () => Promise<any>, options?: Partial<SubmitHandler>): Promise<void> {
    this.f7.dialog.preloader(this.submittingMessage)
    if (options) {
      this.setOptions(options)
    }
    const fn = action || this.onSubmit
    try {
      const result = await fn()
      this.f7.dialog.close()
      if (this.successMessage) {
        this.f7.dialog.alert(this.successMessage, tr({ en: 'Success', es: 'Exito' }), () =>
          this.handleSuccess(result),
        )
      } else {
        this.handleSuccess(result)
      }
    } catch (error) {
      this.f7.dialog.close()
      logger.error(error)
      if (error.response) {
        this.f7.dialog.alert(this.processErrors(error) || this.errorMessage, this.errorTitle, () =>
          this.handleError(error),
        )
      } else {
        this.f7.dialog.alert(this.errorMessage, this.errorTitle, () => this.handleError(error))
      }
    }
  }

  private handleSuccess(result?: any) {
    if (this.onSuccess) {
      this.onSuccess(result)
    }
  }

  private handleError(error: any) {
    if (this.onError) {
      this.onError(error)
    }
  }

  private processErrors(error: any) {
    if (error.response.status === 422) {
      return error.response.data.errors.map((x: JSONAPIError) => x.detail).join(', ')
    }
    return null
  }
}
