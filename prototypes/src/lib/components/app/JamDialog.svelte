<script lang="ts">
	import showdown from 'showdown';
	import axios from 'axios';
	import { type GenerateContentRequest, type EnhancedGenerateContentResponse } from '@google/generative-ai';

	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import type { JamConfig } from '$lib/jamconfig'
	import { latestUserDialog } from '$lib/jamconfig';

	interface Dialog {
		role: string;
		text: string;
	}

  export let config : JamConfig;

	let loading = false;
	let inputClass: string = '';
	let errorMessage: string = '';

	let chatInput = '';
  let lastSentInput = '';
	let dialogTurns : Dialog[] = [];

	let markdown = new showdown.Converter();

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

	const generateContent = async (request: any) : Promise<EnhancedGenerateContentResponse> => {
		const response = await axios.post('/api/gg', {
				model:  'gemini-1.5-pro-latest',
				prompt: request,
			}) ;

		return response.data as EnhancedGenerateContentResponse;
	}


	const constructRequest = () : GenerateContentRequest => {
		let request :GenerateContentRequest = {
			contents: []
		}

		// Put in the inital prompt
		request.contents.push({
			role: 'user',
			parts: [
				{text: config.initialPrompt}
			]
		})

		// Insert the rest of the dialog into the prompt
		dialogTurns.forEach((dialogItem) => {
			request.contents.push({
				role: dialogItem.role,
				parts: [
					{text: dialogItem.text}
				]
			})
		})
		return request;
	}

	const continueChat = async (input: string) => {
		dialogTurns.push({role: 'user', text: input})
		dialogTurns = dialogTurns;
		loading = true;

		let request = constructRequest();
		let response = await generateContent(request) as EnhancedGenerateContentResponse
		loading = false;

		if (response && response.candidates) {
			let candidate = response.candidates[0]
			let content = candidate.content;
			let part = content.parts[0];
			if (part && part.text) {
				dialogTurns.push({role: 'model', text: part.text})
				dialogTurns = dialogTurns;
			}
		} else {
			errorMessage = 'No response found';
			console.log(response);
		}

	}

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			lastSentInput = chatInput.trim();
      latestUserDialog.update((last) => {
        return lastSentInput;
      })
			chatInput = '';
			continueChat(lastSentInput)
		}
	};

  latestUserDialog.subscribe((value) => {
    if (value && lastSentInput !== value) {
      console.log('got value', value);
      lastSentInput = value;
      continueChat(value);
    }
  });
</script>

<div class="flex flex-col justify-start w-[400px] border-t py-4">
  <div class="py-4 text-xs">Initial Prompt</div>
  <Textarea bind:value={config.initialPrompt} on:keydown={onEnter} rows={10} class={inputClass} />
  <div class="py-4">
    {#each dialogTurns as item}
    <div class="py-2">
      <div class="text-xs">{item.role}</div>
      <div class="">{@html markdown.makeHtml(item.text)}</div>

    </div>
    {/each}

  </div>
  <div><Input bind:value={chatInput} on:keydown={onEnter} /></div>
</div>