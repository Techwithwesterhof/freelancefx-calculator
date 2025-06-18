export async function handler(event, context) {
  const { base, target } = event.queryStringParameters || {};
  if (!base || !target) return { statusCode: 400, body: "Missing base/target" };

  const resp = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
  const data = await resp.json();
  if (!data.rates?.[target]) return { statusCode: 500, body: "Rate fetch error" };

  return {
    statusCode: 200,
    headers: { "cache-control": "max-age=60" },
    body: JSON.stringify({ rate: data.rates[target] })
  };
}
