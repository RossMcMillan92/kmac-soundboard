import React from "react"

const FaceButton = ({
  className,
  renderImage,
  imageClassName,
  textClassName,
  children,
  ...otherProps
}) => (
  <button className={`face-button ${className || ""}`} {...otherProps}>
    {renderImage && (
      <div className={`face-button__image ${imageClassName || ""}`}>
        {renderImage && renderImage()}
      </div>
    )}
    <div className={`face-button__text ${textClassName || ""}`}>{children}</div>
  </button>
)

export default FaceButton
