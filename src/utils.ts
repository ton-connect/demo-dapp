export function isMobile(): boolean {
	return window.innerWidth <= 500;
}

export function openLink(href: string, target = '_self') {
	window.open(href, target, 'noreferrer noopener');
}
