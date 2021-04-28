import { Request } from "apify";
import { HTTPResponse, Page } from "puppeteer";

export enum ElementType {
    Link = "link",
    Text = "text",
    Heading1 = "heading1",
    Heading2 = "heading2",
    Heading3 = "heading3",
    List = "list",
    Blockquote = "blockquote",
    Preformatted = "preformatted"
}

export interface Element {
    path: string;
    type: ElementType;
}

export interface Schema {
    url: string;
    elements: Element[];
    filename: string;
    development: boolean;
}

export interface ApifyRequest extends Request {
    userData: {
        elements: Element[];
        filename: string;
    }
}

export interface ApifyContext {
    request: ApifyRequest,
    response: HTTPResponse,
    page: Page
}
