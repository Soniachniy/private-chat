import React, { useMemo } from 'react';
import { marked } from 'marked';
import { processResponseContent, replaceTokens } from '@/lib/utils/markdown';
import MarkdownTokens from '@/components/chat/messages/MarkdownTokens';

// The original content from your example
const testContent = `Of course. Creating a buy/sell strategy for a token like **JAM** (JamboToken) requires a structured approach, blending fundamental analysis with technical indicators and strict risk management. **Important Disclaimer:** I am an AI assistant and this is not financial advice. The cryptocurrency market is extremely volatile and high-risk. JAM is a relatively new token, making it even more speculative. Always do your own research (DYOR) and never invest more than you can afford to lose. Here is a comprehensive framework you can use to build your own strategy for JamboToken. --- ### Phase 1: Foundational Analysis (The "Why") Before looking at charts, you must understand what you're investing in. 1.  **Project Fundamentals:** *   **Utility:** What is Jambo's purpose? (e.g., gateway to Web3, core of the JamboPhone ecosystem, rewards for app usage). Strong utility = stronger long-term demand. *   **Team & Backers:** Is the team credible? Are they backed by reputable VCs (e.g., Delphi Digital, Framework Ventures)? This often increases confidence. *   **Tokenomics:** *   **Total Supply:** What is the max and circulating supply? *   **Inflation/Emissions:** Is new token supply constantly being minted, causing sell pressure? *   **Vesting:** When do early investors and team tokens unlock? (This is a major source of sell pressure. Find their vesting schedule). *   **Ecosystem Growth:** Are more people using the JamboPhone and the associated apps? Is there growing activity on the JamboChain? **Your Strategy:** Your long-term bullishness should be based on the strength of these fundamentals. If they are weak or unclear, your strategy should be more short-term and cautious. --- ### Phase 2: Technical Analysis & Strategy Framework This is where we define the entry (buy) and exit (sell) points. #### A) Buy Strategy (When to Enter) A good strategy uses multiple confluent signals, not just one. 1.  **Support Level Bounce:** *   **Concept:** Buy when the price approaches a key historical support level and shows signs of bouncing back up. *   **How to Identify:** Use the chart to find price zones where the token has reversed its downtrend multiple times in the past. Use indicators like **Volume Profile** to see high-volume nodes. *   **Example:** "I will buy if JAM drops to the $0.0045 support level and the 4-hour candle closes above it with increasing volume." 2.  **Moving Average Crossover:** *   **Concept:** Use a faster-moving average (e.g., 20 EMA) crossing above a slower one (e.g., 50 EMA) as a buy signal. *   **How:** Set up these indicators on your trading view (TradingView is excellent for this). *   **Example:** "I will enter a long position if the 20 EMA crosses above the 50 EMA on the 4-hour chart, confirmed by an RSI > 50." 3.  **RSI Oversold Condition:** *   **Concept:** The Relative Strength Index (RSI) measures momentum. An RSI below 30 suggests the asset is oversold (potentially undervalued). *   **How:** Use this as a *confirmation* signal, not a standalone one. Wait for RSI to go below 30 and then start curling back up. *   **Example:** "If RSI on the 4-hour chart hits 28 and begins to rise while the price is at a support level, I will consider that a strong buy signal." #### B) Sell Strategy (When to Exit) - **CRITICAL** Having an exit plan is more important than your entry plan. 1.  **Take-Profit (TP) Targets:** *   **Concept:** Pre-define price levels where you will take profits. *   **How:** Use **Resistance Levels** from the chart. You can use a Risk-Reward Ratio (e.g., aim for a 3:1 reward-to-risk). If you risk $100, aim for a $300 profit. *   **Example:** "I will sell 50% of my position at TP1 (Resistance level 1 at $0.0060) and another 25% at TP2 (Resistance level 2 at $0.0065)." 2.  **Stop-Loss (SL) Orders:** *   **Concept:** A pre-set order that automatically sells your tokens to cap your losses if the trade goes against you. *   **How:** Place your stop-loss *just below* a key support level. This prevents you from being taken out by normal market "noise." *   **Example:** "If I buy at $0.0050, I will set a hard stop-loss at $0.0043 (below the major support zone)." 3.  **Trend Reversal Signs:** *   **Concept:** Sell if the technical picture breaks down. *   **How:** A break below a key support level (e.g., the 50 EMA or a major historical support) on high volume can be a signal to exit. *   **Example:** "If the price closes a 4-hour candle below the 50 EMA and the RSI breaks below 40, I will sell my remaining position." --- ### Phase 3: Risk Management (The Golden Rule) This is what separates gamblers from traders. 1.  **Position Sizing:** Never allocate a large portion of your portfolio to a highly speculative asset like JAM. A common rule is to risk **no more than 1-2% of your total capital on any single trade**. 2.  **Emotion Control:** Greed and fear are your biggest enemies. Your pre-defined strategy (from above) is your shield against them. **Stick to the plan.** 3.  **DCA (Dollar-Cost Averaging):** Instead of one lump sum investment, consider splitting your buy order into 3-5 smaller chunks. Buy a little at your target, and if it drops further, buy a little more. This averages your entry price. --- ### Sample Strategy Summary for JAM *   **Timeframe:** 4-Hour Chart for signals, Daily chart for trend context. *   **Indicators:** 20 EMA, 50 EMA, RSI (14), Volume. *   **Buy Condition:** Price touches key support ($X.XXXX) + 20 EMA crosses above 50 EMA + RSI moves from <30 to above 35. *   **Stop-Loss:** 10-15% below entry price, or below the next major support level. *   **Take-Profit 1:** Sell 33% at Resistance Level 1 (R:R 1.5:1) *   **Take-Profit 2:** Sell 33% at Resistance Level 2 (R:R 3:1) *   **Exit Condition:** If the 4-hour candle closes below the 50 EMA, sell the remainder. **Final Step:** Backtest this strategy against historical JAM price action. Does it have a positive expectancy? Adjust the rules accordingly before using real capital. Would you like help identifying specific support/resistance levels or setting up these indicators on a chart?`;

const MarkdownTest: React.FC = () => {
	const tokens = useMemo(() => {
		const processedContent = replaceTokens(
			processResponseContent(testContent),
			[],
			undefined,
			undefined
		);
		return marked.lexer(processedContent);
	}, []);

	console.log('=== MARKDOWN TEST ===');
	console.log('Total tokens:', tokens.length);
	tokens.forEach((t, i) => {
		console.log(`${i}: ${t.type}`, t.type === 'heading' ? `(depth: ${(t as any).depth})` : '');
	});

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
					Markdown Rendering Test
				</h1>

				<div className="bg-gray-50 dark:bg-gray-850 p-6 rounded-lg mb-8">
					<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Original Content Stats
					</h2>
					<p className="text-gray-700 dark:text-gray-300">
						Content length: {testContent.length} characters
					</p>
					<p className="text-gray-700 dark:text-gray-300">Tokens generated: {tokens.length}</p>
				</div>

				<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Rendered Output
					</h2>
					<div className="markdown-prose">
						<MarkdownTokens tokens={tokens} id="test-message" />
					</div>
				</div>

				<div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
					<p className="text-sm text-blue-800 dark:text-blue-200">
						<strong>Instructions:</strong> Open the browser console to see token details. The
						rendered output above should match the expected HTML structure with proper spacing,
						headings, lists, and horizontal rules.
					</p>
				</div>
			</div>
		</div>
	);
};

export default MarkdownTest;
