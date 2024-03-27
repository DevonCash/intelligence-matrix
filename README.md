# Intelligence Matrix

A digitized table roller for FIST

## Adding Content

Data for the intelligence matrix is broken up into two types. `Generators` are listed and categorized on the site. Each generator can reference multiple `Tables` to generate a result.

### Generators

Generators are defined in `src/content/generators`, and the navigation for the site is created from the structure of that directory. Each generator is defined in a YAML file with the following structure:

```yaml
# src/content/generators/generator_file_name.yaml
singular: Item # Singular name of the generator product
plural: Items # Plural name of the generator product
tables: # List of tables that the generator references
  Key: table_file_name # The table key and the file name it references, sans extension
  Key2:
    table: table_file_name # The table file name
    count: 3 # The number of results to include in each entry
```

### Tables

Tables are defined in `src/content/tables`, and are referenced by the generators. Each table is defined in a YAML file with the following structure:

```yaml
# src/content/tables/table_file_name.yaml
distribution: normal # The selection distribution for the table ( "normal" or "uniform" )
items: # List of items for the table
  - Item 1 # The text of the item
  - Item 2
  - Item 3
```

Tables can also be defined in shorthand if you want a uniform distribution and a simple list of strings:

```yaml
# src/content/tables/table_file_name.yaml
- Item 1
- Item 2
- Item 3
```

#### Item Types

Some items require additional information in order to display correctly. By default, all items support the property `name` and `extra` Currently the following item types are supported:

| Item Type | Additional Properties           |
| :-------- | :------------------------------ |
| `weapon`  | damage                          |
| `armor`   | armor, accessory, equipAsWeapon |
| `vehicle` | hp, armor                       |

In order to use these item types, add the item_type property to the table information, and include the additional properties as needed:

```yaml
# src/content/tables/gear_weapons.yaml
item_type: weapon
items:
  - name: Small blunt (baton, cane, etc.)
    damage: "3"
```

```yaml
# src/content/tables/gear_armor.yaml
distribution: normal
item_type: armor
items:
  - name: Combat shield
    armor: 0
    accessory: true
```

```yaml
# src/content/tables/gear_vehicles.yaml
item_type: vehicle
items:
  - name: Bike
    hp: 3
    armor: 0
```
