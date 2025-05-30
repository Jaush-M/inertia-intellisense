import {
	CompletionItem,
	CompletionItemKind,
	type CompletionItemProvider,
	type CompletionList,
	type Position,
	Range,
	type TextDocument,
	workspace,
} from "vscode";

export class AutocompletionProvider implements CompletionItemProvider {
	async provideCompletionItems(
		document: TextDocument,
		position: Position,
	): Promise<CompletionItem[] | CompletionList<CompletionItem> | undefined> {
		const lineText = document.lineAt(position.line).text;
		const cursorIndex = position.character;

		// Quick check: cursor must be inside a quoted string
		const textBeforeCursor = lineText.slice(0, cursorIndex);
		const textAfterCursor = lineText.slice(cursorIndex);

		const quoteBefore = textBeforeCursor.lastIndexOf("'");
		const doubleQuoteBefore = textBeforeCursor.lastIndexOf('"');
		const quoteAfter = textAfterCursor.indexOf("'");
		const doubleQuoteAfter = textAfterCursor.indexOf('"');

		const insideSingleQuotes =
			quoteBefore > -1 && quoteAfter > -1 && quoteBefore > doubleQuoteBefore;
		const insideDoubleQuotes =
			doubleQuoteBefore > -1 &&
			doubleQuoteAfter > -1 &&
			doubleQuoteBefore > quoteBefore;

		if (!insideSingleQuotes && !insideDoubleQuotes) return undefined;

		// Check for Inertia context on the line
		const lineContentUpToCursor = document.getText(
			new Range(position.line, 0, position.line, position.character),
		);
		const isInInertiaCall = /\b(Inertia::render|inertia|Route::inertia)\(/.test(
			lineContentUpToCursor,
		);
		if (!isInInertiaCall) return undefined;

		const workspaceURI = workspace.getWorkspaceFolder(document.uri)?.uri;
		if (!workspaceURI) return [];

		const componentGroups = workspace
			.getConfiguration("inertia")
			.get<any[]>("componentGroups", []);
		const defaultDomain: string =
			workspace.getConfiguration("inertia").get("defaultDomain") || "main";
		const pathSeparators: string[] = workspace
			.getConfiguration("inertia")
			.get("pathSeparators") || ["."];
		const firstPathSeparator = pathSeparators[0];

		const domainSeparator = workspace
			.getConfiguration("inertia")
			.get("domainSeparator", "::");
		const domainDelimiters: { start: string; end: string }[] = workspace
			.getConfiguration("inertia")
			.get("domainDelimiters", [{ start: "[", end: "]" }]);

		const completionItems: CompletionItem[] = [];

		for (const group of componentGroups) {
			const { glob, domainDir, pagesDir } = group;

			const files = await workspace.findFiles({
				base: workspaceURI.toString(),
				baseUri: workspaceURI,
				pattern: glob,
			});

			const domainBaseRegex = domainDir
				? new RegExp(
						`${domainDir.replace(/\//g, "\\/")}/([^/]+)/${pagesDir.replace(/\//g, "\\/")}`,
					)
				: new RegExp(`${pagesDir.replace(/\//g, "\\/")}`);

			for (const fileUri of files) {
				const match = fileUri.fsPath.match(domainBaseRegex);
				if (!match) continue;

				const domainSegment = domainDir ? match[1] : defaultDomain;
				const domainPrefix = domainDir
					? `${domainDir}/${domainSegment}/${pagesDir}`
					: pagesDir;

				const domainPrefixIndex = fileUri.fsPath.indexOf(domainPrefix);
				if (domainPrefixIndex === -1) continue;

				const relativeComponentPath = fileUri.fsPath
					.slice(domainPrefixIndex + domainPrefix.length + 1)
					.replace(/\.[^/.]+$/, "")
					.replace(/\\|\/+/g, firstPathSeparator);

				if (domainDir && domainSegment !== defaultDomain) {
					for (const delimiter of domainDelimiters) {
						const label = `${delimiter.start}${domainSegment}${delimiter.end}${domainSeparator}${relativeComponentPath}`;
						const item = new CompletionItem(label, CompletionItemKind.Value);
						item.detail = "Inertia.js Page";
						item.sortText = `!000_${domainSegment}${relativeComponentPath}`;
						completionItems.push(item);
					}
				} else {
					const item = new CompletionItem(
						relativeComponentPath,
						CompletionItemKind.Value,
					);
					item.detail = "Inertia.js Page";
					item.sortText = `!000_${relativeComponentPath}`;
					completionItems.push(item);
				}
			}
		}

		return completionItems;
	}
}
