
import { OpenAI } from "openai";

import axios from 'axios'

const API_KEY = "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"
const engine_ID = "e4f82bc1a18454ff9"
const  G_API_KEY = ""
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });


console.log(process.env)
console.log(API_KEY)



//text Prompt needs to be a variable and

//following are example prompts that may be constrcuted from the users input
const colorText = "What color sneakers matches the clothes in the image. Return your answer as a JSON object with the key being the color number and value being only the actual color. Include at least 3 colors"
const styleText = "What style top and shoes goes with this jeans. Return your answer as a json object with the key being the style type and value is the name of the clothes for each of the types requested." //might just ask one type only. Not two..

//The following function encodesTheImage in base64 string needed for vision API, but in our project may not need to read
export function encodeImage(imagePath) {
  // const image = fs.readFileSync(imagePath);
  // return Buffer.from(image).toString('base64');
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

//Sends the image and user prompt to OPENAI vision API to retrieve recommendations based on the recommendation type
export const uploadImageRequest = (base64_img, userPrompt, recommendationType) => {

  const payload = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `${userPrompt}. Rank the colors based on how well they go the clothes item. Return the response in JSON. Each key in the JSON is the number rank and the key is the color.. ` },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64_img}`
            }
          }
        ]
      }
    ],
    max_tokens: 300
  };

  return axios.post("https://api.openai.com/v1/chat/completions", payload, { headers: headers })
    .then(response => {
      console.log(response.data.choices[0].message.content);
      return response.data.choices[0].message.content
    })
    .catch(error => {
      console.error("Error:", error);
    });

}

const fetchImageURLs = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: googleApiKey,
          cx: searchEngineId,
          searchType: 'image',
          q: query,
          num: 10, // Number of images to return. Max is 10.
        },
      }
    );
    
    const imageLinks = response.data.items.map(item => item.link);
     return imageLinks;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};



//have a way to parse the JSON right, when needed!!

// uploadImageRequest();


//TODO: Need to format the response I believe to be JSON that can  be understood thats my problem!

