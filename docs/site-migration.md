# Companion repository and Pages migration

This implementation prepares a migration without changing GitHub repositories, DNS, Pages settings, or production files. The current remote is `AustinGarrod/idle-slayer-ascension-map`; the target is `AustinGarrod/idle-slayer-companion`. The application base is already `/idle-slayer-companion/`.

## Why a same-origin bridge is required

GitHub documents that repository renames redirect source/issue links but exclude project-site URLs; reusing the old repository name removes those repository redirects. [GitHub rename guidance](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository). Do not recreate a source repository named `idle-slayer-ascension-map`: that would consume the redirect used by old source/issue links. The proposed compatibility host is the same account's user-site repository, `AustinGarrod/AustinGarrod.github.io`, serving both paths during migration:

- `/idle-slayer-companion/`: the staged complete new release.
- `/idle-slayer-ascension-map/`: a minimal compatibility launcher and read-only offline map/export fallback.

Same-origin local storage remains readable in the same browser partition. The wrapper's legacy baseline and the workspace's goals baseline protect old/new tabs. No storage key is renamed destructively. The manifest keeps the stable ID `/idle-slayer-ascension-map/` while its start URL and scope use the new path. Physical browser/OS installation continuity is not yet verified.

## Generate and validate locally on Windows

```powershell
Set-Location C:\Users\Austin\Repos\idle-slayer-ascension-map
yarn install --immutable
yarn validate:catalog
yarn typecheck
yarn test
yarn test:tools
yarn build
yarn prepare:migration
yarn playwright install chromium
yarn test:e2e
yarn check:release
```

`prepare:migration` validates the complete `dist` release and writes only `.cache/site-migration`. It refuses linked/escaped output targets. The result is suitable for review as a user-site static artifact; it includes `.nojekyll` and needs no backend or analytics on the old launcher. The old worker has a distinct scope and cache prefix, so neither worker can delete the other's release cache. Existing active workers still wait for old windows to close.

The bridge forwards only bounded map/layout transfer fragments, public upgrade references, and the disabled analytics marker. It removes arbitrary query/fragment data at the old address and starts no telemetry. Offline, it reads the validated current Companion document or the legacy map profile, renders only currently visible tree facts, and exports without writing storage. Invalid storage stays untouched and receives recovery guidance.

## Ordered rollout, after release review

1. Keep project deployment disabled: the source workflow publishes only when the repository variable `PAGES_DEPLOY_ENABLED` is `true`. Preserve a copy of the prior reviewed static release and existing Pages settings for rollback. Inspect whether `AustinGarrod.github.io` already exists or has content before creating or changing it; preserve unrelated user-site files and workflows.
2. Stage the generated compatibility site through the user-site repository's reviewed Pages workflow. Retain the complete new path there before renaming the source repository. Do not place private input, raw exports, saves, or development tooling in either artifact.
3. After the complete new path is served by the user site, disable the existing **project Pages site** before renaming the repository. The workflow variable alone only blocks future deployments; it does not disable a previously published site. Manually confirm that both paths are now served by the staged user-site artifact, including old-address forwarding, recognized private/public fragments, license links, and ordinary saved-state continuity. If either path fails, stop the rename and restore the prior Pages settings. Keep automated checks on the local artifact or isolated CI only.
4. Rename the source repository to `idle-slayer-companion`, update its remote URL, and verify the old source/issue redirect. Do not rename the existing local/Mac directory as incidental cleanup. Keep project Pages disabled until a deployment of the reviewed new-base artifact is ready. Reconfigure it deliberately and enable `PAGES_DEPLOY_ENABLED` only for that cutover. Do not let the previous project artifact reappear under the new path; the staged user-site copies must be manually confirmed throughout the transition.
5. Manually inspect the project deployment and old bridge after cutover. Keep the same-origin fallback and the staged complete release until installation/update continuity is established. No automatic migration deletes browser data or user documents.

Example remote update **after a confirmed GitHub rename**:

```powershell
git remote set-url origin https://github.com/AustinGarrod/idle-slayer-companion.git
git remote -v
```

## Rollback

Disable project deployment, restore the prior reviewed static release only at `/idle-slayer-ascension-map/` through the user site, and retain both same-origin data documents. Never publish that old-base artifact at `/idle-slayer-companion/`: its absolute asset paths point to the old address. Keep the staged current Companion at the new path while disabling its project site. Do not roll back by clearing storage or rewriting Companion progress into the legacy key. Older map code cannot represent the new modules. Keep Companion JSON and intentions exports available through the staged site or bridge, and preserve repository redirects. Reversing the repository rename is a deliberate operator action; first inspect which name owns each redirect and Pages path.

This change has not performed any of the remote rollout steps. Local/CI success does not establish deployment, manual production readback, analytics ingestion, or physical installation behavior.
