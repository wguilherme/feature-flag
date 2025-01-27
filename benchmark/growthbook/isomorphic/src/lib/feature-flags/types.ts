export interface FeatureFlagsContext {
  isBetaEnabled?: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlagsContext = {
  isBetaEnabled: false,
};
