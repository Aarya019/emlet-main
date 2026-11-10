/** How a tool's finding is shown: good = nothing to do, info = worth knowing, warn = check it, bad = fix it. */
export type Severity = 'good' | 'info' | 'warn' | 'bad';

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
}
