<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { searchParameters, sitesFilter } from '@/store/search';
import { selectedTab } from '@/store';

export default defineComponent({
  name: 'Predicate',
  setup() {
    const predicate = [
      'within',
      'contains',
      'crosses',
      'disjoint',
      'equals',
      'intersects',
      'overlaps',
      'touches',
    ];

    const value = selectedTab.value === 'search' ? searchParameters.value.predicate : sitesFilter.value.predicate;

    return {
      predicate,
      value,
      searchParameters,
    };
  },
});

</script>

<template>
  <v-select
    v-model="value"
    :items="predicate"
    label="Predicate"
    outlined
    dense
    value=""
    @input="selectedTab==='search' ? $emit('input', searchParameters) : $emit('input', sitesFilter)"
  />
</template>
