<template>
  <i class="icon">
    <component :is="icon" />
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from './Icon.meta'
import UserIcon from '../../../assets/icons/user.svg'
import HomeIcon from '../../../assets/icons/home.svg'
import RewardIcon from '../../../assets/icons/reward.svg'
import SearchIcon from '../../../assets/icons/search.svg'
import InventoryIcon from '../../../assets/icons/inventory.svg'
import EditIcon from '../../../assets/icons/edit.svg'
import AddIcon from '../../../assets/icons/add.svg'
import DeleteIcon from '../../../assets/icons/delete.svg'
import SaveIcon from '../../../assets/icons/save.svg'
import DragIcon from '../../../assets/icons/drag.svg'
import EmailIcon from '../../../assets/icons/email.svg'
import SettingsIcon from '../../../assets/icons/settings.svg'
import NukeIcon from '../../../assets/icons/nuke.svg'
import LockIcon from '../../../assets/icons/lock.svg'

const ComponentMap: Record<Icon, unknown> = {
  user: UserIcon,
  home: HomeIcon,
  search: SearchIcon,
  reward: RewardIcon,
  inventory: InventoryIcon,
  edit: EditIcon,
  add: AddIcon,
  delete: DeleteIcon,
  save: SaveIcon,
  drag: DragIcon,
  email: EmailIcon,
  settings: SettingsIcon,
  nuke: NukeIcon,
  lock: LockIcon,
}

const props = withDefaults(defineProps<{ name: Icon; color?: string; size?: number }>(), {
  color: 'var(--white)',
  size: 30,
})

const icon = computed(() => {
  return ComponentMap?.[props.name] || 'p'
})

const size = computed(() => props.size + 'px')
</script>

<style lang="scss" scoped>
.icon {
  width: v-bind(size);
  height: v-bind(size);
  display: flex;

  svg {
    fill: v-bind(color);
  }
}
</style>
