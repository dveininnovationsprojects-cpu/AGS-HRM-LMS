/* eslint-disable */
// Type shim for react-simple-maps (no official @types package)
declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, MouseEvent, SVGAttributes } from 'react';

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: object;
      hover?: object;
      pressed?: object;
    };
    [key: string]: any;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => ReactNode;
    [key: string]: any;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: (event: any) => void;
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event?: any) => void;
    style?: object;
    [key: string]: any;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      scale?: number;
      rotate?: [number, number, number];
      [key: string]: any;
    };
    width?: number;
    height?: number;
    style?: object;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    center?: [number, number];
    children?: ReactNode;
    [key: string]: any;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Sphere: ComponentType<any>;
  export const Graticule: ComponentType<any>;
  export const Line: ComponentType<any>;
  export const Annotation: ComponentType<any>;
}
