# Tesla landing page

The hero **Order now** button creates a Byl checkout for one `model3price` item and redirects the visitor to the secure checkout URL returned by Byl.

## Deployment

This project includes a Vercel serverless function so the Byl API token never reaches the browser.

1. Import the repository into Vercel.
2. In **Project Settings -> Environment Variables**, add `BYL_TOKEN` with the API token created in the Byl dashboard.
3. Deploy the project.

The Byl project ID defaults to `850` and the price lookup key defaults to `model3price`. They can be changed with the optional `BYL_PROJECT_ID` and `BYL_PRICE_LOOKUP_KEY` environment variables shown in `.env.example`.

Do not put the real API token in source code or commit a local `.env` file.
