---
title: Continuum Release Lifecycle and Runbook
status: current
---

# Continuum Release Lifecycle and Runbook

Status: canonical maintainer runbook
Audience: maintainers, release operators, repo stewards, automation authors
Scope: all Continuum repositories
Core rule: plan deliberately, publish immutably, verify publicly, learn immediately.

This runbook defines the standard Continuum release lifecycle. Individual
repositories may adapt commands, registries, documentation topology, deployment
targets, and workflow names through a repo-local release profile, but they should
not reinvent the release philosophy.

A release is not a version bump. A release is a promise made visible.

## 1. Release doctrine

A valid Continuum release has all of the following.

1. A reason.
   Planned releases must have a release thesis before implementation scope
   becomes active.
2. A bucket.
   Version-targeted work belongs in a GitHub milestone, not in version labels.
3. Honest scope.
   Must-ship, may-slip, and explicitly-not-included work must be recorded.
4. A reviewed source commit.
   The release tag must point at the exact main commit that passed release prep.
5. An immutable public tag.
   Public tags are not moved. Bad releases are fixed by patching forward.
6. Synchronized metadata.
   All declared version sources must agree.
7. Updated signposts.
   Changelog, front-door docs, architecture docs, operations docs, and maintainer
   docs must change when their truth changes.
8. Executable gates.
   Release law lives in scripts and workflows, not only in prose.
9. Publication from the tag.
   Packages, deployments, releases, and registry artifacts must be produced from
   the tagged source.
10. Post-publication verification.
    A release is not done when publishing succeeds. It is done when consumers can
    see and use it.
11. Evidence.
    The release must leave behind tag, commit, workflow, artifact, verification,
    and retrospective evidence.
12. Learning.
    Planned releases end with a retrospective and fallout issues. Do not rely on
    memory as the release improvement system.

## 2. Repository release profile

Every Continuum repo should declare its release mechanics in:

```text
.continuum/release.yml
```

The runbook defines the lifecycle. The profile defines how that lifecycle maps
onto a specific repository.

Example:

```yaml
schema: 1
repo:
  name: example-repo
  owner: Continuum
  primary_artifact: package
versioning:
  strategy: fixed
  tag_format: "v{version}"
  release_branch_format: "release/v{version}"
  milestone_format: "v{version}"
version_sources:
  - path: package.json
    type: json
    field: version
    required: true
  - path: package-lock.json
    type: npm-lock-root
    field: version
    required: true
  - path: jsr.json
    type: json
    field: version
    required: false
  - path: packages/*/package.json
    type: json
    field: version
    required: false
docs:
  changelog: CHANGELOG.md
  front_door: README.md
  architecture: ARCHITECTURE.md
  user_docs:
    - docs/topics/
  operator_docs:
    - docs/operations/
  contributor_docs:
    - .github/CONTRIBUTING.md
    - AGENTS.md
    - RELEASE.md
validation:
  prep: npm run release:prep
  preflight: npm run release:preflight
workflows:
  release_prep: release-prep.yml
  autotag: release-autotag.yml
  publish: release.yml
publish:
  manual_dispatch_required: false
  github_release: true
  registries:
    - name: npm
      package: "@continuum/example-repo"
      verify: "npm view @continuum/example-repo@{version} version --registry=https://registry.npmjs.org"
dist_tags:
  stable: latest
  prerelease:
    alpha: alpha
    beta: beta
    rc: next
  maintenance: "v{major}"
issue_axes:
  required:
    - type
    - priority
    - status
    - area
  optional:
    - risk
    - impact
```

Repo-local prose should be thin. The profile should carry the boring facts so
automation can enforce them.

## 3. Standard release lifecycle

Continuum releases move through this lifecycle:

```text
planned
  -> active
  -> release-prep
  -> merged
  -> tagged
  -> published
  -> verified
  -> retrospectived
  -> closed
```

### 3.1 planned

A release is planned when:

- a milestone exists;
- the release thesis exists;
- must-ship, may-slip, and not-included scope are recorded;
- two to five goalposts are defined;
- acceptance evidence is clear.

### 3.2 active

A release is active when:

- the milestone is the current version train;
- at least one scoped issue is in progress;
- exactly one slice, tracking issue, or workstream is marked `status:active`;
- priority labels reflect the real queue.

### 3.3 release-prep

A release enters prep when:

- implementation scope is reconciled;
- slipped work is moved or explicitly cut;
- version metadata is updated;
- release signposts are updated;
- release-prep validation passes locally or in CI;
- a release branch exists.

Branch format:

```text
release/vX.Y.Z
```

### 3.4 merged

A release is merged when:

- the release-prep PR has review approval;
- CI is green;
- release-prep validation has passed;
- the release branch is merged to main.

The merge commit is the candidate release commit.

