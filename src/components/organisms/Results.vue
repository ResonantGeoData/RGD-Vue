<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { searchResults, getFootPrint, removeFootPrint } from '@/store';
import type { DataOptions } from 'vuetify';
import { RGDResult } from '@/store/types';
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
      {
        text: 'Data Type', value: 'subentry_type', align: 'center', width: 2,
      },
      {
        text: 'Show Footprint', value: 'show_footprint', align: 'end', width: 1,
      },
    ];

    const ellipsisText = (str: string) => {
      if (str.length > 15) {
        return `${str.substr(0, 10)}...${str.substr(str.length - 5, str.length)}`;
      }
      return str;
    };

    const toggleFootprintVisibility = (spatialId: number, value: boolean): null | RGDResult => {
      if (!searchResults.value) {
        return null;
      }
      if (value) {
        getFootPrint(spatialId);
      } else {
        removeFootPrint(spatialId);
      }
      searchResults.value = searchResults.value.map((entry) => {
        if (entry.spatial_id === spatialId) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          return Object.assign(entry, { show_footprint: value });
        }
        return entry;
      });
      return null;
    };

    return {
      searchResults,
      tableOptions,
      headers,
      ellipsisText,
      toggleFootprintVisibility,
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
      dense
      calculate-widths
    >
      <!-- eslint-disable-next-line -->
      <template #item.id-name="{item}">
        <div style="max-width: 10vw;">
          {{ item.spatial_id }}
          {{ item.subentry_name ? ` - ${ellipsisText(item.subentry_name)}` : '' }}
        </div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.subentry_type="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <img
              v-bind="attrs"
              :src="`${item.subentry_type.toLowerCase()}.png`"
              :alt="item.subentry_type"
              class="data-type-icon"
              v-on="on"
            >
          </template>
          <span>
            {{ item.subentry_type }}
          </span>
        </v-tooltip>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.show_footprint="{item}">
        <v-simple-checkbox
          v-ripple
          dark
          :value="item.show_footprint"
          @input="(value) => toggleFootprintVisibility(item.spatial_id, value)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
.data-type-icon {
  max-height: 25px;
  filter: invert(100%);
}
</style>
