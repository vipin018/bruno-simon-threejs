import { type FC } from 'react';
import * as THREE from 'three';
import type { PerfUIProps } from '../types';
export interface graphData {
    curve: THREE.SplineCurve;
    maxVal: number;
    element: string;
}
export declare const ChartUI: FC<PerfUIProps>;
