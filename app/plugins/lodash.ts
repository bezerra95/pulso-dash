import {
  debounce,
  throttle,
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

export default defineNuxtPlugin(() => {
  return {
    provide: {
      _: {
        debounce,
        throttle,
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
      },
    },
  }
})
