import axios from "axios";
import { Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

export default async function (req, res) {
  const userPrompt = req.body.text;
  const language = req.body.language;

  try {
    const completion = await axios.post('https://api.openai.com/v1/chat/completions',{
      model: "gpt-4o",
      messages: [{ role: "system", content: generatePrompt(userPrompt, language) }],
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${configuration.apiKey}`,
      },
    });
    res.status(200).json({ result: completion.data.choices[0] });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userPrompt, language) {
  return `Translate ${userPrompt} to ${language}. Reply with only the translation.`;
}