import { ref } from '@vue/composition-api';
import { GeoJsonShape } from './types';

export const useMap = ref(false);

export const geoShape = ref<GeoJsonShape>({ type: '', coordinates: [] });
