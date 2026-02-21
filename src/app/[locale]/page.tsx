import { T, Num, Currency, DateTime, Plural, Branch, Var } from "gt-next";
import { LocaleSelector } from "gt-next";

const inventory = [
  {
    id: "WDG-001",
    name: "steel-bolts",
    category: "hardware",
    stock: 2450,
    price: 0.12,
    lastRestocked: new Date("2026-02-15T09:30:00"),
    lowThreshold: 500,
  },
  {
    id: "WDG-002",
    name: "copper-wire",
    category: "electrical",
    stock: 85,
    price: 24.99,
    lastRestocked: new Date("2026-02-10T14:15:00"),
    lowThreshold: 100,
  },
  {
    id: "WDG-003",
    name: "oak-planks",
    category: "lumber",
    stock: 340,
    price: 8.75,
    lastRestocked: new Date("2026-02-18T11:00:00"),
    lowThreshold: 50,
  },
  {
    id: "WDG-004",
    name: "pvc-pipe",
    category: "plumbing",
    stock: 12,
    price: 3.49,
    lastRestocked: new Date("2026-01-28T16:45:00"),
    lowThreshold: 25,
  },
  {
    id: "WDG-005",
    name: "led-panel",
    category: "electrical",
    stock: 0,
    price: 45.0,
    lastRestocked: new Date("2026-01-15T08:00:00"),
    lowThreshold: 10,
  },
  {
    id: "WDG-006",
    name: "concrete-mix",
    category: "masonry",
    stock: 178,
    price: 6.25,
    lastRestocked: new Date("2026-02-12T10:30:00"),
    lowThreshold: 30,
  },
];

function ProductName({ name }: { name: string }) {
  return (
    <Branch
      branch={name}
      steel-bolts={<T>Steel Bolts (M8x30)</T>}
      copper-wire={<T>Copper Wire (14 AWG)</T>}
      oak-planks={<T>Oak Planks (2x4x8)</T>}
      pvc-pipe={<T>PVC Pipe (1 inch)</T>}
      led-panel={<T>LED Panel Light</T>}
      concrete-mix={<T>Concrete Mix (50 lb)</T>}
    />
  );
}

function CategoryName({ category }: { category: string }) {
  return (
    <Branch
      branch={category}
      hardware={<T>Hardware</T>}
      electrical={<T>Electrical</T>}
      lumber={<T>Lumber</T>}
      plumbing={<T>Plumbing</T>}
      masonry={<T>Masonry</T>}
    />
  );
}

type Recipe = {
  id: string;
  name: string;
  ingredients: { category: string; label: string; quantity: number }[];
  outputQuantity: number;
};

const recipes: Recipe[] = [
  {
    id: "RCP-001",
    name: "wired-shelf-bracket",
    ingredients: [
      { category: "hardware", label: "steel-bolts", quantity: 8 },
      { category: "lumber", label: "oak-planks", quantity: 2 },
      { category: "electrical", label: "copper-wire", quantity: 1 },
    ],
    outputQuantity: 1,
  },
  {
    id: "RCP-002",
    name: "plumbing-assembly",
    ingredients: [
      { category: "plumbing", label: "pvc-pipe", quantity: 4 },
      { category: "hardware", label: "steel-bolts", quantity: 12 },
      { category: "masonry", label: "concrete-mix", quantity: 2 },
    ],
    outputQuantity: 1,
  },
  {
    id: "RCP-003",
    name: "concrete-anchor-post",
    ingredients: [
      { category: "masonry", label: "concrete-mix", quantity: 6 },
      { category: "lumber", label: "oak-planks", quantity: 4 },
      { category: "hardware", label: "steel-bolts", quantity: 20 },
    ],
    outputQuantity: 2,
  },
  {
    id: "RCP-004",
    name: "illuminated-display",
    ingredients: [
      { category: "electrical", label: "led-panel", quantity: 2 },
      { category: "lumber", label: "oak-planks", quantity: 6 },
      { category: "hardware", label: "steel-bolts", quantity: 16 },
      { category: "electrical", label: "copper-wire", quantity: 3 },
    ],
    outputQuantity: 1,
  },
];

