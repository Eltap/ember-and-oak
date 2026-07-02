# How to Update Your Product Catalog

This is a quick guide for adding new products or changing prices on your site yourself, without waiting on Prism Websites to make the change for you.

## Where Your Catalog Lives

Your products, prices, and descriptions all live in one file called `products.json`, here:

**https://github.com/Eltap/ember-and-oak/blob/master/products.json**

You'll need the GitHub login you were given when the site launched. No coding tools, no downloads — everything happens in your web browser.

## Changing a Price or Description

1. Open the `products.json` link above.
2. Click the pencil icon in the top-right corner of the file to start editing.
3. Find the product you want to change. Each one looks like this:
   ```
   {
     "id": "amber-oakwood",
     "name": "Amber & Oakwood",
     "scent": "Warm & Woody",
     "price": 24,
     "desc": "Amber resin, warm oak, and a whisper of sandalwood. Our best-seller.",
     "image": "images/candle-amber-oakwood.svg"
   }
   ```
4. To change the price, edit the number after `"price":` — just the number, no dollar sign or quotes (e.g. change `24` to `26`).
5. To change the description, edit the text between the quotes after `"desc":`, keeping the quotes in place.
6. Scroll to the bottom of the page. Type a short note in the commit message box (e.g. "Update candle prices").
7. Click **Commit changes directly to the master branch**.
8. Give it about a minute — your site rebuilds automatically and the change will be live.

## Adding a New Product

1. Open `products.json` and click the pencil icon, same as above.
2. Copy one entire existing product block — everything from its opening `{` to its closing `},` (include the comma).
3. Paste the copy right after the block you copied it from.
4. Edit the new block's fields:
   - `id`: a short, unique label with no spaces (use hyphens, e.g. `"pumpkin-spice"`)
   - `name`, `scent`, `desc`: whatever fits the new product
   - `price`: the number, no dollar sign
   - `image`: leave this pointing at an existing image for now, or ask Prism Websites for a matching product icon and use the filename they send you
5. Commit the change the same way as above (steps 6-8 in the previous section).

## A Few Rules to Keep the File Working

This file follows a strict format (called JSON), so a few things matter:

- Every product block needs a comma right after its closing `}` — **except the very last one in the file**, which has no comma.
- Don't remove any of the quotation marks — they need to stay exactly where they are.
- Don't delete the square brackets `[` and `]` at the very start and end of the whole file.
- If you're ever unsure before making a bigger edit, copy the file's full contents somewhere safe first, so you can paste it back if something goes wrong.

## If Something Breaks

If you make a change and the shop page stops showing products afterward, it's almost always a misplaced comma or quotation mark. This is a quick fix — send Prism Websites a message and it can usually be sorted out in a few minutes. If you'd rather not edit the file yourself at all, that's completely fine too; just send over what you want changed and it'll be handled as a normal update request.
