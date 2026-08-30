import { MockAIService } from '../src/lib/ai/mockProvider.js';
import { validateTripPlan } from '../src/lib/ai/validator.js';
import { fetchOsrmRoute } from '../src/lib/routing/osrm.js';

async function runTests() {
  console.log("=== NUVAY Engine Verification Test ===");

  const engine = new MockAIService();

  // Test 1: Prompt Parsing
  const testPrompt = "I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.";
  console.log("\n1. Testing Prompt Parsing:");
  console.log("Prompt:", testPrompt);

  const parsed = await engine.parseNaturalPrompt(testPrompt);
  console.log("Parsed Output:", JSON.stringify(parsed, null, 2));

  // Assertions for Task 1
  const passBudget = parsed.budget === 20000;
  const passDays = parsed.durationDays === 4;
  const passPax = parsed.travelersCount === 3;
  const passOrigin = parsed.origin === "Mangalore";

  console.log(`- Budget == 20000: ${passBudget ? 'PASS ✅' : 'FAIL ❌ (' + parsed.budget + ')'}`);
  console.log(`- Duration == 4: ${passDays ? 'PASS ✅' : 'FAIL ❌ (' + parsed.durationDays + ')'}`);
  console.log(`- Travelers == 3: ${passPax ? 'PASS ✅' : 'FAIL ❌ (' + parsed.travelersCount + ')'}`);
  console.log(`- Origin == Mangalore: ${passOrigin ? 'PASS ✅' : 'FAIL ❌ (' + parsed.origin + ')'}`);

  // Test 2: OSRM Routing
  console.log("\n2. Testing OSRM Routing:");
  const route = await fetchOsrmRoute("Mangalore", "Coorg");
  console.log("OSRM Route Result:", JSON.stringify(route, null, 2));

  // Test 3 & 5: Dynamic Itinerary Generation & Validation
  console.log("\n3. Testing Dynamic Itinerary & Plan Generation:");
  const plan = await engine.generateTripPlan({ prompt: testPrompt });

  console.log("Plan Title:", plan.title);
  console.log("Destination:", plan.destination);
  console.log("Duration Days:", plan.durationDays);
  console.log("Travelers Count:", plan.travelersCount);
  console.log("Requested Budget:", plan.requestedBudget);
  console.log("Total Budget Estimate:", plan.totalBudgetEstimate);
  console.log("Route Info:", plan.routeInfo);
  console.log("Itinerary Days Count:", plan.dayItineraries.length);

  console.log("\nDay Itinerary Titles:");
  plan.dayItineraries.forEach(d => console.log(` - Day ${d.day}: ${d.title} (${d.schedule.length} activities)`));

  // Validation Check
  const validation = validateTripPlan(plan, {
    prompt: testPrompt,
    budget: 20000,
    durationDays: 4,
    travelersCount: 3,
    origin: "Mangalore"
  });

  console.log("\nValidation Status:", validation.valid ? "VALID ✅" : "INVALID ❌");
  if (!validation.valid) {
    console.log("Validation Errors:", validation.errors);
  }

  if (passBudget && passDays && passPax && passOrigin && validation.valid) {
    console.log("\n🎉 ALL SPRINT 1 ENGINE TESTS PASSED!");
  } else {
    console.error("\n❌ TESTS FAILED!");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
