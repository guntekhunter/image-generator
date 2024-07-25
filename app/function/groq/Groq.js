import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const fetchData = (inputText, callback, onError) => {
  return new Promise(async (resolve, reject) => {
    try {
      const model = new ChatGroq({
        apiKey: "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",
      });

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        ["human", inputText],
      ]);

      const outputParser = new StringOutputParser();
      const chain = prompt.pipe(model).pipe(outputParser);

      const responseStream = await chain.stream({
        input: { inputText },
      });

      let res = "";
      for await (const item of responseStream) {
        res += item;
        callback(item); // Callback for each chunk of data
      }
      resolve(res);
    } catch (error) {
      onError(error); // Callback for error handling
      reject(error);
    }
  });
};

export default fetchData;
