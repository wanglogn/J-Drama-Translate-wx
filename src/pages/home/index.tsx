import { Navigator, View, Text, Image } from "@tarojs/components";
import commentsIcon from "@/assets/icons/comments.png";
import bookIcon from "@/assets/icons/a-007-book.png";

export default function Home() {
  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <View className="max-w-4xl mx-auto">
        <View className="text-center py-12">
          <View className="text-4xl md:text-3xl font-bold text-gray-900 mb-4">
            日语学习工具
          </View>
        </View>
        <View className="mb-16">
          <View className="grid md:grid-cols-2 gap-6 mb-12">
            <Navigator url="/pages/index/index">
              <View className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src={bookIcon}
                    className="fa-solid fa-book text-blue-500 text-xl h-[1.45rem] w-[1.45rem]"
                  ></Image>
                </View>
                <View className="text-xl md:text-sm font-semibold text-gray-900 mb-2">
                  台词翻译
                </View>
                <Text className="text-gray-600">
                  精选多部热门日剧台词，覆盖不同难度级别，贴近实际口语使用
                </Text>
              </View>
            </Navigator>
            <Navigator url="/pages/jpVerb/index">
              <View className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                <View className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src={commentsIcon}
                    className="fa-solid fa-comments text-green-500 text-xl h-[1.6rem] w-[1.6rem]"
                  ></Image>
                </View>
                <View className="text-xl md:text-sm font-semibold text-gray-900 mb-2">
                  动词变身魔法机
                </View>
                <Text className="text-gray-600">
                  不会变形？输入动词，秒出所有活用形，学习复习更轻松。
                </Text>
              </View>
            </Navigator>
          </View>
        </View>
      </View>
    </View>
  );
}
