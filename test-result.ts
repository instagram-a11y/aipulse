import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
async function test() {
  const result = streamText({
    model: google('gemini-flash-latest'),
    prompt: 'hi'
  })
  console.log(Object.keys(result))
  // let's check its prototype chain as well
  let proto = Object.getPrototypeOf(result);
  let methods = [];
  while(proto) {
    methods.push(...Object.getOwnPropertyNames(proto));
    proto = Object.getPrototypeOf(proto);
  }
  console.log('Methods:', methods.filter(m => m.includes('Response')));
}
test()
