import * as Apify from "apify";
import { Schema, ApifyContext } from "./types";
import { STORE_NAME } from "./constants";
import { parseHtml } from "./parsers";

const { log } = Apify.utils;

const handlePageFunction = async (context: ApifyContext) => {
    const { response, request }: ApifyContext = context;
    const { filename } = request.userData;

    const body = await response.text();

    log.info(`Request [${request.method}] ${request.loadedUrl}`);
    log.info(`   Origin URL:             ${request.url}`);
    log.info(`   Response length:        ${body.length}`);
    log.info(`   Response status:        ${response.status()}`);

    if (response.status() !== 200) {
        log.error('Request status code:', response.status);
        return;
    }

    log.info(`************************************************************************************************************`);
    log.info('');

    // Open CapsuleStore
    const capsuleStore = await Apify.openKeyValueStore(STORE_NAME);

    const result = await parseHtml(context);

    // Save to the CapsuleStore
    await capsuleStore.setValue(filename, result, { contentType: "text/gemini" });

};

Apify.main(async () => {
    const input: Schema = await Apify.getInput() as Schema;
    const { url, elements, development, filename } = input;

    if (development) {
        log.setLevel(log.LEVELS.DEBUG);
    }

    // Create new queue
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({git
        url,
        userData: {
            elements,
            filename
        }
    });

    // Get `maxConcurrency` from ENV
    const maxConcurrency = process.env?.MAX_CONCURRENCY ? +process.env.MAX_CONCURRENCY : 5;

    // Create Puppeteer Crawler
    const crawler = new Apify.PuppeteerCrawler({
        launchContext: {
            launchOptions: {
                headless: true,
                useChrome: true,
                stealth: false,
                args: [
                    '--disable-web-security',
                    '--disable-notifications',
                ],
            },
        },
        requestQueue,
        maxRequestRetries: 2,
        maxConcurrency,
        handlePageTimeoutSecs: 1200,
        handlePageFunction,
        handleFailedRequestFunction: async ({ request }: ApifyContext) => {
            log.error(`Request ${request.url} failed multiple times.`, request);
        },

    });

    // Start the crawler
    log.info('');
    log.info(`************************************************************************************************************`);
    log.info(`   Converting web page \`${url}\` to the Gemini capsule.`);
    log.info(`************************************************************************************************************`);
    log.info('');

    await crawler.run();

    log.info('Done.');
});
