// 获取对应字符串的base64格式
export const toBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}

export const generateID = () => {
  return Math.random().toString(36).slice(2, 12)
}

// 将一段js，转化为一个URL对象，注意观察浏览器的产物
export const getBlobURL = (jsCode) => {
  const blob = new Blob([jsCode], { type: 'text/javascript' })
  return URL.createObjectURL(blob)
}

export const hasChildrenBlock = (code) => {
  return /from ['|"].\//.test(code)
}

export const joinMap = (content, map) => {
  return map
    ? `${content}\n//# sourceMappingURL=data:application/json;base64,${toBase64(JSON.stringify(map))}`
    : content
}
