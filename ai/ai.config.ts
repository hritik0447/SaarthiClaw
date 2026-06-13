import {createOpenRouter} from '@openrouter/ai-sdk-provider';


export function getAgentModel(){
const provide = createOpenRouter({apiKey : process.env.OPENROUTER_API_KEY})


const modelID = process.env.OPENROUTER_DEFAULT_MODEL;

if (!modelID) {
  throw new Error("OPENROUTER_DEFAULT_MODEL is not set");
}

return provide(modelID);
}