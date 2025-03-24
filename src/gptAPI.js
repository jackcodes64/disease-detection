// src/gptService.js
export const askGPT = async (prompt) => {
    const apiKey = "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";
   
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a crop disease expert." },
            { role: "user", content: prompt },
          ],
        }),
      });
  
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      return "Consider using your AI api, my prompts are done!";
    }
  };
  