<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import CuboidDetails from '@/components/CuboidDetails.vue'
import { use3DScene } from '@/composables/use3DScene'

const { cuboids, resetCameraPosition, setCreateCuboidMode, isCreateCuboidModeActivated } =
  use3DScene()
</script>

<template>
  <div class="w-full h-screen overflow-y-auto">
    <div class="flex flex-col p-4">
      <BaseButton
        class="w-32 mb-2"
        @click="setCreateCuboidMode(true)"
        :is-activated="isCreateCuboidModeActivated"
        >Add cuboid</BaseButton
      >
      <BaseButton class="w-32" @click="resetCameraPosition">Reset camera</BaseButton>
    </div>

    <div v-if="cuboids.length" class="w-full">
      <p class="text-gray-900 font-semibold my-2 pl-4">Cuboids:</p>
      <CuboidDetails v-for="(cuboid, i) in cuboids" :key="cuboid.id" :cuboid="cuboid" :index="i" />
    </div>
  </div>
</template>
