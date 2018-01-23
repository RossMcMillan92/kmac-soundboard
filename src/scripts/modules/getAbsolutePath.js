import isPhoneGap from "./isPhoneGap"

const getAbsolutePath = () =>
  isPhoneGap ? window.location.href.split("index.html")[0] : "/"

export default getAbsolutePath
