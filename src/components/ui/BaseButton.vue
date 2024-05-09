<script setup lang="ts">
interface Props {
  isActivated?: boolean
}

withDefaults(defineProps<Props>(), {
  isActivated: false
})
</script>

<template>
  <button
    class="font-semibold p-2 border border-gray-400 rounded shadow"
    :class="
      isActivated
        ? 'bg-blue-500 text-white border-blue-700'
        : 'bg-white hover:bg-gray-100 text-gray-600'
    "
  >
    <slot />
  </button>
</template>
