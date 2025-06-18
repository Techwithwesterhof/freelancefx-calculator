
export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get("base");
    const target = searchParams.get("target");

    if (!base || !target) {
      return new Response(JSON.stringify({ error: "Missing base or target currency" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = "cur_live_JIrwC4Qmy8xZ7W8o1KrpyELOEpDCuSG5NDjrSbsb";

    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${base}&currencies=${target}`);
    const data = await response.json();

    const rate = data?.data?.[target]?.value;

    if (!rate) {
      return new Response(JSON.stringify({ error: "Currency not supported or rate unavailable", raw: data }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ rate, source: "CurrencyAPI" }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Unexpected error occurred",
      message: err.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
