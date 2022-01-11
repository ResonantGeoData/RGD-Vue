declare module 'geojsonhint' {
  function hint(input: string): Array<{
    message: string;
    line: number;
  }>;
}
