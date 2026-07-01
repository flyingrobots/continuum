export type CanonicalJson =
  | null
  | boolean
  | number
  | string
  | CanonicalJson[]
  | { readonly [key: string]: CanonicalJson };

export type CanonicalJsonObject = {
  readonly [key: string]: CanonicalJson;
};

/**
 * Continuum v1 digest receipts are fixed to lowercase SHA-256 strings.
 * Algorithm agility must be introduced as an explicit new field or type, not by
 * silently reinterpreting this contract.
 */
export type AppliedDigest = `sha256:${string}`;

export interface LawpackRef {
  readonly domain: string;
  readonly name: string;
  readonly version?: string;
  readonly semanticDigest: AppliedDigest;
  readonly schemaDigest?: AppliedDigest;
}

export interface OpticRef {
  readonly domain: string;
  readonly name: string;
  readonly lawpack: LawpackRef;
}

export interface LoweringRef {
  readonly target: string;
  readonly loweringDigest: AppliedDigest;
  readonly runtimeVersion?: string;
}

export interface TargetReceipt {
  readonly target: string;
  readonly runtimeVersion?: string;
  readonly implementationDigest?: AppliedDigest;
}

export interface RuntimeReceipt {
  readonly at?: string;
  readonly digest?: AppliedDigest;
}

export interface EvaluationReceipt {
  readonly semantic: LawpackRef;
  readonly lowering?: LoweringRef;
  readonly runtime: TargetReceipt;
}

export interface RevelationPosture {
  readonly value: 'opaque' | 'redacted' | 'clear';
  readonly proof: 'none' | 'receipt' | 'public-proof' | 'witness';
  readonly transport: 'none' | 'local' | 'shareable';
}

export interface CoordinateAlias {
  readonly basis: 'latest-visible' | 'latest-admitted';
  readonly posture?: RevelationPosture;
  readonly accumulation?: AccumulationPolicy;
}

export type CoordinateInput = CoordinateAlias | BasisRef | CoordinateReceipt;

export interface BasisRef {
  readonly kind: string;
  readonly digest: AppliedDigest;
}

export interface AccumulationPolicy {
  readonly kind: string;
}

export interface CoordinateReceipt {
  readonly basis: BasisRef;
  readonly coordinatePosture: RevelationPosture;
  readonly accumulation: AccumulationPolicy;
  readonly target: TargetReceipt;
  readonly coordinateDigest: AppliedDigest;
  readonly resolution: RuntimeReceipt;
}

export interface AppliedReading<Value> {
  readonly kind: 'reading';
  readonly optic: OpticRef;
  readonly args: CanonicalJsonObject;
  readonly selection?: SelectionSpec;
  readonly page?: PageSpec;
  readonly aperture: ApertureSpec;
  readonly basisPolicy: BasisPolicy;
  readonly requestedPosture: RevelationPosture;
  readonly support: SupportObligationSpec;
  readonly projection: ProjectionSpec<Value>;
  readonly appliedDigest: AppliedDigest;
  readonly optimizationDigest?: AppliedDigest;
}

export interface AppliedIntent<Result> {
  readonly kind: 'intent';
  readonly optic: OpticRef;
  readonly args: CanonicalJsonObject;
  readonly site: SiteDescriptorSpec;
  readonly footprint: FootprintSpec;
  readonly support: SupportObligationSpec;
  readonly admission: AdmissionPolicySpec<Result>;
  readonly appliedDigest: AppliedDigest;
  readonly optimizationDigest?: AppliedDigest;
}

export interface OccurrenceRef {
  readonly issuer: ObserverRef | DeviceRef | ClientRef;
  readonly localId: string;
  readonly occurrenceKeyDigest: AppliedDigest;
}

export interface OccurredIntent<Result> {
  readonly kind: 'occurred-intent';
  readonly intent: AppliedIntent<Result>;
  readonly occurrence: OccurrenceRef;
  readonly occurredDigest: AppliedDigest;
}

export interface AuthoredIntent<Result> {
  readonly kind: 'authored-intent';
  readonly occurred: OccurredIntent<Result>;
  readonly author: ObserverRef;
  readonly authority?: AuthorityReceipt;
  readonly authoredAt?: LogicalTime | WallClockReceipt;
  readonly nonce?: string;
  readonly signature?: SignatureEnvelope;
}

