import { expandIntervals, locateInterval } from '@lp-labs/interval-training-plan';
const plan = expandIntervals([{ label: 'phase', durationSeconds: 30 }], 2);
if (locateInterval(plan, 30) !== 1) throw new Error('Intervals');
// @ts-expect-error invalid argument must be rejected by declarations
expandIntervals([{ label: 'a', durationSeconds: '30' }]);
