<template>
  <div
      class="dashboard-card"
      :class="[
      {
        'dashboard-card-hover': hover,
        'dashboard-card-flat': flat
      }
    ]"
  >
    <!-- Header -->
    <div
        v-if="$slots.header || title"
        class="dashboard-card-header"
    >
      <slot name="header">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">

            <div
                v-if="icon"
                class="dashboard-card-icon"
                :class="iconClass"
            >
              <i :class="icon"></i>
            </div>

            <div class="min-w-0">
              <h3 class="dashboard-card-title">
                {{ title }}
              </h3>

              <p
                  v-if="subtitle"
                  class="dashboard-card-subtitle"
              >
                {{ subtitle }}
              </p>
            </div>

          </div>

          <slot name="actions" />
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div
        class="dashboard-card-content"
        :class="contentClass"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },

  subtitle: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: ''
  },

  iconClass: {
    type: String,
    default: 'bg-indigo-50 border-indigo-100 text-indigo-600'
  },

  hover: {
    type: Boolean,
    default: true
  },

  flat: {
    type: Boolean,
    default: false
  },

  contentClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.dashboard-card {
  @apply bg-white rounded-2xl border border-slate-200/70 overflow-hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.dashboard-card-hover {
  @apply transition-all duration-300;
}

.dashboard-card-hover:hover {
  box-shadow:
      0 8px 25px rgba(15, 23, 42, 0.07),
      0 2px 6px rgba(15, 23, 42, 0.04);
  transform: translateY(-1px);
}

.dashboard-card-flat {
  box-shadow: none;
}

.dashboard-card-header {
  @apply p-5 border-b border-slate-200/60;
  background: linear-gradient(
      135deg,
      rgb(248 250 252),
      rgb(249 250 251)
  );
}

.dashboard-card-icon {
  @apply w-10 h-10 rounded-xl border
  flex items-center justify-center
  flex-shrink-0;
}

.dashboard-card-icon i {
  @apply text-lg;
}

.dashboard-card-title {
  @apply font-bold text-slate-800 text-base leading-5;
}

.dashboard-card-subtitle {
  @apply text-slate-500 text-xs mt-1;
}

.dashboard-card-content {
  @apply p-5;
}
</style>