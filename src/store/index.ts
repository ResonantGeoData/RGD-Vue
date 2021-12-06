import { ref } from '@vue/composition-api';
import { GeoJsonShape, RGDResultList } from './types';

export const useMap = ref(false);

export const geoShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const searchResults = ref<RGDResultList>();
