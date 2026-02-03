// This is the entrypoint for your application.
// node app.js
// app.js
import {printAllTransactions, addTransaction, getTransactionsByCategory, getTransactionsByDateRange, groupTransactionsByMonth, getAverageExpensePerCategory, removeTransactionById, findConsecutiveExpensiveMonths,} from "./finance.js";

// Print data
printAllTransactions();

// Add one transaction
addTransaction({
  id: 6,
  type: "expense",
  category: "transport",
  amount: 60,
  description: "Train ticket",
  date: "2026-02-02",
});

console.log("\nAfter adding one transaction:\n");
printAllTransactions();

// Filter by category 
const foodTransactions = getTransactionsByCategory("food");
console.log("\nFood transactions:", foodTransactions);

//Bonus Challenges
// Search transactions by date range using slice
const februaryRange = getTransactionsByDateRange("2026-02-02", "2026-02-04");
console.log("\nDate range 2026-02-02..2026-02-04:", februaryRange);

// Group transactions by month using nested objects
const groupedByMonth = groupTransactionsByMonth();
console.log("\nGrouped by month:", groupedByMonth);

// Calculate average expense per category
const average = getAverageExpensePerCategory();
console.log("\nAverage expense per category:", average);

// Add ability to remove transactions by id
const removedById = removeTransactionById(2);
console.log("\nRemoved transaction with id=2:", removedById);

// Create a function that finds consecutive expensive months
const sequences = findConsecutiveExpensiveMonths(500);
console.log("\nConsecutive expensive months (>= 500):", sequences);