require('dotenv').config();
const { chromium } = require('playwright');



// ⬇️ Import all sub-scripts (exported as functions).

const DIVIDER = '────────────────────────────────────────────────────────────────────────────────';

const runBurnEnergy = require('./burn-energy.js');
const runFashionMagazine = require('./fashion-magazine.js');
const runTeleportEvent = require('./tele.js');
const runSolitaireEvent = require('./solitaire.js');
const runMapsEvent = require('./maps.js');
const runSlotsEvent = require('./Slots.js');
const runMemoryEvent = require('./memory.js');
const runFurnitureScript = require('./furniture.js');
const runDailyTasks = require('./daily-tasks.js');
const runBoyfriendKiss = require('./bfk.js');
const runGuildShow = require('./guild-show.js');
const runPetTraining = require('./pet-train.js');
const runBridesmaids = require('./bridesmaids.js');
const runParties = require('./parties.js');
const runApartment = require('./apartment.js');
const runTeleport = require('./teleport-activation.js');
const runGifts = require('./gifts-activation.js');
const runDuelFP = require('./duel-fp.js');
const runClaimRewards = require('./claim-BPrewards.js');
const runGuildAttack = require('./guild-attack.js');
const runRate = require('./rate.js');
const runBattlePassChests = require('./battlepass-chests.js');
const runNewAccount = require('./new-account.js');



const scripts = [

  { name: 'New Account', fn: runNewAccount, alwaysRun: true },
  /*{ name: 'Burn Energy', fn: runBurnEnergy, alwaysRun: true },
  { name: 'Claim Duel Rewards', fn: runClaimRewards, alwaysRun: true },*/

  /*{ name: 'Fashion Magazine', fn: runFashionMagazine, envKey: 'LP_FASHION_MAGAZINE_URL' },

  { name: 'Tele Event', fn: runTeleportEvent, envKey: 'LP_TELEPORT_URL' },

  { name: 'Solitaire Event', fn: runSolitaireEvent, envKey: 'LP_SOLITAIRE_URL' },

  { name: 'Maps Event', fn: runMapsEvent, envKey: 'LP_MAPS_URL' },

  { name: 'Slots Event', fn: runSlotsEvent, envKey: 'LP_SLOTS_URL' },

  { name: 'Parties', fn: runParties, alwaysRun: false },

  { name: 'Memory Event', fn: runMemoryEvent, envKey: 'LP_MEMORY_URL' }, */

  /*{ name: 'Daily Tasks', fn: runDailyTasks, alwaysRun: true },

  { name: 'Boyfriend Kiss', fn: runBoyfriendKiss, alwaysRun: true },
  { name: 'Guild Attack', fn: runGuildAttack, alwaysRun: false },

  { name: 'Guild Show', fn: runGuildShow, alwaysRun: true },

  { name: 'Pet Training', fn: runPetTraining, alwaysRun: false },*/

  //{ name: 'Bridesmaids Tasks', fn: runBridesmaids, alwaysRun: false },

  //{ name: 'Apartment Income', fn: runApartment, alwaysRun: true },
  //{ name: 'Gifts Flashback', fn: runGifts, alwaysRun: false },
  //{ name: 'Teleport Activation', fn: runTeleport, alwaysRun: true },
  //{ name: 'Furniture Script1', fn: runFurnitureScript, alwaysRun: true },
  //{ name: 'Furniture Script2', fn: runFurnitureScript, alwaysRun: true },
  /*{ name: 'Raise stats', fn: runDuelFP, alwaysRun: true },
  { name: 'Rate Guild', fn: runRate, alwaysRun: true },*/
  //{ name: 'Battle Pass Chests', fn: runBattlePassChests, alwaysRun: false }, //opens chests

];



// ================================================================
// 📝 REGISTER FUNCTION (replaces login)
// ================================================================

