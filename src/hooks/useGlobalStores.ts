import { useViewport } from './../store/viewport';
import { useRAF } from './../store/raf';

export function useGlobalStores() {
  useViewport()
  useRAF()
}