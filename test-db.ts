import { getQualityDashboard } from "./prototype/lib/db";

try {
  const data = getQualityDashboard();
  console.log("Dashboard Data:", JSON.stringify(data, null, 2));
} catch (error) {
  console.error("Error fetching dashboard data:", error);
}
