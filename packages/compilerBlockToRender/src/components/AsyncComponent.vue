<template>
  <div>
    <Suspense>
      <component :is="BlockComponent"></component>
      <template #fallback>正在加载...</template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineProps, defineAsyncComponent } from 'vue'
import { generateBlock } from '../utils'
const props = defineProps({
  blockConfig: {
    type: Object,
    default: () => ({
      code: `<template>
        <h4>请传递对应区块源码</h4>
      </template>`
    })
  }
})

const BlockComponent = defineAsyncComponent(async () => {
  return await generateBlock(props.blockConfig)
})
</script>
