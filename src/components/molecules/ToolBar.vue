<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ToolBar',
  props: {
    text: {
      type: String,
      required: false,
    },
  },
  inheritAttrs: false,
});

</script>

<template>
  <div>
    <v-toolbar
      v-if="text"
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
