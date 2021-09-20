<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TabToolBar',
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: Number,
      required: false,
    },
  },
  inheritAttrs: false,
});

</script>

<template>
  <div>
    <v-toolbar
      v-bind="$attrs"
    >
      <v-tabs
        :value="value"
        centered
        grow
        @change="$emit('input', $event)"
      >
        <v-tab
          v-for="item in items"
          :key="item"
          max-width="150px"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </div>
</template>
