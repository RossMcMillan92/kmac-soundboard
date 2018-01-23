import React from "react"

const ImageButton = ({
  className,
  renderImage,
  imageClassName,
  textClassName,
  children,
  ...otherProps
}) => (
  <button className={`image-button ${className || ""}`} {...otherProps}>
    {renderImage && (
      <div className={`image-button__image ${imageClassName || ""}`}>
        {renderImage && renderImage()}
      </div>
    )}
    <div className={`image-button__text ${textClassName || ""}`}>
      {children}
    </div>
  </button>
)

export default ImageButton
