export type GeoJsonShape = {
  type: string;
  coordinates: Array<Array<number>>;
}

export type RGDResult = {
  spatial_id: number;
  acquisition_date: string | null;
  footprint: {
    type: string;
    coordinates: Array<Array<number>>;
  };
  instrumentation: string | null;
  outline: {
    type: string;
    coordinates: Array<Array<number>>;
  };
  subentry_type: string;
  subentry_name: string;
  show_footprint: boolean;
  show_overlay: boolean;
}

export type RGDResultList = Array<RGDResult>

export interface SearchParameters {
  predicate: string | null;
  acquired: {
    startDate: string | null;
    endDate: string | null;
    startDateModal?: boolean;
    endDateModal?: boolean;
  };
}

export interface ResultsFilter {
  distance: {
    min: string | null;
    max: string | null;
  };
  instrumentation: string | null;
  time: {
    startTime: string | null;
    endTime: string | null;
    startTimeModal?: boolean;
    endTimeModal?: boolean;
  };
}