### 3.5 tagged

A release is tagged when:

- the autotag workflow validates the merged commit;
- the expected tag does not already exist;
- final preflight passes from the aligned main commit;
- an annotated tag is created.

Tag format:

```text
vX.Y.Z
```

The tag must point at the exact main commit that passed release prep.

### 3.6 published

A release is published when:

- the release workflow checks out the tag commit;
- version metadata matches the tag;
- package, deployment, release, or registry artifacts are built from the tag;
- all configured registries, deployment targets, or release surfaces receive the
  artifact.

### 3.7 verified

A release is verified when:

- public artifact visibility is confirmed;
- install, import, CLI, service, docs, or deployment smoke checks pass;
- release evidence is captured.

### 3.8 retrospectived

A release is retrospectived when:

- released work is recorded;
- unreleased work is recorded;
- plan-versus-actual scope is recorded;
- repeatable wins are identified;
- improvements have concrete mitigations;
- fallout issues are filed.

### 3.9 closed

A release is closed when:

- the release milestone is closed;
- all scoped work is closed, moved, or explicitly cut;
- fallout issues are triaged;
- the next release thesis exists;
- the next active slice is selected.

## 4. Release types

Not every release deserves the same ceremony. Every release deserves discipline.

### 4.1 Planned release

Use for normal minor, major, and meaningful patch trains.

Requires:

- milestone;
- thesis;
- scoped issues;
- goalposts;
- full release-prep PR;
- full validation;
- publication evidence;
- retrospective.

### 4.2 Patch release

Use for compatible bug fixes, packaging fixes, documentation corrections tied to
current behavior, and narrow maintenance.

Requires:

- short patch thesis;
- changelog entry;
- version metadata update;
- validation;
- publication evidence;
- lightweight retrospective or release tracking issue update.

Patch releases should not become miscellaneous change buckets.

### 4.3 Emergency release

Use for urgent production, security, data-loss, broken-package, broken-deploy,
or severe operator-impacting fixes.

Allowed shortcuts:

- abbreviated planning;
- private tracking, where necessary;
- narrower review path;
- delayed public detail for security-sensitive issues.

Still required:

- immutable tag;
- validation proportional to risk;
- post-publication verification;
- retrospective after stabilization;
- fallout issues.

Emergency does not mean lawless. It means focused.

### 4.4 Security release

Use for vulnerability fixes or disclosure-managed releases.

Requires:

- private advisory or restricted tracking when appropriate;
- minimal exploit-enabling public notes before disclosure;
- clear patched versions;
- verification evidence;
- post-disclosure documentation update, if needed.

### 4.5 Prerelease

Use for alpha, beta, preview, or release-candidate artifacts.

Examples:

```text
1.4.0-alpha.1
1.4.0-beta.1
1.4.0-rc.1
```

Rules:

- prereleases must not publish to the stable dist-tag;
- prereleases must not update stable "latest release" signposts unless promoted;
- promotion to stable requires a normal release decision.

### 4.6 Docs-only release

Use only when the repository's public artifact includes docs or when docs are
versioned as part of the release surface.

Docs-only releases still need:

- changelog entry, if public consumers track versions;
- validation;
- verification of deployed or published documentation;
- clear note that runtime behavior did not change.

### 4.7 Internal operational release

Use for service repos, infrastructure repos, deployment bundles, configuration
repos, or internal tools.

The same lifecycle applies, but publication may mean:

- deployment;
- rollout;
- artifact promotion;
- image push;
- environment update;
- docs publication.

## 5. Version selection

Continuum repos use SemVer unless a repo profile explicitly declares another
strategy.

### 5.1 Patch

Use PATCH for:

- compatible bug fixes;
- packaging fixes;
- dependency updates without public behavior change;
- internal refactors with no public contract change;
- docs corrections that describe existing behavior;
- narrow operator workflow improvements that do not alter support boundaries.

Example:

```text
1.2.3 -> 1.2.4
```

### 5.2 Minor

Use MINOR for:

- new compatible capabilities;
- new public commands;
- new supported workflows;
- additive APIs;
- new configuration options with safe defaults;
- meaningful docs or operations additions accompanying new capability.

Example:

```text
1.2.3 -> 1.3.0
```

### 5.3 Major

Use MAJOR for breaking changes.

Breaking changes may include:

- public API removal or incompatible behavior;
- CLI flag removal, rename, or default change;
- output format changes consumed by scripts;
- storage format changes requiring migration;
- configuration format changes;
- runtime support boundary changes;
- deployment or operator contract changes;
- authentication, authorization, or permissions behavior changes;
- package entrypoint changes;
- data model changes that consumers must handle.

Example:

```text
1.2.3 -> 2.0.0
```

### 5.4 Prerelease

Use prerelease versions when consumers need early artifacts without stable
guarantees.

