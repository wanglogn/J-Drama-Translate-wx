// 翻译项目接口定义
export interface TranslationItem {
  id: number;
  japanese: string;
  romaji?: string;
  chinese: string;
  context?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  episode: number;
}

export interface EpisodeData {
  number: number;
  title: string;
  lines: TranslationItem[];
}

// 获取单集数据（外部传入 json）
export const getEpisodeData = async (
  episodeJson: any
): Promise<EpisodeData | null> => {
  if (!episodeJson) return null;
  return {
    number: episodeJson.number,
    title: episodeJson.title,
    lines: episodeJson.lines,
  };
};

// 获取剧集所有集数信息（外部传入 json 数组）
export const getEpisodesByShow = async (
  episodesJson: any[]
): Promise<{ number: number; title: string; lines: TranslationItem[] }[]> => {
  const results: { number: number; title: string; lines: TranslationItem[] }[] =
    [];
  for (const episodeJson of episodesJson) {
    const ep = await getEpisodeData(episodeJson);
    if (ep) {
      results.push({
        number: ep.number,
        title: ep.title,
        lines: ep.lines,
      });
    }
  }
  return results;
};

// 根据剧集和集数获取台词（外部传入 json 数组和集数）
export const getLinesByShowAndEpisode = async (
  episodesJson: any[],
  episodeNumber: number
): Promise<TranslationItem[]> => {
  const ep = await getEpisodeData(
    episodesJson.find((e) => e.number === episodeNumber)
  );
  return ep ? ep.lines : [];
};

// 获取剧集所有台词（外部传入 json 数组）
export const getAllItemsByShow = async (
  episodesJson: any[]
): Promise<TranslationItem[]> => {
  const items: TranslationItem[] = [];
  for (const episodeJson of episodesJson) {
    const ep = await getEpisodeData(episodeJson);
    if (ep) items.push(...ep.lines);
  }
  return items;
};

// 获取指定 ID 的台词（外部传入 json 数组和 id）
export const getTranslationItemById = async (
  episodesJson: any[],
  id: number
): Promise<TranslationItem | undefined> => {
  const allItems = await getAllItemsByShow(episodesJson);
  return allItems.find((item) => item.id === id);
};
