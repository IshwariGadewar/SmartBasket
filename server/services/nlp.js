const OpenAI = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function matchProducts(query, products) {
  try {
    const prompt = `
    Given the search query: "${query}"
    And the following products from different platforms:
    ${JSON.stringify(products, null, 2)}
    
    Please analyze and match equivalent products across platforms. Consider:
    1. Product names and descriptions
    2. Quantities and units
    3. Similar products with different packaging
    4. Brand variations
    
    Return a JSON array with matched product groups, where each group contains equivalent products from different platforms.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product matching expert. Analyze products and group equivalent items across different e-commerce platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback: return products grouped by platform
      return groupProductsByPlatform(products);
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return groupProductsByPlatform(products);
  }
}

function groupProductsByPlatform(products) {
  const grouped = {};
  products.forEach(product => {
    if (!grouped[product.platform]) {
      grouped[product.platform] = [];
    }
    grouped[product.platform].push(product);
  });
  return Object.values(grouped);
}

async function processChatbotQuery(message, context = {}) {
  try {
    const systemPrompt = `You are SmartCart AI, a helpful shopping assistant. You help users:
    1. Compare product prices across platforms
    2. Find the best deals
    3. Set price alerts
    4. Track inventory
    5. Provide shopping advice
    
    Current context: ${JSON.stringify(context)}
    
    Be friendly, helpful, and provide actionable advice. Keep responses concise but informative.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Chatbot API error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

async function extractProductInfo(text) {
  try {
    const prompt = `
    Extract product information from the following text:
    "${text}"
    
    Return a JSON object with:
    - productName: The main product name
    - quantity: Quantity and unit (e.g., "1kg", "12 pcs")
    - brand: Brand name if mentioned
    - category: Product category
    - keywords: Array of relevant search keywords
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product information extractor. Extract structured product data from user input."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Product extraction error:', error);
    return {
      productName: text,
      quantity: "1 unit",
      brand: "",
      category: "General",
      keywords: [text]
    };
  }
}

async function generateSearchSuggestions(query) {
  try {
    const prompt = `
    Generate 5 search suggestions for the query: "${query}"
    
    Consider:
    - Alternative product names
    - Different quantities/units
    - Brand variations
    - Related products
    
    Return a JSON array of search suggestions.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a search suggestion generator. Create relevant search alternatives."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Search suggestions error:', error);
    return [query];
  }
}

async function analyzePriceTrends(products) {
  try {
    const prompt = `
    Analyze the following products and provide price trend insights:
    ${JSON.stringify(products, null, 2)}
    
    Consider:
    - Price variations across platforms
    - Delivery costs impact
    - Best value options
    - Price vs quality trade-offs
    
    Return a JSON object with analysis and recommendations.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a price analysis expert. Provide insights on product pricing and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Price analysis error:', error);
    return {
      bestValue: products[0] || null,
      priceRange: { min: 0, max: 0 },
      recommendations: []
    };
  }
}

module.exports = { 
  matchProducts, 
  processChatbotQuery,
  extractProductInfo,
  generateSearchSuggestions,
  analyzePriceTrends
};