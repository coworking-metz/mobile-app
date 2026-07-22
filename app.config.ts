import { ExpoConfig, ConfigContext } from 'expo/config';
import { execSync } from 'child_process';

// only tag local builds, EAS Cloud builds already carry the channel/version
const getGitBranchName = (): string | null => {
  try {
    const branchName = execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (branchName !== 'main') {
      return branchName;
    }
  } catch (error) {
    console.warn('Failed to get git branch name:', error);
  }
  return null;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...(process.env.APP_SLUG && { slug: process.env.APP_SLUG }),
  ...(process.env.APP_NAME && { name: process.env.APP_NAME }),
  ...(process.env.APP_ICON && { icon: process.env.APP_ICON }),
  extra: {
    ...config.extra,
    buildDate: new Date().toISOString(), // https://stackoverflow.com/a/65970202
    gitBranch: getGitBranchName(),
  },
});
