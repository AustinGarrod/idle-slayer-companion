// Design-system build stub for src/pwa.ts. Designs never register a service
// worker; the status is a fixed, online, offline-ready snapshot.
import type { PwaStatus } from '../../src/pwa'
export type { PwaStatus } from '../../src/pwa'

const status: PwaStatus = { offline: 'ready', online: true, installed: false, canInstall: true, update: false, message: '' }
export const usePwaStatus = () => status
export function initializePwa() {}
export async function promptInstall() {}
export async function checkForUpdate() {}
export function prepareUpdate(): boolean { return false }
export async function repairOffline(): Promise<boolean> { return false }
