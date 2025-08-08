import { View, Image, Navigator } from "@tarojs/components";
import { shows } from "@/data/shows/index";
import { cn } from "@/lib/utils";

export default function ShowSelection() {
  return (
    <View className="space-y-8">
      <View className="text-center">
        <View className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          选择日剧
        </View>
        <View className="text-gray-600 dark:text-gray-400">
          选择你想练习的日剧台词
        </View>
      </View>

      <View className="grid md:grid-cols-2 gap-6">
        {shows.map((show) => (
          <Navigator
            key={show.id}
            url={`/pages/index/index?show=${show.id}`}
            className={cn(
              "group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl",
              "transform hover:-translate-y-1"
            )}
          >
            <View className="aspect-video relative overflow-hidden">
              <Image
                src={show.coverImage}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                mode="aspectFill"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></View>

              <View className="absolute bottom-0 left-0 p-6 w-full">
                <View className="text-2xl font-bold text-white mb-2">
                  {show.title}
                </View>
                <View className="text-gray-200 mb-4 line-clamp-2">
                  {show.description}
                </View>
                <View className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {show.episodeCount} 集
                </View>
              </View>
            </View>
          </Navigator>
        ))}
      </View>
    </View>
  );
}
