const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export class DeepSeekAI {
  constructor() {
    this.apiKey = DEEPSEEK_API_KEY;
    this.apiUrl = DEEPSEEK_API_URL;
  }

  async makeRequest(messages, model = 'deepseek-chat') {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  // Fraud Detection
  async detectFraud(transactionData) {
    const messages = [
      {
        role: 'system',
        content: `You are a fraud detection AI for an escrow platform. Analyze the following transaction data and determine if there are any suspicious patterns or potential fraud indicators. Respond with a JSON object containing:
        {
          "risk_level": "low/medium/high",
          "fraud_indicators": ["list of suspicious patterns"],
          "recommendation": "approve/flag/review",
          "confidence": 0.0-1.0,
          "reasoning": "detailed explanation"
        }`
      },
      {
        role: 'user',
        content: `Analyze this transaction for fraud:
        - Transaction ID: ${transactionData.transactionId}
        - Title: ${transactionData.title}
        - Description: ${transactionData.description}
        - Price: $${transactionData.price}
        - Seller: ${transactionData.sellerName}
        - Buyer: ${transactionData.buyerName || 'N/A'}
        - File Type: ${transactionData.fileName}
        - Created: ${transactionData.createdAt}
        - Status: ${transactionData.status}`
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Fraud detection error:', error);
      return {
        risk_level: 'low',
        fraud_indicators: [],
        recommendation: 'approve',
        confidence: 0.5,
        reasoning: 'Unable to analyze due to API error'
      };
    }
  }

  // Support Chat
  async getSupportResponse(userMessage, context = {}) {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful support assistant for The MiddleMan escrow platform. You help users with:
        - How the escrow process works
        - Payment and dispute procedures
        - File upload and download issues
        - Transaction status questions
        - General platform support
        
        Be friendly, professional, and provide accurate information. If you don't know something, say so and suggest contacting support.
        
        Current context: ${JSON.stringify(context)}`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      return await this.makeRequest(messages);
    } catch (error) {
      console.error('Support chat error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team directly.";
    }
  }

  // Transaction Analysis
  async analyzeTransaction(transactionData) {
    const messages = [
      {
        role: 'system',
        content: `You are an AI assistant analyzing escrow transactions. Provide insights about:
        - Transaction health and risk factors
        - Potential issues or concerns
        - Recommendations for buyers or sellers
        - Market trends and pricing analysis
        
        Be helpful and provide actionable advice.`
      },
      {
        role: 'user',
        content: `Analyze this transaction:
        - Product: ${transactionData.title}
        - Description: ${transactionData.description}
        - Price: $${transactionData.price}
        - File: ${transactionData.fileName}
        - Status: ${transactionData.status}
        - Seller: ${transactionData.sellerName}
        - Buyer: ${transactionData.buyerName || 'N/A'}`
      }
    ];

    try {
      return await this.makeRequest(messages);
    } catch (error) {
      console.error('Transaction analysis error:', error);
      return "Unable to analyze transaction at this time.";
    }
  }
}

export default new DeepSeekAI(); 