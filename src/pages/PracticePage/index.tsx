import { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import TranslationCard from "@/components/TranslationCard";
import { TranslationItem, EpisodeData } from "@/data/translationData";
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
    const episodeData: EpisodeData | null =
      Taro.getStorageSync("currentEpisode");

    if (!episodeData || !showParam || !episodeParam) {
      Taro.redirectTo({ url: "/pages/index/index" });
      return;
    }

    setShowTitle(getShowById(showParam)?.title || "");
    setEpisode(episodeData.number);
    setEpisodeTitle(episodeData.title);
    setTranslationItems(episodeData.lines);
    setCurrentIndex(0);

    // 读取进度
    const savedProgress = Taro.getStorageSync(
      `translationProgress_${showParam}_ep${episodeData.number}`
    );
    if (
      typeof savedProgress === "number" &&
      savedProgress < episodeData.lines.length
    ) {
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
      <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Text className="text-xl">加载练习数据中...</Text>
      </View>
    );
  }

  const currentItem = translationItems[currentIndex];

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="max-w-2xl mx-auto">
        <View className="mb-6 text-center">
          <View className="text-xl font-semibold text-gray-600 mb-1">
            {showTitle}
          </View>
          <View className="text-2xl font-bold text-gray-800 mb-2">
            {episodeTitle}
          </View>
          <Text className="text-gray-600">
            第 {currentIndex + 1} 题 / 共 {translationItems.length} 题
          </Text>
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
          <Image src={arrowLeft} className="h-[1.2rem] w-[1.2rem] mr-1" />
          返回集数选择
        </View>
      </View>
    </View>
  );
}