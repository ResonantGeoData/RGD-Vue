<script lang="ts">
import {
  defineComponent, ref,
} from '@vue/composition-api';
import { resultsFilter } from '@/store/search';
import { rgdCollections } from '@/api/rest';

export default defineComponent({
  name: 'Collections',
  setup() {
    const collections = ref([]);
    rgdCollections().then((result) => {
      collections.value = result;
    });
    return {
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
    :items="collections"
    :item-text="'name'"
    :item-value="'id'"
    outlined
    multiple
    dense
    @input="$emit('input', resultsFilter)"
  />
</template>