function RecipeName({ name }: { name: string }) {
  return (
    <Branch
      branch={name}
      wired-shelf-bracket={<T>Wired Shelf Bracket</T>}
      plumbing-assembly={<T>Plumbing Assembly</T>}
      concrete-anchor-post={<T>Concrete Anchor Post</T>}
      illuminated-display={<T>Illuminated Display Unit</T>}
    />
  );
}

function IngredientLabel({ label }: { label: string }) {
  return (
    <Branch
      branch={label}
      steel-bolts={<T>Steel Bolts</T>}
      copper-wire={<T>Copper Wire</T>}
      oak-planks={<T>Oak Planks</T>}
      pvc-pipe={<T>PVC Pipes</T>}
      led-panel={<T>LED Panel Lights</T>}
      concrete-mix={<T>Concrete Mix</T>}
    />
  );
}

function getStatus(stock: number, threshold: number): "ok" | "low" | "out" {
  if (stock === 0) return "out";
  if (stock <= threshold) return "low";
  return "ok";
}

function getStockByCategory(cat: string): number {
  return inventory
    .filter((item) => item.category === cat)
    .reduce((sum, item) => sum + item.stock, 0);
}

function getMaxCraftable(recipe: Recipe): number {
  let max = Infinity;
  for (const ingredient of recipe.ingredients) {
    const available = getStockByCategory(ingredient.category);
    const possible = Math.floor(available / ingredient.quantity);
    if (possible < max) max = possible;
  }
  return max === Infinity ? 0 : max;
}

