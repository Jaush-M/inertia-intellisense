import path from "node:path";
import { locateInDocument, unglob } from "@/helpers";
import {
	type DocumentLink,
	type DocumentLinkProvider,
	type ProviderResult,
	type TextDocument,
	Uri,
	window,
	workspace,
} from "vscode";

interface DocumentLinkWithData extends DocumentLink {
	data: string;
}

export class ComponentLinkProvider implements DocumentLinkProvider {
	provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
		const helperRegex =
			/^(?!.*Route::inertia).*inertia\(\s*(['"])(?<component>.+?)(\1)/dgm;
		const renderRegex =
			/\bInertia::render\(\s*(['"])(?<component>(?:(?!\1).)*)(\1)/dgm;
		const routesRegex =
			/\bRoute::inertia\(\s*(["']).+\1\s*,\s*(["'])(?<component>(?:(?!\2).)*)\2/dgm;

		const components = [
			...locateInDocument(helperRegex, "component", document),
			...locateInDocument(renderRegex, "component", document),
			...locateInDocument(routesRegex, "component", document),
		];

		const workspaceURI = workspace.getWorkspaceFolder(document.uri)?.uri;
		if (!workspaceURI) {
			return [];
		}

		const componentGroups = workspace
			.getConfiguration("inertia")
			.get<any[]>("componentGroups", []);
		if (!componentGroups.length) {
			return undefined;
		}

		return components.map((component) => {
			return {
				range: component.range,
				data: component.value,
			} as DocumentLinkWithData;
		});
	}

	async resolveDocumentLink(
		link: DocumentLink,
	): Promise<DocumentLink | undefined> {
		const linkWithData = link as DocumentLinkWithData;
		const input = linkWithData.data.trim();

		const document = window.activeTextEditor?.document;
		if (!document) return undefined;

		const workspaceURI = workspace.getWorkspaceFolder(document.uri)?.uri;
		if (!workspaceURI) return undefined;

		const componentGroups = workspace
			.getConfiguration("inertia")
			.get<any[]>("componentGroups", []);
		if (!componentGroups.length) return undefined;

		const separators = workspace
			.getConfiguration("inertia")
			.get<string[]>("pathSeparators", ["."]);
		const defaultExt = workspace
			.getConfiguration("inertia")
			.get("defaultExtension", ".tsx");
		const defaultDomain = workspace
			.getConfiguration("inertia")
			.get("defaultDomain", "main");

		// Parse domain and component from input string, e.g. [domain]::component.path
		let domainSegment = defaultDomain;
		let componentSegment = input;
		const domainMatch = input.match(/^\[([^\]]+)\]::(.+)$/);
		if (domainMatch) {
			domainSegment = domainMatch[1];
			componentSegment = domainMatch[2];
		}

		const normalizedComponent = componentSegment.replaceAll(
			new RegExp(`[${separators.join("")}]`, "g"),
			"/",
		);

		let resolvedUri: Uri | undefined;

		for (const group of componentGroups) {
			const { glob, domainDir, pagesDir } = group;

			// Extract root folder before * in glob
			const rootMatch = glob.match(/^(.*?)\*/);
			const rootFolder = rootMatch ? rootMatch[1] : unglob(glob);

			// Handle multiple domains or wildcard
			const domainCandidates =
				domainSegment === "*"
					? [""]
					: domainSegment.split(/\s*,\s*/).map((d) => d.replace(/\./g, "/"));

			for (const domain of domainCandidates) {
				let candidatePath: string;
				if (domainDir) {
					candidatePath = path.posix.join(
						rootFolder,
						domain,
						pagesDir,
						normalizedComponent,
					);
				} else {
					// domain-less setup: no domain segment folder
					candidatePath = path.posix.join(
						rootFolder,
						pagesDir,
						normalizedComponent,
					);
				}

				// Check if the file exists among workspace files matching the group's glob
				const files = await workspace.findFiles(glob);
				resolvedUri = files.find((file) => file.path.includes(candidatePath));
				if (resolvedUri) break;
			}

			if (resolvedUri) break;
		}

		// If not found, fallback to default path in first componentGroup
		if (!resolvedUri && componentGroups.length > 0) {
			const firstGroup = componentGroups[0];
			const rootMatch = firstGroup.glob.match(/^(.*?)\*/);
			const rootFolder = rootMatch ? rootMatch[1] : unglob(firstGroup.glob);
			const domainPath = firstGroup.domainDir
				? path.posix.join(
						rootFolder,
						domainSegment,
						firstGroup.pagesDir,
						normalizedComponent + defaultExt,
					)
				: path.posix.join(
						rootFolder,
						firstGroup.pagesDir,
						normalizedComponent + defaultExt,
					);

			resolvedUri = Uri.joinPath(workspaceURI, domainPath);
		}

		link.target = resolvedUri;
		return link;
	}
}
