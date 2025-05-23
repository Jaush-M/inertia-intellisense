import { Range, type TextDocument, type Uri } from "vscode";

/**
 * Computes the difference between two paths
 */
export const pathDiff = (base: Uri, path: Uri) => {
	const baseParts = base.fsPath.split(/[\/\\]/).filter(Boolean);
	const pathParts = path.fsPath.split(/[\/\\]/).filter(Boolean);
	while (
		baseParts.length &&
		pathParts.length &&
		baseParts[0] === pathParts[0]
	) {
		baseParts.shift();
		pathParts.shift();
	}
	return pathParts.join("/");
};

/**
 * Returns the static part of a glob pattern
 *
 * This helper will return the static part of a given glob pattern. This means
 * that it will return everything before a glob character is encountered.
 *
 * For example, given the following glob pattern: `resources/js/pages/*.tsx`
 * the function will return `resources/js/pages/`.
 */
export const unglob = (glob: string): string => {
	const regex = /^(.*?)([*[{].*|$)/;
	const match = glob.match(regex);
	return match ? match[1] : "";
};

/**
 * Locates a pattern in a document an returns the range of all occurences.
 */
export const locateInDocument = (
	pattern: RegExp,
	group: string,
	document: TextDocument,
): { value: string; range: Range }[] => {
	const results: { value: string; range: Range }[] = [];

	while (true) {
		const match = pattern.exec(document.getText());
		if (!match) break;
		if (match.groups?.[group] && match.indices?.groups?.[group]) {
			results.push({
				value: match.groups?.[group],
				range: new Range(
					document.positionAt(match.indices.groups[group][0]),
					document.positionAt(match.indices.groups[group][1]),
				),
			});
		}
	}

	return results;
};
