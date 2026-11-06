function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function strictText(value: string, max = 16384): void {
  if (typeof value !== 'string') throw new TypeError('Expected string');
  if (value.length > max) throw new RangeError('Text length budget exceeded');
}
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
export function expandIntervals(
  phases: readonly IntervalPhase[],
  repetitions = 1,
): TimedInterval[] {
  if (!Array.isArray(phases) || !phases.length || phases.length > 1000)
    throw new RangeError('Phase count');
  integer(repetitions, 1, 1000);
  if (phases.length * repetitions > 10000) throw new RangeError('Output budget');
  for (const p of phases) {
    if (!p) throw new TypeError('Expected phase');
    strictText(p.label, 100);
    if (!p.label) throw new RangeError('Empty phase label');
    finite(p.durationSeconds, Number.MIN_VALUE, 86400);
  }
  const out: TimedInterval[] = [];
  let elapsed = 0;
  for (let r = 1; r <= repetitions; r++)
    for (const p of phases) {
      const end = finite(elapsed + p.durationSeconds);
      if (end <= elapsed) throw new RangeError('Duration lost to rounding');
      out.push({
        index: out.length,
        label: p.label,
        startSeconds: elapsed,
        endSeconds: end,
        repetition: r,
      });
      elapsed = end;
    }
  return out;
}
export function locateInterval(
  plan: readonly TimedInterval[],
  elapsedSeconds: number,
): number | null {
  finite(elapsedSeconds, 0);
  if (!Array.isArray(plan) || !plan.length || plan.length > 10000)
    throw new RangeError('Plan count');
  let end = 0,
    found: number | null = null;
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    if (!p || p.index !== i || p.startSeconds !== end)
      throw new RangeError('Contiguous indexed plan required');
    finite(p.endSeconds, 0);
    if (p.endSeconds <= end) throw new RangeError('Positive interval required');
    if (elapsedSeconds >= end && elapsedSeconds < p.endSeconds) found = i;
    end = p.endSeconds;
  }
  return found;
}
