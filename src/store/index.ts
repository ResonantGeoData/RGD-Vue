import { ref } from '@vue/composition-api';
import { rgdFootprint, rgdImagery, rgdSearch } from '@/api/rest';
import {
  GeoJsonShape, RGDResult, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const rasterArray = ref();

export const footprints = ref();

export const footprintFlag = ref(false);

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

export const addFootPrint = async (spatialId: number) => {
  const res = await rgdFootprint(spatialId);

  if (footprints.value === undefined) {
    footprints.value = [];
  }

  footprints.value.push(res.data);
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

const footprintFlagToggle = () => {
  if (footprintFlag.value === true) {
    footprintFlag.value = false;
  } else {
    footprintFlag.value = true;
  }
};

export const updateFootPrints = async () => {
  const resArray: any[] = [];
  const promiseList: Promise<unknown>[] = [];
  const getFootPrints = async (current: { spatial_id: number }) => {
    const res = await rgdFootprint(current.spatial_id);
    resArray.push(res.data.footprint);
    footprints.value = resArray;
  };
  if (searchResults.value) {
    for (let i = 0; i < searchResults.value?.length; i += 1) {
      const currentRequest = searchResults.value[i];
      promiseList.push(getFootPrints(currentRequest));
    }
  }
  await Promise.all(promiseList);
  footprintFlagToggle();
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
  // updateFootPrints();
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