async function register(page, account) {

  console.log(`📝 Registering ${account.name}...`);

  let registerSuccess = false;

  for (let attempt = 1; attempt <= 1; attempt++) {

    try {

      // ----------------------------------------------------------
      // Step 1: open the homepage
      // ----------------------------------------------------------
      console.log(`📝 [${account.name}] Attempt ${attempt}: Opening Lady Popular...`);

      await page.goto('https://ladypopular.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });



      // ----------------------------------------------------------
      // Step 2: click "Create an account"
      // (page has more than one, so take the first visible one)
      // ----------------------------------------------------------
      console.log("🔎 Waiting for Create an account button...");

      const createBtn = page
        .locator('a.register-btn[data-popup="register"]:visible')
        .first();

      await createBtn.waitFor({ state: 'visible', timeout: 30000 });

      await page.waitForTimeout(2000);

      await createBtn.click();

      // wait for the popup to appear
      await page.waitForTimeout(5000);

      await page.waitForSelector('#reg_form', {
        state: 'visible',
        timeout: 15000
      });



      // ----------------------------------------------------------
      // Step 3: fill the form
      // ----------------------------------------------------------
      console.log(`📝 [${account.name}] Filling registration form...`);

      await page.fill('#reg_form #regUsername', account.username);

      await page.fill('#reg_form #regPassword', account.password);

      await page.fill('#reg_form #reg_email', account.gmail);

      // force:true because the checkboxes are custom-styled
      // (the real input is often hidden behind a <span>)
      await page.locator('#reg_form #terms').check({ force: true });

      await page.locator('#reg_form #privacy-policy').check({ force: true });

      await page.waitForTimeout(1000);



      // ----------------------------------------------------------
      // Step 4: submit and wait 15 seconds
      // ----------------------------------------------------------
      console.log(`📝 [${account.name}] Submitting...`);

      await page.click('#registrationSubmit');

      await page.waitForTimeout(15000);



      // Check for validation errors shown inside the form
      const errorSelectors = [
        '#register_username',
        '#register_password',
        '#register_email',
        '#register_error',
        '#termsStatus',
        '#privacyPolicyStatus',
      ];

      for (const sel of errorSelectors) {

        const el = page.locator(sel);

        if (await el.isVisible().catch(() => false)) {

          const msg = (await el.innerText()).trim();

          if (msg) {
            throw new Error(`Form error (${sel}): ${msg}`);
          }

        }

      }



      // Registration should log us straight into the game
      await page.waitForSelector('#header', { timeout: 15000 });

      console.log(`🎉 [${account.name}] Registration successful.`);

      registerSuccess = true;

      break;

    } catch (error) {

      console.log(
        `❌ [${account.name}] Register attempt ${attempt} failed: ${error.message}`
      );

      await page.screenshot({
        path: `${account.name.replace(/\s+/g, '_')}-register-error-${attempt}.png`,
        fullPage: true
      });



      if (attempt === 1) {

        console.log(
          `🚫 [${account.name}] Registration failed. Aborting this account.`
        );

        throw error;

      }

    }

  }

  return registerSuccess;
}



// ================================================================
// 🎁 DAILY REWARD COLLECTION
// ================================================================

async function collectDailyReward(page) {

  console.log(DIVIDER);
  console.log("🎁 Starting daily reward collection...");
  console.log("📡 Endpoint: /ajax/daily_rewards.php");
  console.log("🔁 Will attempt dates 1 → 7");

  for (let date = 1; date <= 7; date++) {

    try {

      console.log(`➡️ Sending daily reward request for date = ${date}...`);

      const response = await page.evaluate(async (date) => {

        const res = await fetch(
          'https://v3.g.ladypopular.com/ajax/daily_rewards.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
              type: 'collectSevenDayReward',
              date: date
            }),
            credentials: 'same-origin'
          }
        );

        return await res.json();

      }, date);

      console.log(
        `📦 Date ${date} → status=${response.status}` +
        (response.message ? ` | message="${response.message}"` : '')
      );

      if (response.status === 1) {

        console.log(
          `🎉 Daily reward successfully collected for date ${date}.`
        );

        console.log(
          "⛔ Future dates will be locked. Stopping further requests."
        );

        break;
      }

      await page.waitForTimeout(500);

    } catch (err) {

      console.log(
        `❌ Daily reward request failed for date ${date}: ${err.message}`
      );

    }

  }

  console.log("🎁 Daily reward collection block finished.");
  console.log(DIVIDER);

}



