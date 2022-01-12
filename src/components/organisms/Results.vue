<script lang="ts">
import {
  defineComponent, reactive, watch, toRefs,
} from '@vue/composition-api';
import {
  searchResults,
  searchLimit,
  searchOffset,
  searchResultsTotal,
  updateResults,
  addFootprint,
  removeFootprint,
  addRasterOverlay,
  removeRasterOverlay,
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
      {
        text: '', value: 'show_raster', width: 1, sortable: false,
      },
      { text: 'ID-Name', value: 'id-name', sortable: false },
      {
        text: 'Data Type',
        value: 'subentry_type',
        align: 'center',
        width: 2,
        sortable: false,
      },
      {
        text: 'Show Footprint',
        value: 'show_footprint',
        align: 'end',
        width: 1,
        sortable: false,
      },
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

    const ellipsisText = (str: string) => {
      if (str.length > 15) {
        return `${str.substr(0, 10)}...${str.substr(str.length - 5, str.length)}`;
      }
      return str;
    };

    const toggleValue = (fieldName: string, spatialId: number, value: boolean) => {
      let addFunc;
      let removeFunc;
      if (fieldName === 'show_footprint') {
        addFunc = addFootprint;
        removeFunc = removeFootprint;
      } else if (fieldName === 'show_raster') {
        addFunc = addRasterOverlay;
        removeFunc = removeRasterOverlay;
      }

      if (!searchResults.value) {
        return null;
      }
      if (value && addFunc) {
        addFunc(spatialId);
      } else if (removeFunc) {
        removeFunc(spatialId);
      }
      searchResults.value = searchResults.value.map((entry) => {
        if (entry.spatial_id === spatialId) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          return Object.assign(entry, { [fieldName]: value });
        }
        return entry;
      });
      return null;
    };

    return {
      searchResults,
      ...toRefs(tableOptions),
      headers,
      ellipsisText,
      toggleValue,
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
      dense
      calculate-widths
    >
      <!-- eslint-disable-next-line -->
      <template #item.show_raster="{item}">
        <v-simple-checkbox
          v-if="item.subentry_type === 'RasterMeta'"
          v-ripple
          dark
          off-icon="mdi-eye-off"
          on-icon="mdi-eye"
          :value="item.show_raster"
          @input="(value) => toggleValue('show_raster', item.spatial_id, value)"
        />
      </template>
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
          @input="(value) => toggleValue('show_footprint', item.spatial_id, value)"
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
