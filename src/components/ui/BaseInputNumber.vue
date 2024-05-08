<script setup lang="ts">
interface Props {
  modelValue: string | number
  step?: string | number
}

withDefaults(defineProps<Props>(), {
  step: '.01'
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <input
    type="number"
    :value="modelValue"
    :step="step"
    @input="updateValue"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  />
</template>
