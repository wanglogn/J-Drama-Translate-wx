import { useState } from "react";
import { View, Text, Button, Textarea, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { TranslationItem } from "@/data/translationData";
import exchangeAltSolid from "@/assets/icons/exchange-alt-solid.png";
import volumeupB from "@/assets/icons/volumeup-b.png";
import arrowLeft from "@/assets/icons/arrow_left.png";
import arrowRight from "@/assets/icons/arrow_right.png";
interface TranslationCardProps {
  item: TranslationItem;
  onNext: () => void;
  onPrevious: () => void;
}

export default function TranslationCard({
  item,
  onNext,
  onPrevious,
}: TranslationCardProps) {
  const [userTranslation, setUserTranslation] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<
    "jp-to-cn" | "cn-to-jp"
  >("jp-to-cn");

  const toggleTranslationDirection = () => {
    setTranslationDirection((prev) =>
      prev === "jp-to-cn" ? "cn-to-jp" : "jp-to-cn"
    );
    setUserTranslation("");
    setShowAnswer(false);
  };

  const handleInputChange = (e) => {
    setUserTranslation(e.detail.value);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // 语音合成播放（需后端生成音频URL）
  const speakSourceLanguage = async () => {
    setIsSpeaking(true);
    const textToSpeak =
      translationDirection === "jp-to-cn" ? item.japanese : item.chinese;
    try {
      const res = await Taro.request({
        url: "你的语音合成API地址",
        method: "POST",
        data: {
          text: textToSpeak,
          lang: translationDirection === "jp-to-cn" ? "ja" : "zh",
        },
      });
      const audioUrl = res.data.url;
      const innerAudioContext = Taro.createInnerAudioContext();
      innerAudioContext.src = audioUrl;
      innerAudioContext.play();
      innerAudioContext.onEnded(() => {
        setIsSpeaking(false);
        innerAudioContext.destroy();
      });
      innerAudioContext.onError(() => {
        setIsSpeaking(false);
        innerAudioContext.destroy();
      });
    } catch (e) {
      setIsSpeaking(false);
      Taro.showToast({ title: "语音合成失败", icon: "none" });
    }
  };

  const hasTranslated = userTranslation.trim().length > 0;
  const isSimilar = hasTranslated
    ? userTranslation.length > item.chinese.length * 0.7
    : false;

  return (
    <View className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 难度标签和集数 */}
      <View className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium flex justify-between items-center"></View>

      {/* 原文区域 */}
      <View className="p-4">
        <View className="flex justify-between items-start mb-6">
          <Text className="text-lg font-semibold text-gray-800">
            {translationDirection === "jp-to-cn" ? "日语原文" : "中文原文"}
          </Text>
          <View className="flex">
            <Button
              onClick={toggleTranslationDirection}
              size="mini"
              disabled={isSpeaking}
              className="!p-1 rounded-full bg-purple-100 text-purple-600 !flex items-center justify-center"
            >
              <Image src={exchangeAltSolid} className="w-4 h-4"></Image>
            </Button>
            {/* 语音 */}
            {/* <Button
              onClick={speakSourceLanguage}
              size="mini"
              disabled={isSpeaking}
              className="!p-1.5 rounded-full bg-blue-100 text-blue-600 ml-3 !flex items-center justify-center"
            >
              <Image src={volumeupB} className="w-4 h-4"></Image>
            </Button> */}
          </View>
        </View>

        <View className="mb-4 p-4 bg-gray-50 rounded-lg">
          <Text className="text-xl font-medium text-gray-900 mb-2">
            {translationDirection === "jp-to-cn" ? item.japanese : item.chinese}
          </Text>
          {translationDirection === "jp-to-cn" && item.romaji && (
            <View className="text-sm text-gray-500 italic">{item.romaji}</View>
          )}
        </View>

        {/* 用户翻译输入 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {translationDirection === "jp-to-cn" ? "我的翻译" : "我的日语翻译"}
          </Text>
          <View className=" w-full p-4 border border-gray-300 rounded-lg overflow-hidden">
            <Textarea
              value={userTranslation}
              onInput={handleInputChange}
              placeholder={
                translationDirection === "jp-to-cn"
                  ? "请输入你的中文翻译..."
                  : "请输入你的日语翻译..."
              }
              className="w-full box-border min-h-[120px]"
              autoHeight
            />
          </View>
        </View>

        {/* 参考答案区域 */}
        <View className="mb-6">
          <View className="flex justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              {translationDirection === "jp-to-cn"
                ? "参考答案"
                : "日语参考译文"}
            </Text>
            <View
              onClick={toggleAnswer}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {showAnswer ? "隐藏答案" : "显示答案"}
            </View>
          </View>

          <View
            className={`p-4 rounded-lg border h-20 flex items-center justify-center ${
              showAnswer
                ? "bg-blue-50  border-blue-200 "
                : "bg-gray-100 border-gray-200 "
            }`}
          >
            {showAnswer ? (
              <Text className="text-gray-900">
                {translationDirection === "jp-to-cn"
                  ? item.chinese
                  : item.japanese}
              </Text>
            ) : (
              <Text className="text-gray-500 italic">
                点击"显示答案"查看参考翻译
              </Text>
            )}
          </View>
        </View>

        {/* 翻译反馈 */}
        {showAnswer && hasTranslated && (
          <View
            className={`p-3 rounded-lg mb-6 ${
              isSimilar
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            }`}
          >
            <Text className="text-sm">
              {isSimilar
                ? "翻译得不错！意思基本准确。"
                : "可以再尝试改进一下，注意语句的自然流畅度。"}
            </Text>
          </View>
        )}

        {/* 导航按钮 */}
        <View className="flex justify-between mt-auto pt-4 border-t border-gray-200">
          <View
            onClick={() => {
              setUserTranslation("");
              setShowAnswer(false);
              onPrevious();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center m-0"
          >
            <Image src={arrowLeft} className="w-4 h-4 mr-2"></Image> 上一题
          </View>
          <View
            onClick={() => {
              setUserTranslation("");
              setShowAnswer(false);
              onNext();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center m-0"
          >
            下一题<Image src={arrowRight} className="w-4 h-4 ml-2"></Image>
          </View>
        </View>
      </View>
    </View>
  );
}
