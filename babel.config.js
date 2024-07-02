module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env",
      },
    ],
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "#assets/*": "./src/assets/*",
          "#navigation": "./src/navigation",
          "#navigation/*": "./src/navigation/*",
          "#screens": "./src/screens",
          "#store": "./src/store",
          "#store/*": "./src/store/*",
          "#components": "./src/shared/components",
          "#constants": "./src/shared/constants",
          "#colors": "./src/shared/constants/colors",
          "#styles": "./src/shared/constants/commonStyles",
          "#hooks": "./src/shared/hooks",
          "#permissions": "./src/shared/permissions",
          "#types": "./src/shared/types",
          "#utils": "./src/shared/utils",
          "#ui": "./src/shared/ui",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
