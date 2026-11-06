# @lp-labs/interval-training-plan

Caller-defined interval timing and repeated phase expansion.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/interval-training-plan
```

## Working example

```js
import { expandIntervals, locateInterval } from '@lp-labs/interval-training-plan';
const plan = expandIntervals([{ label: 'phase', durationSeconds: 30 }], 2);
if (locateInterval(plan, 30) !== 1) throw new Error('Intervals');
```

CommonJS: `const api = require('@lp-labs/interval-training-plan')`.

## Behavior, customization and limits

expandIntervals(phases,repetitions=1) expands {label,durationSeconds} to index0-based,startSeconds,endSeconds,repetition1-based; durations positive<=86400, labels nonempty<=100chars, phases1..1000, repetitions1..1000, output<=10000. locateInterval(plan,elapsedSeconds) uses half-open intervals, returns index or null after end; validates contiguous plan from0 with increasing finite ends. No workouts, intensities or health recommendations supplied. Expansion/lookup O(entries), stateless.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface IntervalPhase {
  label: string;
  durationSeconds: number;
}
export interface TimedInterval {
  index: number;
  label: string;
  startSeconds: number;
  endSeconds: number;
  repetition: number;
}
export declare function expandIntervals(
  phases: readonly IntervalPhase[],
  repetitions?: number,
): TimedInterval[];
export declare function locateInterval(
  plan: readonly TimedInterval[],
  elapsedSeconds: number,
): number | null;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
