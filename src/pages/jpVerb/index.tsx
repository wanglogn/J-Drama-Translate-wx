import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Input, Button } from "@tarojs/components";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [verbInput, setVerbInput] = useState("");
  const [practiceVerb, setPracticeVerb] = useState("");
  const [conjugationResult, setConjugationResult] = useState<Record<
    string,
    string
  > | null>(null);
  const [verbType, setVerbType] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [practiceQuestions, setPracticeQuestions] = useState<
    Array<{ form: string; answer: string }>
  >([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showPracticeArea, setShowPracticeArea] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [wrongFields, setWrongFields] = useState<Record<string, boolean>>({});

  const switchTab = (id: string) => {
    setActiveTab(id);
  };

  const detectVerbType = (verb: string): string => {
    if (typeof verb !== "string" || verb.length === 0) return "";

    const exceptionalGodan = new Set([
      "入る",
      "走る",
      "知る",
      "帰る",
      "要る",
      "切る",
      "限る",
      "減る",
      "喋る",
      "滑る",
      "焦る",
      "握る",
      "蹴る",
      "交じる",
      "混じる",
      "遮る",
      "滅入る",
      "参る",
      "覆る",
      "嘲る",
      "罵る",
      "照る",
      "捻る",
    ]);

    const confirmedIchidan = new Set([
      "見る",
      "寝る",
      "出る",
      "食べる",
      "教える",
      "見せる",
      "受ける",
      "入れる",
      "変える",
      "始める",
      "続ける",
      "忘れる",
    ]);

    if (verb === "する") return "サ変動詞";
    if (verb === "くる" || verb === "来る") return "カ変動詞";

    if (verb.endsWith("する")) {
      return "サ変動詞";
    }

    if (verb.endsWith("る")) {
      if (exceptionalGodan.has(verb)) return "五段動詞";
      if (confirmedIchidan.has(verb)) return "一段動詞";

      const preChar = verb.charAt(verb.length - 2);

      const ichidanKana = new Set([
        "い",
        "き",
        "し",
        "ち",
        "に",
        "ひ",
        "み",
        "り",
        "ぎ",
        "じ",
        "ぢ",
        "び",
        "ぴ",
        "え",
        "け",
        "せ",
        "て",
        "ね",
        "へ",
        "め",
        "れ",
        "げ",
        "ぜ",
        "で",
        "べ",
        "ぺ",
      ]);

      if (ichidanKana.has(preChar)) return "一段動詞";

      return "五段動詞";
    }

    return "五段動詞";
  };

  const godanEndings = {
    う: [
      "い",
      "って",
      "った",
      "わ",
      "え",
      "おう",
      "えば",
      "える",
      "われる",
      "わせる",
      "わせられる",
    ],
    く: [
      "き",
      "いて",
      "いた",
      "か",
      "け",
      "こう",
      "けば",
      "ける",
      "かれる",
      "かせる",
      "かせられる",
    ],
    ぐ: [
      "ぎ",
      "いで",
      "いだ",
      "が",
      "げ",
      "ごう",
      "げば",
      "げる",
      "がれる",
      "がせる",
      "がせられる",
    ],
    す: [
      "し",
      "して",
      "した",
      "さ",
      "せ",
      "そう",
      "せば",
      "せる",
      "される",
      "させる",
      "させられる",
    ],
    つ: [
      "ち",
      "って",
      "った",
      "た",
      "て",
      "とう",
      "てば",
      "てる",
      "たれる",
      "たせる",
      "たせられる",
    ],
    ぬ: [
      "に",
      "んで",
      "んだ",
      "な",
      "ね",
      "のう",
      "ねば",
      "ねる",
      "なれる",
      "なせる",
      "なせられる",
    ],
    ぶ: [
      "び",
      "んで",
      "んだ",
      "ば",
      "べ",
      "ぼう",
      "べば",
      "べる",
      "ばれる",
      "ばせる",
      "ばせられる",
    ],
    む: [
      "み",
      "んで",
      "んだ",
      "ま",
      "め",
      "もう",
      "めば",
      "める",
      "まれる",
      "ませる",
      "ませられる",
    ],
    る: [
      "り",
      "って",
      "った",
      "ら",
      "れ",
      "ろう",
      "れば",
      "れる",
      "られる",
      "らせる",
      "らせられる",
    ],
  };

  const conjugateVerb = (
    verb: string
  ): Record<string, string> | { error: string } => {
    const type = detectVerbType(verb);

    if (type === "サ変動詞" && verb !== "する") {
      const base = verb.slice(0, -2);
      return {
        type,
        基本形: verb,
        ます形: base + "します",
        て形: base + "して",
        た形: base + "した",
        ない形: base + "しない",
        命令形: base + "しろ",
        意志形: base + "しよう",
        ば形: base + "すれば",
        可能形: base + "できる",
        被动形: base + "される",
        使役形: base + "させる",
        使役被动: base + "させられる",
      };
    }

    if (verb === "する") {
      return {
        type,
        基本形: "する",
        ます形: "します",
        て形: "して",
        た形: "した",
        ない形: "しない",
        命令形: "しろ",
        意志形: "しよう",
        ば形: "すれば",
        可能形: "できる",
        被动形: "される",
        使役形: "させる",
        使役被动: "させられる",
      };
    }

    if (verb === "くる" || verb === "来る") {
      return {
        type,
        基本形: verb === "来る" ? "来る" : "くる",
        ます形: "きます",
        て形: "きて",
        た形: "きた",
        ない形: "こない",
        命令形: "こい",
        意志形: "こよう",
        ば形: "くれば",
        可能形: "こられる",
        被动形: "こられる",
        使役形: "こさせる",
        使役被动: "こさせられる",
      };
    }
    if (verb === "行く" || verb === "いく") {
      return {
        type,
        基本形: verb === "行く" ? "行く" : "いく",
        ます形: "行きます",
        て形: "行って",
        た形: "行った",
        ない形: "行かない",
        命令形: "行け",
        意志形: "行こう",
        ば形: "行けば",
        可能形: "行ける",
        被动形: "行かれる",
        使役形: "行かせる",
        使役被动: "行かせられる",
      };
    }

    if (type === "一段動詞") {
      const base = verb.slice(0, -1);

      if (verb === "見る") {
        return {
          type,
          基本形: "見る",
          ます形: "見ます",
          て形: "見て",
          た形: "見た",
          ない形: "見ない",
          命令形: "見ろ",
          意志形: "見よう",
          ば形: "見れば",
          可能形: "見られる",
          被动形: "見られる",
          使役形: "見させる",
          使役被动: "見させられる",
        };
      }

      if (verb === "寝る") {
        return {
          type,
          基本形: "寝る",
          ます形: "寝ます",
          て形: "寝て",
          た形: "寝た",
          ない形: "寝ない",
          命令形: "寝ろ",
          意志形: "寝よう",
          ば形: "寝れば",
          可能形: "寝られる",
          被动形: "寝られる",
          使役形: "寝させる",
          使役被动: "寝させられる",
        };
      }

      return {
        type,
        基本形: verb,
        ます形: base + "ます",
        て形: base + "て",
        た形: base + "た",
        ない形: base + "ない",
        命令形: base + "ろ",
        意志形: base + "よう",
        ば形: base + "れば",
        可能形: base + "られる",
        被动形: base + "られる",
        使役形: base + "させる",
        使役被动: base + "させられる",
      };
    }

    if (type === "五段動詞") {
      const ending = verb.slice(-1);
      const base = verb.slice(0, -1);
      const endings = godanEndings[ending as keyof typeof godanEndings];

      if (!endings) {
        return { error: "対応できない動詞の語尾です。" };
      }

      const [i, te, ta, a, e, o, ba, kanou, ukemi, shieki, shiekiUkemi] =
        endings;

      return {
        type,
        基本形: verb,
        ます形: base + i + "ます",
        て形: base + te,
        た形: base + ta,
        ない形: base + a + "ない",
        命令形: base + e,
        意志形: base + o,
        ば形: base + ba,
        可能形: base + kanou,
        被动形: base + ukemi,
        使役形: base + shieki,
        使役被动: base + shiekiUkemi,
      };
    }

    return { error: "対応できない動詞形式です。" };
  };

  const showConjugation = () => {
    const verb = verbInput.trim();
    if (!verb) {
      Taro.showToast({
        title: "動詞を入力してください",
        icon: "none",
      });
      return;
    }

    const result = conjugateVerb(verb);
    setConjugationResult(result);

    if ("error" in result) {
      Taro.showToast({
        title: `エラー: ${result.error}`,
        icon: "none",
      });
    } else {
      setVerbType(`動詞タイプ：${result.type}`);
    }
  };

  const generatePractice = () => {
    const verb = practiceVerb.trim();
    if (!verb) {
      Taro.showToast({ title: "練習用の動詞を入力してください", icon: "none" });
      return;
    }

    const result = conjugateVerb(verb);
    if ("error" in result) {
      Taro.showToast({ title: `エラー: ${result.error}`, icon: "none" });
      setShowPracticeArea(false);
      return;
    }

    setPracticeType(`動詞タイプ：${result.type}`);
    setWrongFields({});

    const forms: Array<{ form: string; answer: string }> = [];
    for (const key in result) {
      if (key !== "type" && key !== "error") {
        forms.push({
          form: key,
          answer: result[key as keyof typeof result] as string,
        });
      }
    }

    const shuffledForms = [...forms].sort(() => Math.random() - 0.5);
    setPracticeQuestions(shuffledForms);
    setUserAnswers({});
    setShowPracticeArea(true);
    setFeedback("");
  };

  const handleAnswerChange = (form: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [form]: value,
    }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const newWrongFields: Record<string, boolean> = {};

    practiceQuestions.forEach((question) => {
      if (userAnswers[question.form]?.trim() === question.answer) {
        correctCount++;
        newWrongFields[question.form] = false;
      } else {
        newWrongFields[question.form] = true;
      }
    });

    setWrongFields(newWrongFields);

    setFeedback(
      `正解数: ${correctCount}/${practiceQuestions.length}  ${
        correctCount === practiceQuestions.length
          ? "すごい！全問正解です！"
          : "引き続き練習しましょう！"
      }`
    );

    if (correctCount < practiceQuestions.length) {
      Taro.showToast({
        title: `練習結果: ${correctCount}/${practiceQuestions.length} 正解しました`,
        icon: "none",
      });
    } else {
      Taro.showToast({
        title: "おめでとうございます！全問正解です！",
        icon: "none",
      });
    }
  };

  return (
    <View className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <View className="mx-auto bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <View className="bg-blue-600 text-white p-6 text-2xl sm:text-3xl font-bold text-center">
          日本語動詞活用変換ツール
        </View>

        {/* 标签页导航 */}
        <View className="flex border-b border-gray-200 dark:border-gray-700">
          <View
            onClick={() => switchTab("tab1")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === "tab1"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            動詞変形
          </View>
          <View
            onClick={() => switchTab("tab2")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === "tab2"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            変形練習
          </View>
        </View>

        {/* 标签页内容 */}
        <View className="p-6">
          {/* 動詞変形タブ */}
          {activeTab === "tab1" && (
            <View className="space-y-6">
              <View>
                <View className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Text>動詞（辞書形）を入力:</Text>
                  <Text>{verbType}</Text>
                </View>
                <View className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                  <Input
                    value={verbInput}
                    onInput={(e) => setVerbInput(e.detail.value)}
                    placeholder="例：書く、食べる、勉強する、見る、寝る"
                    className="w-ful focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </View>
                <Button
                  onClick={showConjugation}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  変形する
                </Button>
              </View>

              {/* 结果表 */}
              {conjugationResult && !("error" in conjugationResult) && (
                <View className="overflow-x-auto mt-6">
                  <View className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow">
                    <View className="bg-gray-100 dark:bg-gray-700 flex">
                      <Text className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 flex-1">
                        形式
                      </Text>
                      <Text className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 flex-1">
                        変形後
                      </Text>
                    </View>
                    {Object.entries(conjugationResult).map(([form, value]) => {
                      if (form === "type") return null;
                      return (
                        <View
                          key={form}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 flex"
                        >
                          <Text className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 flex-1">
                            {form}
                          </Text>
                          <Text className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 font-medium text-blue-600 dark:text-blue-400 flex-1">
                            {value}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* 変形練習タブ */}
          {activeTab === "tab2" && (
            <View className="space-y-6">
              <View>
                <View className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Text>動詞（辞書形）を入力:</Text>
                  <Text>{practiceType}</Text>
                </View>
                <View className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                  <Input
                    value={practiceVerb}
                    onInput={(e) => setPracticeVerb(e.detail.value)}
                    placeholder="例：話す、来る、する、見る、寝る"
                    className="w-full focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:text-white"
                  />
                </View>
                <Button
                  onClick={generatePractice}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  練習開始
                </Button>
              </View>

              {/* 练习区域 */}
              {showPracticeArea && (
                <View className="space-y-4 p-5 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    動詞活用練習
                  </Text>

                  <View className="space-y-4">
                    {practiceQuestions.map((question, index) => (
                      <View key={index} className="space-y-2">
                        <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {question.form}：
                          {wrongFields[question.form] && (
                            <Text className="ml-2 text-red-600">
                              正解: {question.answer}
                            </Text>
                          )}
                        </Text>
                        <View
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white ${
                            wrongFields[question.form]
                              ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <Input
                            value={userAnswers[question.form] || ""}
                            onInput={(e) =>
                              handleAnswerChange(question.form, e.detail.value)
                            }
                            placeholder="入力してください..."
                          />
                        </View>
                      </View>
                    ))}
                  </View>

                  <Button
                    onClick={checkAnswers}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 rounded-lg transition-colors duration-200"
                  >
                    チェック
                  </Button>

                  {feedback && (
                    <View className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-gray-800 dark:text-gray-200 font-medium">
                      {feedback}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {/* 页脚 */}
        <View className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
          日本語動詞活用自動変換ツール - 日本語学習に役立ててください
        </View>
      </View>
    </View>
  );
}
