import { OffFn } from './defs';

// Types
export interface OffGroup extends OffFn {
  add(fn: OffFn): void;
}

// Utils
function isOffGroup(off: OffFn): off is OffGroup {
  return 'add' in off;
}

export function offGroup(...offs: OffFn[]): OffGroup {
  const fns = new Set<OffFn>(offs);
  
  // Create group
  const off = () => {
    for (const fn of fns) {
      fns.delete(fn);
      fn();
    }
  };
  
  const group = Object.assign(off, {
    add: (fn: OffFn) => {
      const has = fns.has(fn);

      fns.add(fn);

      if (!has && isOffGroup(fn)) {
        fn.add(group);
      }
    },
  });

  // Add group in other groups
  for (const fn of offs) {
    if (isOffGroup(fn)) {
      fn.add(group);
    }
  }

  return group;
}
