<script lang="ts">
import {
  defineComponent, reactive, watch, toRefs,
} from '@vue/composition-api';
import {
  searchResults, searchLimit, searchOffset, searchResultsTotal, updateResults,
} from '@/store';
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
      itemsPerPage: 10,
    } as DataOptions);

    const headers = [
      { text: 'ID-Name', value: 'id-name', sortable: false },
      { text: 'Data Type', value: 'subentry_type', sortable: false },
    ];

    const itemsPerPageOptions = [5, 10, 15];

    const updateOptions = () => {
      const { page, itemsPerPage } = tableOptions;
      searchLimit.value = itemsPerPage;
      searchOffset.value = (page - 1) * itemsPerPage;
      updateResults();
    };

    watch(tableOptions, updateOptions, {
      deep: true,
    });

    // ToDo rework table for row selection instead of linking
    const baseLink = `${process.env.VUE_APP_API_ROOT}rgd/spatial_entries/`;

    return {
      searchResults,
      ...toRefs(tableOptions),
      headers,
      baseLink,
      searchResultsTotal,
      itemsPerPageOptions,
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
      :page.sync="page"
      :items-per-page.sync="itemsPerPage"
      :server-items-length="searchResultsTotal"
      :footer-props="{ itemsPerPageOptions }"
      class="resultsTable"
      dense
    >
      <!-- eslint-disable-next-line -->
     <template #item.id-name="{item}">
        <div
          class="text-truncate"
          style="max-width: 10vw;"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <a
                :href="`${baseLink}${item.spatial_id}`"
                v-bind="attrs"
                v-on="on"
              >
                {{ item.spatial_id }}{{ item.subentry_name ? ` - ${item.subentry_name}` : '' }}
              </a>
            </template>
            <span>
              View {{ item.spatial_id }}{{ item.subentry_name ? ` - ${item.subentry_name}` : '' }}
            </span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
