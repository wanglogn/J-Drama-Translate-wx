import { useRouter } from "@tarojs/taro";
import { Navigator, View, Text, Image } from "@tarojs/components";
import ep1 from "../data/episodes/episode1.json";
import ep2 from "../data/episodes/episode2.json";
import ep3 from "../data/episodes/episode3.json";
import ep4 from "../data/episodes/episode4.json";
import ep5 from "../data/episodes/episode5.json";
import ep6 from "../data/episodes/episode6.json";
import ep7 from "../data/episodes/episode7.json";
import ep8 from "../data/episodes/episode8.json";
import ep9 from "../data/episodes/episode9.json";
import ep10 from "../data/episodes/episode10.json";
import { getEpisodesByShow, EpisodeData } from "@/data/translationData";
import { getShowById } from "@/data/shows";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

import arrowLeft1 from "@/assets/icons/arrow_left_1.png";

export default function Home() {
  const router = useRouter();
  const { show, episodeCount } = router.params || {};
  const showId = show;
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const showInfo = showId ? getShowById(showId) : null;

  const episodesJson = [ep1, ep2, ep3, ep4, ep5, ep6, ep7, ep8, ep9, ep10];

  useEffect(() => {
    if (!showId || !episodeCount) {
      setLoading(false);
      return;
    }

    const loadEpisodes = async () => {
      try {
        const res = await getEpisodesByShow(episodesJson);
        setEpisodes(res);
      } catch (err) {
        console.error("加载剧集失败:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, [showId, episodeCount]);

  const handleEpisodeClick = (episode: EpisodeData) => {
    // 保存当前选中的 episode 数据到本地缓存
    Taro.setStorageSync("currentEpisode", episode);
    // 跳转时只带 id 和集数
    Taro.navigateTo({
      url: `/pages/PracticePage/index?show=${showId}&episode=${episode.number}`,
    });
  };

  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <View className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <View className="text-left mb-6">
          <Navigator
            url="/pages/index/index"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center w-fit"
          >
            <Image src={arrowLeft1} className="mr-1 h-[1.1rem] w-[1.1rem]" />
            返回剧集选择
          </Navigator>
        </View>

        {/* 剧集信息 */}
        {showInfo && (
          <View className="mb-8 text-center">
            <View className="text-3xl font-bold text-gray-900 mb-2">
              {showInfo.title}
            </View>
            <Text className="text-gray-600 max-w-2xl mx-auto">
              {showInfo.description}
            </Text>
          </View>
        )}

        {/* 集数选择 */}
        <View className="bg-white rounded-xl shadow-md p-6 mb-12">
          {loading ? (
            <Text className="text-center py-10 text-gray-500">加载中...</Text>
          ) : episodes.length > 0 ? (
            <View className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {episodes.map((episode) => (
                <View
                  key={episode.number}
                  className="border border-[#e5e7eb] rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <View className="flex flex-col items-center justify-center p-4">
                    <View className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Text className="text-xl font-bold text-blue-600 group-hover:text-white">
                        第{episode.number}集
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-medium text-center">
                      {episode.title.split("：")[1]}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {episode.lines.length}句台词
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="text-center py-10">
              <Text className="text-xl font-medium text-gray-900 mb-2">
                暂无剧集数据
              </Text>
              <Text className="text-gray-600">
                该日剧的练习数据正在整理中，敬请期待...
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}