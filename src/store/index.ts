import { ref } from '@vue/composition-api';
import { rgdFootprint, rgdImagery, rgdSearch } from '@/api/rest';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter, ImageryResult,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const rasterArray = ref();

export const footPrints = ref();

export const footPrintFlag = ref(false);

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawerContents = ref();

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

  if (footPrints.value === undefined) {
    footPrints.value = [];
  }

  footPrints.value.push(res.data);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeFootPrint = (_spatialId: number) => {
  // TODO
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addRasterOverlay = async (_spatialId: number) => {
  // TODO
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeRasterOverlay = (_spatialId: number) => {
  // TODO
};

export const selectResultForMetadataDrawer = (spatialId: number) => {
  if (searchResults.value) {
    searchResults.value = searchResults.value.map(
      // eslint-disable-next-line @typescript-eslint/camelcase
      (entry) => Object.assign(entry, { show_metadata: false }),
    );
  }
  // eslint-disable-next-line prefer-destructuring
  const metadata = rasterArray.value.filter(
    (imgData: ImageryResult) => imgData.spatial_id === spatialId,
  )[0];
  drawerContents.value = metadata;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearMetaDataDrawer = (_spatialId: number) => {
  drawerContents.value = undefined;
};

const footPrintFlagToggle = () => {
  if (footPrintFlag.value === true) {
    footPrintFlag.value = false;
  } else {
    footPrintFlag.value = true;
  }
};

export const updateFootPrints = async () => {
  const resArray: any[] = [];
  const promiseList: Promise<unknown>[] = [];
  const getFootPrints = async (current: { spatial_id: number }) => {
    const res = await rgdFootprint(current.spatial_id);
    resArray.push(res.data.footprint);
    footPrints.value = resArray;
  };
  if (searchResults.value) {
    for (let i = 0; i < searchResults.value?.length; i += 1) {
      const currentRequest = searchResults.value[i];
      promiseList.push(getFootPrints(currentRequest));
    }
  }
  await Promise.all(promiseList);
  footPrintFlagToggle();
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
  const resArr: ImageryResult[] = [];
  const getRasterImagery = async (current: { spatial_id: number }) => {
    const res = await rgdImagery(current.spatial_id);
    resArr.push(res.data);
    rasterArray.value = resArr;
  };
  if (searchResults.value) {
    for (let i = 0; i < searchResults.value?.length; i += 1) {
      const currentRequest = searchResults.value[i];
      getRasterImagery(currentRequest);
    }
  }
};
