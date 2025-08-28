import { Navigator, View, Text, Image } from "@tarojs/components";

export default function Home() {
  return (
    <view class="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <view class="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <view class="text-xl font-bold text-gray-800 mb-4 text-center">
          使用声明
        </view>
        <view class="text-gray-600 text-base leading-relaxed space-y-4">
          <view>
            本小程序所展示的内容和数据，均由 AI 整理与生成，旨在学习与交流使用。
          </view>
          <view>
            如您认为其中涉及版权问题，请与作者联系，我们将在第一时间下架相关内容。
          </view>
          <view>
            如您对本小程序有任何意见或需求，敬请联系作者，我们将持续改进 💌
          </view>
          <view class="pt-2 font-medium text-gray-700 text-center">
            感谢您的理解与支持 🙏
          </view>
          <button
            open-type="contact"
            class="mt-4 rounded-lg bg-blue-600 text-white"
          >
            意见反馈
          </button>
        </view>
      </view>
    </view>
  );
}