// ================================================================
// 🧩 RUN ALL SCRIPTS
// ================================================================

async function runAllScripts(page, account) {

  // ==============================================================
  // ✅ RUN EACH SCRIPT
  // ==============================================================

  for (const script of scripts) {

    const shouldRun =
      script.alwaysRun ||
      (
        process.env[script.envKey] &&
        process.env[script.envKey] !== 'OFF'
      );



    if (!shouldRun) {

      console.log(
        `⏭️ ${script.name} skipped (not active or URL = OFF)`
      );

      continue;

    }



    console.log(`\n🚀 Starting: ${script.name}`);

    try {

      await script.fn(page, account);

      console.log(
        `✅ ${script.name} finished successfully.`
      );

      console.log(DIVIDER);

    } catch (err) {

      console.log(
        `❌ ${script.name} failed: ${err.message}`
      );

      await page.screenshot({
        path: `${script.name.replace(/\s+/g, '_')}-error.png`,
        fullPage: true
      });

      console.log(DIVIDER);

    }

  }

}



// ================================================================
// 🚪 LOGOUT FUNCTION
// ================================================================

async function logout(page, account) {

  console.log(`🚪 Logging out from ${account.name}...`);

  await page.goto(
    'https://v3.g.ladypopular.com/logout.php',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // Confirm that LP has returned us to the login page.
  await page.waitForSelector('#login-btn', {
    timeout: 15000
  });

  console.log(`✅ [${account.name}] Logout confirmed.`);

}



// ================================================================
// 🚀 MAIN
// ================================================================

(async () => {

  // ==============================================================
  // 👥 LOAD ACCOUNTS
  // ==============================================================

  let accounts;

  try {

    accounts = JSON.parse(process.env.LP_ACCOUNTS);

  } catch (error) {

    console.log("❌ Could not read LP_ACCOUNTS.");

    console.log(
      "❌ Make sure LP_ACCOUNTS contains valid JSON."
    );

    process.exit(1);

  }



  if (!Array.isArray(accounts) || accounts.length === 0) {

    console.log("❌ LP_ACCOUNTS contains no accounts.");

    process.exit(1);

  }



  console.log(
    `👥 Loaded ${accounts.length} account(s).`
  );



  // ==============================================================
  // 🌐 LAUNCH BROWSER
  // ==============================================================

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext();

  const page = await context.newPage();



  // ==============================================================
  // 🔁 PROCESS EACH ACCOUNT
  // ==============================================================

  for (const account of accounts) {

    console.log('\n');
    console.log(DIVIDER);

    console.log(
      `👤 Starting account: ${account.name}`
    );

    console.log(DIVIDER);



    try {

      // ----------------------------------------------------------
      // 📝 REGISTER (replaces login)
      // ----------------------------------------------------------

      const registered = await register(page, account);

      if (!registered) {

        console.log(
          `🚫 ${account.name}: registration failed, skipping all tasks for this account.`
        );

        continue;

      }



      // ----------------------------------------------------------
      // 🎁 DAILY REWARD
      // ----------------------------------------------------------

      await collectDailyReward(page);



      // ----------------------------------------------------------
      // ▶️ RUN ALL EXISTING SCRIPTS
      // ----------------------------------------------------------

      await runAllScripts(page, account);



      // ----------------------------------------------------------
      // 🚪 LOGOUT
      // ----------------------------------------------------------

      await logout(page, account);



      console.log(
        `🎉 ${account.name} completed successfully.`
      );

    } catch (err) {

      console.log(
        `❌ ${account.name} encountered an error: ${err.message}`
      );

      console.log(
        `⚠️ Moving on from ${account.name}.`
      );

    }

  }



  // ==============================================================
  // 🛑 CLOSE BROWSER
  // ==============================================================

  await browser.close();

  console.log(
    `\n🎉 All accounts processed. Browser closed.`
  );

})();
