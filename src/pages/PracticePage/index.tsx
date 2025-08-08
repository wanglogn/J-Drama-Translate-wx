import { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import TranslationCard from "@/components/TranslationCard";
import {
  getLinesByShowAndEpisode,
  getEpisodesByShow,
  TranslationItem,
} from "@/data/translationData";
import { getShowById } from "@/data/shows";
import arrowLeft from "@/assets/icons/arrow_left.png";

export default function PracticePage() {
  const [translationItems, setTranslationItems] = useState<TranslationItem[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [episode, setEpisode] = useState<number | null>(null);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [showTitle, setShowTitle] = useState("");

  const router = useRouter();
  const showParam = router.params?.show || "";
  const episodeParam = router.params?.episode || "";

  useEffect(() => {
    if (!showParam || !episodeParam) {
      Taro.redirectTo({ url: "/pages/index/index" });
      return;
    }

    const episodeNumber = parseInt(episodeParam, 10);
    if (isNaN(episodeNumber)) {
      Taro.redirectTo({ url: "/pages/index/index" });
      return;
    }

    const show = getShowById(showParam);
    if (!show) {
      Taro.redirectTo({ url: "/pages/index/index" });
      return;
    }

    const lines = getLinesByShowAndEpisode(showParam, episodeNumber);
    if (lines.length === 0) {
      Taro.redirectTo({ url: `/pages/episodes/index?show=${showParam}` });
      return;
    }

    const episodes = getEpisodesByShow(showParam);
    const currentEpisode = episodes.find((ep) => ep.number === episodeNumber);

    setShowTitle(show.title);
    setEpisode(episodeNumber);
    setEpisodeTitle(currentEpisode?.title || `第${episodeNumber}集`);
    setTranslationItems(lines);
    setCurrentIndex(0);

    // 读取进度
    const savedProgress = Taro.getStorageSync(
      `translationProgress_${showParam}_ep${episodeNumber}`
    );
    if (typeof savedProgress === "number" && savedProgress < lines.length) {
      setCurrentIndex(savedProgress);
    }
  }, []);

  useEffect(() => {
    if (translationItems.length > 0 && episode && showParam) {
      Taro.setStorageSync(
        `translationProgress_${showParam}_ep${episode}`,
        currentIndex
      );
    }
  }, [currentIndex, translationItems.length, episode]);

  const handleNext = () => {
    if (currentIndex < translationItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Taro.showToast({
        title: `已完成《${showTitle} - ${episodeTitle}》的全部练习！`,
        icon: "none",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      Taro.navigateTo({ url: `/pages/episodes/index?show=${showParam}` });
    }
  };

  if (translationItems.length === 0) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <View className="flex flex-col items-center">
          <View className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <View className="text-2xl text-gray-500 dark:text-gray-400">
              📖
            </View>
          </View>
          <View className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            加载练习数据中
          </View>
          <View className="text-gray-600 dark:text-gray-400">
            请稍候，我们正在准备翻译练习内容...
          </View>
        </View>
      </View>
    );
  }

  const currentItem = translationItems[currentIndex];

  return (
    <View className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <View className="max-w-2xl mx-auto">
        <View className="mb-6 text-center">
          <View className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {showTitle}
          </View>
          <View className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {episodeTitle}
          </View>
          <Text className="text-gray-600 dark:text-gray-400">
            第 {currentIndex + 1} 题 / 共 {translationItems.length} 题
          </Text>

          <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
            <View
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentIndex + 1) / translationItems.length) * 100
                }%`,
              }}
            />
          </View>
        </View>

        <TranslationCard
          item={currentItem}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        <View
          className="mt-6 mb-6 flex justify-start text-[#4b5563]"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/index/index?show=${showParam}`,
            });
          }}
        >
          <Image src={arrowLeft} className="h-[1.2rem] w-[1.2rem] mr-1"></Image>
          返回集数选择
        </View>
      </View>
    </View>
  );
}
