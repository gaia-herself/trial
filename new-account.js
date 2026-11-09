// new-account.js
// CHANGED: LADY_NAME constant removed. The lady name comes only from the secret.
const START_AT = Number(process.env.START_AT || 45);       // 1 to 39, then 45 to 101
const STOP_AT = Number(process.env.STOP_AT || 101);        // default 101; steps 102-104 run only if STOP_AT is raised

const V3 = 'https://v3.g.ladypopular.com';
const BLOCKS = { eventId: 484, zoneId: 1852 };
const BOARD = { eventId: 395, zoneId: 320 };
const BOARD_ITEMS_NEEDED = 3;      // Step 49 / 96 / 98: items that finish the board
const POSE_COLLECTION_ID = 363;    // Step 102
const BOOSTER_IDS = [191, 192, 193, 194];   // Step 73: popularity boosters
const BOOSTER_BUY_COUNT = 50;               // Step 73: purchases per booster
const BOOSTER_BUY_DELAY = 0.5;              // Step 73: seconds between purchases

// board event used by steps 95, 96 and 98
const BOARD2_EVENT_ID = 386;
const BOARD2_ZONE_A = { zoneId: 312, rewards: 6 };    // Step 96  (312:6)
const BOARD2_ZONE_B = { zoneId: 313, rewards: 10 };   // Step 98  (313:10)
const BOARD_CLICK_DELAY_MS = 500;   // wait between clicks
const BOARD_RESET_DELAY_MS = 500;   // wait around a reset
const BOARD_MIN_CREDITS = 10;       // stop if credits fall below this

// ---------------------------------------------------------------- bodies
const SALON_SAVE_3 = 'type=save&appearance%5B0%5D%5Btype%5D=1&appearance%5B0%5D%5Bnum%5D=23&appearance%5B0%5D%5Bcolor%5D=7&appearance%5B0%5D%5Bsize%5D=1&appearance%5B1%5D%5Btype%5D=2&appearance%5B1%5D%5Bnum%5D=19&appearance%5B1%5D%5Bcolor%5D=16&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=3&appearance%5B2%5D%5Bnum%5D=12&appearance%5B2%5D%5Bcolor%5D=&appearance%5B3%5D%5Btype%5D=5&appearance%5B3%5D%5Bnum%5D=191&appearance%5B3%5D%5Bcolor%5D=14&appearance%5B4%5D%5Btype%5D=8&appearance%5B4%5D%5Bnum%5D=1&appearance%5B4%5D%5Bcolor%5D=1&appearance%5B4%5D%5Bsize%5D=0&appearance%5B5%5D%5Btype%5D=9&appearance%5B5%5D%5Bnum%5D=14&appearance%5B5%5D%5Bcolor%5D=2&appearance%5B6%5D%5Btype%5D=11&appearance%5B6%5D%5Bnum%5D=2&appearance%5B6%5D%5Bcolor%5D=12&appearance%5B7%5D%5Btype%5D=4&appearance%5B7%5D%5Bnum%5D=4&appearance%5B7%5D%5Bcolor%5D=1&appearance%5B8%5D%5Btype%5D=10&appearance%5B8%5D%5Bnum%5D=9&appearance%5B8%5D%5Bcolor%5D=34&appearance%5B9%5D%5Btype%5D=12&appearance%5B9%5D%5Bnum%5D=1&appearance%5B9%5D%5Bcolor%5D=12';

// appearance (body/makeup) part of the wardrobe saves - same on every account
const APPEARANCE_20 = '&appearance%5B0%5D%5Btype%5D=1&appearance%5B0%5D%5Bnum%5D=23&appearance%5B0%5D%5Bcolor%5D=7&appearance%5B0%5D%5Bsize%5D=1&appearance%5B1%5D%5Btype%5D=2&appearance%5B1%5D%5Bnum%5D=19&appearance%5B1%5D%5Bcolor%5D=16&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=3&appearance%5B2%5D%5Bnum%5D=12&appearance%5B2%5D%5Bcolor%5D=1&appearance%5B3%5D%5Btype%5D=5&appearance%5B3%5D%5Bnum%5D=191&appearance%5B3%5D%5Bcolor%5D=14&appearance%5B4%5D%5Btype%5D=8&appearance%5B4%5D%5Bnum%5D=1&appearance%5B4%5D%5Bcolor%5D=1&appearance%5B5%5D%5Btype%5D=9&appearance%5B5%5D%5Bnum%5D=14&appearance%5B5%5D%5Bcolor%5D=2&appearance%5B6%5D%5Btype%5D=10&appearance%5B6%5D%5Bnum%5D=9&appearance%5B6%5D%5Bcolor%5D=34&appearance%5B7%5D%5Btype%5D=11&appearance%5B7%5D%5Bnum%5D=2&appearance%5B7%5D%5Bcolor%5D=12&appearance%5B8%5D%5Btype%5D=12&appearance%5B8%5D%5Bnum%5D=1&appearance%5B8%5D%5Bcolor%5D=12&appearance%5B9%5D%5Btype%5D=4&appearance%5B9%5D%5Bnum%5D=4&appearance%5B9%5D%5Bcolor%5D=1';

const APPEARANCE_55 = '&appearance%5B0%5D%5Btype%5D=4&appearance%5B0%5D%5Bnum%5D=4&appearance%5B0%5D%5Bcolor%5D=1&appearance%5B1%5D%5Btype%5D=1&appearance%5B1%5D%5Bnum%5D=23&appearance%5B1%5D%5Bcolor%5D=7&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=2&appearance%5B2%5D%5Bnum%5D=19&appearance%5B2%5D%5Bcolor%5D=16&appearance%5B2%5D%5Bsize%5D=1&appearance%5B3%5D%5Btype%5D=3&appearance%5B3%5D%5Bnum%5D=12&appearance%5B3%5D%5Bcolor%5D=1&appearance%5B4%5D%5Btype%5D=5&appearance%5B4%5D%5Bnum%5D=191&appearance%5B4%5D%5Bcolor%5D=14&appearance%5B5%5D%5Btype%5D=8&appearance%5B5%5D%5Bnum%5D=1&appearance%5B5%5D%5Bcolor%5D=1&appearance%5B6%5D%5Btype%5D=9&appearance%5B6%5D%5Bnum%5D=14&appearance%5B6%5D%5Bcolor%5D=2&appearance%5B7%5D%5Btype%5D=10&appearance%5B7%5D%5Bnum%5D=9&appearance%5B7%5D%5Bcolor%5D=34&appearance%5B8%5D%5Btype%5D=11&appearance%5B8%5D%5Bnum%5D=2&appearance%5B8%5D%5Bcolor%5D=12&appearance%5B9%5D%5Btype%5D=12&appearance%5B9%5D%5Bnum%5D=1&appearance%5B9%5D%5Bcolor%5D=12';

const FILTER_54 = 'isArchive=false&wardrobePage=wardrobe&ajaxPostUrl=%2Fajax%2Fwardrobe%2Flady.php&selectedPet=&isFavourite=false&contentType=&contentId=&hasItems=true&currentPageNum=1&availableFilterColors%5B%5D=1&availableFilterColors%5B%5D=6&availableFilterColors%5B%5D=8&availableFilterColors%5B%5D=13&availableFilterColors%5B%5D=15&availableFilterColors%5B%5D=17&availableFilterColors%5B%5D=19&availableFilterColors%5B%5D=56&availableFilterColors%5B%5D=68&availableFilterColors%5B%5D=85&routeToMall=%2Fmall%2Fmall.php%3FmallType%3D1%26categoryId%3D%2525categoryId%2525&event_id%5B%5D=395&archive=false&favourites=false&pose=false&animated=false&filter_out_tagged=false&pet=0&empty_filter=false&wardrobetype=lady&default_category=false&page=1&hasMore=false&updatePartials%5B%5D=3';