Examples:

```text
2.0.0-alpha.1
2.0.0-beta.1
2.0.0-rc.1
```

Prerelease artifacts publish to prerelease dist-tags or channels only.

## 6. Milestones, labels, and issue discipline

### 6.1 Milestones are release buckets

Use GitHub milestones for version targeting.

Good:

```text
v1.4.0
v1.4.1
v2.0.0
```

Bad:

```text
label: v1.4.0
label: release-1.4
label: next-version
```

Version labels rot. Milestones already do the job.

### 6.2 Labels are query axes

Standard live issue axes:

```text
type:*
priority:*
status:*
area:*
```

Optional axes:

```text
risk:*
impact:*
```

Every live issue should have exactly one label from each required axis.

Example:

```text
type:bug
priority:next
status:ready
area:release
```

### 6.3 Status labels

Recommended status labels:

- `status:triage`
- `status:ready`
- `status:active`
- `status:blocked`
- `status:review`
- `status:deferred`

Only one issue, slice, or tracking issue should be `status:active` for a given
active release train unless the repo explicitly supports parallel release
streams.

### 6.4 Priority labels

Recommended priority labels:

- `priority:asap`
- `priority:next`
- `priority:soon`
- `priority:later`

A release should not tag while unrelated open `priority:asap` issues exist
unless the release owner explicitly records why they do not block the release.

## 7. Release thesis

Every planned release must have a thesis before implementation work starts
against that milestone.

The thesis is one short paragraph that answers:

- Why does this release exist?
- What capability boundary is being advanced?
- Who benefits?
- What outcome should they see?
- What is explicitly outside this release?

Template:

```markdown
## Release thesis

This release advances <capability boundary> for <primary user/operator> by
<main outcome>. It focuses on <included scope> and deliberately excludes
<not included scope>, which remains in <future milestone/backlog/research>.
```

Example:

```markdown
This release advances repository release reliability for maintainers by making
tagging, publication, and verification repeatable across package repos. It
focuses on release metadata lockstep, automated tag creation, and release
evidence capture. It deliberately excludes full deployment orchestration for
service repos, which remains in the next operations milestone.
```

No thesis, no planned release.

## 8. Scope model

Each planned release records three scope buckets.

### 8.1 Must-ship

Work that defines the release. If this does not ship, the release should
probably not happen under that version.

```markdown
## Must-ship

- ...
```

### 8.2 May-slip

Valuable work that may move without invalidating the release thesis.

```markdown
## May-slip

- ...
```

### 8.3 Explicitly not included

Work that people might assume is included, but is not.

```markdown
## Explicitly not included

- ...
```

This bucket prevents confusion and scope creep.

## 9. Goalposts and acceptance evidence

A release should be broken into two to five goalposts.

Each goalpost should have observable acceptance evidence.

Template:

```markdown
## Goalposts

### Goalpost 1: <name>

Outcome:
Evidence:
Issues:

### Goalpost 2: <name>

Outcome:
Evidence:
Issues:
```

Good evidence:

- command output;
- test result;
- workflow run;
- screenshot;
- registry lookup;
- deployment SHA;
- documentation link;
- smoke test;
- closed issue;
- merged PR.

Bad evidence:

- seems fine;
- probably works;
- I checked it;
- subjective approval with no captured evidence.

## 10. Implementation phase

During implementation:

- work lands through normal PRs;
- docs change near the code that changes their truth;
- release notes candidates accumulate;
- milestone scope stays honest;
- blockers are marked explicitly;
- slipped work is moved deliberately;
- active work is limited.

Do not wait until release prep to discover what shipped.

## 11. Scope reconciliation before release prep

Before opening a release-prep branch, reconcile the milestone.

Run the previous-tag diff:

```bash
git fetch origin --tags
git diff --stat vPREVIOUS..HEAD
git diff --name-status vPREVIOUS..HEAD
git log --oneline vPREVIOUS..HEAD
```

Use the diff to answer:

- What behavior changed?
- What public API changed?
- What CLI behavior changed?
- What docs truth changed?
- What operator workflow changed?
- What architecture boundary changed?
- What dependency or package posture changed?
- What release tooling changed?
- What did we intend to ship but did not?
- What slipped?
- What accidentally expanded?

Then update:

- milestone issues;
- changelog;
- version metadata;
- front-door docs;
- architecture docs;
- user docs;
- operator docs;
- contributor docs;
- maintainer docs.

Do not rely on version bumping alone. Version numbers are labels, not
explanations.

## 12. Required release signposts

Every repo should define its release signposts in `.continuum/release.yml`.

Common signpost categories:

