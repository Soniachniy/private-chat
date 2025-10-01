import type {
	ChatCompletionRequest,
	ChatCompletionResponse,
	ChatCompletionStreamResponse,
	Chat
} from '../types';

const API_BASE_URL = 'http://localhost:8000'; // This will be configurable later

// Mock data for development
export const MOCK_CHATS: Chat[] = [
	{
		id: '1',
		title: 'Hello World Chat',
		user_id: 'user1',
		created_at: Date.now() - 86400000,
		updated_at: Date.now() - 86400000,
		messages: [
			{
				id: 'msg1',
				role: 'user',
				content: 'Hello! How are you?',
				timestamp: Date.now() - 86400000,
				model: 'gpt-4o'
			},
			{
				id: 'msg2',
				role: 'assistant',
				content:
					'Of course. Creating a buy/sell strategy for a token like **JAM** (JamboToken) requires a structured approach, blending fundamental analysis with technical indicators and strict risk management.\n\n**Important Disclaimer:** I am an AI assistant and this is not financial advice. The cryptocurrency market is extremely volatile and high-risk. JAM is a relatively new token, making it even more speculative. Always do your own research (DYOR) and never invest more than you can afford to lose.\n\nHere is a comprehensive framework you can use to build your own strategy for JamboToken.\n\n---\n\n### Phase 1: Foundational Analysis (The "Why")\n\nBefore looking at charts, you must understand what you\'re investing in.\n\n1.  **Project Fundamentals:**\n    *   **Utility:** What is Jambo\'s purpose? (e.g., gateway to Web3, core of the JamboPhone ecosystem, rewards for app usage). Strong utility = stronger long-term demand.\n    *   **Team & Backers:** Is the team credible? Are they backed by reputable VCs (e.g., Delphi Digital, Framework Ventures)? This often increases confidence.\n    *   **Tokenomics:**\n        *   **Total Supply:** What is the max and circulating supply?\n        *   **Inflation/Emissions:** Is new token supply constantly being minted, causing sell pressure?\n        *   **Vesting:** When do early investors and team tokens unlock? (This is a major source of sell pressure. Find their vesting schedule).\n    *   **Ecosystem Growth:** Are more people using the JamboPhone and the associated apps? Is there growing activity on the JamboChain?\n\n**Your Strategy:** Your long-term bullishness should be based on the strength of these fundamentals. If they are weak or unclear, your strategy should be more short-term and cautious.\n\n---\n\n### Phase 2: Technical Analysis & Strategy Framework\n\nThis is where we define the entry (buy) and exit (sell) points.\n\n#### A) Buy Strategy (When to Enter)\n\nA good strategy uses multiple confluent signals, not just one.\n\n1.  **Support Level Bounce:**\n    *   **Concept:** Buy when the price approaches a key historical support level and shows signs of bouncing back up.\n    *   **How to Identify:** Use the chart to find price zones where the token has reversed its downtrend multiple times in the past. Use indicators like **Volume Profile** to see high-volume nodes.\n    *   **Example:** "I will buy if JAM drops to the $0.0045 support level and the 4-hour candle closes above it with increasing volume."\n\n2.  **Moving Average Crossover:**\n    *   **Concept:** Use a faster-moving average (e.g., 20 EMA) crossing above a slower one (e.g., 50 EMA) as a buy signal.\n    *   **How:** Set up these indicators on your trading view (TradingView is excellent for this).\n    *   **Example:** "I will enter a long position if the 20 EMA crosses above the 50 EMA on the 4-hour chart, confirmed by an RSI > 50."\n\n3.  **RSI Oversold Condition:**\n    *   **Concept:** The Relative Strength Index (RSI) measures momentum. An RSI below 30 suggests the asset is oversold (potentially undervalued).\n    *   **How:** Use this as a *confirmation* signal, not a standalone one. Wait for RSI to go below 30 and then start curling back up.\n    *   **Example:** "If RSI on the 4-hour chart hits 28 and begins to rise while the price is at a support level, I will consider that a strong buy signal."\n\n#### B) Sell Strategy (When to Exit) - **CRITICAL**\n\nHaving an exit plan is more important than your entry plan.\n\n1.  **Take-Profit (TP) Targets:**\n    *   **Concept:** Pre-define price levels where you will take profits.\n    *   **How:** Use **Resistance Levels** from the chart. You can use a Risk-Reward Ratio (e.g., aim for a 3:1 reward-to-risk). If you risk $100, aim for a $300 profit.\n    *   **Example:** "I will sell 50% of my position at TP1 (Resistance level 1 at $0.0060) and another 25% at TP2 (Resistance level 2 at $0.0065)."\n\n2.  **Stop-Loss (SL) Orders:**\n    *   **Concept:** A pre-set order that automatically sells your tokens to cap your losses if the trade goes against you.\n    *   **How:** Place your stop-loss *just below* a key support level. This prevents you from being taken out by normal market "noise."\n    *   **Example:** "If I buy at $0.0050, I will set a hard stop-loss at $0.0043 (below the major support zone)."\n\n3.  **Trend Reversal Signs:**\n    *   **Concept:** Sell if the technical picture breaks down.\n    *   **How:** A break below a key support level (e.g., the 50 EMA or a major historical support) on high volume can be a signal to exit.\n    *   **Example:** "If the price closes a 4-hour candle below the 50 EMA and the RSI breaks below 40, I will sell my remaining position."\n\n---\n\n### Phase 3: Risk Management (The Golden Rule)\n\nThis is what separates gamblers from traders.\n\n1.  **Position Sizing:** Never allocate a large portion of your portfolio to a highly speculative asset like JAM. A common rule is to risk **no more than 1-2% of your total capital on any single trade**.\n2.  **Emotion Control:** Greed and fear are your biggest enemies. Your pre-defined strategy (from above) is your shield against them. **Stick to the plan.**\n3.  **DCA (Dollar-Cost Averaging):** Instead of one lump sum investment, consider splitting your buy order into 3-5 smaller chunks. Buy a little at your target, and if it drops further, buy a little more. This averages your entry price.\n\n---\n\n### Sample Strategy Summary for JAM\n\n*   **Timeframe:** 4-Hour Chart for signals, Daily chart for trend context.\n*   **Indicators:** 20 EMA, 50 EMA, RSI (14), Volume.\n*   **Buy Condition:** Price touches key support ($X.XXXX) + 20 EMA crosses above 50 EMA + RSI moves from <30 to above 35.\n*   **Stop-Loss:** 10-15% below entry price, or below the next major support level.\n*   **Take-Profit 1:** Sell 33% at Resistance Level 1 (R:R 1.5:1)\n*   **Take-Profit 2:** Sell 33% at Resistance Level 2 (R:R 3:1)\n*   **Exit Condition:** If the 4-hour candle closes below the 50 EMA, sell the remainder.\n\n**Final Step:** Backtest this strategy against historical JAM price action. Does it have a positive expectancy? Adjust the rules accordingly before using real capital.\n\nWould you like help identifying specific support/resistance levels or setting up these indicators on a chart?',
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg3',
				role: 'assistant',
				content:
					'Of course. Here is a basic JavaScript algorithm that implements a simple moving average crossover buy/sell strategy, similar to the one described in the previous section.\n\nThis is for **educational purposes only** and is not suitable for live trading without significant expansion and testing.\n\n### The Algorithm Logic\n\n*   **Indicator:** We use two Simple Moving Averages (SMA) - a "fast" period and a "slow" period.\n*   **Buy Signal:** When the fast SMA crosses **above** the slow SMA.\n*   **Sell Signal:** When the fast SMA crosses **below** the slow SMA.\n*   **Assumption:** The algorithm processes historical price data (an array of closing prices) and simulates trades.\n\n```javascript\n// ==============================================\n// SIMPLE MOVING AVERAGE CROSSOVER STRATEGY\n// (Educational Purpose Only)\n// ==============================================\n\n/**\n * Calculates the Simple Moving Average (SMA) for a given period.\n * @param {number[]} prices - Array of price data (e.g., closing prices)\n * @param {number} period - The period for the SMA (e.g., 20)\n * @returns {number[]} - An array of SMA values. The first (period-1) values are null.\n */\nfunction calculateSMA(prices, period) {\n  const smaValues = [];\n  // The first (period - 1) values don\'t have enough data, so we push null.\n  for (let i = 0; i < period - 1; i++) {\n    smaValues.push(null);\n  }\n  // Calculate the SMA for each subsequent point\n  for (let i = period - 1; i < prices.length; i++) {\n    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);\n    smaValues.push(sum / period);\n  }\n  return smaValues;\n}\n\n/**\n * Runs the SMA Crossover strategy on historical data.\n * @param {number[]} closingPrices - Historical closing prices.\n * @param {number} fastPeriod - Period for the fast SMA (e.g., 5).\n * @param {number} slowPeriod - Period for the slow SMA (e.g., 20).\n * @returns {Object} - Results object containing trades and final state.\n */\nfunction runStrategy(closingPrices, fastPeriod = 5, slowPeriod = 20) {\n\n  // 1. Calculate the indicators\n  const fastSMA = calculateSMA(closingPrices, fastPeriod);\n  const slowSMA = calculateSMA(closingPrices, slowPeriod);\n\n  // 2. Initialize state variables\n  let inPosition = false; // Are we currently holding the asset?\n  let trades = [];        // Array to log all trades\n  let cash = 10000;       // Starting capital\n  let coins = 0;          // Amount of cryptocurrency held\n  let currentTrade = {};  // Object to track the current trade\n\n  // 3. Loop through the data (starting from the slowPeriod to avoid null SMA values)\n  for (let i = slowPeriod; i < closingPrices.length; i++) {\n    const currentPrice = closingPrices[i];\n    const prevFastSMA = fastSMA[i - 1];\n    const prevSlowSMA = slowSMA[i - 1];\n    const currentFastSMA = fastSMA[i];\n    const currentSlowSMA = slowSMA[i];\n\n    // 4. Check for a BUY signal (Crossover: Fast was below Slow, now is above)\n    if (!inPosition && prevFastSMA < prevSlowSMA && currentFastSMA > currentSlowSMA) {\n      inPosition = true;\n      coins = cash / currentPrice; // Buy with all cash\n      cash = 0;\n\n      currentTrade = {\n        type: \'BUY\',\n        price: currentPrice,\n        dateIndex: i,\n        capital: coins * currentPrice // For tracking purposes\n      };\n      trades.push(currentTrade);\n      console.log(`BUY at ${currentPrice}`);\n    }\n\n    // 5. Check for a SELL signal (Crossunder: Fast was above Slow, now is below)\n    if (inPosition && prevFastSMA > prevSlowSMA && currentFastSMA < currentSlowSMA) {\n      inPosition = false;\n      cash = coins * currentPrice; // Sell all coins\n      coins = 0;\n\n      // Add profit/loss to the trade log\n      const profit = cash - currentTrade.capital;\n      const profitPct = (profit / currentTrade.capital) * 100;\n\n      trades.push({\n        type: \'SELL\',\n        price: currentPrice,\n        dateIndex: i,\n        profit: profit,\n        profitPct: profitPct.toFixed(2) + \'%\'\n      });\n      console.log(`SELL at ${currentPrice}. Profit: ${profitPct}%`);\n    }\n  }\n\n  // 6. Calculate final portfolio value\n  // If the simulation ends and we\'re still in a position, calculate based on the last price.\n  const finalEquity = inPosition ? (coins * closingPrices[closingPrices.length - 1]) : cash;\n  const totalReturn = ((finalEquity - 10000) / 10000) * 100;\n\n  // 7. Return the results\n  return {\n    trades: trades,\n    finalEquity: finalEquity,\n    totalReturnPct: totalReturn.toFixed(2) + \'%\',\n    fastSMA: fastSMA,\n    slowSMA: slowSMA\n  };\n}\n\n// ==============================================\n// EXAMPLE USAGE WITH SAMPLE DATA\n// ==============================================\n\n// Sample data: Array of closing prices (e.g., JAM token over 30 days)\nconst sampleClosingPrices = [\n  0.0050, 0.0052, 0.0051, 0.0054, 0.0055, // Day 1-5\n  0.0053, 0.0050, 0.0048, 0.0049, 0.0050, // Day 6-10\n  0.0052, 0.0055, 0.0058, 0.0060, 0.0062, // Day 11-15 (Uptrend)\n  0.0065, 0.0063, 0.0061, 0.0059, 0.0057, // Day 16-20\n  0.0055, 0.0053, 0.0050, 0.0047, 0.0045, // Day 21-25 (Downtrend)\n  0.0046, 0.0048, 0.0050, 0.0052, 0.0053  // Day 26-30\n];\n\n// Run the strategy with a fast SMA of 5 and a slow SMA of 10\nconst results = runStrategy(sampleClosingPrices, 5, 10);\n\nconsole.log("\\n--- STRATEGY RESULTS ---");\nconsole.log("Starting Capital: $10,000");\nconsole.log("Final Portfolio Value: $" + results.finalEquity.toFixed(2));\nconsole.log("Total Return: " + results.totalReturnPct);\nconsole.log("Trades Executed:", results.trades.length / 2); // Each trade is a BUY/SELL pair\nconsole.log("Full Trade Log:", results.trades);\n```\n\n### Key Concepts and Next Steps:\n\n1.  **This is a Simulator:** It runs on historical data to **backtest** a strategy. It does not connect to an exchange or execute real trades.\n2.  **Improvements Needed for Real Use:**\n    *   **Fees:** Subtract trading fees from `cash` on each trade.\n    *   **Slippage:** The actual buy/sell price might be worse than `currentPrice`.\n    *   **More Indicators:** Add RSI or volume confirmation to avoid false signals.\n    *   **Risk Management:** Implement a stop-loss and take-profit logic.\n    *   **Data Source:** Connect to a real API (like Binance, CoinGecko) to fetch live or historical data.\n3.  **Visualization:** The returned `fastSMA` and `slowSMA` arrays can be plotted on a chart alongside the price to visualize the crossovers.\n\nTo use this meaningfully, you would feed it with real historical price data for JAM and adjust the periods (`fastPeriod`, `slowPeriod`) to see how the strategy would have performed.',
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg4',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg5',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg6',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000
			},
			{
				id: 'msg7',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg8',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000
			},
			{
				id: 'msg1',
				role: 'user',
				content: 'Hello! How are you?',
				timestamp: Date.now() - 86400000
			},
			{
				id: 'msg2',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg3',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000
			},
			{
				id: 'msg4',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg5',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000
			},
			{
				id: 'msg6',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg7',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg8',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg9',
				role: 'user',
				content: 'Hello! How are you?',
				timestamp: Date.now() - 86400000
			},
			{
				id: 'msg10',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg11',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg12',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000
			},
			{
				id: 'msg13',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg14',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg15',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			},
			{
				id: 'msg16',
				role: 'assistant',
				content: "Hello! I'm doing well, thank you for asking. How can I help you today?",
				timestamp: Date.now() - 86400000 + 1000,
				model: 'gpt-4o'
			}
		]
	},
	{
		id: '2',
		title: 'React Development',
		user_id: 'user1',
		created_at: Date.now() - 43200000,
		updated_at: Date.now() - 43200000,
		messages: [
			{
				id: 'msg3',
				role: 'user',
				content: 'Can you help me with React hooks?',
				timestamp: Date.now() - 43200000
			},
			{
				id: 'msg4',
				role: 'assistant',
				content:
					'Of course! React hooks are a powerful feature that allow you to use state and other React features without writing a class component. What specific aspect of hooks would you like to learn about?',
				timestamp: Date.now() - 43200000 + 2000
			}
		]
	}
];

