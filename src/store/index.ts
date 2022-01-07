import { ref } from '@vue/composition-api';
import { rgdFootprint } from '@/api/rest';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const footPrints = ref([]);

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

export const getFootPrint = async (spatialId: number) => {
  const res = await rgdFootprint(spatialId);
  footPrints.value.push(res.data);
};

export const removeFootPrint = (spatialId: number) => {
  footPrints.value = footPrints.value.filter((entry) => entry.spatial_id !== spatialId);
};
