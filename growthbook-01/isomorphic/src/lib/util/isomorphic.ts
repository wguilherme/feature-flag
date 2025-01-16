import { FeatureFlagsContext, DEFAULT_FEATURE_FLAGS } from '../feature-flags/types';

export function helloIsomorphic(context: FeatureFlagsContext = DEFAULT_FEATURE_FLAGS): string {
  const betaSuffix = context.isBetaEnabled ? 'ENABLED' : 'DISABLED';
  return `Hello from Isomorphic Library${betaSuffix}!`;
}