// Step 104 makeup save (was Step 103, originally Step 93)
const SALON_SAVE_93 = 'type=save&appearance%5B0%5D%5Btype%5D=1&appearance%5B0%5D%5Bnum%5D=23&appearance%5B0%5D%5Bcolor%5D=6&appearance%5B0%5D%5Bsize%5D=1&appearance%5B1%5D%5Btype%5D=2&appearance%5B1%5D%5Bnum%5D=31&appearance%5B1%5D%5Bcolor%5D=12&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=3&appearance%5B2%5D%5Bnum%5D=10&appearance%5B2%5D%5Bcolor%5D=1&appearance%5B3%5D%5Btype%5D=5&appearance%5B3%5D%5Bnum%5D=191&appearance%5B3%5D%5Bcolor%5D=14&appearance%5B4%5D%5Btype%5D=8&appearance%5B4%5D%5Bnum%5D=1&appearance%5B4%5D%5Bcolor%5D=5&appearance%5B5%5D%5Btype%5D=9&appearance%5B5%5D%5Bnum%5D=30&appearance%5B5%5D%5Bcolor%5D=15&appearance%5B6%5D%5Btype%5D=10&appearance%5B6%5D%5Bnum%5D=9&appearance%5B6%5D%5Bcolor%5D=33&appearance%5B7%5D%5Btype%5D=11&appearance%5B7%5D%5Bnum%5D=2&appearance%5B7%5D%5Bcolor%5D=9&appearance%5B8%5D%5Btype%5D=12&appearance%5B8%5D%5Bnum%5D=1&appearance%5B8%5D%5Bcolor%5D=12&appearance%5B9%5D%5Btype%5D=4&appearance%5B9%5D%5Bnum%5D=3&appearance%5B9%5D%5Bcolor%5D=1';

// Step 93 makeup save - the new look (recorded from the game)
const SALON_SAVE_NEW_93 = 'type=save&appearance%5B0%5D%5Btype%5D=1&appearance%5B0%5D%5Bnum%5D=23&appearance%5B0%5D%5Bcolor%5D=6&appearance%5B0%5D%5Bsize%5D=1&appearance%5B1%5D%5Btype%5D=2&appearance%5B1%5D%5Bnum%5D=19&appearance%5B1%5D%5Bcolor%5D=12&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=3&appearance%5B2%5D%5Bnum%5D=1&appearance%5B2%5D%5Bcolor%5D=1&appearance%5B3%5D%5Btype%5D=8&appearance%5B3%5D%5Bnum%5D=1&appearance%5B3%5D%5Bcolor%5D=5&appearance%5B4%5D%5Btype%5D=9&appearance%5B4%5D%5Bnum%5D=14&appearance%5B4%5D%5Bcolor%5D=15&appearance%5B5%5D%5Btype%5D=10&appearance%5B5%5D%5Bnum%5D=9&appearance%5B5%5D%5Bcolor%5D=33&appearance%5B6%5D%5Btype%5D=11&appearance%5B6%5D%5Bnum%5D=2&appearance%5B6%5D%5Bcolor%5D=9&appearance%5B7%5D%5Btype%5D=12&appearance%5B7%5D%5Bnum%5D=1&appearance%5B7%5D%5Bcolor%5D=12&appearance%5B8%5D%5Btype%5D=4&appearance%5B8%5D%5Bnum%5D=3&appearance%5B8%5D%5Bcolor%5D=1&appearance%5B9%5D%5Btype%5D=5&appearance%5B9%5D%5Bnum%5D=191&appearance%5B9%5D%5Bcolor%5D=4';

// CHANGED: Step 101 makeup save - the new look (recorded from the game)
const SALON_SAVE_101 = 'type=save&appearance%5B0%5D%5Btype%5D=1&appearance%5B0%5D%5Bnum%5D=23&appearance%5B0%5D%5Bcolor%5D=6&appearance%5B0%5D%5Bsize%5D=1&appearance%5B1%5D%5Btype%5D=2&appearance%5B1%5D%5Bnum%5D=19&appearance%5B1%5D%5Bcolor%5D=12&appearance%5B1%5D%5Bsize%5D=1&appearance%5B2%5D%5Btype%5D=3&appearance%5B2%5D%5Bnum%5D=1&appearance%5B2%5D%5Bcolor%5D=1&appearance%5B3%5D%5Btype%5D=5&appearance%5B3%5D%5Bnum%5D=1066&appearance%5B3%5D%5Bcolor%5D=4&appearance%5B4%5D%5Btype%5D=8&appearance%5B4%5D%5Bnum%5D=1&appearance%5B4%5D%5Bcolor%5D=5&appearance%5B5%5D%5Btype%5D=9&appearance%5B5%5D%5Bnum%5D=14&appearance%5B5%5D%5Bcolor%5D=15&appearance%5B6%5D%5Btype%5D=10&appearance%5B6%5D%5Bnum%5D=9&appearance%5B6%5D%5Bcolor%5D=33&appearance%5B7%5D%5Btype%5D=11&appearance%5B7%5D%5Bnum%5D=2&appearance%5B7%5D%5Bcolor%5D=9&appearance%5B8%5D%5Btype%5D=12&appearance%5B8%5D%5Bnum%5D=1&appearance%5B8%5D%5Bcolor%5D=12&appearance%5B9%5D%5Btype%5D=4&appearance%5B9%5D%5Bnum%5D=3&appearance%5B9%5D%5Bcolor%5D=1';

// Step 76 amounts
const AMOUNTS = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
  49, 52, 55, 58, 61, 64, 67, 70, 73, 77, 81, 85, 89, 93, 97, 101, 105,
  109, 113, 117, 121, 125, 129, 134, 139, 144, 149, 155, 161, 167, 173, 179,
  187, 193, 199, 205, 211, 217, 223, 229, 236, 243, 250, 257, 264, 272, 280,
  288, 296, 304, 312, 321, 330, 339, 348, 357, 366, 375, 385, 395, 405, 415,
  425, 435, 445, 455, 465, 476, 487, 498, 509, 520, 532, 544, 556, 568, 581,
  594, 607, 620, 633, 646, 659, 672, 685, 698, 711, 724, 738, 752, 767, 782,
  797, 812, 827, 842, 858, 874, 890, 906, 922, 939, 956, 973, 990, 1007, 1024,
  1042, 1060, 1078, 1096, 1114, 1132, 1150, 1168, 1187, 1206, 1225, 1244, 1264,
  1284, 1304, 1324, 1346, 1368, 1390, 1412, 1434, 1456, 1478, 1500, 1522, 1544,
  1566, 1588, 1610, 1632, 1656, 1680, 1704, 1728, 1752, 1776, 1800, 1824, 1848,
  1874, 1900, 1926, 1952, 1978, 2000
];

