async function fetchExpenses() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to view this page.');
            window.location.href = 'Login.html';
            return;
        }

        const response = await fetch('https://expense-tracker-backend-l100.onrender.com/data', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert('Authentication failed. Please log in again.');
                window.location.href = '/login.html';
            } else {
                throw new Error(`Error: ${response.statusText}`);
            }
            return;
        }

        const expenses = await response.json();

        // Sort expenses by date in ascending order
        expenses.sort((a, b) => new Date(a.date) -new Date(b.date));

        const expenseData = document.getElementById('expenseData');
        expenseData.innerHTML = ''; // Clear existing rows

        const monthlyTotals = {};
        let currentMonthYear = '';
        // console.log(expenses[expenses.length-1]._id);
        expenses.forEach(expense => {
            let d1 = new Date(expense.date)
            console.log(d1.toString().slice(0,15))
            const date = new Date(expense.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const amount = parseFloat(expense.amount);

            if (!monthlyTotals[monthYear]) {
                monthlyTotals[monthYear] = 0;
            }
            monthlyTotals[monthYear] += amount;

            if (currentMonthYear !== monthYear) {
                currentMonthYear = monthYear;
            }

            // Create table row for individual expense
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = d1.toString().slice(3,15);
            row.appendChild(dateCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = expense.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = `${amount.toFixed(2)} Rs.`;
            row.appendChild(amountCell);

            // Add Delete button
            // const actionCell = document.createElement('td');
            // const deleteButton = document.createElement('button');
            // deleteButton.textContent = 'Delete';
            // deleteButton.className = 'delete-btn';

            // actionCell.appendChild(deleteButton);
            // row.appendChild(actionCell);

            expenseData.prepend(row);
            // deleteButton.onclick = async () => {

            //     await deleteExpense(expense._id); // Call deleteExpense function
            //     await fetchExpenses(); // Refresh the table after deletion
            // };
        });

        displayMonthlyTotals(monthlyTotals);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// async function deleteExpense(id) {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             throw new Error('No token found. Please log in again.');
//         }

//         const response = await fetch(`https://expense-tracker-backend-l100.onrender.com/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         console.log('Response:', response);

//         if (!response.ok) {
//             throw new Error(`Failed to delete expense. Server returned status ${response.status}`);
//         }

//         alert('Expense deleted successfully.');
//     } catch (error) {
//         console.error('Error deleting expense:', error.message);
//         alert('Error deleting expense. Please try again.');
//     }
// }



function displayMonthlyTotals(monthlyTotals) {
    const expenseData = document.getElementById('expenseData');

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (const monthYear in monthlyTotals) {
        const [year, month] = monthYear.split('-'); // Split year and month
        const formattedMonthYear = `${monthNames[parseInt(month) - 1]} ${year}`; // Convert to "Jan 2024" format

        // Create a new row for the monthly total
        const totalRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.colSpan = 2; // Span across Date and Description columns
        totalCell.textContent = `Total expenses of ${formattedMonthYear} : ${monthlyTotals[monthYear].toFixed(2)} Rs.`;
        totalCell.style.fontWeight = 'bold'; // Make it bold
        totalRow.appendChild(totalCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = ''; // Empty cell for amount in total row
        totalRow.appendChild(amountCell);

        // Prepend the row (newest totals appear first)
        expenseData.prepend(totalRow);
    }
}


// Call the function to load data when the page loads
fetchExpenses();
