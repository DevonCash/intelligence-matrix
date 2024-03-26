import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";

const TableItem = z.object({
  name: z.string(),
  desc: z.string().optional(),
  extra: z.array(z.string()).optional(),
});

const Table = z.object({
  distribution: z.enum(["normal", "uniform"]).optional().default("uniform"),
  items: z.union([z.array(z.string()), z.array(TableItem)]),
});

const ArmorTable = Table.extend({
  item_type: z.literal("armor"),
  items: z.array(
    TableItem.extend({
      armor: z.number().optional(),
      equipAsWeapon: z.boolean().optional(),
      accessory: z.boolean().optional(),
    }),
  ),
});

const WeaponTable = Table.extend({
  item_type: z.literal("weapon"),
  items: z.array(
    TableItem.extend({
      damage: z.string().optional(),
    }),
  ),
});

const VehicleTable = Table.extend({
  item_type: z.literal("vehicle"),
  items: z.array(
    TableItem.extend({
      hp: z.number(),
      armor: z.number(),
    }),
  ),
});

const tables = defineCollection({
  type: "data",
  schema: z.union([
    z
      .discriminatedUnion("item_type", [ArmorTable, WeaponTable, VehicleTable])
      .transform((table) => {
        if (table.item_type) {
          for (const item of table.items) {
            item.item_type = table.item_type;
          }
        }
        return table;
      }),
    Table,
    z.array(z.string()).transform((items) => ({
      distribution: "uniform",
      items,
    })),
  ]),
});

const generators = defineCollection({
  type: "data",
  schema: z.object({
    singular: z.string(),
    plural: z.string(),
    tables: z.record(
      z.union([
        z.object({
          table: reference("tables"),
          count: z.number().optional().default(1),
        }),

        reference("tables").transform((ref) => ({
          table: ref,
          count: 1,
        })),
      ]),
    ),
  }),
});

export const collections = {
  tables,
  generators,
};
