export async function handler(event, context) {
  const { base, target } = event.queryStringParameters || {};
  if (!base || !target) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing base or target currency." })
    };
  }

  try {
    const resp = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const data = await resp.json();

    if (!data || !data.rates || !data.rates[target]) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Rate fetch error", response: data })
      };
    }

    return {
      statusCode: 200,
      headers: { "cache-control": "max-age=60" },
      body: JSON.stringify({ rate: data.rates[target] })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", message: error.message })
    };
  }
}

