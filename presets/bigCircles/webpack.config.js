const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const version = require("./package.json").version;

const getEntry = (name) => {
  const obj = {};

  obj[`tsparticles.preset.${name}`] = "./dist/index.js";
  obj[`tsparticles.preset.${name}.min`] = "./dist/index.js";

  return obj;
};

const getExternals = (bundle) => {
  if (bundle) {
    return [];
  }

  return [
    {
      "tsparticles-core": {
        commonjs: "tsparticles-core",
        commonjs2: "tsparticles-core",
        amd: "tsparticles-core",
        root: "window"
      },
      "tsparticles-shape-circle": {
        commonjs: "tsparticles-shape-circle",
        commonjs2: "tsparticles-shape-circle",
        amd: "tsparticles-shape-circle",
        root: "window"
      },
      "tsparticles-updater-out-modes": {
        commonjs: "tsparticles-updater-out-modes",
        commonjs2: "tsparticles-updater-out-modes",
        amd: "tsparticles-updater-out-modes",
        root: "window"
      },
      "tsparticles-updater-plugin-emitters": {
        commonjs: "tsparticles-plugin-emitters",
        commonjs2: "tsparticles-plugin-emitters",
        amd: "tsparticles-plugin-emitters",
        root: "window"
      }
    }
  ];
};

const getConfig = (entry, banner, minBanner, dir, bundle) => {
  return {
    entry: entry,
    output: {
      path: path.resolve(dir, "dist"),
      filename: "[name].js",
      libraryTarget: "umd",
      globalObject: "this"
    },
    resolve: {
      extensions: [ ".js", ".json" ]
    },
    externals: getExternals(bundle),
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner,
        exclude: /\.min\.js$/
      }),
      new webpack.BannerPlugin({
        banner: minBanner,
        include: /\.min\.js$/
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: "static",
        exclude: /\.min\.js$/,
        reportFilename: `report.html`
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /\.min\.js$/,
          terserOptions: {
            output: {
              comments: minBanner
            }
          },
          extractComments: false
        })
      ]
    }
  };
};

const banner = `Author : Matteo Bruni - https://www.matteobruni.it
MIT license: https://opensource.org/licenses/MIT
Demo / Generator : https://particles.matteobruni.it/
GitHub : https://www.github.com/matteobruni/tsparticles
How to use? : Check the GitHub README
v${version}`;

const minBanner = `tsParticles Big Circles Preset v${version} by Matteo Bruni`;

module.exports = [
  getConfig(getEntry("bigCircles"), banner, minBanner, __dirname, false),
  getConfig(getEntry("bigCircles.bundle"), banner, minBanner, __dirname, true)
];