// ---------------------------------------------------------------- GraphQL queries (trimmed to the fields we use)
const Q = {
  enterZone: 'mutation EnterZone($eventId: Int!, $zoneId: Int!) { blocks { EnterZoneMutation(eventId: $eventId, zoneId: $zoneId) { status message zone_info { id map available_clicks } } } }',
  clickBlock: 'mutation ClickBlock($eventId: Int!, $zoneId: Int!, $positionX: Int!, $positionY: Int!, $booster: String!) { blocks { ClickBlockMutation(eventId: $eventId, zoneId: $zoneId, positionX: $positionX, positionY: $positionY, booster: $booster) { status message zone_info { map available_clicks lady_boosters { bomb color_bomb hammer } } } } }',
  buyBooster: 'mutation BuyBoosterPack($eventId: Int!, $booster: String!, $packId: Int!) { blocks { BuyBoosterPackMutation(eventId: $eventId, booster: $booster, packId: $packId) { status message lady_boosters { bomb color_bomb hammer } } } }',
  // Step 49: includes the board map so we can count the items won
  openSquare: 'mutation OpenBoardSquare($eventId: Int!, $zoneId: Int!, $positionX: Int!, $positionY: Int!) { board { OpenSquareMutation(eventId: $eventId, zoneId: $zoneId, positionX: $positionX, positionY: $positionY) { status message is_zone_completed zone_info { map { is_opened pending value { id type amount } } } } } }',
  // Steps 96 / 98: same click, but also returns credits so we can stop when they run low
  openSquareStats: 'mutation OpenBoardSquare($eventId: Int!, $zoneId: Int!, $positionX: Int!, $positionY: Int!) { board { OpenSquareMutation(eventId: $eventId, zoneId: $zoneId, positionX: $positionX, positionY: $positionY) { status message is_zone_completed lady_stats { credits emeralds } zone_info { map { is_opened pending value { id type amount } } } } } }',
  // Steps 96 / 98: start a new board in the zone
  resetBoard: 'mutation Board($eventId: Int!, $zoneId: Int!) { board { ResetBoardMutation(eventId: $eventId, zoneId: $zoneId) { status message lady_stats { credits emeralds } reset_board_info { is_reset_allowed price_start_game { credits } } } } }'
};

// ---------------------------------------------------------------- helpers
const authState = { token: null };
const listening = new WeakSet();

function attachTokenListener(page) {
  if (listening.has(page)) return;
  listening.add(page);
  page.on('request', (req) => {
    if (req.url().includes('/api/graphql')) {
      const a = req.headers()['authorization'];
      if (a) authState.token = a;
    }
  });
}

function jwtExpMs(bearer) {
  try {
    const payload = bearer.replace(/^Bearer\s+/i, '').split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp * 1000;
  } catch (e) { return Infinity; }
}

async function getToken(page) {
  const fresh = () => authState.token && jwtExpMs(authState.token) - Date.now() > 60000;
  if (fresh()) return authState.token;
  authState.token = null;
  for (let i = 0; i < 3; i++) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    for (let t = 0; t < 40 && !authState.token; t++) await page.waitForTimeout(500);
    if (authState.token) return authState.token;
  }
  throw new Error('No GraphQL token seen on this page (the page sent no /api/graphql request).');
}

const sleep = (page, s) => page.waitForTimeout(s * 1000);
const goto = (page, url) => page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
const reload = (page) => page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });

async function postForm(page, path, body) {
  return page.evaluate(async ({ path, body }) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body, credentials: 'include'
    });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch (e) { return { __nonjson: true, http: res.status, text: text.slice(0, 300) }; }
  }, { path, body });
}

async function getJson(page, path) {
  return page.evaluate(async (path) => {
    const res = await fetch(path, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch (e) { return { __nonjson: true, http: res.status, text: text.slice(0, 300) }; }
  }, path);
}

async function gql(page, operationName, query, variables = {}) {
  const token = await getToken(page);
  const json = await page.evaluate(async ({ operationName, query, variables, token }) => {
    const res = await fetch('/api/graphql/index.php', {
      method: 'POST',
      headers: {
        accept: 'application/graphql-response+json,application/json;q=0.9',
        authorization: token,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ operationName, variables, query }),
      credentials: 'include'
    });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch (e) { return { __nonjson: true, http: res.status, text: text.slice(0, 300) }; }
  }, { operationName, query, variables, token });
  if (json.__nonjson || json.errors) {
    console.log('❌ GraphQL raw:', JSON.stringify(json).slice(0, 600));
    throw new Error(`${operationName} returned an error`);
  }
  return json;
}

function raw(json) { return JSON.stringify(json).slice(0, 500); }

// status === 1 is success (some BP duel requests legitimately return 3)
function need(json, label, allowed = [1]) {
  if (!json || json.__nonjson || !allowed.includes(json.status)) {
    console.log(`❌ ${label} raw: ${raw(json)}`);
    throw new Error(`${label} failed`);
  }
}
function needReward(json, label) {
  if (!json || json.__nonjson || !Array.isArray(json.reward)) {
    console.log(`❌ ${label} raw: ${raw(json)}`);
    throw new Error(`${label} failed`);
  }
}
function soft(json, label) {   // log only, never stops the script
  if (!json || json.__nonjson || json.status !== 1) console.log(`⚠️ ${label}: unexpected response ${raw(json)}`);
  else console.log(`✅ ${label}`);
}
function needGql(status, label, raw_) {
  if (status !== 1) {
    console.log(`❌ ${label} raw: ${JSON.stringify(raw_).slice(0, 500)}`);
    throw new Error(`${label} failed`);
  }
}

// send a request without verifying the result (just logs it)
async function fire(page, label, path, body) {
  const j = await postForm(page, path, body);
  soft(j, label);
  return j;
}

async function claim(page, questId, waitSec, reloadAfter = false) {
  let json = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    json = await postForm(page, '/ajax/quests.php', `type=giveTutorialQuestReward&quest_id=${questId}`);
    if (json && !json.__nonjson && Array.isArray(json.reward)) break;
    console.log(`⚠️ Claim quest ${questId} attempt ${attempt}/4 not ready: ${json && json.message ? json.message : raw(json)}`);
    if (attempt < 4) await sleep(page, 10);
  }
  needReward(json, `Claim quest ${questId}`);
  console.log(`🎁 Quest ${questId} claimed`);
  if (reloadAfter) await reload(page);
  await sleep(page, waitSec);
}

// ---------------------------------------------------------------- wardrobe: look up this account's own row IDs
// category ids: 2 bags, 6 bracelets, 9 dresses, 10 earrings, 13 necklaces, 18 shoes
async function loadCategoryTiles(page, categoryId) {
  const json = await postForm(page, '/ajax/wardrobe.php',
    `wardrobetype=lady&category_id%5B%5D=${categoryId}&archive=0&pet=0&updatePartials%5B%5D=10&updatePartials%5B%5D=3`);
  if (!json || json.status !== 1 || !json.partials || !json.partials.partial3) {
    console.log(`❌ wardrobe category ${categoryId} raw: ${raw(json)}`);
    throw new Error(`Wardrobe category ${categoryId} failed`);
  }
  const tiles = {};
  const re = /\$\('#item-(\d+)'\)\.data\('item',\s*(\{[^\n]*?\})\);/g;
  for (const m of json.partials.partial3.matchAll(re)) {
    try { tiles[m[1]] = JSON.parse(m[2]); } catch (e) { /* skip unparsable tile */ }
  }
  return tiles;
}

async function buildWardrobeSave(page, pieces, appearancePart) {
  const cache = {};
  let items = '';
  for (let i = 0; i < pieces.length; i++) {
    const [cat, type, color, offset] = pieces[i];
    const off = offset ?? -(i + 1);
    if (!cache[cat]) cache[cat] = await loadCategoryTiles(page, cat);
    const tile = cache[cat][String(type)];
    const hit = tile && (tile.colors || []).find(c => Number(c.color) === Number(color));
    if (!hit) throw new Error(`Wardrobe: this account does not own item type ${type} in colour ${color} (category ${cat})`);
    console.log(`👗 slot ${i}: type ${type} colour ${color} -> row id ${hit.concrete_id}, offset ${off}`);
    items += `&items%5B${i}%5D%5Bid%5D=${hit.concrete_id}&items%5B${i}%5D%5Boffset%5D=${off}`;
  }
  return 'action=saveChanges&selectedPet=' + items + appearancePart;
}

