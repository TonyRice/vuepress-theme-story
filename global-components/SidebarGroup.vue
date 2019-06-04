<template>
  <div
    class="sidebar-group"
    :class="{ first, collapsable }"
  >
    <span
      class="sidebar-heading"
      :class="{ open }"
      @click="$emit('toggle')"
    >
      {{ item.title }}
    </span>
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

export default {
  name: 'SidebarGroup',
  props: ['item', 'first', 'open', 'collapsable'],
  components: { SidebarLink }
}
</script>
