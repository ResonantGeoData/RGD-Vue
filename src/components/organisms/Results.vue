<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { searchResults } from '@/store';
import type { DataOptions } from 'vuetify';
import FilterMenu from '../molecules/Filters.vue';
import ToolBar from '../molecules/ToolBar.vue';

export default defineComponent({
  name: 'Results',
  components: {
    ToolBar,
    FilterMenu,
  },

  setup() {
    const tableOptions = reactive({
      page: 1,
      sortBy: ['spatial_id'],
      sortDesc: [true],
    } as DataOptions);

    const headers = [
      { text: 'ID-Name', value: 'id-name' },
      { text: 'Data Type', value: 'subentry_type' },
    ];

    const baseLink = `${process.env.VUE_APP_API_ROOT}rgd/spatial_entries/`;

    return {
      searchResults,
      tableOptions,
      headers,
      baseLink,
    };
  },
});

</script>

<template>
  <div>
    <FilterMenu />
    <v-data-table
      :headers="headers"
      :items="searchResults"
      class="resultsTable"
      dense
    >
      <!-- eslint-disable-next-line -->
     <template #item.id-name="{item}">
        <div
          class="text-truncate"
          style="max-width: 10vw;"
        >
          <a :href="`${baseLink}${item.spatial_id}`">
            {{ item.spatial_id }} - {{ item.subentry_name }}
          </a>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
