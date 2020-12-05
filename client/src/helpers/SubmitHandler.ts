import { t } from '@lingui/macro'
import Framework7 from 'framework7'
import logger from 'src/helpers/logger'
import { JSONAPIError } from 'src/types'

export default class SubmitHandler {
  f7: Framework7

  submittingMessage: string

  errorTitle: string

  errorMessage: string

  successMessage?: string

  onSuccess: () => void

  onSubmit:() => Promise<any>

  onError: (error: any) => void

  constructor(f7: Framework7, options: Partial<SubmitHandler> = {}) {
    this.f7 = f7

    this.submittingMessage = options.submittingMessage || t({ id: 'Common.submitting', message: 'Submitting...' })
    this.onSubmit = options.onSubmit || (() => Promise.resolve())
    this.onSuccess = options.onSuccess || (() => {})
    this.onError = options.onError || (() => {})
    this.errorTitle = options.errorTitle || t({ id: 'Common.submission_failed', message: 'Submission Failed' })
    this.errorMessage = options.errorMessage || t({ id: 'Common.somethings_wrong', message: 'Something went wrong' })
  }

  async submit(action?: () => Promise<any>): Promise<void> {
    this.f7.dialog.preloader(this.submittingMessage)
    const fn = action || this.onSubmit
    try {
      await fn()
      this.f7.dialog.close()
      this.onSuccess()
      if (this.successMessage) {
        this.f7.dialog.alert(this.successMessage, t({ id: 'Common.success', message: 'Success' }))
      }
    } catch (error) {
      this.f7.dialog.close()
      logger.error(error)
      if (error.response) {
        this.f7.dialog.alert(this.processErrors(error) || this.errorMessage, this.errorTitle)
      } else {
        this.f7.dialog.alert(this.errorMessage, this.errorTitle)
      }
    }
  }

  private processErrors(error: any) {
    if (error.response.status === 422) {
      return error.response.data.errors.map((x: JSONAPIError) => x.detail).join(', ')
    }
    return null
  }
}
