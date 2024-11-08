<template>
  <RouterView v-slot="{ Component, route }">
    <transition :name="transition">
      <component :is="Component" :key="route.path" />
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
import { useUI } from '../../store/ui'
import { useRAF } from '../../store/raf'
import { useViewport } from '../../store/viewport'
import { TransitionType } from '@/types/transitions'

withDefaults(
  defineProps<{
    transition?: TransitionType
  }>(),
  {
    transition: 'fade',
  }
)

useViewport()
useRAF()
useUI()
</script>
