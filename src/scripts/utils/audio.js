import { curry } from "ramda"
import { IO, Future as Task } from "ramda-fantasy"

const bufferCache = {}

//    getBufferFromURL :: context -> url -> Task Error Buffer
const getBufferFromURL = curry((context, url) =>
  Task((rej, res) => {
    if (bufferCache[url]) return res(bufferCache[url])
    const onError = () => rej(Error(`Error decoding file data: ${url}`))
    const request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "arraybuffer"
    request.onerror = onError
    request.onload = () =>
      context.decodeAudioData(
        request.response,
        buffer => {
          if (!buffer) {
            onError()
            return
          }
          bufferCache[url] = buffer
          res(buffer)
        },
        onError
      )
    request.send()
  })
)

//    getPitchPlaybackRatio :: Integer -> Integer
const getPitchPlaybackRatio = pitchAmount => {
  const pitchIsPositive = pitchAmount > 0
  const negAmount = pitchIsPositive ? pitchAmount * -1 : pitchAmount
  const val = 1 / Math.abs(negAmount / 1200 - 1)

  return pitchIsPositive ? 1 / val : val
}

const playSoundAdvanced = (context, buffer, time, duration, analyser, pitchAmount = 0) => {
  console.log("playing!")
  if (!buffer) return

  const source = context.createBufferSource()
  const durationMultiplier = getPitchPlaybackRatio(pitchAmount)

  source.connect(analyser)
  analyser.connect(context.destination)

  source.playbackRate.value = durationMultiplier
  source.buffer = buffer

  source.start(time, 0, duration * durationMultiplier)
  console.log("started")
  return source
}

//    playSound :: audioContext -> buffer -> IO source
const playSound = curry((context, analyser, buffer) =>
  IO(() => playSoundAdvanced(context, buffer, 0, buffer.duration, analyser))
)

const stopSource = src => {
  if (src) {
    src.onended = () => {}
    src.stop(0)
    return src
  }
}

export { getBufferFromURL, playSoundAdvanced, playSound, stopSource }
