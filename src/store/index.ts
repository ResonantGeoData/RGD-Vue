import Vue from 'vue';
import VueCompositionAPI, { ref } from '@vue/composition-api';
import { GeoJsonShape } from './types';

Vue.use(VueCompositionAPI);

export const useMap = ref(false);

export const geoShape = ref<GeoJsonShape>({ type: '', coordinates: [] });
