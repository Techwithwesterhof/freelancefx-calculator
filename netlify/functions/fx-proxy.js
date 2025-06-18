export default async (req, context) => {
  const base = req.query.base;
  const target = req.query.target;

  if (!base || !target) {
    return new Response(JSON.stringify({ error: "Missing query params" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = "cur_live_JIrwC4Qmy8xZ7W8o1KrpyELOEpDCuSG5NDjrSbsb"; // 🔁 Replace with your actual API key

  try {
    const res = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${base}&currencies=${target}`);
    const data = await res.json();

    const rate = data?.data?.[target]?.value;
    if (!rate) {
      throw new Error("Rate not found");
    }

    return new Response(JSON.stringify({ rate, source: "CurrencyAPI.com" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Rate fetch error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

