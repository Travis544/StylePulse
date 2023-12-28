
import { OpenAI } from "openai";
import { COLOR_MATCH, COMPLETE_OUTFIT } from "./constants"
import * as FileSystem from 'expo-file-system';

import axios from 'axios'

const API_KEY = "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"
const engine_ID = "e4f82bc1a18454ff9"
const G_API_KEY = "AIzaSyB-tvnrIgn9E-S8dWOL23EL8rk2HHXfIHg"
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });


console.log(process.env)
console.log(API_KEY)



//text Prompt needs to be a variable and

//following are example prompts that may be constrcuted from the users input
const colorText = "What color sneakers matches the clothes in the image. Return your answer as a JSON object with the key being the color number and value being only the actual color. Include at least 3 colors"
const styleText = "What style top and shoes goes with this jeans. Return your answer as a json object with the key being the style type and value is the name of the clothes for each of the types requested." //might just ask one type only. Not two..

//The following function encodesTheImage in base64 string needed for vision API, but in our project may not need to read
export async function encodeImage(imageUri) {
  // const image = fs.readFileSync(imagePath);
  // return Buffer.from(image).toString('base64');
  try {
    const base64String = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64String;
  } catch (error) {
    console.error("Error converting image to base64 string:", error);
  }
}



const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};


let COLOR_MATCH_PROMPT = ` 
          Return the response in JSON. Each key in the JSON is the number rank and the value is the color.Avoid all other textual response`

let STYLE_MATCH_PROMPT = "Return the response in JSON. Each key in the JSON is the clothing type and the value is an array of styles for that clothing type phrased as valid clothing. For example, cable knit should be cable knit sweater, but sneaker should only be put as sneaker since it is valid word for clothing. Only include clothing type not in the picture."

//Sends the image and user prompt to OPENAI vision API to retrieve recommendations based on the recommendation type
export const uploadImageRequest = (base64_img, userPrompt, recommendationType) => {
  const selectedPrompt = recommendationType === COLOR_MATCH ? COLOR_MATCH_PROMPT : STYLE_MATCH_PROMPT
  const payload = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text", text: `${userPrompt}. ${selectedPrompt} Please do not include marking JSON marking. Just pure JSON.`
          },
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



export const fetchImageURLs = async (query, num) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: G_API_KEY,
          cx: engine_ID,
          searchType: 'image',
          q: query,
          num: num, // Number of images to return. Max is 10.
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