| Category | Typical file | Update when |
| --- | --- | --- |
| Changelog | `CHANGELOG.md` | Any public release happens. |
| Front door | `README.md` | Positioning, install, usage, latest release, or core promise changes. |
| Architecture | `ARCHITECTURE.md` | Boundaries, ports, adapters, storage, data flow, deployment shape, or runtime model changes. |
| User docs | `docs/topics/` | User-facing behavior changes. |
| Operator docs | `docs/operations/` | Release, deploy, rollback, migration, support, or incident workflow changes. |
| Contributor docs | `.github/CONTRIBUTING.md` | Contribution or review workflow changes. |
| Maintainer docs | `RELEASE.md`, `AGENTS.md` | Maintainer process, automation, or agent instructions change. |
| Migration docs | `docs/migrations/` | Users or operators must take action. |
| Security docs | `SECURITY.md` | Supported versions, disclosure, permissions, or threat model changes. |

Rule: update every signpost whose truth changes when diffing the previous
public tag against the release branch.

## 13. Release branch

Create release-prep branches from current main.

```bash
git checkout main
git pull --ff-only
git checkout -b release/vX.Y.Z
```

The release branch should contain only release-prep work unless the release
owner explicitly approves a late fix.

Allowed release-prep changes:

- version metadata;
- lockfiles;
- changelog;
- release notes;
- docs signposts;
- release guard updates;
- narrow fixes required to pass release validation.

Risky late feature work should go back through normal implementation flow.
Release prep is not a side door.

## 14. Release prep checklist

Before opening the release-prep PR, complete the checks below.

### 14.1 Metadata

Update all declared version sources.

Examples:

- `package.json`
- `package-lock.json`
- `jsr.json`
- `packages/*/package.json`
- `Cargo.toml`
- `Cargo.lock`
- `pyproject.toml`
- `uv.lock`
- `go.mod`
- `VERSION`
- `Chart.yaml`
- container metadata
- deployment manifests

### 14.2 Changelog

Add a dated entry:

```markdown
## [X.Y.Z] - YYYY-MM-DD
```

The changelog should summarize:

- added behavior;
- changed behavior;
- fixed behavior;
- removed behavior;
- migration notes;
- documentation changes;
- release tooling changes;
- dependency or security changes, when relevant.

### 14.3 Signposts

Update every signpost whose truth changed.

### 14.4 Scope

Confirm:

- all must-ship issues are closed or represented by the release-prep PR;
- may-slip issues either shipped or moved;
- explicitly-not-included work did not sneak in;
- prior milestones have no unresolved release-scoped issues;
- target milestone has no unresolved release-scoped issues except approved
  release operations.

Allowed open items in the target milestone before tagging:

- the release-prep PR;
- a release tracking issue, if it is the evidence container;
- approved release-operations issues.

Everything else should be closed, moved, or cut.

### 14.5 Local validation

Run the repo's prep command.

Generic:

```bash
continuum release prep
```

Repo-local example:

```bash
npm run release:prep
```

## 15. Release-prep PR

Open a normal PR to main.

Default title:

```text
release: vX.Y.Z
```

Default branch:

```text
release/vX.Y.Z
```

Do not open a draft PR for release prep unless the repo profile explicitly uses
drafts for release previews.

The PR body should include:

```markdown
## Release

Version: X.Y.Z
Previous tag: vPREVIOUS
Target tag: vX.Y.Z
Release type: planned | patch | emergency | security | prerelease | docs-only | operational
Publish channel/dist-tag: latest | next | beta | alpha | rc | vN

## Thesis

...

## Scope reconciliation

### Shipped

- ...

### Slipped

- ...

### Explicitly not included

- ...

## Signposts updated

- [ ] CHANGELOG.md
- [ ] README.md
- [ ] ARCHITECTURE.md
- [ ] User docs
- [ ] Operator docs
- [ ] Contributor/maintainer docs
- [ ] Not applicable items explained

## Validation

- [ ] release prep passes
- [ ] CI green
- [ ] docs/link checks pass
- [ ] package/deploy dry-run passes

## Publish notes

Manual actor required: yes/no
Registry/deployment targets:
- ...
```

CI should comment with a release preview:

- version;
- tag;
- release type;
- dist-tag or channel;
- previous tag;
- changed files;
- metadata sources;
- signposts touched;
- publish targets.

## 16. Merge and autotag

After review and green CI, merge the release-prep PR to main.

The autotag workflow runs on pushes to main.

It should proceed only when the pushed commit is associated with a merged
release-prep PR.

Valid release-prep detection may include:

- source branch matches `release/vX.Y.Z`;
- PR title matches `release: vX.Y.Z`;
- PR has a configured release-prep label;
- PR body contains a configured release marker.

Branch names are useful. They should not be the only line of defense.

The autotag workflow must:

