const axios = require('axios');

// @desc    Generate AI recommendation for an employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res) => {
  try {
    const { name, department, skills, performanceScore, experience } = req.body;

    if (!name || performanceScore === undefined) {
      return res.status(400).json({ message: 'Missing employee data for recommendation' });
    }

    const prompt = `
      Analyze the following employee's performance and provide:
      1. Promotion Recommendation
      2. Training Suggestions
      3. AI Feedback Generation
      
      Employee Details:
      - Name: ${name}
      - Department: ${department}
      - Skills: ${skills.join(', ')}
      - Performance Score: ${performanceScore}/100
      - Years of Experience: ${experience}
      
      Provide a concise, professional assessment.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // You can change this to another openrouter model if desired
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // Your site URL
          'X-Title': 'Employee Performance System', // Your site name
        },
      }
    );

    const recommendation = response.data.choices[0].message.content;

    res.status(200).json({ recommendation });
  } catch (error) {
    console.error('AI Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to generate recommendation' });
  }
};

module.exports = {
  getRecommendation,
};