// ---------------------------------------------------------------- grid helpers
const CODE = { yellow: 'Y', purple: 'P', green: 'G', orange: 'O', red: 'R', blue: 'B' };
function checkGrid(map) {
  if (!Array.isArray(map) || map.length !== 10 || map.some(r => !Array.isArray(r) || r.length !== 10)) {
    console.log('❌ map is not 10x10:', JSON.stringify(map).slice(0, 400));
    throw new Error('Board map is not 10x10');
  }
}
function printGrid(map) {
  map.forEach((row, r) => console.log(`r${r}  ` + row.map(c => CODE[c] || '?').join(' ')));
}
function findFirst(map, color) {
  checkGrid(map);
  printGrid(map);
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 10; c++)
      if (map[r][c] === color) {
        console.log(`🎯 ${color} found at row ${r}, col ${c} -> positionX=${r}, positionY=${c}`);
        return { x: r, y: c };
      }
  throw new Error(`No ${color} block found on the board`);
}

// ---------------------------------------------------------------- board game helpers (Steps 49 / 96 / 98)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// items = opened squares whose reward has type 1 or a non-null id ($ = type 30 and FP = type 31 have id null)
function countBoardItems(map) {
  return map.flat().filter(sq =>
    sq && sq.is_opened && Array.isArray(sq.value) &&
    sq.value.some(v => v.type === 1 || (v.id !== null && v.id !== undefined))
  ).length;
}

// Steps 96 / 98 - converted from the console script.
// Plays one board in a zone. Returns { zoneDone } when 3 items are won, throws on any failure.
const BOARD_SQUARES = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
const boardState = { lastOrder: '', lastCredits: null };

async function playBoardRound(page, eventId, zoneId, round) {
  let clicks, orderStr;
  do {
    clicks = shuffle(BOARD_SQUARES);
    orderStr = clicks.map(c => `(${c[0]},${c[1]})`).join(' ');
  } while (orderStr === boardState.lastOrder);   // never the same click order twice in a row
  boardState.lastOrder = orderStr;
  console.log(`🔀 Zone ${zoneId} | round ${round} click order: ${orderStr}`);

  for (let i = 0; i < clicks.length; i++) {
    const [x, y] = clicks[i];
    const j = await gql(page, 'OpenBoardSquare', Q.openSquareStats, { eventId, zoneId, positionX: x, positionY: y });
    const r = j && j.data && j.data.board && j.data.board.OpenSquareMutation;
    if (!r || r.status !== 1) {
      console.log(`❌ Zone ${zoneId} click ${i + 1} (${x},${y}) raw: ${raw(j)}`);
      throw new Error(`Board zone ${zoneId} round ${round}: click ${i + 1} failed`);
    }
    if (r.lady_stats) boardState.lastCredits = r.lady_stats.credits;

    const items = r.zone_info && r.zone_info.map ? countBoardItems(r.zone_info.map) : 0;
    const zoneDone = r.is_zone_completed === true;
    console.log(`🟦 Zone ${zoneId} | round ${round} | click ${i + 1}/9 (${x},${y}) | items ${items}/${BOARD_ITEMS_NEEDED} | zone completed: ${zoneDone}`);

    if (items >= BOARD_ITEMS_NEEDED || zoneDone) return { zoneDone };
    if (boardState.lastCredits !== null && boardState.lastCredits < BOARD_MIN_CREDITS) {
      throw new Error(`Board zone ${zoneId}: credits (${boardState.lastCredits}) below ${BOARD_MIN_CREDITS}, stopping`);
    }
    await page.waitForTimeout(BOARD_CLICK_DELAY_MS);
  }
  throw new Error(`Board zone ${zoneId} round ${round}: all 9 squares opened without reaching ${BOARD_ITEMS_NEEDED} items`);
}

async function resetBoardZone(page, eventId, zoneId) {
  const j = await gql(page, 'Board', Q.resetBoard, { eventId, zoneId });
  const r = j && j.data && j.data.board && j.data.board.ResetBoardMutation;
  if (!r || r.status !== 1) {
    console.log(`❌ Reset zone ${zoneId} raw: ${raw(j)}`);
    throw new Error(`Board zone ${zoneId}: reset failed`);
  }
  if (r.lady_stats) boardState.lastCredits = r.lady_stats.credits;
  console.log(`♻️ New board started in zone ${zoneId}. Credits: ${boardState.lastCredits}`);
}

// Plays `rewards` boards in one zone (resetting between boards).
async function playBoardZone(page, eventId, zoneId, rewards) {
  console.log(`🗺️ Starting zone ${zoneId}, ${rewards} rewards`);
  boardState.lastCredits = null;
  let won = 0;
  for (let round = 1; round <= rewards; round++) {
    const res = await playBoardRound(page, eventId, zoneId, round);
    won++;
    console.log(`🎉 Zone ${zoneId}: reward ${won}/${rewards} collected.`);
    if (res.zoneDone) { console.log(`✅ Zone ${zoneId} marked completed.`); break; }
    if (round < rewards) {
      await page.waitForTimeout(BOARD_RESET_DELAY_MS);
      await resetBoardZone(page, eventId, zoneId);
      await page.waitForTimeout(BOARD_RESET_DELAY_MS);
    }
  }
  console.log(`📊 Summary: zone ${zoneId}: ${won}/${rewards}`);
}

// ---------------------------------------------------------------- BP judging (Steps 7 / 46)
async function judgeOnce(page) {
  const t0 = Date.now();
  while (Date.now() - t0 < 10000) {
    const duel = await page.evaluate(async () => {
      const res = await fetch('/ajax/beauty_pageant.php', {
        method: 'POST', body: new URLSearchParams({ action: 'judgeDuel' }), credentials: 'same-origin'
      });
      try { return await res.json(); } catch (e) { return null; }
    });
    const matches = duel && duel.html ? [...duel.html.matchAll(/<a id="ladyIdContainer-(\d+)-([^"]+)"/g)] : [];
    if (duel && duel.duel_id && matches.length === 2) {
      const pick = matches[Math.random() < 0.5 ? 0 : 1];
      const res = await page.evaluate(async ({ duelId, winnerId, winnerGameId }) => {
        const r = await fetch('/ajax/beauty_pageant.php', {
          method: 'POST',
          body: new URLSearchParams({ action: 'chooseWinner', duel_id: duelId, winner_id: winnerId, winner_game_id: winnerGameId }),
          credentials: 'same-origin'
        });
        try { return await r.json(); } catch (e) { return null; }
      }, { duelId: duel.duel_id, winnerId: pick[1], winnerGameId: pick[2] });
      // success = the game returned a finished duel object (status is not used here)
      if (res && res.duel && res.duel.duel_id) { console.log(`👑 Judged duel ${duel.duel_id} ✔️`); return true; }
      console.log(`⚠️ chooseWinner raw: ${raw(res)}`);
      return false;
    }
    await page.waitForTimeout(500);
  }
  console.log('⚠️ No valid duel within 10s');
  return false;
}

async function judgeThree(page) {
  let ok = 0, cycles = 0;
  while (ok < 3 && cycles < 5) {
    cycles++;
    if (await judgeOnce(page)) ok++;
    await sleep(page, 3);
  }
  console.log(`👑 Successful judgements: ${ok}/3 (cycles used: ${cycles})`);
  if (ok < 3) throw new Error('Could not complete 3 judgements');
  await reload(page);
  await sleep(page, 5);
}

const goBP = async (page) => { await goto(page, `${V3}/beauty_pageant.php`); };