1. read the version from the configured primary version source;
2. derive the expected tag;
3. verify the tag format;
4. skip if the tag already exists;
5. confirm the release-prep PR is merged into main;
6. confirm the commit matches `origin/main`;
7. run final release preflight from that commit;
8. create an annotated tag at that exact commit;
9. print the publish command.

Annotated tag format:

```bash
git tag -a vX.Y.Z -m "release: vX.Y.Z"
```

The tag must point at the exact commit that passed release prep.

Do not move public tags.

## 17. Final preflight

Final preflight is the release law.

It should include the repo's relevant checks.

### 17.1 Universal checks

- clean worktree;
- expected branch or ref alignment;
- tag format;
- version metadata lockstep;
- changelog entry exists;
- release signposts are valid;
- issue and milestone gates pass;
- no blocking urgent issues;
- no unresolved prior milestone scope;
- release profile is valid.

### 17.2 Code checks

- lint;
- format;
- typecheck;
- unit tests;
- integration tests;
- coverage threshold;
- build;
- artifact smoke test.

### 17.3 Docs checks

- Markdown lint;
- link check;
- generated docs up to date;
- docs topology check;
- examples compile or execute, where applicable.

### 17.4 Package checks

- package dry-run;
- package contents check;
- dependency audit;
- provenance or attestation readiness;
- registry publishability check.

### 17.5 Service/deployment checks

- image build;
- migration dry-run;
- config validation;
- deployment manifest validation;
- rollback plan exists;
- health check target exists.

## 18. Publication

Publishing must happen from the tag.

The release workflow must verify:

- input tag exists;
- checked-out source is the tag commit;
- tag version matches metadata;
- changelog entry matches version;
- tag commit is reachable from main;
- artifact is built from the tag source;
- dist-tag or channel matches release type;
- actor satisfies registry or deployment requirements.

Preferred dispatch:

```bash
gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z
```

Acceptable dispatch when workflow definitions must be loaded from main:

```bash
gh workflow run release.yml --ref main -f tag=vX.Y.Z
```

That fallback is acceptable only if the workflow explicitly checks out the input
tag and fails unless:

```text
HEAD == tag commit
metadata version == tag version
tag commit is reachable from origin/main
```

The release workflow may:

- publish packages;
- push images;
- deploy services;
- create or update a GitHub Release;
- attach artifacts;
- generate release notes;
- record provenance;
- print verification commands.

The release workflow must not:

- move a tag;
- rebuild a different artifact for an existing published version;
- silently change dist-tags;
- publish from untagged main;
- bypass failed gates.

## 19. Dist-tag and channel policy

Stable releases publish to the stable channel.

Common package policy:

```text
1.2.3         -> latest
1.3.0-beta.1 -> beta
1.3.0-rc.1   -> next
2.0.0-alpha.1 -> alpha
1.x maintenance -> v1
```

Rules:

- stable SemVer releases publish to `latest`;
- prereleases publish to prerelease tags only;
- maintenance releases for old majors publish to explicit maintenance tags;
- workflows must print intended dist-tag or channel before publication;
- workflows must fail if the version and dist-tag are inconsistent.

Examples:

```text
1.4.0-alpha.1 must not publish to latest.
1.4.0 must not publish to beta unless manually overridden with evidence.
1.3.7 for an old major may publish to v1 instead of latest.
```

## 20. Verification

Publication is not completion.

After publishing, verify public availability.

### 20.1 Package repo evidence

Examples:

```bash
npm view @scope/package@X.Y.Z version --registry=https://registry.npmjs.org
npm pack --dry-run
npm install @scope/package@X.Y.Z
```

Also verify, where relevant:

- CLI launches;
- import works;
- package exports resolve;
- types resolve;
- packed artifact contains expected files;
- GitHub Release exists;
- provenance or attestation is visible;
- registry metadata is correct.

### 20.2 JSR/npm dual registry evidence

Example:

```bash
npm view @scope/package@X.Y.Z version --registry=https://registry.npmjs.org
npm view @jsr/scope__package@X.Y.Z version --registry=https://npm.jsr.io
```

### 20.3 Service repo evidence

Verify:

- deployment SHA;
- environment;
- rollout status;
- migration status;
- health check;
- smoke test;
- error rate;
- logs;
- rollback readiness.

### 20.4 Docs repo evidence

Verify:

- deployed URL;
- changed canonical pages;
- redirects;
- link check;
- generated index or search, if applicable;
- examples still match current behavior.

### 20.5 Release evidence record

Record:

```yaml
release:
  version: X.Y.Z
  tag: vX.Y.Z
  commit: "<sha>"
  release_type: planned
  previous_tag: vPREVIOUS
  release_pr: "<url>"
  autotag_run: "<url>"
  publish_run: "<url>"
  github_release: "<url>"
artifacts:
  - type: npm
    package: "@scope/package"
    version: X.Y.Z
    evidence: "<npm view output or URL>"
  - type: jsr
    package: "@jsr/scope__package"
    version: X.Y.Z
    evidence: "<registry output or URL>"
verification:
  - name: install smoke
    result: passed
    evidence: "<command output or run URL>"
  - name: cli smoke
    result: passed
    evidence: "<command output or run URL>"
```

