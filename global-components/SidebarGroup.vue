<template>
  <div
    class="sidebar-group"
    :class="{ first, collapsable }"
  >
    <a
      class="sidebar-heading"
      :class="{ open, active }"
      @click="$emit('toggle')"
    >
      <sidebar-icon
        v-if="item.icon"
        :name="item.icon"
      />
      <span>
        {{ item.title }}
      </span>
      <span :class="['icon', 'mdi', 'mdi-chevron-down', {open}]"></span>
    </a>
    <ul
      class="sidebar-group-items"
      ref="items"
      v-if="open || !collapsable"
    >
      <li
        v-for="(child, idx) in item.children"
        :key="`sidebar-group-items-child-${idx}`"
        class="sub-link"
      >
        <SidebarLink :item="child" />
      </li>
    </ul>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'
import { isActive } from '../util'

export default {
  name: 'SidebarGroup',
  props: ['item', 'first', 'open', 'collapsable'],
  components: { SidebarLink },
  computed: {
    active: function () {
      return this.item && this.item.children && this.item.children.some(c => isActive(this.$route, c.path))
    }
  }
}
</script>
