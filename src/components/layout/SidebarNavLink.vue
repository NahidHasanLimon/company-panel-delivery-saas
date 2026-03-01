<template>
  <router-link
    :to="to"
    class="flex items-center px-3 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-200 group"
    :class="isActive
      ? 'bg-slate-100 text-slate-900'
      : 'text-slate-800 hover:bg-slate-100 hover:text-slate-900'"
  >
    <component :is="icon" class="w-4 h-4 transition-colors text-slate-700" :class="collapsed ? '' : 'mr-3'" />
    <span v-if="!collapsed">{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarNavLink',
  props: {
    to: {
      type: String,
      required: true
    },
    routeName: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: [Object, Function, String],
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.$route.name === this.routeName
    }
  }
}
</script>
