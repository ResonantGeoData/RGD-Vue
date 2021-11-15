export type GeoJsonShape = {
  type: string;
  coordinates: Array<Array<number>>;
}

export interface Parameters {
  predicate: string | null;
  distance: {
    min: number | null;
    max: number | null;
  };
  instrumentation: string | null;
  dateAndTime: {
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    startDateModal?: boolean;
    endDateModal?: boolean;
    startTimeModal?: boolean;
    endTimeModal?: boolean;
  };
}
