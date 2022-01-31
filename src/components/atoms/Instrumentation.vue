<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { selectedTab } from '@/store';
import { resultsFilter, sitesFilter } from '@/store/search';

export default defineComponent({
  name: 'Instrumentation',
  setup() {
    const value = selectedTab.value === 'results' ? resultsFilter.value.instrumentation : sitesFilter.value.instrumentation;
    return {
      value,
      resultsFilter,
      sitesFilter,
    };
  },
});

</script>

<template>
  <v-text-field
    v-model="value"
    label="Instrumentation"
    outlined
    dense
    @input="selectedTab==='results' ? $emit('input', resultsFilter) : $emit('input', sitesFilter)"
  />
</template>
