import {
  debounce as _debounce,
  throttle as _throttle,
  cloneDeep,
  groupBy,
  sortBy,
  uniqBy,
  pick,
  omit,
  chunk,
  flattenDeep,
  merge,
  isEqual,
  isEmpty,
  orderBy,
  keyBy,
  mapValues,
} from 'lodash-es'
import type { DebouncedFunc } from 'lodash'

export const useLodash = () => {
  // ─── Rate Control ─────────────────────────────────────────────────────────

  const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    wait = 300
  ): DebouncedFunc<T> => _debounce(fn, wait)

  const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    wait = 300
  ): DebouncedFunc<T> => _throttle(fn, wait)

  // ─── Cloning & Merging ────────────────────────────────────────────────────

  const deepClone = <T>(value: T): T => cloneDeep(value)

  const deepMerge = <TObject extends object, TSource extends object>(
    target: TObject,
    ...sources: TSource[]
  ): TObject & TSource => merge(target, ...sources) as TObject & TSource

  // ─── Comparison ───────────────────────────────────────────────────────────

  const isDeepEqual = <T>(a: T, b: T): boolean => isEqual(a, b)

  const isEmptyValue = (value: unknown): boolean => isEmpty(value)

  // ─── Arrays ───────────────────────────────────────────────────────────────

  const groupByKey = <T>(
    collection: T[],
    key: keyof T
  ): Record<string, T[]> =>
    groupBy(collection, key) as Record<string, T[]>

  const orderByKeys = <T>(
    collection: T[],
    keys: Array<keyof T>,
    orders: Array<'asc' | 'desc'> = ['asc']
  ): T[] => orderBy(collection, keys as string[], orders)

  const sortByKey = <T>(
    collection: T[],
    key: keyof T | ((item: T) => unknown)
  ): T[] => sortBy(collection, key)

  const uniqByKey = <T>(
    collection: T[],
    key: keyof T | ((item: T) => unknown)
  ): T[] => uniqBy(collection, key)

  const chunkArray = <T>(collection: T[], size: number): T[][] =>
    chunk(collection, size)

  const flattenArray = <T>(collection: T[][]): T[] =>
    flattenDeep(collection) as T[]

  const keyByField = <T>(
    collection: T[],
    key: keyof T
  ): Record<string, T> => keyBy(collection, key) as Record<string, T>

  // ─── Objects ──────────────────────────────────────────────────────────────

  const pickKeys = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => pick(obj, keys)

  const omitKeys = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => omit(obj, keys)

  const transformValues = <T extends object, R>(
    obj: T,
    transform: (value: T[keyof T], key: string) => R
  ): Record<string, R> =>
    mapValues(obj, (value, key) =>
      transform(value as T[keyof T], key)
    ) as Record<string, R>

  return {
    debounce,
    throttle,
    deepClone,
    deepMerge,
    isDeepEqual,
    isEmptyValue,
    groupByKey,
    orderByKeys,
    sortByKey,
    uniqByKey,
    chunkArray,
    flattenArray,
    keyByField,
    pickKeys,
    omitKeys,
    transformValues,
  }
}
