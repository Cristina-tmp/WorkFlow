import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(req: Request) {
  const { todos } = await req.json();
  //comm with openAI
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, always welcome the user. Limit the response to 200 characters.",
      },
      {
        role: "user",
        content: `Hi, provide a summary of the following todos. Count how many todos are in each catagory such as Todo, In Progress and Done, then tell the user to have a productive day. Here is the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const { data } = response;
  return NextResponse.json(data.choices[0].message);
}
