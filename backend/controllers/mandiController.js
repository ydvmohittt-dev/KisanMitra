const MANDI_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const MANDI_API_URL = `https://api.data.gov.in/resource/${MANDI_RESOURCE_ID}`;


export const getMandiPrices = async (req, res) => {
  try {
    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Mandi price service is not configured" });
    }

    const { state, district, commodity, market } = req.query;
    const url = new URL(MANDI_API_URL);
console.log(MANDI_API_URL)
    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1000");

    if (state) url.searchParams.set("filters[state.keyword]", state);
    if (district) url.searchParams.set("filters[district.keyword]", district);
    if (commodity) url.searchParams.set("filters[commodity.keyword]", commodity);
    if (market) url.searchParams.set("filters[market.keyword]", market);

   const response = await fetch(url);
if (!response.ok) {
    console.log("Mandi API status:", response.status);

    return res.status(503).json({
        message: "Mandi API is temporarily unavailable, data.gov.api server is facing temprary issue"
    });
}
const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ message: "Unable to fetch mandi prices" });
    }
  

    const records = (data.records || []).map((record) => ({
      state: record.state,
      district: record.district,
      market: record.market,
      commodity: record.commodity,
      variety: record.variety,
      minPrice: Number(record.min_price),
      maxPrice: Number(record.max_price),
      modalPrice: Number(record.modal_price),
      arrivalDate: record.arrival_date,
    }));

    const parseDate = (value) => {
      const parts = String(value).split(/[\/-]/);
      if (parts.length !== 3) return 0;
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    records.sort((a, b) => parseDate(b.arrivalDate) - parseDate(a.arrivalDate));

    res.json({
      total: data.total || records.length,
      records,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to fetch mandi prices" });
  }
};