export class OpenAIClient {
	private apiKey: string;
	private baseURL: string;

	constructor(apiKey: string = '', baseURL: string = API_BASE_URL) {
		this.apiKey = apiKey;
		this.baseURL = baseURL;
	}

	async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
		// For now, return mock data
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

		return {
			id: `chatcmpl-${Date.now()}`,
			object: 'chat.completion',
			created: Math.floor(Date.now() / 1000),
			model: request.model,
			choices: [
				{
					index: 0,
					message: {
						role: 'assistant',
						content: `This is a mock response to: "${request.messages[request.messages.length - 1].content}". In a real implementation, this would come from the OpenAI API.`
					},
					finish_reason: 'stop'
				}
			],
			usage: {
				prompt_tokens: 50,
				completion_tokens: 30,
				total_tokens: 80
			}
		};
	}

	async *createChatCompletionStream(
		request: ChatCompletionRequest
	): AsyncIterable<ChatCompletionStreamResponse> {
		const responseText = `This is a mock streaming response to: "${request.messages[request.messages.length - 1].content}". Each word will appear one by one to simulate streaming.`;
		const words = responseText.split(' ');

		for (let i = 0; i < words.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate streaming delay

			yield {
				id: `chatcmpl-${Date.now()}`,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: request.model,
				choices: [
					{
						index: 0,
						delta: {
							role: i === 0 ? 'assistant' : undefined,
							content: (i === 0 ? '' : ' ') + words[i]
						},
						finish_reason: i === words.length - 1 ? 'stop' : undefined
					}
				]
			};
		}
	}

	// Chat management functions (these would normally be separate from OpenAI client)
	async getChats(): Promise<Chat[]> {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_CHATS;
	}

	async getChat(id: string): Promise<Chat | null> {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return MOCK_CHATS.find((chat) => chat.id === id) || null;
	}

	async createChat(title: string = 'New Chat'): Promise<Chat> {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const newChat: Chat = {
			id: `chat-${Date.now()}`,
			title,
			user_id: 'user1',
			created_at: Date.now(),
			updated_at: Date.now(),
			messages: []
		};

		MOCK_CHATS.unshift(newChat);
		return newChat;
	}

	async deleteChat(id: string): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 300));
		const index = MOCK_CHATS.findIndex((chat) => chat.id === id);
		if (index !== -1) {
			MOCK_CHATS.splice(index, 1);
		}
	}
}

export const openAIClient = new OpenAIClient();
