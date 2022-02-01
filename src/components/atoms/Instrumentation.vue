<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { resultsFilter } from '@/store/search';

export default defineComponent({
  name: 'Instrumentation',
  setup() {
    return {
      resultsFilter,
    };
  },
});

</script>

<template>
  <v-text-field
    v-model="resultsFilter.instrumentation"
    label="Instrumentation"
    outlined
    dense
    @input="$emit('input', resultsFilter)"
  />
</template>
