import { useRouter } from "@tarojs/taro";
import { Navigator, View, Text, Image } from "@tarojs/components";
import ShowSelection from "./../../components/ShowSelection";
import { getEpisodesByShow } from "@/data/translationData";
import { getShowById } from "@/data/shows";
import volumeIcon from "@/assets/icons/volumeup.png";
import commentsIcon from "@/assets/icons/comments.png";
import bookIcon from "@/assets/icons/a-007-book.png";
import arrowLeft1 from "@/assets/icons/arrow_left_1.png";

export default function Home() {
  const router = useRouter();
  const { show } = router.params || {};
  const showId = show;

  if (showId) {
    const episodes = getEpisodesByShow(showId);
    const showInfo = getShowById(showId);

    return (
      <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <View className="max-w-4xl mx-auto">
          <View className="text-left mb-6">
            <Navigator
              url="/pages/index/index"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center w-fit"
            >
              <Image
                src={arrowLeft1}
                className="mr-1 h-[1.1rem] w-[1.1rem]"
              ></Image>
              返回剧集选择
            </Navigator>
          </View>

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

          <View className="bg-white rounded-xl shadow-md p-6 mb-12">
            <View className="text-2xl font-bold text-gray-900 mb-6 text-center">
              选择集数
            </View>

            {episodes.length > 0 ? (
              <View className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {episodes.map((episode) => (
                  <View
                    key={episode.number}
                    className=" border border-[#e5e7eb] rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <Navigator
                      url={`/pages/PracticePage/index?show=${showId}&episode=${episode.number}`}
                      className="flex flex-col items-center justify-center p-4"
                    >
                      <View className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Text className="text-xl font-bold text-blue-600 group-hover:text-white">
                          第{episode.number}集
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-medium text-center">
                        {episode.title.split("：")[1]}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {episode.lineCount}句台词
                      </Text>
                    </Navigator>
                  </View>
                ))}
              </View>
            ) : (
              <View className="text-center py-10">
                <View className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Text className="fa-solid fa-film text-2xl text-gray-500" />
                </View>
                <Text className="text-xl font-medium text-gray-900 mb-2">
                  暂无剧集数据
                </Text>
                <Text className="text-gray-600">
                  该日剧的练习数据正在整理中，敬请期待...
                </Text>
              </View>
            )}
          </View>

          <View className="text-center text-gray-500 text-sm py-6">
            <Text>日语翻译练习 &copy; {new Date().getFullYear()}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <View className="max-w-4xl mx-auto">
        <View className="text-center py-12 mb-8">
          <View className="text-4xl font-bold text-gray-900 mb-4">
            日语翻译练习
          </View>
          <Text className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过热门日剧台词，提升你的日语翻译能力和口语水平
          </Text>
        </View>

        <View className="mb-16">
          <ShowSelection />

          {/* <View className="grid md:grid-cols-3 gap-6 mb-12">
            <View className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Image
                  src={bookIcon}
                  className="fa-solid fa-book text-blue-500 text-xl h-[1.45rem] w-[1.45rem]"
                ></Image>
              </View>
              <View className="text-xl font-semibold text-gray-900 mb-2">
                丰富台词库
              </View>
              <Text className="text-gray-600">
                精选多部热门日剧经典台词，覆盖不同难度级别
              </Text>
            </View>

            <View className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <View className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Image
                  src={commentsIcon}
                  className="fa-solid fa-comments text-green-500 text-xl h-[1.6rem] w-[1.6rem]"
                ></Image>
              </View>
              <View className="text-xl font-semibold text-gray-900 mb-2">
                翻译练习
              </View>
              <Text className="text-gray-600">
                提供翻译输入区域，可与参考答案对比，帮助你提升翻译能力
              </Text>
            </View>

            <View className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <View className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Image
                  src={volumeIcon}
                  className="fa-solid fa-volume-up text-purple-500 text-xl h-[1.8rem] w-[1.8rem]"
                ></Image>
              </View>
              <View className="text-xl font-semibold text-gray-900 mb-2">
                口语练习
              </View>
              <Text className="text-gray-600">
                日语原文朗读功能，帮助你学习标准发音和语调
              </Text>
            </View>
          </View> */}
        </View>

        <View className="text-center text-gray-500 text-sm py-6">
          <Text>日语翻译练习 &copy; {new Date().getFullYear()}</Text>
        </View>
      </View>
    </View>
  );
}
