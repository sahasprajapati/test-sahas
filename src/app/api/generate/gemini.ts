import { GenerateContentStreamResult, GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'

export const generateGemini = async ({
  prompt,
  option,
  command,
  apiKey,
  language = 'Arabic',
}: {
  prompt: string
  option: string
  command: string
  apiKey: string
  language?: string
}) => {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!apiKey || apiKey === '') {
    return new Response('Missing GEMINI_API_KEY', {
      status: 400,
    })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest',
    generationConfig: {
      temperature: 0.7,
      topP: 1,
      maxOutputTokens: 200,
    },
  })

  let geminiStream: GenerateContentStreamResult
  switch (option) {
    case 'translate':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Using your guidelines, translate the following text into ${language} language.
                        Once translated, then enhance the readibility of it and only return the translated text
                        without any comments: ${prompt}`,
              },
            ],
          },
        ],
      })

      break
    case 'improve':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `The existing text is: ${prompt}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an AI writing assistant that improves existing text. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })
      break
    case 'summarize':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Using your guidelines, summarize the following article in its origianl language.
                      Once summarized, then enhance the readibility of it and only return the summarized text
                      without any comments: ${prompt}`,
              },
            ],
          },
        ],
        systemInstruction:
          'Your role is to summarize, and enahnce texts or articles, leveraging our knowledge base files: ' +
          'the editorial policy and style guide. These documents are essential for ensuring that your summarization ' +
          "not only maintain the original message's integrity but also align with our standards of clarity, " +
          'excellence, and distinct voice. With precision and creativity, craft versions that resonate ' +
          'in the new summary, all while upholding our editorial standards. Your deep understanding of these guidelines ' +
          'and your expertise in language are crucial for delivering content that meets our quality expectations.' +
          `Analyze the user prompt language and reply in the same language`,
      })
      break
    case 'rewrite':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `"Using your guidelines, rewrite the following article into Axios style.
                          Return the text without any comments: ${prompt};`,
              },
            ],
          },
        ],
        systemInstruction:
          `Your role as an editor, rewrite the given article into Axios article style.
                  Your rewrite should be clear, concise, and engaging. Use the given structure below as a style guide reference:
          
                  Provide a detailed narrative in markdown format, including subsections like 'why it matters', 'big picture', and 'between the lines'.
          
          ### High-Level Summary\\n- Overview of the story using single quotes where necessary.\\n\\n#### Why It Matters\\n- Explanation of the story's significance, using single quotes for quotes or specific terms.\\n\\n#### Big Picture\\n- Context and broader implications, detailed with single quotes in text. Escape any double quotes with a backslash (\\").\\n\\n#### Between the Lines\\n- In-depth analysis, using single quotes to highlight specific points or quotes. Escape any double quotes with a backslash (\\").\\n\\n#### Bullet Points\\n- Key facts or highlights, listed using single quotes for emphasis. Escape any double quotes with a backslash (\\").\\n\\n#### Additional Insights\\n- Further analysis or comments, incorporating single quotes for direct references or quotations. Escape any double quotes with a backslash (\\").
                  ` +
          'Analyze the language of the user prompt. The rewrite should be translated in the language of the original user prompt.',
      })
      break
    case 'shorter':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `The existing text is: ${prompt}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an AI writing assistant that shortens existing text. ' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })

      break
    case 'longer':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `The existing text is: ${prompt}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an AI writing assistant that lengthens existing text. ' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })
      break
    case 'fix':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `The existing text is: ${prompt}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })
      break
    case 'zap':
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `For this text: ${prompt}. You have to respect the command: ${command}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You area an AI writing assistant that generates text based on a prompt. ' +
          'You take an input from the user and a command for manipulating the text' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })

    case 'continue':
    default:
      geminiStream = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an AI writing assistant that continues existing text based on context from prior text. ' +
          'Give more weight/priority to the later characters than the beginning ones. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.' +
          `Analyze the user prompt language and reply in the same language`,
      })
  }

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
