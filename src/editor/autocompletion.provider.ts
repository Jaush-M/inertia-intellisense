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
		const lineContentUpToCursor = document.getText(
			new Range(position.line, 0, position.line, position.character),
		);

		const renderRegex = /\b(Inertia::render|inertia)\([\s\s]*["']$/;
		const routeRegex = /Route::inertia\([\s\S]*(['"]).+\1[\s\S]*,[\s\S]*['"]$/;

		if (
			!renderRegex.test(lineContentUpToCursor) &&
			!routeRegex.test(lineContentUpToCursor)
		) {
			return undefined;
		}

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

				// For domain-less setups, omit domain prefix
				const componentLabel =
					domainDir && domainSegment !== defaultDomain
						? `[${domainSegment}]::${relativeComponentPath}`
						: relativeComponentPath;

				const item = new CompletionItem(
					componentLabel,
					CompletionItemKind.Value,
				);
				item.detail = "Inertia.js page";
				completionItems.push(item);
			}
		}

		return completionItems;
	}
}