// ---------------------------------------------------------------- achievements (Steps 74 / 75)
async function collectAchievementIds(page) {
  const json = await postForm(page, '/ajax/quests.php', 'type=getAchievementsPopup&tab=main');
  if (!json || json.status !== 1 || !json.html) { console.log(`❌ Step 74 raw: ${raw(json)}`); throw new Error('Step 74 failed'); }
  const ids = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const out = [];
    doc.querySelectorAll('article.single-achievement').forEach(a => {
      if (a.classList.contains('dummy-achievement-tile') || !a.classList.contains('ready')) return;
      const btn = a.querySelector('.achievement-action-button');
      const m = btn && (btn.getAttribute('onclick') || '').match(/this,\s*(\d+)/);
      const h = a.querySelector('.headline');
      if (m) out.push({ id: m[1], headline: h ? h.textContent.trim() : '' });
    });
    return out;
  }, json.html);
  console.log(`📋 Ready achievements: ${ids.length}`);
  ids.forEach(i => console.log(`   ${i.id} | ${i.headline}`));
  await sleep(page, 10);
  return ids.map(i => i.id);
}

async function claimAchievements(page, ids) {
  for (const id of ids) {
    const json = await postForm(page, '/ajax/quests.php', `type=getReward&quest_id=${id}`);
    if (json && json.won_reward && json.won_reward.status === 1) console.log(`🎁 Achievement ${id} claimed`);
    else console.log(`⚠️ Achievement ${id} not claimed: ${raw(json)} (skipping)`);
    await page.waitForTimeout(500);
  }
  await sleep(page, 10);
  await reload(page);
}

// ---------------------------------------------------------------- FP redistribution (Steps 76 / 94 / 100)
async function redistributeFP(page) {
  const result = await page.evaluate(async ({ amounts, rounds }) => {
    const types = ['style', 'creativity', 'devotion', 'beauty'];
    let done = 0;
    for (let round = 0; round < rounds; round++) {
      const amount = amounts[round] ?? 2000;
      for (const t of types) {
        const res = await fetch('/ajax/train.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
          body: new URLSearchParams({ type: 'trainStats', popularityType: t, practiceType: 'fp', amount })
        });
        let data = null;
        try { data = await res.json(); } catch (e) { return { done, stoppedAt: `${t} amount=${amount}`, reason: 'non-JSON' }; }
        if (!data || data.status !== 1) return { done, stoppedAt: `${t} amount=${amount}`, reason: 'status != 1 (out of FP)' };
        done++;
      }
    }
    return { done, stoppedAt: null };
  }, { amounts: AMOUNTS, rounds: 400 });
  console.log(`💪 FP redistribution finished: ${result.done} requests OK. ${result.stoppedAt ? `Stopped at ${result.stoppedAt} - ${result.reason}` : ''}`);
  await reload(page);
}

