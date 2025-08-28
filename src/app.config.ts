export default defineAppConfig({
  pages: [
    "pages/home/index", //首页
    "pages/index/index", // 日剧翻译首页
    "pages/PracticePage/index", // 练习页面
    "pages/jpVerb/index", // 动词活用工具页面
    "pages/disclaimer/index", // 使用声明
  ],
  subpackages: [
    {
      root: "subPackages/restart-life",
      pages: ["index/index"],
    },
    {
      root: "subPackages/please-marry-my-boyfriend",
      pages: ["index/index"],
    },
    {
      root: "subPackages/daily-conversations",
      pages: ["index/index"],
    },
    {
      root: "subPackages/it-kanntann-kaiwa",
      pages: ["index/index"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  lazyCodeLoading: "requiredComponents", // 或 "enabled" 或 "disabled"
});
