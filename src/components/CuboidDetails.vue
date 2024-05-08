<script setup lang="ts">
import * as THREE from 'three'
import BaseInputNumber from '@/components/ui/BaseInputNumber.vue'
import { ref } from 'vue'

interface Props {
  cuboid: THREE.Mesh
  index: number
}

const props = defineProps<Props>()

const activeCuboid = ref(props.cuboid)
</script>
<template>
  <div class="p-4 mb-2 border-b border-gray-40 w-full">
    <p class="text-gray-700 mb-2">Name: Cuboid {{ index + 1 }}</p>
    <p class="text-gray-700 mb-2">Id: {{ cuboid.id }}</p>
    <div>
      <p class="text-gray-900 mb-2">Position:</p>

      <label class="label">
        <span class="inline-block mr-4">X</span>
        <BaseInputNumber v-model="activeCuboid.position.x" />
      </label>
      <label class="label">
        <span class="inline-block mr-4">Y</span>
        <BaseInputNumber v-model="activeCuboid.position.y" />
      </label>
      <div></div>
      <label class="label flex">
        <span class="inline-block mr-4">Z</span>
        <BaseInputNumber v-model="activeCuboid.position.z" />
      </label>
    </div>
    <div>
      <p class="text-gray-900 mb-2">Dimensions:</p>

      <label class="label">
        <span class="inline-block mr-4">X</span>
        <BaseInputNumber v-model="activeCuboid.scale.x" />
      </label>
      <label class="label">
        <span class="inline-block mr-4">Y</span>
        <BaseInputNumber v-model="activeCuboid.scale.y" />
      </label>
      <div></div>
      <label class="label flex">
        <span class="inline-block mr-4">Z</span>
        <BaseInputNumber v-model="activeCuboid.scale.z" />
      </label>
    </div>
    <div>
      <p class="text-gray-900 mb-2">Rotation:</p>

      <label class="label">
        <span class="inline-block mr-4">X</span>
        <BaseInputNumber v-model="activeCuboid.rotation.x" />
      </label>
      <label class="label">
        <span class="inline-block mr-4">Y</span>
        <BaseInputNumber v-model="activeCuboid.rotation.y" />
      </label>
      <div></div>
      <label class="label flex">
        <span class="inline-block mr-4">Z</span>
        <BaseInputNumber v-model="activeCuboid.rotation.z" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.label {
  @apply mb-2 text-sm font-medium text-gray-900 flex items-center;
}
</style>
