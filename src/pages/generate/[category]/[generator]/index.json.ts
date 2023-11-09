import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import triangular from "@stdlib/random-base-triangular";

function rand_uniform(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
}

function rand_normal(array: Array<any>) {
    return array[Math.floor(triangular(0, array.length, (array.length / 2)))];
}

export const GET: APIRoute = async ({ params, request }) => {
    const { category, generator } = params;
    const path = `${category}/${generator}`;
    const { searchParams } = new URL(request.url);
    try {
        if (!path) throw new Error('No path provided');

        const generator = await getEntry('generators', path);
        if (!generator) throw new Error('No generator found');

        const { data } = generator;
        const results: (typeof data.tables)[] = [];
        const n = searchParams.get('n') ? parseInt(searchParams.get('n')!) : 1;
        for (let i = 0; i < n; i++) {
            const result: typeof data.tables = {};
            for (const key in data.tables) {
                const { id, collection } = data.tables[key];
                const { data: table } = await getEntry(collection, id);
                const select = table.distribution === 'uniform' ? rand_uniform : rand_normal;
                result[key] = select(table.items);
            }
            results.push(result);
        }

        return new Response(JSON.stringify({ generator: data.name, results }), {headers: {'content-type': 'application/json'}});
    } catch (e) {
        return new Response('Not found', { status: 404 });
    }
}