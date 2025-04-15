declare class PrayTimes {
  constructor(method?: string);
  // Add other method signatures as needed
  getTimes(date: Date, coords: number[], timezone?: number, dst?: number, format?: string): any;
  // Add other methods you use...
}

export default PrayTimes;