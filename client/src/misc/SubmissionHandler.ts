import { t } from '@lingui/macro'
import Framework7 from 'framework7'
import logger from 'src/logger'
import { JSONAPIError } from 'src/types'

export default class SubmissionHandler {
  f7: Framework7

  onSubmitMessage: string

  onErrorTitle: string

  onErrorMessage: string

  onSuccess: () => void

  onError: (error: any) => void

  constructor(f7: Framework7, options: Partial<SubmissionHandler> = {}) {
    this.f7 = f7

    this.onSubmitMessage = options.onSubmitMessage || t({ id: 'Common.submitting', message: 'Submitting...' })
    this.onErrorTitle = options.onErrorTitle || t({ id: 'Common.submission_failed', message: 'Submission Failed' })
    this.onErrorMessage = options.onErrorMessage || t({ id: 'Common.somethings_wrong', message: 'Something went wrong' })
    this.onSuccess = options.onSuccess || (() => {})
    this.onError = options.onError || (() => {})
  }

  async submit(action: () => Promise<any>) {
    this.f7.dialog.preloader(this.onSubmitMessage)

    try {
      await action()
      this.f7.dialog.close()
    } catch (error) {
      this.f7.dialog.close()
      logger.error(error)
      if (error.response) {
        this.f7.dialog.alert(this.processErrors(error) || this.onErrorMessage, this.onErrorTitle)
      } else {
        this.f7.dialog.alert(this.onErrorMessage, this.onErrorTitle)
      }
    }
  }

  processErrors(error: any) {
    if (error.response.status === 422) {
      return error.response.data.errors.map((x: JSONAPIError) => x.detail).join(', ')
    }
    return null
  }
}
