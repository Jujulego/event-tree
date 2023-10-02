import { Listener, Observable as Obs, OffFn } from './defs/index.js';
import { off$ } from './off.js';

// Utils
/**
 * Merges 2 or more observables into one, emitting each events incoming from every given sources.
 */
export function merge$<A, B>(a: Obs<A>, b: Obs<B>): Obs<A | B>;
export function merge$<A, B, C>(a: Obs<A>, b: Obs<B>, c: Obs<C>): Obs<A | B | C>;
export function merge$<A, B, C, D>(a: Obs<A>, b: Obs<B>, c: Obs<C>, d: Obs<D>): Obs<A | B | C | D>;
export function merge$<A, B, C, D, E>(a: Obs<A>, b: Obs<B>, c: Obs<C>, d: Obs<D>, e: Obs<E>): Obs<A | B | C | D | E>;
export function merge$(...observables: Obs[]): Obs;

export function merge$(...observables: Obs[]): Obs {
  return {
    subscribe(listener: Listener): OffFn {
      const off = off$();

      for (const src of observables) {
        off.add(src.subscribe(listener));
      }

      return off;
    },
    unsubscribe(listener: Listener): void {
      for (const src of observables) {
        src.unsubscribe(listener);
      }
    },
    clear() {
      for (const src of observables) {
        src.clear();
      }
    }
  };
}
