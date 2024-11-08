export type Artboard = {
  width: number;
  height: number;
  dpr?: number;
};

export interface ArtBoardWithDomains extends Artboard {
  domainX?: (Date | number)[];
  domainY?: (Date | number)[];
  seconds?: number;
}

type Pair = [Date, Date] | [number, number];

export type Domain = Pair;
export type Range = Pair;

export interface DataVizProps extends ArtBoardWithDomains {
  transform: [number, number, number];
  rangeX: Range;
  rangeY: Range;
  domainX: Domain;
  domainY: Domain;
  scaleX: any;
  scaleY: any;
}
