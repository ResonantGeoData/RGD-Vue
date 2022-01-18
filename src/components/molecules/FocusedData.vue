<script lang="ts">

import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'FocusedData',
  props: {
    imageList: {
      type: Array,
    },
    bandsList: {
      type: Array,
    },
    rasterTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const bandSelection = ref();
    const imageSelection = ref();
    const opacity = ref(1);

    return {
      bandSelection,
      imageSelection,
      opacity,
    };
  },

});

</script>

<template>
  <v-card>
    <v-card-title>
      {{ rasterTitle }}
    </v-card-title>
    <v-row
      justify="center"
    >
      <v-col
        cols="10"
      >
        <v-select
          v-if="imageList"
          v-model="imageSelection"
          label="Image"
          clearable
          :items="imageList"
          :item-value="'id'"
          :item-text="'name'"
          item-disabled="disabled"
          return-object
          outlined
        />
        <v-select
          v-if="bandsList && bandsList.length !==0"
          v-model="bandSelection"
          label="Bands"
          clearable
          :items.sync="bandsList"
          outlined
        />
        <v-slider
          v-model="opacity"
          label="Opacity"
          :step=".1"
          min="0"
          max="1"
          thumb-label
          track-color="#8EC13F"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
