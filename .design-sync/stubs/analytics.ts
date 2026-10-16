// Design-system build stub for src/analytics.ts. Designs and preview cards must
// never load Umami or transmit events, so every runtime export is inert.
import type { AnalyticsTrackEvent } from '../../src/analytics-contract'
export type { AnalyticsEventName, AnalyticsOperation, AnalyticsProperties, AnalyticsTrackEvent } from '../../src/analytics-contract'
export { analyticsPosition } from '../../src/analytics-contract'
export type { AnalyticsContext, TrackingStatus } from '../../src/analytics'

const status = { enabled: false, reason: 'Usage analytics is off in design previews.', active: false, preference: 'disabled' as const }
export const initializeAnalytics = () => {}
export const updateAnalyticsContext = () => {}
export const trackEvent: AnalyticsTrackEvent = () => {}
export const getTrackingStatus = () => status
export const setTrackingPreference = () => status