## 21. Idempotency

Release workflows must be safe to rerun for an existing public tag.

A rerun may:

- verify an already-published artifact;
- publish to a registry that did not receive the version;
- update GitHub Release notes for the same tag;
- rerun post-publish checks;
- attach missing release artifacts.

A rerun must not:

- move the tag;
- rebuild different contents for an already-published version;
- overwrite registry artifacts with different artifacts;
- silently change dist-tags or channels;
- publish from a different commit;
- hide partial failure.

For multi-registry releases, idempotency is not optional.

## 22. Failure handling

### 22.1 Tag exists, no registry published

Do not move the tag.

Fix the release workflow or registry issue, then rerun publication for the same
tag.

### 22.2 One registry published, another failed

Do not move the tag.

Fix the failing registry path and rerun the workflow. The workflow should detect
already-published registries and verify them rather than trying to republish
incompatible artifacts.

### 22.3 GitHub Release failed

Do not move the tag.

Rerun the GitHub Release creation or update step for the same tag.

### 22.4 Published artifact is bad

Do not move the tag.

Cut a new patch release from main.

Optional, depending on registry policy:

- deprecate bad package version;
- yank only when safe and appropriate;
- mark GitHub Release with a warning;
- publish advisory;
- open incident or fallout issue.

### 22.5 Wrong commit tagged but not public

If the tag has not left the local machine, fix it locally.

If the tag has been pushed to a shared remote, treat it as public unless
maintainers explicitly prove no external consumer could observe it. In almost all
cases, patch forward.

### 22.6 Wrong commit tagged and public

Do not move the tag.

Cut the next patch version from main.

### 22.7 Credentials, identity, or provenance failure

Stop publication.

Fix identity, permissions, token, OIDC, provenance, or registry scope
membership. Rerun from the same tag.

### 22.8 Security issue discovered during release

Stop normal release flow.

Switch to security release handling. Restrict detail, patch deliberately, and
record public notes only when disclosure policy allows.

## 23. Manual fallback

Manual tagging is allowed only when autotag cannot run.

Manual tagging must not bypass failed gates.

From clean, fetched, aligned main:

```bash
git checkout main
git pull --ff-only
git fetch origin --tags
continuum release preflight
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin vX.Y.Z
```

Repo-local example:

```bash
npm run release:preflight
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin vX.Y.Z
```

After manual tagging, publish through the normal release workflow.

Manual fallback is a recovery path, not a bypass.

## 24. Retrospective

Run the retrospective immediately after:

- tag exists;
- GitHub Release exists, if applicable;
- registry or deployment publication is complete;
- visibility checks pass;
- smoke checks pass.

Do not start the next planned release train until the retrospective exists.

Template:

```markdown
# Release retrospective: vX.Y.Z

Date:
Release type:
Release thesis:
Tag:
Commit:
Release PR:
Autotag run:
Publish run:
GitHub Release:

## Released

User-facing behavior:
Runtime/API changes:
Docs changes:
Release tooling changes:
Dependency changes:
Registry/deployment evidence:

## Not released

Planned items moved forward:
Blocked items:
Intentional cuts:
Accidental omissions:

## Plan versus actual

Shipped as planned:
Slipped:
Expanded:
Changed direction:
Why:

## What went well

1. ...
2. ...
3. ...

Why these are repeatable:

## What should improve

1. Problem:
   Mitigation:
2. Problem:
   Mitigation:
3. Problem:
   Mitigation:

## Fallout issues

- ...

## Next release recommendation

Suggested next version:
Suggested thesis:
Suggested first active slice:
```

Every fallout issue must include:

- why it matters;
- evidence that proved it;
- target milestone, when known;
- definition of done;
- exactly one label from each live issue axis.

## 25. Next-release planning

After the retrospective:

1. Close the completed release milestone when all scoped issues are closed,
   moved, or cut.
2. Keep empty patch milestones only as patch buckets.
3. Do not treat an empty patch milestone as the next feature train.
4. Triage open issues into milestones and label axes.
5. Choose the next versioned milestone.
6. Write or refresh the release thesis.
7. Define must-ship, may-slip, and explicitly-not-included scope.
8. Break the milestone into two to five goalposts.
9. Promote the first goalpost's issues to `priority:next`.
10. Mark exactly one active slice or tracking issue `status:active`.
11. Update release signposts only where the new thesis changes public or
    maintainer truth.

Patch milestones are parking lots for maintenance opportunities, not feature
trains. A patch milestone becomes active only when it has a patch thesis and at
least one must-ship fix.

