import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import triangular from "@stdlib/random-base-triangular";

function rand_uniform<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

function rand_normal<T>(array: Array<T>): T {
  return array[Math.floor(triangular(0, array.length, array.length / 2))];
}

async function RollTableCategory(
  category: string,
  entry?: string,
  n: number = 1
) {
  const tables = await getCollection(
    "generators",
    entry
      ? ({ id }) => id.startsWith(`${category}/${entry}`)
      : ({ id }) => id.startsWith(category)
  );

  const results: any[] = [];
  for (let i = 0; i < n; i++) {
    const generator = rand_uniform(tables);

    const result: any = {};
    for (const trait in generator.data.tables) {
      const { data: table } = await getEntry(generator.data.tables[trait]);
      const selector =
        table.distribution === "normal" ? rand_normal : rand_uniform;
      result[trait] = selector(table.items) ?? [];
    }
    results.push({
      table: generator.id,
      name: generator.data.singular,
      result,
    });
  }
  return results;
}

export const GET: APIRoute = async ({ params, request }) => {
  const { path } = params;
  try {
    if (!path) throw new Error("No path provided");
    const [collection, entry] = path.split("/");
    const n = parseInt(new URL(request.url).searchParams.get("n") ?? "1");
    const results = await RollTableCategory(collection, entry, n);
    return new Response(JSON.stringify({ path, results }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response("Not found", { status: 404 });
  }
};
