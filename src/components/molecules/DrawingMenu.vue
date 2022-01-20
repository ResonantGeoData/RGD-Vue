<script lang="ts">

import { defineComponent, reactive } from '@vue/composition-api';

export default defineComponent({
  name: 'DrawingMenu',
  props: {
    text: {
      type: String,
      required: false,
    },
  },
  inheritAttrs: false,
});

</script>

<template>
    <v-toolbar dense rounded floating>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon small>mdi-cursor-default-outline</v-icon>
          </v-btn></template>
        <span>Exit Draw Mode</span></v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        <v-icon small>mdi-vector-square-edit</v-icon>
      </v-btn></template>
        <span>Draw Polygon</span></v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-trash-can-outline</v-icon>
        </v-btn></template>
        <span>Delete Polygon</span></v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon small>mdi-vector-polygon</v-icon>
          </v-btn></template>
        <span>Toggle Search Polygon</span></v-tooltip>

      <v-tooltip bottom>
       <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-content-copy</v-icon>
        </v-btn></template>
       <span>Copy GeoJSON to Clipboard</span></v-tooltip>

    </v-toolbar>
</template>

<style scoped>
  .v-toolbar {
    width: 50%;
    align: center
  }
</style>
