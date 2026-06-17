const logger = require('../utils/logger');

// OpenAI client - initialized lazily
let openai = null;
const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

const callAI = async (systemPrompt, userMessage) => {
  const client = getOpenAI();
  if (!client) {
    // Fallback mock response when no API key
    return `[AI Advisor] Based on the data provided: ${userMessage.substring(0, 100)}... Analysis pending OpenAI configuration.`;
  }
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (err) {
    logger.error('OpenAI error:', err.message);
    throw new Error('AI service error: ' + err.message);
  }
};

const generateWorkforceInsights = async (data) => {
  const system = `You are an expert HR analytics advisor for AGS Health, a healthcare staffing company. 
  Provide actionable, concise workforce insights in bullet points. Be specific and data-driven.`;
  const prompt = `Analyze this workforce data and provide 5 key insights and recommendations:
  - Active Employees: ${data.active_employees}
  - Resigned this period: ${data.resigned}
  - New Joiners (last 90 days): ${data.new_joiners}
  - Average Performance Rating: ${data.avg_performance}
  - Open Positions: ${data.open_positions}`;
  return callAI(system, prompt);
};

const predictAttrition = async (employees) => {
  const highRisk = employees.filter(e => {
    const score = 0
      + (e.tenure_days < 365 ? 30 : 0)
      + (e.avg_rating < 3 ? 25 : 0)
      + (e.leaves_taken > 15 ? 20 : 0);
    e.attrition_risk = score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low';
    e.risk_score = score;
    return true;
  });
  return highRisk.sort((a, b) => b.risk_score - a.risk_score).slice(0, 20);
};

const getTrainingRecommendations = async (empData) => {
  const system = `You are a learning and development specialist for healthcare enterprise. 
  Recommend specific, relevant training courses for employee development.`;
  const prompt = `Employee Profile:
  Name: ${empData.first_name} ${empData.last_name}
  Department: ${empData.dept}
  Designation: ${empData.designation}
  Completed Training Categories: ${empData.completed_categories || 'None'}
  
  Recommend 5 specific training courses with rationale.`;
  return callAI(system, prompt);
};

const getHiringRecommendations = async (context) => {
  const system = `You are a talent acquisition specialist for a healthcare enterprise. 
  Provide strategic hiring recommendations.`;
  const prompt = `Current hiring context:
  Open Positions: ${context.open_positions}
  Active Requisitions: ${context.positions}
  
  Provide 5 strategic recommendations for improving recruitment efficiency and candidate quality.`;
  return callAI(system, prompt);
};

const chat = async (message, history = []) => {
  const client = getOpenAI();
  if (!client) {
    return 'AI Advisor is not configured. Please add your OpenAI API key to enable this feature.';
  }
  const messages = [
    {
      role: 'system',
      content: `You are the AGS Health Workforce Intelligence AI Advisor. You help HR managers with:
      - Employee management insights
      - Recruitment strategies  
      - Training recommendations
      - Performance analysis
      - Workforce planning
      Be concise, professional, and data-driven. Focus on healthcare industry context.`,
    },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (err) {
    logger.error('AI chat error:', err);
    throw new Error('AI chat unavailable');
  }
};

module.exports = { generateWorkforceInsights, predictAttrition, getTrainingRecommendations, getHiringRecommendations, chat };
