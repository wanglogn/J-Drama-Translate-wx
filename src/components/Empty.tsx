import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";

// Empty component
export function Empty() {
  return (
    <View
      className="flex h-full items-center justify-center"
      onClick={() => Taro.showToast({ title: "敬请期待", icon: "none" })}
    >
      <Text>Empty</Text>
    </View>
  );
}
