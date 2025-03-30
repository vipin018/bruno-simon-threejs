import { type FC, type HTMLAttributes } from 'react';
import type { PerfProps } from '../types';
export declare let matriceWorldCount: {
    value: number;
};
export declare let matriceCount: {
    value: number;
};
export interface Props extends HTMLAttributes<HTMLDivElement> {
}
/**
 * Performance profiler component
 */
export declare const PerfHeadless: FC<PerfProps>;
