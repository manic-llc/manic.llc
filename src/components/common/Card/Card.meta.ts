export type CardProps = {
  padding?: number | number[];
  margin?: number | number[];
  gap?: number;
  transparent?: boolean;
  blur?: boolean;
  full?: boolean;
  title?: string;
  subtitle?: string;
  widget?: boolean;
  direction?: "row" | "column";
};

export const DefaultCardProps: CardProps = {
  padding: 1,
  margin: 0,
  gap: 0,
  transparent: false,
  blur: false,
  full: false,
  widget: false,
  direction: "column",
}