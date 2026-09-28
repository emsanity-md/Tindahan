import { searchProducts, peso, qty } from "../src/lib/format";
import { INITIAL_PRODUCTS, stockState } from "../src/lib/data";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.log(`FAIL ${label}: got ${JSON.stringify(actual)} want ${JSON.stringify(expected)}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// The load-bearing behaviour: partial typing must find the product.
check("'sanmig' finds San Miguel first", searchProducts(INITIAL_PRODUCTS, "sanmig", 1)[0]?.name, "San Miguel Pale Pilsen 320ml");
check("'coke' finds Coca-Cola", searchProducts(INITIAL_PRODUCTS, "coke", 1)[0]?.name, "Coca-Cola 1.5L");
check("'skyf' finds Skyflakes", searchProducts(INITIAL_PRODUCTS, "skyf", 1)[0]?.name, "Skyflakes 250g");
check("'indo' prefix match", searchProducts(INITIAL_PRODUCTS, "indo", 1)[0]?.name, "Indomie Chicken 85g");
check("'indomie' word-prefix", searchProducts(INITIAL_PRODUCTS, "indomie", 1)[0]?.name, "Indomie Chicken 85g");
check("case insensitive", searchProducts(INITIAL_PRODUCTS, "MILO", 1)[0]?.name, "Milo 300g");
check("'chup' finds Chupa Chups", searchProducts(INITIAL_PRODUCTS, "chup", 1)[0]?.name, "Chupa Chups Stick");
check("no match returns empty", searchProducts(INITIAL_PRODUCTS, "zzzzz", 5).length, 0);
check("empty query returns actives", searchProducts(INITIAL_PRODUCTS, "", 100).length, INITIAL_PRODUCTS.filter(p => p.active).length);

// Prefix must outrank a mid-word substring hit.
const ranked = searchProducts(INITIAL_PRODUCTS, "co", 6).map(p => p.name);
check("'co' ranks prefix first", ranked[0], "Coca-Cola 1.5L");
check("'co' still finds Corned Beef", ranked.includes("Corned Beef 150g"), true);

// Nicknames only resolve when the name genuinely cannot match.
check("'coke' hits alias, not name", searchProducts(INITIAL_PRODUCTS, "coke", 1)[0]?.name, "Coca-Cola 1.5L");
check("'toothpaste' alias", searchProducts(INITIAL_PRODUCTS, "toothpaste", 1)[0]?.name, "Colgate Toothpaste 150g");
check("'beer' alias", searchProducts(INITIAL_PRODUCTS, "beer", 1)[0]?.name, "San Miguel Pale Pilsen 320ml");
check("'noodles' alias", searchProducts(INITIAL_PRODUCTS, "noodles", 1)[0]?.name, "Indomie Chicken 85g");
check("'rice' name match beats alias", searchProducts(INITIAL_PRODUCTS, "rice", 1)[0]?.name, "Basmati Rice 5kg");
check("'bigas' alias reaches Palay", searchProducts(INITIAL_PRODUCTS, "bigas", 1)[0]?.name, "Palay (Well-Milled)");
check("real name outranks alias", searchProducts(INITIAL_PRODUCTS, "coca", 1)[0]?.name, "Coca-Cola 1.5L");

// The compactness guard must stop short queries matching everything.
check("'co' does not match all 36", searchProducts(INITIAL_PRODUCTS, "co", 99).length < 20, true);
check("'co' still finds Cola", searchProducts(INITIAL_PRODUCTS, "co", 99).some(p => p.name === "Coca-Cola 1.5L"), true);

// Stock states must all be reachable from the seed data.
const out = INITIAL_PRODUCTS.filter(p => stockState(p) === "out").map(p => p.name);
const low = INITIAL_PRODUCTS.filter(p => stockState(p) === "low").map(p => p.name);
check("has an out-of-stock item", out.length > 0, true);
check("has a low-stock item", low.length > 0, true);
check("has fractional stock", INITIAL_PRODUCTS.some(p => !Number.isInteger(p.stock)), true);
check("Colgate is out of stock", out.includes("Colgate Toothpaste 150g"), true);
check("Skyflakes is low", low.includes("Skyflakes 250g"), true);

// Formatting
check("peso whole", peso(35), "₱35");
check("peso thousands", peso(1234), "₱1,234");
check("peso keeps 2dp for fractional", peso(12.5), "₱12.50");
check("qty integer drops decimal", qty(12), "12");
check("qty fractional preserved", qty(24.5), "24.5");

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
