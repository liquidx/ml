import { writable } from 'svelte/store';

export interface JamConfig {
	initialPrompt: string;
}

export const latestUserDialog = writable<string>('');
