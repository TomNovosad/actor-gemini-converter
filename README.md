# Apify Gemini Converter

Apify Gemini Converter is a very simple actor to scrape any web page and convert it to the Gemini capsule. You can define any number of HTML elements on the source page, which will be converted to the gemtext (native language for Gemini very similar to the Markdown).
For more infromations about Gemini, please refer to the [gemini.circumlunar.space](https://gemini.circumlunar.space/).

## Actor input schema

- **Url** Source url for the HTML page (JSON property `url`).
- **File name** Gemini file name (JSON property `filename`).
- **Elements** Elements configuration object (JSON property `elements`). Please refer to the '[How to specify elements](#how-to-specify-elements)' section.
- **Development mode** Set to `true` if you want to run in development mode (JSON property `development`).


### How to specify elements

```json
{
  "path": "h1#firstHeading",
  "type": "heading1"
}
```

Where:
* `path` Selector used for the `document.querySelector` method in Puppeteer.
* `type` Gemini element type (`heading1`, `heading2`, `heading3`, `text`, `link`, `list`, `blockquote` or `preformatted`).


## Input example
```json
{
  "url": "https://en.wikipedia.org/wiki/Chernobyl",
  "filename": "index.gmi",
  "elements": [
    {
      "path": "#firstHeading",
      "type": "heading1"
    },
    {
      "path": "#mw-content-text > div.mw-parser-output > p:nth-child(8)",
      "type": "text"
    },
    {
      "path": "#Etymology",
      "type": "heading2"
    },
    {
      "path": "#mw-content-text > div.mw-parser-output > ul:nth-child(17) > li:nth-child(1)",
      "type": "list"
    }
  ]
}
```


## Gemini server for testing

I recommend using [Agate](https://github.com/timwalls/agate) server for Gemini network protocol.