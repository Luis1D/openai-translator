import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const userPrompt = req.body.text;
  const language = req.body.language;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userPrompt, language),
      temperature: 0.6,
      max_tokens: 200,
    });
    res.status(200).json({ result: completion.data.choices[0].text });

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
  return `Translate ${userPrompt} to ${language}`;
}