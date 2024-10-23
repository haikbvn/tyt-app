export const saveSession = (access_token: string, expires_in: number) => {
  const expirationTime = new Date().getTime() + expires_in * 1000
  localStorage.setItem("access_token", access_token)
  localStorage.setItem("expiration_time", expirationTime.toString())
}

export const checkSession = () => {
  const accessToken = localStorage.getItem("access_token")
  const expirationTime = localStorage.getItem("expiration_time")

  if (accessToken && expirationTime) {
    const currentTime = new Date().getTime()
    if (currentTime < parseInt(expirationTime)) {
      return accessToken
    } else {
      // Hết hạn, xoá phiên
      localStorage.removeItem("access_token")
      localStorage.removeItem("expiration_time")
      return null
    }
  }
  return null
}
