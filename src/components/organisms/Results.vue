<script lang="ts">
import {
  defineComponent, reactive, watch, toRefs, ref,
} from '@vue/composition-api';
import { clearMetaDataDrawer, selectedTab } from '@/store';
import {
  searchResults,
  searchLimit,
  searchOffset,
  searchResultsTotal,
  updateResults,
  selectResultForMetadataDrawer,
  updateSites,
} from '@/store/search';
import {
  addFootprint,
  removeFootprint,
} from '@/store/cesium/footprints';
import {
  addVisibleOverlay,
  removeVisibleOverlay,
} from '@/store/cesium/layers';
import { FocusedDataType } from '@/store/types';
import { imageryBands, rgdImagery } from '@/api/rest';
import type { DataOptions } from 'vuetify';
import FilterMenu from '../molecules/Filters.vue';
import FocusedData from '../molecules/FocusedData.vue';
import TimeSliderRange from '../atoms/TimeSliderRange.vue';

export default defineComponent({
  name: 'Results',
  components: {
    FilterMenu,
    FocusedData,
    TimeSliderRange,
  },

  setup(props) {
    const focusedData = ref<FocusedDataType>({
      bandsList: [],
      images: [],
      title: '',
      spatialId: 0,
    });

    const focusFlag = ref(false);
    const tableOptions = reactive({
      page: 1,
      itemsPerPage: 10,
    } as DataOptions);

    const headers = [
      {
        text: '', value: 'show_overlay', width: 1, sortable: false,
      },
      {
        text: 'ID-Name',
        value: 'id-name',
        sortable: false,
      },
      {
        text: 'Data Type',
        value: 'subentry_type',
        align: 'center',
        width: '1',
        sortable: false,
      },
      {
        text: 'Show Footprint',
        value: 'show_footprint',
        align: 'center',
        width: '1',
        sortable: false,
      },
      {
        text: '',
        value: 'show_metadata',
        align: 'end',
        width: '1',
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
      if (str.length > 20) {
        return `${str.substr(0, 10)}...${str.substr(str.length - 5, str.length)}`;
      }
      return str;
    };

    const toggleValue = (fieldName: string, spatialId: number, value?: boolean) => {
      let addFunc;
      let removeFunc;
      if (fieldName === 'show_footprint') {
        addFunc = addFootprint;
        removeFunc = removeFootprint;
      } else if (fieldName === 'show_overlay') {
        addFunc = addVisibleOverlay;
        removeFunc = removeVisibleOverlay;
      } else if (fieldName === 'show_metadata') {
        addFunc = selectResultForMetadataDrawer;
        removeFunc = clearMetaDataDrawer;
      }

      if (value && addFunc) {
        addFunc(spatialId);
      } else if (removeFunc) {
        removeFunc(spatialId);
      }

      if (!searchResults.value) return null;
      searchResults.value = searchResults.value.map(
        (entry) => {
          if (entry.spatial_id === spatialId) {
            return { ...entry, [fieldName]: value };
          }
          return entry;
        },
      );

      return null;
    };

    const getFocusedData = async (
      item: { spatial_id: number; subentry_name: string },
    ) => {
      focusedData.value.bandsList = [];
      focusedData.value.images = [];
      focusedData.value.spatialId = item.spatial_id;
      const res = await imageryBands(item.spatial_id);
      focusedData.value.title = item.subentry_name;
      Object.keys(res.data).forEach((key) => {
        if (res.data[key].interpretation) {
          focusedData.value.bandsList.push({ index: key, bandName: res.data[key].interpretation });
        }
      });
      const result = await rgdImagery(item.spatial_id);
      result.parent_raster.image_set.images.forEach(
        (element: { file: { id: string; name: string }; id: string }) => {
          focusedData.value.images.push({ id: element.id, name: element.file.name });
        },
      );
    };

    return {
      props,
      searchResults,
      ...toRefs(tableOptions),
      headers,
      ellipsisText,
      toggleValue,
      searchResultsTotal,
      itemsPerPageOptions,
      getFocusedData,
      focusedData,
      focusFlag,
      updateSites,
      selectedTab,
    };
  },
});

</script>

<template>
  <div>
    <FilterMenu />
    <div
      class="subtitle-1 ml-5"
    >
      Set Time Slider Range
    </div>
    <TimeSliderRange />
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
      <template #item.show_overlay="{item}">
        <v-simple-checkbox
          v-if="item.subentry_type === 'RasterMeta'"
          v-ripple
          dark
          off-icon="mdi-eye-off"
          on-icon="mdi-eye"
          :value="item.show_overlay"
          style="padding: 0;"
          @input="(value) => toggleValue('show_overlay', item.spatial_id, value)"
        />
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.id-name="{item}">
        <div
          style="max-width: 10vw;"
          @click="getFocusedData(item),
                  focusFlag=true,
                  toggleValue(
                    'show_overlay',
                    item.spatial_id, true
                  )"
        >
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
          @input="(value) => toggleValue('show_footprint', item.spatial_id || item.id, value)"
        />
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.show_metadata="{item}">
        <v-simple-checkbox
          v-ripple
          dark
          off-icon="mdi-chevron-right"
          on-icon="mdi-chevron-left"
          :value="item.show_metadata"
          @input="(value) => toggleValue('show_metadata', item.spatial_id || item.id, value)"
        />
      </template>
    </v-data-table>
    <FocusedData
      v-if="focusFlag"
      :focused-data="focusedData"
    />
  </div>
</template>

<style>
.data-type-icon {
  max-height: 25px;
  filter: invert(100%);
}

td {
  padding: 0px 5px!important;
}
</style>
