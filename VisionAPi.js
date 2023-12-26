
import { OpenAI } from "openai";

import axios from 'axios'

const API_KEY = "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"

console.log(process.env)
console.log(API_KEY)

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const imagePath = "/Users/nanabonsu/Downloads/Jeans_Style_GPT.jpeg" //need to replace this with imagePath from image on Device
const base64_img = encodeImage(imagePath)
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

          { type: "text", text: `${userPrompt}. Return the response in JSON. Each key in the JSON is a number and the value.. ` },
          {
            type: "image_url",
            image_url: {
              url: base64_img
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

//have a way to parse the JSON right, when needed!!

// uploadImageRequest();


//TODO: Need to format the response I believe to be JSON that can  be understood thats my problem!

