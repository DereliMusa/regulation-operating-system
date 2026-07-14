import type { DeviceClass, Regulation } from '../types/technical-file'

export const MDR_DEVICE_CLASSES: DeviceClass[] = ['I', 'IIa', 'IIb', 'III']
export const IVDR_DEVICE_CLASSES: DeviceClass[] = ['A', 'B', 'C', 'D']

export function deviceClassesFor(regulation: Regulation): DeviceClass[] {
  return regulation === 'MDR' ? MDR_DEVICE_CLASSES : IVDR_DEVICE_CLASSES
}
