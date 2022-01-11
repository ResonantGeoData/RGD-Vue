import { ref } from '@vue/composition-api';
import { rgdFootprint } from '@/api/rest';
import {
  GeoJsonShape, RGDResult, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const footPrints = ref <RGDResult[]>([]);

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const searchResults = ref<RGDResultList>();

export const searchParameters = ref<SearchParameters>({
  predicate: 'intersects',
  acquired: {
    startDate: null,
    endDate: null,
    startDateModal: false,
    endDateModal: false,
  },
});

export const resultsFilter = ref<ResultsFilter>({
  distance: {
    min: null,
    max: null,
  },
  instrumentation: null,
  time: {
    startTime: null,
    endTime: null,
    startTimeModal: false,
    endTimeModal: false,
  },
});

export const addFootPrint = async (spatialId: number) => {
  const res = await rgdFootprint(spatialId);
  footPrints.value.push(res.data);
};

export const removeFootPrint = (spatialId: number) => {
  // TODO
};

export const addRasterOverlay = async (spatialId: number) => {
  // TODO
};

export const removeRasterOverlay = (spatialId: number) => {
  // TODO
};