export interface ObservationEnvelope<Value> {
  readonly value: Value;
  readonly observer: ObserverRef;
  readonly coordinate: CoordinateReceipt;
  readonly reading: AppliedReadingReceipt<Value>;
  readonly aperture: ApertureReceipt;
  readonly revelation: RevelationReceipt;
  readonly support: SupportLedger;
  readonly evaluation: EvaluationReceipt;
  readonly proof?: ProofEnvelope;
  readonly transport?: TransportReceipt;
  readonly degeneracy?: DegeneracyReport;
  readonly witnessDebt?: readonly WitnessDebt[];
}

export interface AppliedReadingReceipt<Value> {
  readonly ref: AppliedReadingRef;
  readonly declaration?: AppliedReading<Value>;
  readonly appliedDigest: AppliedDigest;
}

export type ObservationOutcome<Value> =
  | { readonly kind: 'observed'; readonly observation: ObservationEnvelope<Value> }
  | {
      readonly kind: 'plural';
      readonly observations: readonly ObservationEnvelope<Value>[];
      readonly plurality: PluralityReport;
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
    }
  | {
      readonly kind: 'conflict';
      readonly conflict: ConflictArtifact;
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
    }
  | {
      readonly kind: 'obstruction';
      readonly obstruction: ObstructionArtifact;
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
    };

export type AdmissionOutcome<Result> =
  | Accepted<Result>
  | Plural<Result>
  | Conflict
  | Obstruction;

export interface Accepted<Result> {
  readonly kind: 'accepted';
  readonly result: Result;
  readonly support: SupportLedger;
  readonly receipt: AdmissionReceipt;
  readonly coordinate: CoordinateReceipt;
}

export interface AdmissionReceipt {
  readonly authored: AuthoredIntentRef;
  readonly sourceCoordinate: CoordinateReceipt;
  readonly admissionCoordinate: CoordinateReceipt;
  readonly evaluation: EvaluationReceipt;
  readonly support: SupportLedger;
  readonly admittedAt?: RuntimeReceipt;
}

export interface Plural<Result> {
  readonly kind: 'plural';
  readonly alternatives: readonly PluralAlternative<Result>[];
  readonly plurality: PluralityReport;
  readonly receipt?: AdmissionReceipt;
  readonly coordinate?: CoordinateReceipt;
}

export interface PluralAlternative<Result> {
  readonly result: Result;
  readonly support: SupportLedger;
  readonly receipt?: AdmissionReceipt;
  readonly coordinate?: CoordinateReceipt;
}

export interface Conflict {
  readonly kind: 'conflict';
  readonly conflict: ConflictArtifact;
  readonly coordinate?: CoordinateReceipt;
  readonly evaluation?: EvaluationReceipt;
}

export interface Obstruction {
  readonly kind: 'obstruction';
  readonly obstruction: ObstructionArtifact;
  readonly coordinate?: CoordinateReceipt;
  readonly evaluation?: EvaluationReceipt;
}

export type ReadingValue<Reading> = Reading extends AppliedReading<infer Value> ? Value : never;

export type ObservationOutcomesFor<Readings extends readonly AppliedReading<unknown>[]> = {
  readonly [Index in keyof Readings]: ObservationOutcome<ReadingValue<Readings[Index]>>;
};

export interface ObserverSession {
  pin(): Promise<PinnedObserverSession>;
  author<Result>(
    intent: AppliedIntent<Result>,
    options: AuthorIntentOptions,
  ): Promise<AuthoredIntent<Result>>;
  read<Value>(reading: AppliedReading<Value>): Promise<Value>;
  observe<Value>(reading: AppliedReading<Value>): Promise<ObservationOutcome<Value>>;
  observeMany<Readings extends readonly AppliedReading<unknown>[]>(
    readings: Readings,
  ): Promise<ObservationOutcomesFor<Readings>>;
  canObserve?<Value>(reading: AppliedReading<Value>): Promise<CapabilityOutcome>;
  canAdmit?<Result>(
    intent: OccurredIntent<Result> | AuthoredIntent<Result>,
  ): Promise<CapabilityOutcome>;
  write<Result>(
    intent: OccurredIntent<Result> | AuthoredIntent<Result>,
  ): Promise<AdmissionOutcome<Result>>;
}

