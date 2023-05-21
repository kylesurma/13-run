import { useSanityClient, groq } from 'astro-sanity';

console.log(useSanityClient);

export const getTeams = async () => {
	const query = groq`*[_type == "team"]`;
	return await useSanityClient().fetch(query);
};