export default function Home() {
  const totalItems = inventory.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );
  const lowStockCount = inventory.filter(
    (item) => getStatus(item.stock, item.lowThreshold) === "low"
  ).length;
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;

  const categories = Array.from(new Set(inventory.map((i) => i.category)));
  const categoryStats = categories.map((cat) => {
    const items = inventory.filter((i) => i.category === cat);
    const units = items.reduce((s, i) => s + i.stock, 0);
    const value = items.reduce((s, i) => s + i.stock * i.price, 0);
    return { category: cat, count: items.length, units, value };
  });

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200">
      <header className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://generaltranslation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              General Translation
            </a>
            <span className="text-neutral-700">/</span>
            <h1 className="text-sm font-semibold text-neutral-100">
              <T>Inventory Tracker</T>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gt-examples/inventory-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="View on GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <LocaleSelector />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <T>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-100 mb-3">
              Inventory Dashboard
            </h2>
            <p className="text-base text-neutral-400 max-w-2xl leading-relaxed">
              Track stock levels, prices, and restock dates for your warehouse.
              This example demonstrates locale-aware number formatting, currency
              display, date rendering, pluralization, and conditional branching.
            </p>
          </div>
        </T>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <T>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                Total Units
              </p>
              <p className="text-2xl font-semibold text-neutral-100">
                <Num>{totalItems}</Num>
              </p>
            </T>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <T>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                Inventory Value
              </p>
              <p className="text-2xl font-semibold text-neutral-100">
                <Currency currency="USD">{totalValue}</Currency>
              </p>
            </T>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <T>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                Low Stock
              </p>
              <p className="text-2xl font-semibold text-amber-400">
                <Plural
                  n={lowStockCount}
                  singular={<><Num>{lowStockCount}</Num> item</>}
                  plural={<><Num>{lowStockCount}</Num> items</>}
                  zero="None"
                />
              </p>
            </T>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <T>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                Out of Stock
              </p>
              <p className="text-2xl font-semibold text-red-400">
                <Plural
                  n={outOfStockCount}
                  singular={<><Num>{outOfStockCount}</Num> item</>}
                  plural={<><Num>{outOfStockCount}</Num> items</>}
                  zero="None"
                />
              </p>
            </T>
          </div>
        </div>

        {/* Category breakdown */}
        <T>
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-neutral-100 mb-4">
              Inventory by Category
            </h3>
          </div>
        </T>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {categoryStats.map((cat) => (
            <div
              key={cat.category}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                <CategoryName category={cat.category} />
              </p>
              <T>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-300">
                    <Plural
                      n={cat.count}
                      singular={<><Num>{cat.count}</Num> product</>}
                      plural={<><Num>{cat.count}</Num> products</>}
                    />
                  </p>
                  <p className="text-sm text-neutral-300">
                    <Num>{cat.units}</Num> units in stock
                  </p>
                  <p className="text-sm text-neutral-400">
                    Value: <Currency currency="USD">{cat.value}</Currency>
                  </p>
                </div>
              </T>
            </div>
          ))}
        </div>

        {/* Inventory table */}
        <div className="rounded-lg border border-neutral-800 overflow-hidden mb-14">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900">
                  <T>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">
                      SKU
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-400">
                      Stock
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-400">
                      Unit Price
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">
                      Last Restocked
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">
                      Status
                    </th>
                  </T>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const status = getStatus(item.stock, item.lowThreshold);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-neutral-200">
                        <ProductName name={item.name} />
                      </td>
                      <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        <Num>{item.stock}</Num>
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        <Currency currency="USD">{item.price}</Currency>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        <DateTime>
                          {item.lastRestocked}
                        </DateTime>
                      </td>
                      <td className="px-4 py-3">
                        <T>
                          <Branch
                            branch={status}
                            ok={
                              <span className="inline-flex items-center rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-800">
                                In Stock
                              </span>
                            }
                            low={
                              <span className="inline-flex items-center rounded-full bg-amber-950 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-800">
                                Low Stock
                              </span>
                            }
                            out={
                              <span className="inline-flex items-center rounded-full bg-red-950 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-800">
                                Out of Stock
                              </span>
                            }
                          />
                        </T>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crafting recipes */}
        <T>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-100 mb-3">
              Crafting View
            </h2>
            <p className="text-base text-neutral-400 max-w-2xl leading-relaxed">
              Recipes that can be assembled from current inventory. Availability
              is calculated from stock levels across categories.
            </p>
          </div>
        </T>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {recipes.map((recipe) => {
            const maxCraftable = getMaxCraftable(recipe);
            const craftable = maxCraftable > 0;
            return (
              <div
                key={recipe.id}
                className={`rounded-lg border p-5 ${
                  craftable
                    ? "border-emerald-800/50 bg-emerald-950/20"
                    : "border-neutral-800 bg-neutral-900/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">
                      <RecipeName name={recipe.name} />
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                      {recipe.id}
                    </p>
                  </div>
                  <T>
                    <Branch
                      branch={craftable ? "available" : "unavailable"}
                      available={
                        <span className="inline-flex items-center rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-800">
                          Available
                        </span>
                      }
                      unavailable={
                        <span className="inline-flex items-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-500 border border-neutral-700">
                          Insufficient Stock
                        </span>
                      }
                    />
                  </T>
                </div>

                <T>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                      Required Materials
                    </p>
                  </div>
                </T>
                <ul className="space-y-1.5 mb-4">
                  {recipe.ingredients.map((ing, idx) => {
                    const available = getStockByCategory(ing.category);
                    const sufficient = available >= ing.quantity;
                    return (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className={sufficient ? "text-neutral-300" : "text-red-400"}>
                          <T><Num>{ing.quantity}</Num>x <Var><IngredientLabel label={ing.label} /></Var></T>
                        </span>
                        <span className={`text-xs ${sufficient ? "text-neutral-500" : "text-red-500"}`}>
                          <T><Num>{available}</Num> available</T>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                  <T>
                    <p className="text-xs text-neutral-500">
                      <Plural
                        n={recipe.outputQuantity}
                        singular={<>Produces <Num>{recipe.outputQuantity}</Num> unit</>}
                        plural={<>Produces <Num>{recipe.outputQuantity}</Num> units</>}
                      />
                    </p>
                  </T>
                  <T>
                    <p className="text-sm font-medium">
                      <Branch
                        branch={craftable ? "can" : "cannot"}
                        can={
                          <span className="text-emerald-400">
                            Can craft up to <Num>{maxCraftable}</Num>
                          </span>
                        }
                        cannot={
                          <span className="text-neutral-600">
                            Cannot craft
                          </span>
                        }
                      />
                    </p>
                  </T>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <T>
          <p className="mt-8 text-xs text-neutral-600 text-center">
            This is an example application built with General Translation to
            demonstrate internationalization features including locale-aware
            number, currency, and date formatting.
          </p>
        </T>
      </main>
    </div>
  );
}
