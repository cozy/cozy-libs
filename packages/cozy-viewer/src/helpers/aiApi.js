/**
 * AI API helper functions for interacting with the AI service
 * This is a mock for demonstration purposes. It will be removed and replaced by function from cozy-client when the real AI service is available.
 */

/**
 * Generate a mock AI response for testing
 * @param {object} file - File document
 * @returns {Promise<object>} Mock AI response
 */
const getMockResponse = async file => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  return {
    choices: [
      {
        message: {
          content: `This is a mock summary of the document "${file.name}".

The document appears to be a ${
            file.mime || 'file'
          } containing important information. Key points include:

• Main topic and overview of the content
• Important details and findings
• Relevant conclusions and recommendations

This summary was generated using AI technology and may contain errors. Please verify the information with the original document.`
        }
      }
    ]
  }
}

/**
 * Summarize a file using AI with placeholder mechanism
 * @param {object} params
 * @param {object} params.file - File document to summarize
 * @param {boolean} params.stream - Whether to stream the response
 * @param {string} params.model - Optional model to use
 * @returns {Promise<object>} AI response
 */
export const summarizeFile = async ({ file, stream = false, model }) => {
  let requestBody

  requestBody = {
    messages: [
      { role: 'system', content: 'You are an expert in summary.' },
      { role: 'user', content: 'Summarize this:' }
    ],
    attachments: [{ type: 'io.cozy.files', id: file._id, purpose: 'input' }],
    tools: [
      {
        type: 'function',
        function: {
          name: 'parse'
        }
      }
    ],
    metadata: {
      action: 'summary'
    },
    stream
  }

  if (model) {
    requestBody.model = model
  }

  return await getMockResponse(file)
}
