const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const defaultConfig = getDefaultConfig(projectRoot);

/**
 * Metro configuration for Monorepos (pnpm workspaces)
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
  // Watch the entire monorepo root folder so we can resolve hoisted node_modules
  watchFolders: [workspaceRoot],
  
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    // Add both local and root node_modules to the search path for module resolution
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    // Proxy resolver to dynamically locate physical packages using Node's resolution (which follows pnpm symlinks)
    extraNodeModules: new Proxy({}, {
      get: (target, name) => {
        if (typeof name !== 'string' || name.startsWith('debugger-') || name.includes('/')) {
          return undefined;
        }
        try {
          // Resolve package using Node's resolver
          return path.dirname(require.resolve(`${name}/package.json`, {
            paths: [projectRoot, workspaceRoot]
          }));
        } catch (err) {
          // Fallback to local node_modules
          return path.join(projectRoot, 'node_modules', name);
        }
      }
    })
  },
};

module.exports = mergeConfig(defaultConfig, config);