No release-prep PR should be opened for a planned version whose milestone lacks
a thesis.

## 26. Standard planned-release routine

This is the normal Continuum release rhythm.

1. Write release thesis.
2. Create or refresh milestone.
3. Define must-ship, may-slip, and not-included scope.
4. Break scope into two to five goalposts.
5. Activate exactly one slice.
6. Implement through normal PRs.
7. Keep docs and release notes current as truth changes.
8. Reconcile scope against the previous public tag.
9. Create `release/vX.Y.Z` branch.
10. Update version metadata.
11. Update changelog and release signposts.
12. Run release prep validation.
13. Open normal release-prep PR.
14. Merge after review and green CI.
15. Autotag the exact main merge commit.
16. Publish from the immutable tag.
17. Verify public artifact or deployment.
18. Record release evidence.
19. Run retrospective.
20. File fallout issues.
21. Close milestone.
22. Plan the next release thesis.

That is the whole machine.

## 27. Package repo adapter

For package repositories, release validation should usually include:

- version metadata lockstep;
- lockfile consistency;
- lint;
- typecheck;
- tests;
- coverage;
- build;
- package dry-run;
- packed artifact smoke;
- registry publish dry-run, where supported;
- dependency audit;
- docs check;
- link check.

Publication should verify:

- registry version visible;
- package install works;
- CLI/import smoke works;
- types resolve;
- GitHub Release exists;
- dist-tag is correct;
- artifact contents are correct.

Example commands:

```bash
npm run release:prep
npm run release:preflight
gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z
npm view @scope/package@X.Y.Z version --registry=https://registry.npmjs.org
npm install @scope/package@X.Y.Z
```

## 28. Service repo adapter

For service repositories, release validation should usually include:

- lint;
- typecheck;
- tests;
- build;
- container build;
- config validation;
- migration dry-run;
- deployment manifest validation;
- security scan;
- rollback plan;
- observability check.

Publication may mean:

- image push;
- staging deploy;
- production deploy;
- rollout promotion;
- environment config update.

Verification should include:

- deployed SHA;
- health check;
- smoke test;
- migration result;
- error rate;
- latency;
- logs;
- dashboard;
- rollback readiness.

Service releases should have an explicit rollback or patch-forward decision.

## 29. Docs repo adapter

For documentation repositories, release validation should include:

- Markdown lint;
- link check;
- spell/style checks, where applicable;
- generated docs check;
- example validation;
- redirect validation;
- search/index validation.

Publication may mean:

- static site deploy;
- docs package publish;
- release notes publish;
- documentation portal sync.

Verification should include:

- deployed URLs;
- canonical page checks;
- redirect checks;
- link checks;
- search/index checks;
- example rendering.

Docs releases still need scope discipline.

## 30. GitHub workflow expectations

Continuum release workflows should be explicit and hostile to ambiguity.

### 30.1 Release prep workflow

Runs on PRs.

Should verify:

- version metadata consistency;
- changelog entry;
- docs topology;
- issue or milestone gates, when possible;
- lint, tests, build, and docs;
- predicted tag;
- predicted dist-tag or channel.

Should comment with a release preview.

### 30.2 Autotag workflow

Runs on pushes to main.

Should:

- detect merged release-prep PR;
- derive version;
- run preflight;
- create annotated tag;
- print publish command.

Should not:

- publish;
- move existing tags;
- tag non-release commits.

### 30.3 Publish workflow

Runs on manual dispatch, tag trigger, or approved release event depending on the
repo profile.

Should:

- check out tag;
- validate tag, metadata, and commit;
- build from tag;
- publish;
- verify;
- create or update GitHub Release;
- emit evidence.

Should not:

- publish from moving main;
- ignore actor requirements;
- republish incompatible artifacts;
- hide partial failure.

## 31. Maintainer roles

A repo does not need bureaucracy, but it does need clear hands on the wheel.

### Release owner

Responsible for:

- thesis;
- milestone hygiene;
- scope reconciliation;
- release-prep PR;
- retrospective;
- fallout issues.

### Reviewer

Responsible for:

- reviewing release-prep changes;
- checking scope honesty;
- checking docs/signpost completeness;
- challenging suspicious late changes.

### Publisher

Responsible for:

- dispatching publish workflow, if manual;
- satisfying registry or deployment actor requirements;
- watching publication;
- verifying public artifacts.

### Repo steward

Responsible for:

- ensuring the repo profile stays current;
- keeping release automation healthy;
- making sure repo-local deviations are intentional.

For small repos, one person may wear multiple hats. The roles still exist.

## 32. Release tracking issue template

Use this for planned releases or heavier patch releases.

