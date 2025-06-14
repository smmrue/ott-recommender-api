import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export default async function handler(req, res) {
    const allowedOrigin = "https://smmrue.github.io"
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
}
console.log("요청 body 확인:", req.body);
const { ott, genre } = req.body;
if (!ott || !genre) {
    return res.status(400).json({error:"ott와 장르 선택을 해야 합니다. "});
} 
try {
    const prompt = `
    OTT 플랫폼: ${ott}
    원하는 장르: ${genre}
        
    위 정보를 기반으로 콘텐츠를 1개 추천해 줘.
    넷플릭스, 티빙, 왓챠, 쿠팡플레이 중 해당 플랫폼에 있는 작품으로 골라 줘.
    작품명, 간단한 소개를 포함해 줘.
`;
const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
        systemInstruction:
        "당신은 미디어 콘텐츠 추천 전문가입니다.OTT 플랫폼과 장르 정보를 받아 사용자가 즐길 수 있어할 만한 콘텐츠를 한 편 추천하세요. 친절하고 긍정적인 어조와 함께 콘텐츠를 200자 이내로 설명해 주세요.",
    },
});

res.status(200).json({ answer: result.text });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 오류 발생" });
}
}
