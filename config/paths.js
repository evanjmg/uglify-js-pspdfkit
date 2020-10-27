'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;
const envBuildDirUrl = process.env.BUILD_DIR;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
envPublicUrl || require(appPackageJson).homepage;

const getBuildDir = () => envBuildDirUrl || resolveApp('build');

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath (appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const alias = {
  '@core': resolveApp('src/core'),
  '@web': resolveApp('src/web'),
  '@translations': resolveApp('src/translations'),
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appDirectory: appDirectory,
  appBuild: getBuildDir(),
  appPublic: resolveApp('public'),
  cacheDirectory: resolveApp('.cache'),
  distDirectory: resolveApp('dist'),
  appTsConfig: resolveApp('tsconfig.json'),
  appTsLint: resolveApp('tslint.json'),
  appHtml: resolveApp('public/index.html'),
  publicStaticJs: resolveApp('public/static/js'),
  appIndexJs: resolveApp('src/index.tsx'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTest: resolveApp('test'),
  testsSetup: resolveApp('src/setupTests.ts'),
  appNodeModules: resolveApp('node_modules'),
  pspdfKitModuleDist: resolveApp('node_modules/pspdfkit/dist'),
  pspdfKitJs: resolveApp('node_modules/pspdfkit/dist/pspdfkit.js'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  alias: alias,
};
