<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { searchResults } from '@/store';
import type { DataOptions } from 'vuetify';

export default defineComponent({
  name: 'Results',

  setup() {
    const tableOptions = reactive({
      page: 1,
      sortBy: ['spatial_id'],
      sortDesc: [true],
    } as DataOptions);

    const headers = [
      { text: 'ID - Name', value: 'id-name' },
      {
        text: 'Data Type', value: 'subentry_type', align: 'end', width: 1,
      },
    ];

    const baseLink = `${process.env.VUE_APP_API_ROOT}rgd/spatial_entries/`;

    const ellipsisText = (str: string) => {
      if (str.length > 15) {
        return `${str.substr(0, 10)}...${str.substr(str.length - 5, str.length)}`;
      }
      return str;
    };

    return {
      searchResults,
      tableOptions,
      headers,
      baseLink,
      ellipsisText,
    };
  },
});

</script>

<template>
  <v-data-table
    :headers="headers"
    :items="searchResults"
    class="resultsTable"
    calculate-widths
  >
    <!-- eslint-disable-next-line -->
     <template #item.id-name="{item}">
      <div
        style="max-width: 15vw;"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <a
              :href="`${baseLink}${item.spatial_id}`"
              v-bind="attrs"
              v-on="on"
            >
              {{ item.spatial_id }}
              {{ item.subentry_name ? ` - ${ellipsisText(item.subentry_name)}` : '' }}
            </a>
          </template>
          <span>
            View {{ item.spatial_id }}
            {{ item.subentry_name ? ` - ${ellipsisText(item.subentry_name)}` : '' }}
          </span>
        </v-tooltip>
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
  </v-data-table>
</template>

<style scoped>
.data-type-icon {
  max-height: 25px;
  filter: invert(100%);
}
</style>
