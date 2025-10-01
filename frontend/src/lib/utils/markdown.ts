export const processResponseContent = (content: string): string => {
	// Preprocess content to add proper line breaks for markdown elements
	// This is necessary when AI responses come as a single line

	// Step 1: Add newlines around horizontal rules (---)
	// "text. --- ### heading" -> "text.\n\n---\n\n### heading"
	content = content.replace(/(\S)\s+(---+)\s+/g, '$1\n\n$2\n\n');

	// Step 2: Add newlines before headings (###, ####, etc.)
	// "text. ### Heading" -> "text.\n\n### Heading"
	content = content.replace(/([^\n])\s+(#{1,6}\s)/g, '$1\n\n$2');

	// Step 2b: Add newlines after headings (when followed by sentence)
	// "### Heading Before text" -> "### Heading\n\nBefore text"
	content = content.replace(/(#{1,6}\s+[^\n]+?\))\s+([A-Z][a-z])/g, '$1\n\n$2');

	// Step 3: Add newlines before numbered list items (1., 2., 3., etc.)
	// "text. 1.  **Item:**" -> "text.\n\n1.  **Item:**"
	content = content.replace(/([.?!])\s+(\d+\.\s+)/g, '$1\n\n$2');

	// Step 4: Add newlines before bullet list items (*)
	// "text. *   **Item:**" -> "text.\n\n*   **Item:**"
	content = content.replace(/([.?!])\s+(\*\s+)/g, '$1\n\n$2');

	// Step 5: Ensure numbered lists have proper newlines between paragraphs
	// "sentence. **Bold:** text" -> "sentence.\n\n**Bold:** text" (when in context)
	content = content.replace(/([.?!])\s+(\*\*[^*]+\*\*:(?!\*))/g, '$1\n\n$2');

	// Step 6: Handle special case of closing bold followed by list item
	// "**text** *   **Item:**" -> "**text**\n\n*   **Item:**"
	content = content.replace(/(\*\*)\s+(\*\s+\*\*)/g, '$1\n\n$2');

	return content.trim();
};

export const replaceTokens = (
	content: string,
	sourceIds: string[] = [],
	char?: string,
	user?: string
): string => {
	const tokens = [
		{ regex: /{{char}}/gi, replacement: char },
		{ regex: /{{user}}/gi, replacement: user }
	];

	// Replace tokens outside code blocks only
	const processOutsideCodeBlocks = (text: string, replacementFn: (segment: string) => string) => {
		return text
			.split(/(```[\s\S]*?```|`[\s\S]*?`)/)
			.map((segment) => {
				return segment.startsWith('```') || segment.startsWith('`')
					? segment
					: replacementFn(segment);
			})
			.join('');
	};

	// Apply replacements
	content = processOutsideCodeBlocks(content, (segment) => {
		tokens.forEach(({ regex, replacement }) => {
			if (replacement !== undefined && replacement !== null) {
				segment = segment.replace(regex, replacement);
			}
		});

		if (Array.isArray(sourceIds)) {
			sourceIds.forEach((sourceId, idx) => {
				const regex = new RegExp(`\\[${idx + 1}\\]`, 'g');
				segment = segment.replace(regex, `<source_id data="${idx + 1}" title="${sourceId}" />`);
			});
		}

		return segment;
	});

	return content;
};

export const unescapeHtml = (html: string): string => {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.documentElement.textContent || '';
};
