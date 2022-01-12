import { ref } from '@vue/composition-api';
import { rgdImagery, rgdSearch } from '@/api/rest';
import {
  GeoJsonShape, RGDResult, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const rasterArray = ref();

export const footprintIds = ref();

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const searchResults = ref<RGDResultList>();

export const searchLimit = ref<number>(10);

export const searchOffset = ref<number>(0);

export const searchResultsTotal = ref<number>();

export const searchInstrumentation = ref<string|null>('');

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

export const addFootPrint = (spatialId: number) => {
  if (footprintIds.value === undefined) {
    footprintIds.value = [];
  }
  footprintIds.value.push(spatialId);
};

export const removeFootPrint = (spatialId: number) => {
  footprintIds.value = footprintIds.value.filter((obj: number) => obj !== spatialId);
};

export const addRasterOverlay = (spatialId: number) => {
  // TODO
};

export const removeRasterOverlay = (spatialId: number) => {
  // TODO
};

export const updateResults = async () => {
  const res = await rgdSearch(
    searchLimit.value,
    searchOffset.value,
    geoJsonShape.value,
    searchParameters.value.predicate,
    searchParameters.value.acquired.startDate,
    searchParameters.value.acquired.endDate,
    resultsFilter.value.distance.min,
    resultsFilter.value.distance.max,
    resultsFilter.value.instrumentation,
    resultsFilter.value.time.startTime,
    resultsFilter.value.time.endTime,

  );
  searchResults.value = res.data.results;
  searchResultsTotal.value = res.data.count;
};

export const createRasterArray = async () => {
  // const resArr: any[] = [];
  // const getRasterImagery = async (current: { spatial_id: number }) => {
  //   const res = await rgdImagery(current.spatial_id);
  //   resArr.push(res.data);
  //   rasterArray.value = resArr;
  // };
  // if (searchResults.value) {
  //   for (let i = 0; i < searchResults.value?.length; i += 1) {
  //     const currentRequest = searchResults.value[i];
  //     getRasterImagery(currentRequest);
  //   }
  // }
};
