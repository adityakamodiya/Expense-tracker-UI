async function fetchExpenses() {
    try {
        const response = await fetch('https://expense-tracker-backend-l100.onrender.com/data'); // Adjust the endpoint as needed
        const expenses = await response.json();

        // Sort expenses by date in ascending order
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        const expenseData = document.getElementById('expenseData');
        expenseData.innerHTML = ''; // Clear existing rows

        // Object to hold the total amount per month
        const monthlyTotals = {};
        let currentMonthYear = '';

        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM
            const amount = parseFloat(expense.amount); // Ensure amount is a number

            // Update the monthly total
            if (!monthlyTotals[monthYear]) {
                monthlyTotals[monthYear] = 0;
            }
            monthlyTotals[monthYear] += amount;

            // If we're in a new month, add a total row before adding the expense rows
            if (currentMonthYear !== monthYear) {
                currentMonthYear = monthYear;
            }

            // Create table row for individual expense
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = expense.date;
            row.appendChild(dateCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = expense.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = `$${amount.toFixed(2)}`; // Adding dollar sign for clarity
            row.appendChild(amountCell);

            expenseData.appendChild(row);
        });

        // After processing all expenses, display monthly totals
        displayMonthlyTotals(monthlyTotals);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

function displayMonthlyTotals(monthlyTotals) {
    const expenseData = document.getElementById('expenseData');

    for (const monthYear in monthlyTotals) {
        // Create a new row for the monthly total
        const totalRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.colSpan = 2; // Span across Date and Description columns
        totalCell.textContent = `Total for ${monthYear}: $${monthlyTotals[monthYear].toFixed(2)}`;
        totalCell.style.fontWeight = 'bold'; // Make it bold
        totalRow.appendChild(totalCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = ''; // Empty cell for amount in total row
        totalRow.appendChild(amountCell);

        expenseData.appendChild(totalRow);
    }
}

fetchExpenses(); // Call the function to load data when the page loads
