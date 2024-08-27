import * as compiler from '@vue/compiler-sfc'
import { getBlobURL, generateID, joinMap } from './utils'

export const blocksMap = {}
const styleSheetMap = {}
window.blocksMap = blocksMap

/**
 * adoptedStyleSheets 的优先级高于document.styleSheets，它是一个Proxy<Array> 对象
 * adoptedStyleSheets 不仅支持document,还会往shadowRoot节点下挂载样式，同一个stylesheet可以挂到多处，可复用，节约内存
 * adoptedStyleSheets 下的样式表对象，在head下不可见，不会影响dom结构
 */

const generateCssInJs = (descriptor, id) => {
  if (descriptor.styles) {
    const styled = descriptor.styles.map((style) => {
      return compiler.compileStyle({
        id,
        source: style.content,
        scoped: style.scoped,
        preprocessLang: style.lang
      })
    })
    const styles = styled.map((s) => s.code).join('')
    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(styles)

    if (styleSheetMap[id]) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((sheet) => sheet !== styleSheetMap[id])
    } else {
      styleSheetMap[id] = styleSheet
    }
    document.adoptedStyleSheets.push(styleSheetMap[id])
  }
}

/**
 * 编译sfc源文件，输出编译后的js源代码
 */

const transformVueSFC = ({ code, name }) => {
  const { descriptor, errors } = compiler.parse(code, { name })
  if (errors.length) {
    throw new Error(errors.toString())
  }

  // 获取唯一id
  const id = generateID()
  const hasScoped = descriptor.styles.some((e) => e.scoped)
  const scopeId = hasScoped ? `data-v-${id}` : undefined

  // 编译js
  const script = compiler.compileScript(descriptor, { id, sourceMap: true })
  script.content = joinMap(script.content, script.map)

  // 模板编译项
  const templateOptions = {
    id,
    source: descriptor.template.content,
    filename: name,
    scoped: hasScoped,
    slotted: descriptor.slotted,
    compilerOptions: {
      mode: 'module',
      inline: false,
      bindingMetadata: script.bindings
    }
  }

  const template = compiler.compileTemplate({ ...templateOptions, sourceMap: true, inlineTempate: true })
  if (template.map) {
    template.map.sources[0] = `${template.map.sources[0]}?template`
    template.code = joinMap(template.code, template.map)
  }

  generateCssInJs(descriptor, id)

  // 将模板、js结合到一起
  const moduleCode = `
  import script from '${getBlobURL(script.content)}'; // script content
  import { render } from '${getBlobURL(template.code)}'; // template code
  script.render = render;
  ${name ? `script.__file='${name}';` : ''}
  ${scopeId ? `script.scopeId='${scopeId}';` : ''}
  export default script;
  `
  return moduleCode
}

// 循环解析嵌套区块
const handleBlock = ({ code, childBlocks }, blockList) => {
  let result = code
  childBlocks.forEach((item) => {
    const block = blockList[item]

    // 如果子区块中也有子区块，则循环调用
    if (!block.childBlocks) {
      block.code = handleBlock({ code: block.code, childBlocks: block.childBlocks }, blockList)
    }

    // 拿到子区块的BlobURL，然后将源码中的子区块文件名换成子区块的BlobURL
    if (!blocksMap[block.name]) {
      blocksMap[block.name] = getBlobURL(transformVueSFC(block))
    }

    const blobURL = blocksMap[block.name]
    result = result.replaceAll(`./${item}.vue`, blobURL)
  })

  return result
}

export const generateBlock = async ({ code, name, childBlocks }, blockList) => {
  let blockCode = code

  if (childBlocks) {
    blockCode = handleBlock({ code, childBlocks }, blockList)
  }

  if (!blocksMap[name]) {
    blocksMap[name] = getBlobURL(transformVueSFC({ code: blockCode, name }))
  }

  const blockBlobURL = blocksMap[name]
  const AppModule = await import(blockBlobURL)
  return AppModule.preventDefault()
}