// ---------------------------------------------------------------- the script
module.exports = async function runNewAccount(page, account = {}) {   // receives the account from the secret
  authState.token = null;   // forget the previous account's GraphQL token
  // lady name comes ONLY from the secret ("47-Elsa" -> "Elsa"). No fallback.
  const ladyName = (account.name || '').replace(/^\d+-/, '').trim();
  console.log(`💄 Lady name for this account: ${ladyName || '(none)'}`);
  attachTokenListener(page);
  const ctx = {};

  const steps = [

    // Steps 1 & 2: nothing to do, just wait
    [1, 'Wait before start', async () => { await sleep(page, 5); }],

    [3, 'Makeup', async () => {
      await goto(page, `${V3}/beauty_salon.php`);       // makes sure we are on the game domain
      const j = await postForm(page, '/ajax/beauty_salon_lady.php', SALON_SAVE_3);
      need(j, 'Step 3 makeup');
      await sleep(page, 10);
      await reload(page);
      await sleep(page, 5);
    }],

    [4, 'Wardrobe page', async () => {
      await goto(page, `${V3}/wardrobe.php?wardrobetype=lady&archive=0&category_id%5B0%5D=9`);
      await reload(page);
      await sleep(page, 5);
    }],

    [5, 'Dress up (2nd saved outfit)', async () => {
      const j = await postForm(page, '/ajax/wardrobe/lady.php', 'action=loadOutfits&offset=0');
      need(j, 'Step 5a loadOutfits');
      if (!Array.isArray(j.outfits) || j.outfits.length < 2) throw new Error('Step 5a: fewer than 2 saved outfits');
      ctx.outfitId = j.outfits[1].id;
      console.log(`👗 2nd outfit id = ${ctx.outfitId}`);
      await sleep(page, 5);
      const k = await postForm(page, '/ajax/wardrobe/lady.php',
        `action=changeOutfit&outfitId=${ctx.outfitId}&wardrobetype=wardrobe&contenttype=&contentid=&page=1&apply_appearance=true`);
      need(k, 'Step 5b changeOutfit');
      await sleep(page, 10);
    }],

    [6, 'Go to BP', async () => { await goBP(page); }],
    [7, 'BP: 3 judgements', async () => { await judgeThree(page); }],

    [8, 'BP: spend 1 ticket', async () => {
      const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=competeInDuel&is_tutorial_competing=true');
      need(j, 'Step 8 competeInDuel', [1, 3]);
      await sleep(page, 5);
    }],

    [9, 'BP: spend all tickets', async () => {
      const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=massCompete&is_tutorial_competing=true');
      need(j, 'Step 9 massCompete', [1, 3]);
      await sleep(page, 10);
    }],

    [10, 'BP: collect dollars', async () => {
      const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=claimAllDuelRewards');
      need(j, 'Step 10 claimAllDuelRewards');
      await reload(page);
      await sleep(page, 10);
    }],

    [11, 'Open tutorial quests popup', async () => {
      const j = await getJson(page, '/ajax/quests.php?type=getTutorialQuestsPopup');
      need(j, 'Step 11 quests popup');
      await sleep(page, 10);
    }],

    [12, 'Claim 200102', async () => { await claim(page, 200102, 10); }],
    [13, 'Claim 200103', async () => { await claim(page, 200103, 10); }],

    [14, 'New collection page', async () => {
      await goto(page, `${V3}/mall/boutique.php`);
      await reload(page);
      await sleep(page, 10);
    }],

    [15, 'Add 4 items to cart', async () => {
      for (const color of [74, 49, 36, 4]) {
        const j = await postForm(page, '/ajax/mall/cart.php',
          `action=addToCart&mallType=1&itemId=19708&itemCategoryId=13&itemCollectionId=301&itemColor=${color}&pageNum=2&collectionsPage=limited&orderBy=&orderType=`);
        need(j, `Step 15 addToCart color ${color}`);
        await sleep(page, 3);
      }
    }],

    [16, 'Load cart', async () => {
      const j = await postForm(page, '/ajax/mall/cart.php', 'action=loadMallContent');
      need(j, 'Step 16 loadMallContent');
      await sleep(page, 10);
    }],

    [17, 'Buy 4 items', async () => {
      const j = await postForm(page, '/ajax/mall/cart.php', 'action=checkoutCart&collectionsPage=limited');
      need(j, 'Step 17 checkoutCart');
      await sleep(page, 10);
    }],

    [18, 'Claim 200105', async () => { await claim(page, 200105, 10, true); }],

    [19, 'Wardrobe necklace page', async () => {
      await goto(page, `${V3}/wardrobe.php?wardrobetype=lady&category_id%5B0%5D=13&archive=0&pet=0&updatePartials%5B0%5D=10&updatePartials%5B1%5D=3`);
      await sleep(page, 10);
    }],

    [20, 'Wear necklace and save look (outfit 1)', async () => {
      // bag, earrings, bought necklace (colour 49), dress, shoes
      const body = await buildWardrobeSave(page, [
        [2, 27230, 46], [10, 28813, 65], [13, 19708, 49], [9, 25834, 49], [18, 27065, 46]
      ], APPEARANCE_20);
      const j = await postForm(page, '/ajax/wardrobe/lady.php', body);
      need(j, 'Step 20 saveChanges');
      await sleep(page, 10);
    }],

    [21, 'Claim 200111', async () => { await claim(page, 200111, 10); }],

    [22, 'BP: spend 1 ticket', async () => {
      await goBP(page);
      const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=competeInDuel');
      need(j, 'Step 22 competeInDuel', [1, 3]);
      await sleep(page, 10);
    }],

    [23, 'Claim 200112', async () => { await claim(page, 200112, 10); }],

    [24, 'Mall', async () => {
      await goto(page, `${V3}/mall/mall.php`);
      await sleep(page, 5);
    }],

    [25, 'Add 1 item to cart', async () => {
      const j = await postForm(page, '/ajax/mall/cart.php',
        'action=addToCart&mallType=1&itemId=23933&itemCategoryId=9&itemCollectionId=3&itemColor=64&pageNum=1&collectionsPage=false&orderBy=id&orderType=desc');
      need(j, 'Step 25 addToCart');
      await sleep(page, 5);
    }],

    [26, 'Cart page', async () => {
      await goto(page, `${V3}/mall/cart.php?action=loadMallContent`);
      await sleep(page, 5);
    }],

    [27, 'Buy from cart', async () => {
      const j = await postForm(page, '/ajax/mall/cart.php', 'action=checkoutCart&collectionsPage=false');
      need(j, 'Step 27 checkoutCart');
      await sleep(page, 5);
    }],

    [28, 'Claim 200113', async () => { await claim(page, 200113, 5); }],

    [29, 'Ladygram page', async () => {
      await goto(page, `${V3}/ladygram.php`);
      await sleep(page, 10);
    }],

    [30, 'Claim 200106', async () => { await claim(page, 200106, 5); }],

    // Steps 31-36 (photobooth, take photo, share, post, claim 200110, delete post)
    // are intentionally skipped - done manually.

    [37, 'Change lady name', async () => {
      // stop right here if the secret gave no name. No fallback.
      if (!ladyName) throw new Error('Step 37: no name in the secret for this account. Stopping.');
      await goto(page, `${V3}/settings.php?tab=change_ladyname`);
      await sleep(page, 5);
      const body = new URLSearchParams({ type: 'changeLadyName', newName: ladyName }).toString();   // ladyName from the secret
      const j = await postForm(page, '/ajax/settings.php', body);
      need(j, 'Step 37 changeLadyName');
      await sleep(page, 10);
    }],

    [38, 'Claim 200109', async () => { await claim(page, 200109, 5); }],

    [39, 'Blocks event page', async () => {
      await goto(page, `${V3}/events/blocks.php?event_id=${BLOCKS.eventId}`);
      await sleep(page, 10);
    }],

    [40, 'Enter blocks zone, read board, pick yellow', async () => {
      const j = await gql(page, 'EnterZone', Q.enterZone, BLOCKS);
      const map = j.data.blocks.EnterZoneMutation.zone_info.map;
      ctx.yellow = findFirst(map, 'yellow');
      await reload(page);
      await sleep(page, 5);
    }],

    [41, 'Colour bomb on yellow, pick purple', async () => {
      if (!ctx.yellow) throw new Error('Step 41: no yellow position (run Step 40 first)');
      const j = await gql(page, 'ClickBlock', Q.clickBlock,
        { ...BLOCKS, positionX: ctx.yellow.x, positionY: ctx.yellow.y, booster: 'color_bomb' });
      const r = j.data.blocks.ClickBlockMutation;
      needGql(r.status, 'Step 41 colour bomb (yellow)', j);
      ctx.purple = findFirst(r.zone_info.map, 'purple');
      await sleep(page, 10);
    }],

    [42, 'Buy a colour bomb', async () => {
      const j = await gql(page, 'BuyBoosterPack', Q.buyBooster, { eventId: BLOCKS.eventId, booster: 'color_bomb', packId: 1 });
      needGql(j.data.blocks.BuyBoosterPackMutation.status, 'Step 42 buy colour bomb', j);
      await reload(page);
      await sleep(page, 10);
    }],

    [43, 'Colour bomb on purple', async () => {
      if (!ctx.purple) throw new Error('Step 43: no purple position (run Step 41 first)');
      const j = await gql(page, 'ClickBlock', Q.clickBlock,
        { ...BLOCKS, positionX: ctx.purple.x, positionY: ctx.purple.y, booster: 'color_bomb' });
      needGql(j.data.blocks.ClickBlockMutation.status, 'Step 43 colour bomb (purple)', j);
      await sleep(page, 10);
    }],

    [44, 'Claim 200114', async () => { await claim(page, 200114, 5); }],

    [45, 'Go to BP (repeat of step 6)', async () => { await goBP(page); }],
    [46, 'BP: 3 judgements (repeat of step 7)', async () => { await judgeThree(page); }],

    [47, 'Claim 200115', async () => { await claim(page, 200115, 10); }],

    [48, 'Board event page', async () => {
      await goto(page, `${V3}/events/board.php?event_id=${BOARD.eventId}`);
      await sleep(page, 10);
    }],

    [49, 'Board: random clicks until 3 items are won', async () => {
      // all 9 squares in a random order, each exactly once
      const squares = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
      const clicks = shuffle(squares);
      console.log('🔀 Click order:', clicks.map(c => `(${c[0]},${c[1]})`).join(' '));

      let items = 0;
      for (let i = 0; i < clicks.length; i++) {
        await reload(page);
        await sleep(page, 3);
        const [x, y] = clicks[i];
        const j = await gql(page, 'OpenBoardSquare', Q.openSquare, { ...BOARD, positionX: x, positionY: y });
        const r = j.data.board.OpenSquareMutation;
        needGql(r.status, `Step 49 click ${i + 1} (${x},${y})`, j);

        const map = r.zone_info && r.zone_info.map;
        if (!map) { console.log(`❌ Step 49 raw: ${raw(j)}`); throw new Error('Step 49: response has no board map'); }
        items = countBoardItems(map);
        console.log(`🟦 Click ${i + 1}/9 (${x},${y}) done | items won: ${items}/${BOARD_ITEMS_NEEDED}`);
        await sleep(page, 5);

        // success = 3 items collected (is_zone_completed is NOT used)
        if (items >= BOARD_ITEMS_NEEDED) { console.log('🎉 3 items collected, board finished.'); break; }
      }
      if (items < BOARD_ITEMS_NEEDED) throw new Error(`Step 49: only ${items}/${BOARD_ITEMS_NEEDED} items after all 9 squares`);
      await sleep(page, 10);
    }],

    [50, 'Claim 200116', async () => {
      await claim(page, 200116, 10);
      await reload(page);
    }],

    [51, 'Activate talent', async () => {
      await goto(page, `${V3}/vip_shop.php`);
      const j = await postForm(page, '/ajax/vip_shop.php', 'type=buyMaxEnergy&packId=2&energyType=1');
      need(j, 'Step 51 buyMaxEnergy');
      await sleep(page, 5);
    }],

    [52, 'Wardrobe', async () => {
      await goto(page, `${V3}/wardrobe.php?wardrobetype=lady&archive=0&category_id%5B0%5D=9`);
      await sleep(page, 5);
    }],

    [53, 'Filter wardrobe', async () => {
      const j = await postForm(page, '/ajax/wardrobe.php',
        'wardrobetype=lady&archive=0&empty_filter=1&updatePartials%5B%5D=9&updatePartials%5B%5D=3');
      need(j, 'Step 53 filter wardrobe');
      await sleep(page, 5);
    }],

    [54, 'Filter event', async () => {
      const j = await postForm(page, '/wardrobe.php', FILTER_54);
      need(j, 'Step 54 filter event');
      await sleep(page, 5);
    }],

    [55, 'Save look (outfit 2)', async () => {
      // bag, dress, necklace, shoes - no earrings; offsets as recorded
      const body = await buildWardrobeSave(page, [
        [2, 27230, 46, -1], [9, 25834, 49, 118], [13, 19708, 49, -123], [18, 27065, 46, -4]
      ], APPEARANCE_55);
      const j = await postForm(page, '/ajax/wardrobe/lady.php', body);
      need(j, 'Step 55 save look');
      await sleep(page, 5);
    }],

    [56, 'Claim 200121', async () => { await claim(page, 200121, 5); }],

    [57, 'BP: spend 10 tickets', async () => {
      for (let i = 1; i <= 10; i++) {
        const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=competeInDuel');
        need(j, `Step 57 ticket ${i}/10`, [1, 3]);
        console.log(`🎟️ Ticket ${i}/10 spent`);
        if (i < 10) await sleep(page, 5);
      }
      await sleep(page, 5);
    }],

    [58, 'Claim 200117', async () => { await claim(page, 200117, 10); }],

    [59, 'BP: 1 ticket in new theme', async () => {
      const j = await postForm(page, '/ajax/beauty_pageant.php', 'action=competeInDuel');
      need(j, 'Step 59 competeInDuel', [1, 3]);
      await sleep(page, 10);
    }],

    [60, 'Claim 200120', async () => { await claim(page, 200120, 5); }],

    [61, 'Fashion Arena page', async () => {
      await goto(page, `${V3}/duels.php`);
      await sleep(page, 10);
    }],

    [62, 'Show stats popup', async () => {
      const j = await postForm(page, '/ajax/main.php', 'type=getStatistics');
      need(j, 'Step 62 getStatistics');
      await sleep(page, 10);
    }],

    [63, 'Raise stats', async () => {
      const j = await postForm(page, '/ajax/train.php', 'type=distributeAllFP');
      need(j, 'Step 63 distributeAllFP');
      await sleep(page, 10);
    }],

    [64, 'Claim 200122', async () => { await claim(page, 200122, 10); }],

    [65, 'FA: 1 duel', async () => {
      const j = await postForm(page, '/ajax/arena.php', 'action=challenge');
      need(j, 'Step 65 challenge');
      await sleep(page, 10);
    }],

    [66, 'FA: all duels', async () => {
      const j = await postForm(page, '/ajax/arena.php', 'action=massChallenge');
      need(j, 'Step 66 massChallenge');
      await sleep(page, 10);
    }],

    [67, 'Claim 200123', async () => { await claim(page, 200123, 5); }],

    [68, 'Buy a pet', async () => {
      await goto(page, `${V3}/pet_shop.php`);
      const j = await postForm(page, '/ajax/pet_shop.php', 'type=buyPet&pet_id=1');
      need(j, 'Step 68 buyPet');
      await sleep(page, 5);
    }],

    [69, 'Claim 200126', async () => { await claim(page, 200126, 5); }],

    [70, 'Play with pet', async () => {
      await goto(page, `${V3}/pet_shop.php`);
      const j = await postForm(page, '/ajax/pets.php', 'type=trainLoyalty&pet_id=1');
      need(j, 'Step 70 trainLoyalty');
      await sleep(page, 10);
    }],

    [71, 'Claim 200127', async () => { await claim(page, 200127, 10, true); }],

    [72, 'Reset stats', async () => {
      await goto(page, `${V3}/duels.php`);
      const j = await postForm(page, '/ajax/main.php', 'type=resetFashoinPoints');
      need(j, 'Step 72 reset stats');
      await sleep(page, 5);
    }],

    // Step 73 (was "Buy 1000 FP"). Buy each popularity booster 50 times, then use each one once.
    // This replaces the old Step 83 (buy + use one at a time), which was removed.
    [73, 'Buy 4 popularity boosters x50, then use each once', async () => {
      await goto(page, `${V3}/duels.php`);
      await sleep(page, 5);

      // buy phase: all 50 purchases of one booster, then the next booster
      for (const id of BOOSTER_IDS) {
        let ok = 0;
        for (let i = 1; i <= BOOSTER_BUY_COUNT; i++) {
          const j = await postForm(page, '/ajax/vip_shop.php', `type=buyPopularityBooster&item_id=${id}`);
          if (j && !j.__nonjson && j.status === 1) ok++;
          else console.log(`⚠️ Step 73 buy booster ${id} #${i}: unexpected response ${raw(j)}`);
          await sleep(page, BOOSTER_BUY_DELAY);
        }
        console.log(`🛒 Booster ${id}: ${ok}/${BOOSTER_BUY_COUNT} bought`);
      }

      // use phase: each booster exactly once
      for (const id of BOOSTER_IDS) {
        await fire(page, `Step 73 use booster ${id}`, '/ajax/items.php', `type=useItem&item_id=${id}&price=false`);
        await sleep(page, 2);
      }

      await reload(page);
      await sleep(page, 5);
    }],

    [74, 'Collect achievement ids', async () => { ctx.achIds = await collectAchievementIds(page); }],
    [75, 'Claim achievements', async () => { await claimAchievements(page, ctx.achIds || []); }],

    [76, 'Redistribute FP', async () => { await redistributeFP(page); }],

    // Steps 77-80 and 82 were removed. (Step 81 was moved to Step 103.)
    // Step 83 was removed (its job is now done by Step 73).

    [84, 'FA: use all energy', async () => {
      await fire(page, 'Step 84 massChallenge', '/ajax/arena.php', 'action=massChallenge');
      await reload(page);
      await sleep(page, 5);
    }],

    [85, 'FA: use all energy', async () => {
      await fire(page, 'Step 85 massChallenge', '/ajax/arena.php', 'action=massChallenge');
      await reload(page);
      await sleep(page, 5);
    }],

    [86, 'Fill energy once', async () => {
      await fire(page, 'Step 86 fillUpEnergy', '/ajax/vip_shop.php', 'type=fillUpEnergy&energyType=1&page=duels');
      await reload(page);
      await sleep(page, 5);
    }],

    // Step 87 does not exist (numbering skipped on purpose)

    [88, 'FA: fight and refill sequence', async () => {
      const seq = [
        ['massChallenge', '/ajax/arena.php', 'action=massChallenge'],
        ['massChallenge', '/ajax/arena.php', 'action=massChallenge'],
        ['fillUpEnergy',  '/ajax/vip_shop.php', 'type=fillUpEnergy&energyType=1&page=duels'],
        ['massChallenge', '/ajax/arena.php', 'action=massChallenge'],
        ['fillUpEnergy',  '/ajax/vip_shop.php', 'type=fillUpEnergy&energyType=1&page=duels'],
        ['massChallenge', '/ajax/arena.php', 'action=massChallenge']
      ];
      for (let i = 0; i < seq.length; i++) {
        await fire(page, `Step 88 #${i + 1} ${seq[i][0]}`, seq[i][1], seq[i][2]);
        await reload(page);
        await sleep(page, 5);
      }
    }],

    [89, 'Boyfriend: activate and kiss', async () => {
      await goto(page, `${V3}/myboy.php`);
      await sleep(page, 5);
      await fire(page, 'Step 89 takeBoyfriend', '/ajax/boyfriend.php', 'type=takeBoyfriend');
      await reload(page);
      await sleep(page, 5);
      await fire(page, 'Step 89 kiss', '/ajax/boyfriend.php', 'type=performAction&actionName=kiss');
      await reload(page);
      await sleep(page, 5);
    }],

    // Step 90 (club application) is skipped / removed.

    [91, 'Salon: buy items for diamonds', async () => {
      await goto(page, `${V3}/beauty_salon.php`);
      await sleep(page, 5);
      const SALON = '/ajax/beauty_salon_lady.php';
      const buy = async (label, body) => { await fire(page, label, SALON, body); await sleep(page, 0.5); };

      for (const n of [20, 19, 17, 16])
        await buy(`Step 91 makeup type 9 / num ${n}`, `type=unlockItem&itemType=9&itemNum=${n}&pageType=makeup`);

      for (const n of [7, 10, 11, 12, 13, 14, 16, 17, 21])
        await buy(`Step 91 makeup type 10 / num ${n}`, `type=unlockItem&itemType=10&itemNum=${n}&pageType=makeup`);

      for (const [t, n] of [[22, 82], [22, 81], [16, 78]])
        await buy(`Step 91 tattoo type ${t} / num ${n}`, `type=unlockItem&itemType=${t}&itemNum=${n}&pageType=tattoo`);

      await buy('Step 91 special 26 / 114', 'type=unlockItem&itemType=26&itemNum=114&pageType=special');
      await buy('Step 91 tattoo 17 / 91', 'type=unlockItem&itemType=17&itemNum=91&pageType=tattoo');

      await reload(page);
      await sleep(page, 5);
    }],

    [92, 'Repeat steps 74 and 75 (4 times)', async () => {
      for (let i = 1; i <= 4; i++) {
        console.log(`🔁 Steps 74+75, run ${i}/4`);
        const ids = await collectAchievementIds(page);
        await claimAchievements(page, ids);
      }
    }],

    // Step 93 saves the new look
    [93, 'Save makeup (new look)', async () => {
      await goto(page, `${V3}/beauty_salon.php`);
      await sleep(page, 5);
      await fire(page, 'Step 93 salon save', '/ajax/beauty_salon_lady.php', SALON_SAVE_NEW_93);
      await sleep(page, 5);
    }],

    [94, 'Repeat step 76 once', async () => { await redistributeFP(page); }],

    // Step 95 - activate the board event (386)
    [95, 'Activate board event', async () => {
      await fire(page, 'Step 95 activateEvent', '/ajax/events.php', `type=activateEvent&event_id=${BOARD2_EVENT_ID}`);
      await sleep(page, 5);
    }],

    // Step 96 - play board 1 (zone 312, 6 rewards)
    [96, 'Play board 1 (zone 312 x6)', async () => {
      await goto(page, `${V3}/events/board.php?event_id=${BOARD2_EVENT_ID}`);
      await sleep(page, 10);
      await playBoardZone(page, BOARD2_EVENT_ID, BOARD2_ZONE_A.zoneId, BOARD2_ZONE_A.rewards);
      await sleep(page, 5);
    }],

    // Step 97 - repeat 74+75 twice
    [97, 'Repeat steps 74 and 75 (2 times)', async () => {
      for (let i = 1; i <= 2; i++) {
        console.log(`🔁 Steps 74+75, run ${i}/2`);
        const ids = await collectAchievementIds(page);
        await claimAchievements(page, ids);
      }
    }],

    // Step 98 - play board 2 (zone 313, 10 rewards)
    [98, 'Play board 2 (zone 313 x10)', async () => {
      await goto(page, `${V3}/events/board.php?event_id=${BOARD2_EVENT_ID}`);
      await sleep(page, 10);
      await playBoardZone(page, BOARD2_EVENT_ID, BOARD2_ZONE_B.zoneId, BOARD2_ZONE_B.rewards);
      await sleep(page, 5);
    }],

    // Step 99 - repeat 74+75 twice
    [99, 'Repeat steps 74 and 75 (2 times)', async () => {
      for (let i = 1; i <= 2; i++) {
        console.log(`🔁 Steps 74+75, run ${i}/2`);
        const ids = await collectAchievementIds(page);
        await claimAchievements(page, ids);
      }
    }],

    // Step 100 - repeat step 76
    [100, 'Repeat step 76', async () => { await redistributeFP(page); }],

    // CHANGED: new Step 101 - save the new makeup look (SALON_SAVE_101)
    [101, 'Save makeup (new look)', async () => {
      await goto(page, `${V3}/beauty_salon.php`);
      await sleep(page, 5);
      await fire(page, 'Step 101 salon save', '/ajax/beauty_salon_lady.php', SALON_SAVE_101);
      await sleep(page, 5);
    }],

    // CHANGED: Step 102 (was Step 101): buy pose
    [102, 'Buy pose (collection 363)', async () => {
      // the unlock request was recorded from the Fashion Arena page
      await goto(page, `${V3}/duels.php`);
      await sleep(page, 5);
      await fire(page, 'Step 102 unlock collection', '/ajax/mall/boutique.php', `action=unlockCollection&collectionId=${POSE_COLLECTION_ID}`);
      await sleep(page, 3);

      await goto(page, `${V3}/mall/boutique.php?collectionsPage=locked&collectionId=${POSE_COLLECTION_ID}`);
      await sleep(page, 5);

      await fire(page, 'Step 102 add to cart', '/ajax/mall/cart.php',
        `action=addToCart&mallType=1&itemId=24931&itemCategoryId=17&itemCollectionId=${POSE_COLLECTION_ID}&itemColor=1&pageNum=1&collectionsPage=limited&orderBy=&orderType=`);
      await sleep(page, 3);

      await fire(page, 'Step 102 go to cart', '/ajax/mall/cart.php', 'action=loadMallContent');
      await sleep(page, 3);

      await fire(page, 'Step 102 buy item', '/ajax/mall/cart.php', 'action=checkoutCart&collectionsPage=limited');
      await sleep(page, 5);
    }],

    // CHANGED: Step 103 (was Step 102): buy the items that Step 104 uses in the makeup save (no hair, no save here)
    [103, 'Salon: buy nose, eyebrows, lips', async () => {
      await goto(page, `${V3}/beauty_salon.php`);
      await sleep(page, 5);
      const SALON = '/ajax/beauty_salon_lady.php';
      await fire(page, 'Step 103 nose 10',     SALON, 'type=unlockItem&itemType=3&itemNum=10&pageType=surgeries');
      await sleep(page, 2);
      await fire(page, 'Step 103 eyebrows 30', SALON, 'type=unlockItem&itemType=9&itemNum=30&pageType=makeup');
      await sleep(page, 2);
      await fire(page, 'Step 103 lips 31',     SALON, 'type=unlockItem&itemType=2&itemNum=31&pageType=surgeries');
      await sleep(page, 2);
      await reload(page);
      await sleep(page, 5);
    }],

    // CHANGED: Step 104 (was Step 103): makeup save
    [104, 'Save makeup', async () => {
      await goto(page, `${V3}/beauty_salon.php`);
      await sleep(page, 5);
      await fire(page, 'Step 104 salon save', '/ajax/beauty_salon_lady.php', SALON_SAVE_93);
      await sleep(page, 5);
    }]
  ];

  for (const [num, name, fn] of steps) {
    if (num < START_AT || num > STOP_AT) continue;
    console.log(`\n🚀 Step ${num} - ${name}`);
    await fn();            // any thrown error stops the whole script
    console.log(`✅ Step ${num} done`);
  }
  console.log('🏁 New-account script finished.');
};
