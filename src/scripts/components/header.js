import React from 'react'
import kmacHeaderUrl from 'static/images/kmac-header.png'

const Header = () => (
  <div className="header">
    <div className="group-spacing-x group-capped u-flex-row u-flex-justify">
      <div className="header__title-group">
        <div className="header__titles">
          <h1 className="header__title">Kmac2021</h1>
          <h2 className="header__title">Soundboard</h2>
        </div>
      </div>
      <img src={kmacHeaderUrl} alt="Kmac2021" className="header__image" />
    </div>
  </div>
)

export default Header
