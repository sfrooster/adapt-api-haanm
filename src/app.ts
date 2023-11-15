import playwright from "playwright";
import inputData from "../inputData.json";
import { AuthType, PrevNext, fauxDb } from "./config/FauxDB";

// Clean the input data first
const carriersToProcess = new Map<string, Set<string>>();

inputData.forEach((entry) => {
  if (carriersToProcess.has(entry.carrier)) {
    carriersToProcess.get(entry.carrier)?.add(entry.customerId);
  } else if (
    fauxDb.carriers.some(
      (carrier) => carrier.details.standardizedName === entry.carrier
    )
  ) {
    carriersToProcess.set(entry.carrier, new Set<string>([entry.customerId]));
  } else {
    console.warn(
      `skipping inout data carrier ${entry.carrier}: no config for carrier`
    );
  }
});

// Process carriers input, find carriers we can process
const processableCarriers = Array.from(carriersToProcess.entries()).map(
  (kvPair) => {
    const details = fauxDb.carriers.find(
      (carrier) => carrier.details.standardizedName === kvPair[0]
    )!.details!;
    return {
      ...details,
      customerIds: Array.from(kvPair[1].values()),
    };
  }
);

// If we have not carriers we can process, exit
if (processableCarriers.length === 0) {
  console.warn("there are no processable carriers in the inout data");
  setTimeout(() => process.exit(1), 3000);
}

const scrape = async () => {
  // By breaking this this up vs additional chaining we can avoid playwright setup if not needed
  const setup = async () => {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext({ bypassCSP: true });
    const page = await context.newPage();
    await page.route("**/*", (route) =>
      route.request().resourceType() === "image"
        ? route.abort()
        : route.continue()
    );

    return page;
  };

  const cleanup = async (workpage: playwright.Page) => {
    await workpage.context().close();
    await workpage.context().browser()?.close();
  };

  const workPage = await setup();

  // BEGIN ====== Scripts - meant to be codegen'd via playwright and loaded at runtime
  const mockIndemnityScript = async (
    workpage: playwright.Page,
    customerId: string,
    url: string
  ) => {
    const urlToUse = url.replace("~0", customerId);
    const result = await workpage.goto(urlToUse);
    if (result === null) {
      console.warn(
        `navigated to about:blank or the same URL with a different hash`
      );
      return;
    } else if (result.ok()) {
      const email = await workpage
        .locator("dd.value-email.value-holder")
        .innerText();
      console.log(`email: ${email}`);
    } else {
      console.warn(`status text: ${result.statusText()}`);
      // do audit trail stuff
      return;
    }
  };

  const placeholderScript = async (
    workpage: playwright.Page,
    customerId: string,
    url: string
  ) => {
    const urlToUse = url.replace("~0", customerId);
    const result = await workpage.goto(urlToUse);
    if (result === null) {
      console.warn(
        `navigated to about:blank or the same URL with a different hash`
      );
      return;
    } else if (result.ok()) {
      let pagedUrl = workpage.url();
      console.log(`ph pagedUrl ${pagedUrl}`);

      let currPageNum = 1;
      let currPageNumResult = await workpage.goto(
        `${urlToUse}/policies/${currPageNum}`
      );
      if (currPageNumResult === null) {
        console.warn(
          `navigated to about:blank or the same URL with a different hash`
        );
        return;
      } else if (result.ok()) {
        // get agent info
        // get customer info

        do {
          const summary = workpage
            .locator(
              "div.card.policy-details > table.table > tbody > tr.policy-info-row"
            )
            .count();
          const detail = workpage
            .locator(
              "div.card.policy-details > table.table > tbody > tr.collapse > td.details-row"
            )
            .count();
          const [summmaryCount, detailCount] = await Promise.all([
            summary,
            detail,
          ]);

          console.log(
            `Page ${currPageNum}: summaries = ${summmaryCount}, details = ${detailCount}, match = ${
              summmaryCount === detailCount
            }`
          );
          if (summmaryCount === 0 && detailCount === 0) break;

          currPageNumResult = await workpage.goto(
            `${urlToUse}/policies/${++currPageNum}`
          );
          if (currPageNumResult === null) {
            console.warn(
              `navigated to about:blank or the same URL with a different hash`
            );
            break;
          }
        } while (true);
      }
    }
    // do audit trail stuff
    return;
  };

  // END Scripts ========================================

  for (let carrierToProcess of processableCarriers) {
    // not aborting the entire scape job (but could be convinced we could identify scenarios where we should)
    try {
      if (carrierToProcess.authType !== AuthType.NONE) {
        throw new TypeError(
          `currently, only authType ${
            AuthType.NONE
          } is supported:\n${JSON.stringify(carrierToProcess)}`
        );
      }

      console.log({ ...carrierToProcess });
      for (let customerId of carrierToProcess.customerIds) {
        console.log(`mock ${customerId} ----------------------------`);
        await mockIndemnityScript(workPage, customerId, carrierToProcess.url);

        console.log(`place ${customerId} ----------------------------`);
        await placeholderScript(workPage, customerId, carrierToProcess.url);
      }
    } catch (err) {
      // real audit things here
      console.error(err);
    }
  }

  await cleanup(workPage);
};

scrape();
