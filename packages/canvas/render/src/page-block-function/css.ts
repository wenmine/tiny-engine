import { initStyle } from '../material-function/page-getter'
import { getController } from '../render'
export function setPagecss(css = '', pageId?) {
  const cssPageId = pageId ?? getController().getBaseInfo().pageId
  const key = `data-te-page-${cssPageId}`
  initStyle(key, css)
}
