import React from 'react'
import kmacFaceBgUrl from 'static/images/kmac-bg.png'
import kmacFaceFgUrl from 'static/images/kmac-fg.png'

const getTranslation = volume => Math.min(Math.round(volume * 15), 15)

const KmacFace = ({ volume }) => (
  <div className="kmac-face">
    <img className="kmac-face__face kmac-face__face--bg" src={kmacFaceBgUrl} alt="kmac2021 face bg" />
    <img
      className="kmac-face__face kmac-face__face--fg"
      src={kmacFaceFgUrl}
      alt="kmac2021 face fg"
      style={{
        transform: `translateY(${getTranslation(volume)}%)`
      }}
    />
  </div>
)

export default KmacFace
