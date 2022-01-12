<script lang="ts">
import {
  defineComponent, ref, watch,
} from '@vue/composition-api';
import {
  drawnShape,
  searchResults,
  createRasterArray,
  geoJsonShape,
  specifiedShape,
  updateResults,
} from '@/store';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';
import Results from './Results.vue';
import Predicate from '../atoms/Predicate.vue';
import DateRange from '../atoms/DateRange.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
    TabToolBar,
    GeoJsonForm,
    BoundingBoxForm,
    LatLongForm,
    Predicate,
    DateRange,
    Results,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const reveal = ref(false);
    const buttonText = ref('Show Results');
    const cardTitle = ref('Search');
    const toggle = () => {
      if (reveal.value) {
        reveal.value = false;
        buttonText.value = 'Show Results';
        cardTitle.value = 'Search';
        return;
      }
      reveal.value = true;
      buttonText.value = 'Back to Search';
      cardTitle.value = 'Results';
    };
    watch(drawnShape, () => {
      if (drawnShape.value.type) {
        geoJsonShape.value = JSON.stringify(drawnShape.value);
      }
    }, { deep: true });
    watch(specifiedShape, () => {
      if (specifiedShape.value.type) {
        geoJsonShape.value = JSON.stringify(specifiedShape.value);
      }
    }, { deep: true });
    watch(searchResults, (newList, oldList) => {
      if (oldList === undefined && newList && newList.length > 0) {
        toggle();
      }
    });
    return {
      searchResults,
      updateResults,
      toggle,
      buttonText,
      reveal,
      cardTitle,
      createRasterArray,
    };
  },
});
</script>
<template>
  <v-card
    color="blue-grey darken-4"
    height="calc(100vh - 48px)"
    style="z-index: 2"
  >
    <v-card-title
      class="blue-grey darken-2 text-uppercase"
    >
      {{ cardTitle }}
      <v-spacer />
      <v-btn
        v-if="searchResults"
        right
        color="#188DC8"
        outlined
        @click="toggle"
      >
        <div
          class="white--text"
        >
          <v-icon
            v-if="reveal"
            left
          >
            mdi-arrow-left
          </v-icon>
          {{ buttonText }}
        </div>
      </v-btn>
    </v-card-title>
    <Results
      v-if="reveal"
    />
    <v-form
      v-if="!reveal"
      @submit.prevent="updateResults().then(createRasterArray)"
    >
      <v-card-subtitle>
        Specify search area
      </v-card-subtitle>
      <GeoJsonForm />
      <template>
        <v-card-subtitle>
          Apply search logic
        </v-card-subtitle>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            cols="11"
          >
            <Predicate />
            <div>
              Acquired date range
            </div>
            <DateRange />
          </v-col>
        </v-row>
      </template>

      <v-row
        no-gutters
        justify="center"
      >
        <v-col
          cols="11"
        >
          <v-btn
            color="#188DC8"
            block
            x-large
            type="submit"
            class="mt-3"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
