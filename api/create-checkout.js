const BYL_API_URL = 'https://byl.mn/api/v1';
const DEFAULT_PROJECT_ID = '850';
const DEFAULT_PRICE_LOOKUP_KEY = 'model3price';

function sendJson(response, statusCode, body) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  return response.status(statusCode).json(body);
}

module.exports = async function createCheckout(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { message: 'Method not allowed.' });
  }

  const token = process.env.BYL_TOKEN;
  const projectId = process.env.BYL_PROJECT_ID || DEFAULT_PROJECT_ID;
  const price = process.env.BYL_PRICE_LOOKUP_KEY || DEFAULT_PRICE_LOOKUP_KEY;

  if (!token) {
    console.error('BYL_TOKEN environment variable is missing.');
    return sendJson(response, 500, {
      message: 'Checkout is not configured yet. Please contact support.'
    });
  }

  try {
    const bylResponse = await fetch(
      `${BYL_API_URL}/projects/${encodeURIComponent(projectId)}/checkouts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: [{ price, quantity: 1 }] }),
        signal: AbortSignal.timeout(10000)
      }
    );
    const result = await bylResponse.json().catch(() => ({}));

    if (!bylResponse.ok) {
      console.error('Byl rejected checkout creation.', {
        status: bylResponse.status,
        error: result.error,
        message: result.message
      });
      const message = bylResponse.status >= 500
        ? 'The payment service is temporarily unavailable. Please try again.'
        : result.message || 'Checkout could not be created. Please try again.';

      return sendJson(response, bylResponse.status, {
        message,
        error: result.error || 'byl_request_failed'
      });
    }

    if (!result.data?.url) {
      console.error('Byl response did not include a checkout URL.');
      return sendJson(response, 502, {
        message: 'The payment service returned an invalid response.'
      });
    }

    return sendJson(response, 201, {
      id: result.data.id,
      url: result.data.url
    });
  } catch (error) {
    console.error('Unable to reach Byl.', error);
    return sendJson(response, 502, {
      message: 'The payment service could not be reached. Please try again.'
    });
  }
};
