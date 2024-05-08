<script setup lang="ts">
import WebGL from 'three/addons/capabilities/WebGL.js'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { use3DScene } from '@/composables/use3DScene'

const {
  container,
  init,
  isWebGLSupported,
  webGLErrorMessage,
  renderer,
  onRendererClick,
  onResize,
  isCreateCuboidModeActivated,
  newCuboidPoints
} = use3DScene()

const activePoint = computed(() => (!newCuboidPoints.x ? 'X' : !newCuboidPoints.y ? 'Y' : 'Z'))

onMounted(() => {
  if (!isWebGLSupported) {
    container.value?.appendChild(webGLErrorMessage)
    return
  }

  init()

  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('click', onRendererClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  renderer.domElement.removeEventListener('click', onRendererClick)
})
</script>

<template>
  <div class="flex">
    <div ref="container" class="relative">
      <BaseAlert v-if="isCreateCuboidModeActivated"> Select {{ activePoint }} point </BaseAlert>
    </div>
    <template v-if="WebGL.isWebGLAvailable()">
      <AppSidebar />
    </template>
  </div>
</template>