```markdown
# Release tracking: vX.Y.Z

## Thesis

...

## Release type

planned | patch | emergency | security | prerelease | docs-only | operational

## Scope

### Must-ship

- [ ] ...

### May-slip

- [ ] ...

### Explicitly not included

- ...

## Goalposts

### 1. ...

Evidence:
Issues:

### 2. ...

Evidence:
Issues:

## Release prep

- [ ] Scope reconciled
- [ ] Version metadata updated
- [ ] Changelog updated
- [ ] Signposts updated
- [ ] Release prep validation passes
- [ ] Release-prep PR opened

## Publication

- [ ] Release-prep PR merged
- [ ] Tag created
- [ ] Publish workflow run
- [ ] GitHub Release created/updated
- [ ] Registry/deployment verification complete

## Evidence

Tag:
Commit:
Release PR:
Autotag run:
Publish run:
Registry/deployment evidence:
Smoke evidence:

## Retrospective

- [ ] Released work recorded
- [ ] Unreleased work recorded
- [ ] Plan-versus-actual recorded
- [ ] Improvements recorded
- [ ] Fallout issues filed
- [ ] Next release planned
```

## 33. Release-prep PR template

```markdown
# release: vX.Y.Z

## Summary

Prepare vX.Y.Z for release.

## Release type

planned | patch | emergency | security | prerelease | docs-only | operational

## Thesis

...

## Previous public tag

vPREVIOUS

## Target tag

vX.Y.Z

## Dist-tag/channel

latest | next | beta | alpha | rc | vN | deployment channel

## Scope reconciliation

### Shipped

- ...

### Slipped

- ...

### Explicitly not included

- ...

## Version metadata

- [ ] Primary version source updated
- [ ] Lockfiles updated
- [ ] Workspace/package manifests updated
- [ ] Deployment/package metadata updated, if applicable

## Release signposts

- [ ] CHANGELOG.md
- [ ] README/front door
- [ ] Architecture docs
- [ ] User docs
- [ ] Operator docs
- [ ] Contributor docs
- [ ] Maintainer docs
- [ ] Migration/security docs, if applicable

## Validation

- [ ] Local release prep passed
- [ ] CI passed
- [ ] Package/deploy dry-run passed
- [ ] Docs/link checks passed

## Publish notes

Manual publish required: yes/no
Required actor/identity:
Targets:
- ...
```

## 34. Changelog entry template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- ...

### Changed

- ...

### Fixed

- ...

### Removed

- ...

### Migration notes

- ...

### Documentation

- ...

### Operations

- ...

### Release tooling

- ...

### Dependencies and security

- ...
```

Use only sections that matter. Empty changelog sections are decorative clutter.

## 35. Minimal repo-local `RELEASE.md`

Once this lifecycle exists centrally, an individual repo's `RELEASE.md` can be
small.

````markdown
# Release process

This repo follows the Continuum Release Lifecycle and Runbook.

Repo-specific release mechanics are declared in:

```text
.continuum/release.yml
```

## Release shape

This repo uses:

```text
branch -> PR -> merge -> autotag -> publish -> verify -> retrospective
```

## Local validation

```bash
npm run release:prep
npm run release:preflight
```

## Release branch

```bash
git checkout main
git pull --ff-only
git checkout -b release/vX.Y.Z
```

## Publish

After autotag creates `vX.Y.Z`, publish from the tag:

```bash
gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z
```

## Verify

<repo-specific verification commands>

## Manual fallback

Manual tagging is allowed only when autotag cannot run and must not bypass failed
gates.

```bash
npm run release:preflight
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin vX.Y.Z
```

Do not move public tags. Patch forward.
````

That is the ideal endpoint: shared doctrine, local mechanics, little
duplication.

## 36. Adoption checklist for existing repos

To apply this across Continuum repos:

1. Add `.continuum/release.yml`.
2. Identify version sources.
3. Identify release signposts.
4. Standardize milestone naming.
5. Standardize label axes.
6. Add or update `RELEASE.md`.
7. Add release-prep validation.
8. Add final preflight.
9. Add autotag workflow.
10. Add publish workflow.
11. Add verification commands.
12. Add retrospective template.
13. Cut one release using the process.
14. File fallout issues.
15. Tighten automation.

Do not try to perfect every repo before adopting the lifecycle. Start with the
contract, then improve the adapters. The release process should itself improve
by releases.

## 37. The non-negotiables

Everything else can be adapted. These cannot.

```text
No planned release without a thesis.
No version targeting through labels.
No release-prep PR without scope reconciliation.
No tag that does not point at the reviewed main commit.
No moving public tags.
No publishing from untagged moving source.
No silent registry/channel mismatch.
No release without verification.
No planned release train after publication without a retrospective.
```

That is the Continuum release spine. Keep the spine intact, and individual repos
can have different local mechanics without losing the shared process.
