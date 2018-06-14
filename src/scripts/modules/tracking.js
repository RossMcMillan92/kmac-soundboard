import { IO } from "ramda-fantasy"

import { compose, curry } from "ramda"

const eventQueue = []

let isRequestIdleCallbackScheduled
const schedulePendingEvents = () => {
  if (isRequestIdleCallbackScheduled) return
  isRequestIdleCallbackScheduled = true
  requestIdleCallback(processPendingAnalyticsEvents)
}

const processPendingAnalyticsEvents = deadline => {
  isRequestIdleCallbackScheduled = false

  // Go for as long as there is time remaining and work to do.
  while (deadline.timeRemaining() > 0 && eventQueue.length > 0) {
    const event = eventQueue.pop()
    event.runIO()
  }

  // Check if there are more events still to send.
  if (eventQueue.length > 0) schedulePendingEvents()
}

//    sendGAEvent :: String s : s -> s -> s -> IO gaEvent
const sendGAEvent = curry((eventCategory, eventAction, eventLabel) =>
  IO(() => {
    window.ga("send", {
      hitType: "event",
      eventCategory,
      eventAction,
      ...(eventLabel !== "" ? { eventLabel } : {})
    })
  })
)

//    addGAEventToQueue :: IO gaEvent -> ()
const addGAEventToQueue = compose(schedulePendingEvents, event => eventQueue.push(event))

//    sendGeneralEvent :: eventAction -> eventLabel -> IO gaEvent
const sendGeneralEvent = sendGAEvent("General")

//    sendGenerateEvent :: label -> IO gaEvent
export const sendClickEvent = compose(addGAEventToQueue, sendGeneralEvent("click"))

//    sendEasterEggEvent :: label -> IO gaEvent
export const sendEasterEggEvent = compose(addGAEventToQueue, sendGeneralEvent("easter"))
