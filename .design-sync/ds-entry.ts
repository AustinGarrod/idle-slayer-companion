// Design-system entry for claude.ai/design. Re-exports the Companion's reusable
// UI unchanged and ships deterministic sample data so designs can render real
// components without storage, a session or the network. Built by
// .design-sync/build-ds.mjs, which also aliases src/analytics and src/pwa to the
// inert stubs in .design-sync/stubs/.
import '@fontsource/press-start-2p/latin-400.css'
import '@xyflow/react/dist/style.css'
import '../src/index.css'
import '../src/CompanionShell.css'
import '../src/CompanionModules.css'
import '../src/SPCost.css'
import '../src/SearchPanel.css'
import '../src/RecentUpgrades.css'
import '../src/ForwardImpactPanel.css'

import catalogData from './.cache/ds-pkg/data/sample-catalog.json'
import companionData from './.cache/ds-pkg/data/sample-companion.json'
import wikiPriorityData from '../src/data/wiki-priorities.json'
import type { Catalog, Profile } from '../src/domain/types'
import { emptyProfile } from '../src/domain/types'
import type { CompanionEntity, CompanionProgress } from '../src/domain/companion-types'
import { emptyCompanionProgress, recordCompanionEntity } from '../src/domain/companion-progress'
import { upgradeState } from '../src/domain/discovery'
import { recommendUpgrades } from '../src/domain/recommendations'
import type { UpgradeRecommendations, WikiPriorityData } from '../src/domain/recommendations'
import { visibility } from '../src/domain/rules'

// Layout and navigation
export { CompanionShell, companionSections } from '../src/CompanionShell'
export type { CompanionSection, CompanionShellProps } from '../src/CompanionShell'
export { Dialog } from '../src/MapDialog'

// Companion modules and their building blocks
export { CompanionModules, CounterEditor, EntityCard, EntityIcon, ObservationSelect, ShoppingList, StatusPill, TrackingNotice } from '../src/CompanionModules'
export type { CompanionModulesProps, CompanionReferenceEntry, CompanionEntityPresentationState } from '../src/CompanionModules'

// Ascension map pieces
export { Icon, UpgradeCard, nodeTypes, edgeTypes } from '../src/UpgradeCard'
export type { UpgradeNode } from '../src/UpgradeCard'
export { ReactFlow, ReactFlowProvider, Background } from '@xyflow/react'
export { SPCost, ExactCostDetails } from '../src/SPCost'
export { ReadOnlyRequirement, RequirementView } from '../src/RequirementView'
export { UpgradeReference } from '../src/UpgradeReference'
export { RecentUpgrades } from '../src/RecentUpgrades'
export { RecommendationPanel } from '../src/RecommendationPanel'
export { SearchPanel } from '../src/SearchPanel'
export { GoalsPanel } from '../src/GoalsPanel'
export { ReferenceSheetPanel } from '../src/ReferenceSheetPanel'
export { SessionHistoryControls } from '../src/SessionHistoryControls'
export { PriorAscensionsForm } from '../src/PriorAscensionsForm'

// Settings and help panels
export { PrivacyPanel } from '../src/PrivacyPanel'
export { InstallPanel } from '../src/InstallPanel'
export { MapHelpPanel } from '../src/MapHelpPanel'

// Domain helpers that the components above take as inputs
export { emptyProfile, visibility, upgradeState, recommendUpgrades, emptyCompanionProgress }
export type { Catalog, Profile, CompanionEntity, CompanionProgress, UpgradeRecommendations }

/** The reviewed Ascension catalog (Idle Slayer 7.3.4), icons inlined as data URIs. */
export const sampleCatalog: Catalog = catalogData as unknown as Catalog

/** A fresh profile: nothing purchased, spoilers hidden. */
export const sampleEmptyProfile: Profile = emptyProfile(sampleCatalog.revision)

/** A deterministic early-run profile with the first reachable upgrades purchased. */
export const sampleProfile: Profile = (() => {
  const profile = emptyProfile(sampleCatalog.revision)
  for (let pass = 0; pass < 6 && Object.keys(profile.purchases).length < 14; pass++) {
    for (const node of sampleCatalog.upgrades) {
      if (Object.keys(profile.purchases).length >= 14) break
      if (upgradeState(node, profile) === 'available') profile.purchases[node.id] = { epoch: 0, active: node.activation === 'immediate' }
    }
  }
  return profile
})()

/** Upgrades revealed to sampleProfile (the shared visible graph). */
export const sampleVisibleUpgrades = visibility(sampleCatalog, sampleProfile).upgrades

/** The reviewed wiki priority order used by recommendations. */
export const sampleWikiPriorities = wikiPriorityData as unknown as WikiPriorityData

/** Recommendations for sampleProfile, ready for RecommendationPanel. */
export const sampleRecommendations: UpgradeRecommendations = recommendUpgrades(sampleCatalog, sampleProfile, sampleWikiPriorities)

/** A curated subset of the companion catalog (every system), icons inlined. */
export const sampleCompanionEntities: readonly CompanionEntity[] = (companionData as unknown as { entities: CompanionEntity[] }).entities

/** Companion progress with every system untracked. */
export const sampleEmptyCompanionProgress: CompanionProgress = emptyCompanionProgress(sampleCatalog.revision)

/** Companion progress with tracked systems and a few recorded observations. */
export const sampleCompanionProgress: CompanionProgress = (() => {
  let progress = emptyCompanionProgress(sampleCatalog.revision)
  for (const system of Object.keys(progress.modules) as (keyof CompanionProgress['modules'])[]) progress.modules[system].tracked = true
  const observedAt = '2026-01-01T00:00:00.000Z'
  const bySystem = (system: CompanionEntity['system']) => sampleCompanionEntities.filter((entity) => entity.system === system)
  bySystem('achievement').slice(0, 3).forEach((entity) => { progress = recordCompanionEntity(progress, 'achievement', entity.id, { completed: true }, observedAt) })
  bySystem('material').slice(0, 6).forEach((entity, index) => { progress = recordCompanionEntity(progress, 'material', entity.id, { discovered: true, count: String((index + 1) * 35) }, observedAt) })
  bySystem('craft').slice(0, 2).forEach((entity) => { progress = recordCompanionEntity(progress, 'craft', entity.id, { completed: true }, observedAt) })
  bySystem('enemy').slice(0, 4).forEach((entity, index) => { progress = recordCompanionEntity(progress, 'enemy', entity.id, { discovered: true, count: String(1200 * (index + 1)) }, observedAt) })
  bySystem('quest').slice(0, 2).forEach((entity) => { progress = recordCompanionEntity(progress, 'quest', entity.id, { completed: true, claimed: true }, observedAt) })
  bySystem('divinity').slice(0, 2).forEach((entity) => { progress = recordCompanionEntity(progress, 'divinity', entity.id, { selected: true }, observedAt) })
  return progress
})()
