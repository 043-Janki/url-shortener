import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Location({ stats = [] }) {
  const cityCount = stats.reduce((acc, item) => {
    if (!item.city) return acc;

    acc[item.city] = (acc[item.city] || 0) + 1;
    return acc;
  }, {});

    const cities = Object.entries(cityCount).map(([city, count]) => ({
      city,
      count,
    }));

  console.log("Stats:", stats);
  console.log("City Count:", cityCount);
  console.log("Cities:", cities);

  if (cities.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No location statistics available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cities}>
          <XAxis dataKey="city" tick={{ fill: "#ffffff" }} />

          <YAxis
            allowDecimals={false}
            domain={[0, "dataMax + 1"]}
            tick={{ fill: "#ffffff" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f1f1f",
              border: "1px solid #444",
              borderRadius: "8px",
            }}
            labelStyle={{
              color: "#22c55e",
              fontWeight: "bold",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
