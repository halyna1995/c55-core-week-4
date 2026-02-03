// finance.js
import chalk from "chalk";
import { transactions } from "./data.js";

// Format number 
function formatEUR(amount) {
  return `€${amount}`;
}

/*
  1) addTransaction - Add new transaction to array
  - Uses destructuring 
  - Uses spread operator when pushing 
*/
export function addTransaction(transaction) {
  const { id, type, category, amount, description, date } = transaction;
  if ( id == null || !type || !category || amount == null || !description || !date ) {
    console.log(chalk.red("❌ Missing required fields"));
    return false;
  }
  transactions.push({ ...transaction });
  return true;
}

/*
  2) getTotalIncome()
  - Sum income using a loop 
*/
export function getTotalIncome() {
  let sum = 0;
  for (const transaction of transactions) {
    if (transaction.type === "income") {
      sum = sum + transaction.amount;
    }
  }
  return sum;
}

/*
  3) getTotalExpenses()
  - Sum expenses using a loop
*/
export function getTotalExpenses() {
  let sum = 0;
  for (const transaction of transactions) {
    if (transaction.type === "expense") {
      sum = sum + transaction.amount;
    }
  }
  return sum;
}

/*
  4) getBalance() - Calculate total income minus expenses
*/
export function getBalance() {
  return getTotalIncome() - getTotalExpenses();
}

/*
  5) getTransactionsByCategory(category) - Filter transactions
  - Loop + push 
*/
export function getTransactionsByCategory(category) {
  const result = [];
  const target = category.toLowerCase();
  for (const transaction of transactions) {
    if (transaction.category.toLowerCase() === target) {
      result.push(transaction);
    }
  }
  return result;
}

/*
  6) getLargestExpense() - Find highest expense amount
*/
export function getLargestExpense() {
  let largest = null;
  for (const transaction of transactions) {
    if (transaction.type === "expense") {
      if (largest === null || transaction.amount > largest.amount) {
        largest = transaction;
      }
    }
  }
  return largest;
}

/*
  7) printAllTransactions() - Display all transactions with formatting
*/
export function printAllTransactions() {
  console.log(chalk.bold("💰 PERSONAL FINANCE TRACKER 💰"));
  console.log("");
  console.log(chalk.bold("All Transactions:"));
  let i = 1;
  for (const transaction of transactions) {
    const { type, category, amount, description } = transaction;
    const typeLabel = type.toUpperCase();
    const categoryColored = chalk.yellow(category);
    const amountText = formatEUR(amount);
    const amountColored =
      type === "income" ? chalk.green(amountText) : chalk.red(amountText);
    console.log(
      `${i}. [${typeLabel}] ${description} - ${amountColored} (${categoryColored})`
    );

    i = i + 1;  
  }
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const count = transactions.length;
  const largestExpense = getLargestExpense();
  console.log("");
  console.log(chalk.bold("📊 FINANCIAL SUMMARY 📊"));

  console.log(chalk.bold(`Total Income: ${chalk.green(formatEUR(totalIncome))}`));
  console.log(
    chalk.bold(`Total Expenses: ${chalk.red(formatEUR(totalExpenses))}`)
  );
  const balanceColored =
    balance >= 0 ? chalk.cyan(formatEUR(balance)) : chalk.red(formatEUR(balance));
  console.log(chalk.bold(`Current Balance: ${balanceColored}`));
  console.log(chalk.bold(`Total Transactions: ${count}`));
  if (largestExpense) {
    console.log(
      chalk.bold(
        `Largest Expense: ${largestExpense.description} (${chalk.red(
          formatEUR(largestExpense.amount)
        )})`
      )
    );
  } else {
    console.log(chalk.bold("Largest Expense: none"));
  }
}

/* Bonus Challenges*/

/*
  Bonus 1: Search transactions by date range using slice
  - Copy + sort by date
  - Find start and end indices
  - Return slice(startIndex, endIndex+1)
*/
export function getTransactionsByDateRange(startDate, endDate) {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let startIndex = -1;
  let endIndex = -1;
  // Find first index with date >= startDate
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].date >= startDate) {
      startIndex = i;
      break;
    }
  }
  // Find last index with date <= endDate
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].date <= endDate) {
      endIndex = i;
      break;
    }
  }
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return [];
  }
  return sorted.slice(startIndex, endIndex + 1);
}

/*
  Bonus 2: Group transactions by month using nested objects
*/
export function groupTransactionsByMonth() {
  const groups = {};
  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7); // "YYYY-MM"
    if (!groups[month]) {
      groups[month] = { income: [], expense: [] };
    }
    if (transaction.type === "income") groups[month].income.push(transaction);
    if (transaction.type === "expense") groups[month].expense.push(transaction);
  }
  return groups;
}

/*
  Bonus 3: Calculate average expense per category
*/
export function getAverageExpensePerCategory() {
  const categorySumCount = {}; 
  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    const c = transaction.category;
    if (!categorySumCount[c]) categorySumCount[c] = { sum: 0, count: 0 };
    categorySumCount[c].sum = categorySumCount[c].sum + transaction.amount;
    categorySumCount[c].count = categorySumCount[c].count + 1;
  }
  const averages = {};
  for (const category of Object.keys(categorySumCount)) {
    averages[category] = categorySumCount[category].sum / categorySumCount[category].count;
  }
  return averages;
}

/*
  Bonus 4: Remove transaction by id

*/
export function removeTransactionById(id) {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === id) {
      const removed = transactions.splice(i, 1); // returns array of removed items
      return removed[0];
    }
  }
  return null;
}

/*
  Bonus 5: Create a function that finds consecutive expensive months
*/
export function findConsecutiveExpensiveMonths(threshold) {
  const groups = groupTransactionsByMonth();
  const months = Object.keys(groups).sort(); // chronological order
  // Build monthly expense totals
  const monthlyExpense = {};
  for (const month of months) {
    let sum = 0;
    for (const transaction of groups[month].expense) {
      sum = sum + transaction.amount;
    }
    monthlyExpense[month] = sum;
  }
  const sequences = [];
  let i = 0;
  // while loop 
  while (i < months.length) {
    const month = months[i];
    if (monthlyExpense[month] >= threshold) {
      const seq = [month];
      i = i + 1;
      // Keep going while next months are also expensive
      while (i < months.length && monthlyExpense[months[i]] >= threshold) {
        seq.push(months[i]);
        i = i + 1;
      }
      // Save only if sequence has at least 2 months 
      if (seq.length >= 2) {
        sequences.push(seq);
      }
    } else {
      i = i + 1;
    }
  }
  return sequences;
}
