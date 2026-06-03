const SESSION_KEY = 'vivugo_ai_session_id'

export const getVivugoSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    const randomPart = Math.random().toString(36).slice(2)
    sessionId = `vv_${Date.now()}_${randomPart}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}
