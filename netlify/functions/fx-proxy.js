export default async (req, context) => {
  const url = new URL(req.url);
  const base = url.searchParams.get('base');
  const target = url.searchParams.get('target');

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const data = await res.json();

    return Response.json({
      rate: data.rates?.[target] || null
    });
  } catch (error) {
    return Response.json({ error: "Rate fetch error", details: error.message });
  }
};