export interface PinnedObserverSession extends ObserverSession {
  readonly coordinate: CoordinateReceipt;
}

export interface AuthorIntentOptions {
  readonly occurrence: string | OccurrenceRef;
  readonly authority?: AuthorityPresentation;
  readonly authoredAt?: LogicalTime | WallClockReceipt;
  readonly nonce?: string;
}

export type StaticCapabilityOutcome =
  | {
      readonly kind: 'supported';
      readonly lawpack: LawpackRef;
      readonly target: TargetReceipt;
      readonly lowerings: readonly LoweringRef[];
    }
  | {
      readonly kind: 'unsupported';
      readonly obstruction: ObstructionArtifact;
    };

export type CapabilityOutcome =
  | {
      readonly kind: 'capable';
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
      readonly caveats?: readonly CapabilityCaveat[];
    }
  | {
      readonly kind: 'incapable';
      readonly obstruction: ObstructionArtifact;
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
    }
  | {
      readonly kind: 'unknown';
      readonly reason: string;
      readonly coordinate?: CoordinateReceipt;
      readonly evaluation?: EvaluationReceipt;
    };

export interface ProofEnvelope {
  readonly kind: 'none' | 'replay' | 'signature' | 'merkle' | 'verkle' | 'ipa' | 'zk';
  readonly status: 'not-provided' | 'not-checked' | 'verified' | 'failed' | 'not-revealed';
  readonly publicInputs?: CanonicalJsonObject;
  readonly proofRef?: string;
}

export interface PageSpec {
  readonly limit?: number;
  readonly cursor?: CursorRef;
}

export interface CursorRef {
  readonly kind: 'cursor';
  readonly target: TargetReceipt;
  readonly coordinate: CoordinateReceiptRef;
  readonly reading: AppliedReadingRef;
  readonly aperture: ApertureReceiptRef;
  readonly token: string;
}

export interface Page<Value> {
  readonly items: readonly Value[];
  readonly next?: CursorRef;
  readonly coordinate: CoordinateReceipt;
}

export type ValidationOutcome<T> =
  | { readonly kind: 'valid'; readonly value: T }
  | { readonly kind: 'invalid'; readonly errors: readonly ConstructionError[] };

export class ContinuumConstructionError extends TypeError {
  readonly code: string;
  constructor(message: string, options?: { readonly code?: string });
}

export class ContinuumObservationError extends Error {
  readonly outcome: ObservationOutcome<unknown>;
  constructor(outcome: ObservationOutcome<unknown>);
  toRedactedJson(): CanonicalJson;
}

export function canonicalStringify(value: CanonicalJson): string;
export function toCanonicalJson(value: unknown): CanonicalJson;
export function assertCanonicalJson(value: unknown): void;
export function hashCanonicalJson(value: CanonicalJson): AppliedDigest;
export function digestAppliedReading(reading: Partial<AppliedReading<unknown>>): AppliedDigest;
export function digestAppliedIntent(intent: Partial<AppliedIntent<unknown>>): AppliedDigest;
export function meetRevelationPosture(
  ...postures: readonly RevelationPosture[]
): RevelationPosture;
export function compareRevelationPosture(
  left: RevelationPosture,
  right: RevelationPosture,
): {
  readonly value: number;
  readonly proof: number;
  readonly transport: number;
};
export function makeOccurrenceRef(input: {
  readonly issuer: ObserverRef | DeviceRef | ClientRef;
  readonly localId: string;
}): OccurrenceRef;
export function makeOccurredIntent<Result>(
  intent: AppliedIntent<Result>,
  occurrence: OccurrenceRef,
): OccurredIntent<Result>;
export function compareOccurrenceBinding(
  left: OccurredIntent<unknown>,
  right: OccurredIntent<unknown>,
): 'retry' | 'occurrence-conflict' | 'separate-occurrence';
export function unwrapObserved<Value>(outcome: ObservationOutcome<Value>): Value;
export function matchObservation<Value, Result>(
  outcome: ObservationOutcome<Value>,
  handlers: {
    readonly observed: (outcome: Extract<ObservationOutcome<Value>, { kind: 'observed' }>) => Result;
    readonly plural: (outcome: Extract<ObservationOutcome<Value>, { kind: 'plural' }>) => Result;
    readonly conflict: (outcome: Extract<ObservationOutcome<Value>, { kind: 'conflict' }>) => Result;
    readonly obstruction: (outcome: Extract<ObservationOutcome<Value>, { kind: 'obstruction' }>) => Result;
  },
): Result;
export function matchAdmission<Result, Output>(
  outcome: AdmissionOutcome<Result>,
  handlers: {
    readonly accepted: (outcome: Extract<AdmissionOutcome<Result>, { kind: 'accepted' }>) => Output;
    readonly plural: (outcome: Extract<AdmissionOutcome<Result>, { kind: 'plural' }>) => Output;
    readonly conflict: (outcome: Extract<AdmissionOutcome<Result>, { kind: 'conflict' }>) => Output;
    readonly obstruction: (outcome: Extract<AdmissionOutcome<Result>, { kind: 'obstruction' }>) => Output;
  },
): Output;
export function redact(value: unknown): CanonicalJson;
export function validateDeclaration<T extends AppliedReading<unknown> | AppliedIntent<unknown>>(
  declaration: T,
): ValidationOutcome<T>;
export function validateDeclaration(
  declaration: unknown,
): ValidationOutcome<AppliedReading<unknown> | AppliedIntent<unknown>>;

