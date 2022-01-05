import { ref } from '@vue/composition-api';
import { rgdFootprint } from '@/api/rest';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const footPrints = ref();

export const geoInputShape = ref();

export const geoShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

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

export const getFootPrints = async () => {
  const resArray: any[] = [];
  // eslint-disable-next-line no-unused-expressions
  searchResults.value?.forEach(async (element) => {
    const res = await rgdFootprint(element.spatial_id);
    resArray.push(res.data);
  });
  footPrints.value = resArray;
};
