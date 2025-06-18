export default async (req) => {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base");
  const target = searchParams.get("target");

  if (!base || !target) {
    return new Response(JSON.stringify({ error: "Missing query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = "cur_live_JIrwC4Qmy8xZ7W8o1KrpyELOEpDCuSG5NDjrSbsb"; // 🔁 Replace this with your real CurrencyAPI key

  try {
    const res = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${base}&currencies=${target}`);
    const data = await res.json();

    const rate = data?.data?.[target]?.value;

    if (!rate) {
      throw new Error("Rate not found in response");
    }

    return new Response(JSON.stringify({ rate, source: "CurrencyAPI.com" }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Rate fetch error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

