export default async (req, context) => {
  const base = req.query.base;
  const target = req.query.target;

  if (!base || !target) {
    return new Response(JSON.stringify({ error: "Missing query params" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const data = await res.json();

    return new Response(JSON.stringify({
      rate: data?.rates?.[target] || null
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Rate fetch error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

