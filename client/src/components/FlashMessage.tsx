import React, { useGlobal } from 'reactn'

export default function FlashMessage() {
  const [flashMessage] = useGlobal('flashMessage')
  // f7.notification.create({
  //   icon: '<i class="icon demo-icon">7</i>',
  //   title: 'Framework7',
  //   titleRightText: 'now',
  //   subtitle: 'Notification with close on click',
  //   text: flashMessage,
  //   closeOnClick: true,
  // })
  if (flashMessage) {
    return <p>{flashMessage}</p>
  }
  return <></>
}
