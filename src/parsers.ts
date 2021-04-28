import * as Apify from "apify";
import { ApifyContext, ElementType } from "./types";

const { log } = Apify.utils;

export const parseHtml = async ({ page, request }: ApifyContext): Promise<string> => {
    const { elements } = request.userData;
    const result = [];

    for (const element of elements) {
        const pageEl = await page.$(element.path);

        if (pageEl) {
            switch(element.type) {
                case ElementType.Link:
                    result.push(`=> ${await pageEl.evaluate(getLink)} ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.Text:
                    result.push(await pageEl.evaluate(getInnerText));
                    break;
                case ElementType.Heading1:
                    result.push(`# ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.Heading2:
                    result.push(`## ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.Heading3:
                    result.push(`### ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.List:
                    result.push(`* ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.Blockquote:
                    result.push(`> ${await pageEl.evaluate(getInnerText)}`);
                    break;
                case ElementType.Preformatted:
                    result.push(await pageEl.evaluate(getInnerText));
                    break;
                default:
            }
        }
    }
    return result.join(`\n`);
};

export const getKebabCase = (str: string) => str.toLowerCase()
    .replace(/\s/g, '-');

export const getLink = (el: HTMLElement) => el?.getAttribute(`href`) as string;

export const getSrc = (el: HTMLElement) => el?.getAttribute(`src`);

export const getInnerText = (el: HTMLElement) => el?.innerText;