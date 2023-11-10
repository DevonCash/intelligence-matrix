import { z } from 'astro/zod';
import { defineCollection, reference } from 'astro:content';

const tables = defineCollection({
    type: 'data',
    schema: z.union([z.array(z.any()), z.object({
        distribution: z.enum(['normal', 'uniform']),
        items: z.array(z.any()),
    })]).transform((val) => {
        if(Array.isArray(val)) return { distribution: 'uniform', items: val }
        return val;
    })
});

const generators = defineCollection({
    type: 'data',
    schema: z.object({
        singular: z.string(),
        plural: z.string(),
        tables: z.record(reference('tables'))
    })
})

export const collections = {
    tables,
    generators
}

