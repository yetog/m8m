'use server'

import { NodeData, ApiResponse } from '../types/types'

// API endpoints
const API_ENDPOINTS = {
  URL: `${process.env.LANGFLOW_API_BASE}/api/v1/run/${process.env.URL_ENDPOINT_ID}?stream=false`,
  YOUTUBE: `${process.env.LANGFLOW_API_BASE}/api/v1/run/${process.env.YT_ENDPOINT_ID}?stream=false`,
  PROMPT: `${process.env.LANGFLOW_API_BASE}/api/v1/run/${process.env.PROMPT_ENDPOINT_ID}?stream=false`
}

// Helper function to determine the input type
function determineInputType(input: string): 'URL' | 'YOUTUBE' | 'PROMPT' {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

  if (youtubeRegex.test(input)) {
    return 'YOUTUBE'
  } else if (urlRegex.test(input)) {
    return 'URL'
  } else {
    return 'PROMPT'
  }
}

// Function to call the appropriate API based on input type
export async function generateMindMap(input: string): Promise<NodeData> {
  const inputType = determineInputType(input)
  const endpoint = API_ENDPOINTS[inputType]

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_value: input,
        output_type: "chat",
        input_type: "chat",
        tweaks: {}
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    
    // Log the full response for debugging
    console.log('Full API response:', JSON.stringify(data, null, 2))
    
    // Extract the JSON string from the nested response
    const mindMapJsonString = data.outputs[0].outputs[0].results.message.text
    
    if (!mindMapJsonString) {
      throw new Error('No mind map data received from API')
    }
    
    // Parse the JSON string into an object
    const parsedData: NodeData = JSON.parse(mindMapJsonString)
    console.log('Parsed mind map data:', parsedData)
    return parsedData
  } catch (error) {
    console.error('Error calling API:', error)
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON received:', error.message)
    }
    throw error
  }
} 