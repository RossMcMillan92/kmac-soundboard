import React from "react"

const getTranslation = volume => Math.min(Math.round(volume * 15), 15)

const KmacFace = ({ volume }) => (
  <div className="kmac-face">
    <img
      className="kmac-face__face kmac-face__face--bg"
      src="/images/kmac-bg.png"
      alt="kmac2021 face bg"
    />
    <img
      className="kmac-face__face kmac-face__face--fg"
      src="/images/kmac-fg.png"
      alt="kmac2021 face fg"
      style={{
        transform: `translateY(${getTranslation(volume)}%)`
      }}
    />
  </div>
)

export default KmacFace