// Phase 1 placeholders. These names are part of the public contract, but their
// field-level schemas must be narrowed by Wesley/Edict lawpacks before they are
// treated as finalized domain types.
export type SelectionSpec = { readonly kind: string; readonly [key: string]: unknown };
export type ApertureSpec = { readonly kind: string; readonly [key: string]: unknown };
export type BasisPolicy = { readonly kind: string; readonly [key: string]: unknown };
export type SupportObligationSpec = { readonly kind: string; readonly [key: string]: unknown };
export type ProjectionSpec<Value> = { readonly kind: string; readonly value?: Value };
export type SiteDescriptorSpec = { readonly kind: string; readonly [key: string]: unknown };
export type FootprintSpec = { readonly kind: string; readonly [key: string]: unknown };
export type AdmissionPolicySpec<Result> = { readonly kind: string; readonly result?: Result };
export type ObserverRef = { readonly kind: string; readonly id: string };
export type DeviceRef = { readonly kind: string; readonly id: string };
export type ClientRef = { readonly kind: string; readonly id: string };
export type AuthorityReceipt = { readonly kind: string; readonly [key: string]: unknown };
export type AuthorityPresentation = { readonly kind: string; readonly [key: string]: unknown };
export type LogicalTime = { readonly kind: string; readonly [key: string]: unknown };
export type WallClockReceipt = { readonly at: string; readonly [key: string]: unknown };
export type SignatureEnvelope = { readonly kind: string; readonly [key: string]: unknown };
export type AuthoredIntentRef = { readonly digest: AppliedDigest };
export type AppliedReadingRef = { readonly digest: AppliedDigest };
export type CoordinateReceiptRef = { readonly digest: AppliedDigest };
export type ApertureReceiptRef = { readonly digest: AppliedDigest };
export type ApertureReceipt = { readonly requested: ApertureSpec; readonly effective: ApertureSpec };
export type RevelationReceipt = {
  readonly requested: RevelationPosture;
  readonly effective: RevelationPosture;
  readonly losses?: readonly SupportLoss[];
};
export type SupportLedger = { readonly status: string; readonly [key: string]: unknown };
export type TransportReceipt = { readonly kind: string; readonly [key: string]: unknown };
export type DegeneracyReport = { readonly kind: string; readonly [key: string]: unknown };
export type WitnessDebt = { readonly kind: string; readonly [key: string]: unknown };
export type PluralityReport = { readonly kind: string; readonly [key: string]: unknown };
export type ConflictArtifact = { readonly kind: string; readonly [key: string]: unknown };
export type ObstructionArtifact = { readonly reason: string; readonly [key: string]: unknown };
export type CapabilityCaveat = { readonly kind: string; readonly [key: string]: unknown };
export type ConstructionError = { readonly name: string; readonly code: string; readonly message: string };
export type SupportLoss = { readonly kind: string; readonly [key: string]: unknown };
