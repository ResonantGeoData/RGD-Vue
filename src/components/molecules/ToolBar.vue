<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ToolBar',
  props: {
    items: {
      type: Array,
      required: false,
    },
    text: {
      type: String,
      required: false,
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
      v-if="items"
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
    <v-toolbar
      v-else-if="text"
      v-bind="$attrs"
    >
      {{ text }}
    </v-toolbar>
    <v-toolbar
      v-else
      v-bind="$attrs"
    />
  </div>
</template>
