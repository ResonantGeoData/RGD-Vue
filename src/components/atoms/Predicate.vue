<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { searchParameters } from '@/store';

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

    return {
      predicate,
      searchParameters,
    };
  },
});

</script>

<template>
  <v-select
    v-model="searchParameters.predicate"
    :items="predicate"
    label="Predicate"
    outlined
    dense
    value=""
    @input="$emit('input', searchParameters)"
  />
</template>
