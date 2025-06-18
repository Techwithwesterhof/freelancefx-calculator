export default async (req, context) => {
  const base = req.query.base;
  const target = req.query.target;

  if (!base || !target) {
    return new Response(JSON.stringify({ error: "Missing query params" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // First try ExchangeRate.host
  try {
    const hostRes = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const hostData = await hostRes.json();

    if (hostData?.rates?.[target]) {
      return new Response(JSON.stringify({
        rate: hostData.rates[target],
        source: "ExchangeRate.host"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    // fallback below
  }

  // Fallback to Frankfurter if ExchangeRate.host fails or is unsupported
  const frankfurterSupported = ["USD", "EUR", "GBP", "AUD", "INR", "PHP"];
  if (frankfurterSupported.includes(base) && frankfurterSupported.includes(target)) {
    try {
      const frankRes = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${target}`);
      const frankData = await frankRes.json();

      if (frankData?.rates?.[target]) {
        return new Response(JSON.stringify({
          rate: frankData.rates[target],
          source: "Frankfurter"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Rate fetch error", fallback: "Frankfurter", details: err.message }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ error: "Rate unavailable for given currencies." }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
};
