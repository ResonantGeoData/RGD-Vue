<script lang="ts">
import {
  defineComponent, ref,
} from '@vue/composition-api';
import { collections, resultsFilter } from '@/store/search';

export default defineComponent({
  name: 'Collections',
  setup() {
    const selected = ref();

    return {
      selected,
      collections,
      resultsFilter,
    };
  },
});

</script>

<template>
  <v-combobox
    v-model="resultsFilter.collections"
    label="Collections"
    outlined
    :items="collections"
    :item-text="'name'"
    :item-value="'id'"
    dense
    return-object
    @input="$emit('input', resultsFilter)"
  />
</template>
