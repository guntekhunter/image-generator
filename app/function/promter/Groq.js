import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const fetchPrompt = (inputText) => {
  return new Promise(async (resolve, reject) => {
    try {
      const model = new ChatGroq({
        apiKey: "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",
      });

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "Kamu adalah propter profesional yang dapat membuat prompt sesuai informasi yang diasukkan pengguna, kamu akan membuat promp untuk image generator untuk mendesain interior berdasarkan sesuai dengan gambar yang diberikan. Anda harus memberikan jawaban yang jelas, praktis, dan ramah. dan semua responmu dalam bahasa indonesia",
        ],
        ["human", inputText],
      ]);

      const chain = prompt.pipe(model);
      const response = await chain.invoke({
        input: { inputText },
      });
      console.log("response", response);
      resolve(response);
    } catch (error) {
      console.log(error); // Callback for error handling
      reject(error);
    }
  });
};

export default fetchPrompt;
