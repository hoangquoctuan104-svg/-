import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure the environment variable API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const streamChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: `你是一位名为"亚马逊合规专家" (Amazon Professionalist) 的资深顾问。
      你的核心原则是【真实性第一】。
      1. 请务必使用【中文】回答所有问题。
      2. 你的回答必须严格基于亚马逊官方服务条款 (TOS) 和政策。
      3. 如果你不知道答案或找不到官方文件，请直接回答“未找到相关官方文件”，严禁编造政策。
      4. 在每个实质性回答的末尾，必须附上：“参考来源：亚马逊卖家后台帮助文档”。
      5. 回答格式要求清晰、专业，适当使用分点陈述。`
    }
  });

  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};

interface AnalyzeOptions {
  text?: string;
  fileData?: string; // Base64
  mimeType?: string;
}

export const analyzeCompliance = async (options: AnalyzeOptions): Promise<string> => {
  const ai = getClient();
  
  // Select model based on input type. 
  // Use gemini-3-flash-preview for pure text/reasoning.
  // Use gemini-2.5-flash-image for images or PDFs (multimodal).
  const isMultimodal = !!options.fileData;
  const model = isMultimodal ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';

  const parts: any[] = [];

  // Add file part if exists
  if (options.fileData && options.mimeType) {
    parts.push({
      inlineData: {
        data: options.fileData,
        mimeType: options.mimeType
      }
    });
  }

  // Add prompt part
  const prompt = `作为一名亚马逊合规专员，请对提交的内容（文本、文档或图片）进行全面的合规性诊断。
  
  请重点检查以下风险：
  1. 敏感词违规：如 "Cure"(治疗), "Anti-bacterial"(抗菌), "Best Seller"(最畅销), "Free Shipping"(包邮), "FDA Approved" 等绝对化用语。
  2. 受限商品政策：检查是否包含攻击性武器、毒品相关或成人用品等受限内容。
  3. 误导性声明：夸大功效、虚假医疗声明等。
  4. 主图/标签规范：如果是图片，检查是否符合亚马逊主图白底、占比等要求（如适用）。

  请返回一个严格的 JSON 对象（不要使用 Markdown 代码块，仅返回原始 JSON 字符串），结构如下：
  {
    "hasViolation": boolean,
    "message": "简短的中文总结 (例如: '发现 3 处高风险违规' 或 '内容合规')",
    "details": [
      "具体问题 1 (例如: 包含禁止词汇 'Cure')",
      "具体问题 2"
    ]
  }
  
  如果输入是纯文本，请分析文本内容。如果输入是文档或图片，请分析其中的可见文字和视觉元素。`;

  if (options.text) {
    // If text is provided alongside a file (or alone)
    parts.push({ text: `[用户输入文本]:\n${options.text}\n\n[分析指令]:\n${prompt}` });
  } else {
    parts.push({ text: prompt });
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts }
  });

  return response.text || "{}";
};

// Deprecated: Alias for compatibility if needed, but we use the generic one now
export const analyzeImageCompliance = async (base64Image: string, mimeType: string) => {
  return analyzeCompliance({ fileData: base64Image, mimeType });
};