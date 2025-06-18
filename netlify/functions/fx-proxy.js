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
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const data = await res.json();

    if (data?.rates?.[target]) {
      return new Response(JSON.stringify({
        rate: data.rates[target],
        source: "ExchangeRate.host"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    // Continue to fallback
  }

  // Frankfurter fallback if both base and target are supported
  const frankfurterSupported = ["USD", "EUR", "GBP", "AUD", "INR", "PHP"];
  if (frankfurterSupported.includes(base) && frankfurterSupported.includes(target)) {
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${target}`);
      const data = await res.json();

      if (data?.rates?.[target]) {
        return new Response(JSON.stringify({
          rate: data.rates[target],
          source: "Frankfurter"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Frankfurter fetch error", details: err.message }), {
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
