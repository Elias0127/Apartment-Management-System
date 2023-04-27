// Fetch and display the list of tenants in a table
function fetchTenantsList() {
    // AJAX request to get the list of tenants
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/view_tenant_list',
        success: function (response) {
            // create the table/header
            var tenantTable = $('<table>').addClass('tenant-list-table');
            var header = $('<tr>').append('<th>Tenant Name</th>', '<th>Apartment Number</th>');
            tenantTable.append(header);
            // add each tenant to the row from the response data
            response.forEach(function (tenant) {
                var row = $('<tr>').append(
                    $('<td>').text(tenant.name),
                    $('<td>').text(tenant.apartment_number));
                tenantTable.append(row);
            });
            // add the table to the tenant-list div
            $('#tenant-list').html(tenantTable);
        },
        error: function (error) {
            alert('Error fetching tenant list');
        }
    });
}

// Fetch the list of tenants and populate the dropdown list
function fetchTenants() {
    // AJAX request to get the list of tenants
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/view_tenant_list',
        success: function (response) {
            // Get the tenant-name dropdown element
            var tenantNameDropdown = $('#tenant-name');
            // Add each tenant to the dropdown from the response data
            response.forEach(function (tenant) {
                var option = $('<option>').val(tenant.apartment_number).text(tenant.name);
                tenantNameDropdown.append(option);
            });
            // console.log(response);
        },
        error: function (error) {
            alert('Error fetching tenant list');
        }
    });
}

// Get the tenant name by apartment number
function getTenantNameByApartmentNumber(apartmentNumber, tenants) {
    // Find the tenant with the matching apartment number
    const tenant = tenants.find(t => t.apartment_number === apartmentNumber);
    return tenant ? tenant.name : '';
}

// Fetch and display rental income records in a table
function fetchRentIncomeRecords() {
    // AJAX request to get the list of tenants
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/view_tenant_list',
        success: function (tenants) {
            // Another AJAX request to get the list of rent income records
            $.ajax({
                type: 'GET',
                url: 'http://localhost:3000/view_rent_income_records',
                success: function (response) {
                    // Create the table and header with the months
                    var rentIncomeTable = $('<table>').addClass('rent-income-record-table');
                    var header = $('<tr>').append('<th>Tenant Name</th>',
                        '<th>Jan</th>', '<th>Feb</th>', '<th>Mar</th>', '<th>Apr</th>',
                        '<th>May</th>', '<th>Jun</th>', '<th>Jul</th>', '<th>Aug</th>',
                        '<th>Sep</th>', '<th>Oct</th>', '<th>Nov</th>', '<th>Dec</th>');
                    rentIncomeTable.append(header);

                    // Loop through the response data and create a row for each rent income record
                    response.forEach(function (record) {
                        // Get the tenant name by apartment number
                        var tenantName = getTenantNameByApartmentNumber(record.apartment_number, tenants);
                        var row = $('<tr>').append(
                            $('<td>').text(tenantName),
                            $('<td>').text('$' + record.Jan),
                            $('<td>').text('$' + record.Feb),
                            $('<td>').text('$' + record.Mar),
                            $('<td>').text('$' + record.Apr),
                            $('<td>').text('$' + record.May),
                            $('<td>').text('$' + record.Jun),
                            $('<td>').text('$' + record.Jul),
                            $('<td>').text('$' + record.Aug),
                            $('<td>').text('$' + record.Sep),
                            $('<td>').text('$' + record.Oct),
                            $('<td>').text('$' + record.Nov),
                            $('<td>').text('$' + record.Dec)
                        );
                        // Add the row to the table
                        rentIncomeTable.append(row);
                    });
                    // Add the table to the rent-income-record div
                    $('#rent-income-record').append(rentIncomeTable);
                },
                error: function (error) {
                    console.error('Error fetching rental income records:', error);
                }
            });
        },
        error: function (error) {
            alert('Error fetching tenant list');
        }
    });
}
// fetch and display the list of expenses in a table
function fetchExpenses() {
    // AJAX request to get the list of expenses
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/view_expense_report',
        success: function (response) {
            // console.log('Expenses data:', response);

            // Create the table and header with the date, payee, amount, and category
            const table = $('<table>').addClass('expense-record-table');
            const header = $('<tr>').append('<th>Date</th>', '<th>Payee</th>', '<th>Amount</th>', '<th>Category</th>');
            table.append(header);
            // Loop through the response data and create a row for each expense
            response.forEach(function (expense) {
                const date = new Date(expense.date);
                const formattedDate = date.toLocaleDateString();

                // Create the row with the formatted date, payee, amount, and category
                const row = $('<tr>').append(
                    $('<td>').text(formattedDate),
                    $('<td>').text(expense.payee),
                    $('<td>').text('$' + expense.amount),
                    $('<td>').text(expense.category)
                );
                // Add the row to the table
                table.append(row);
            });
            // Add the table to the expense-record-container div
            $('#expense-record-container').append(table);
        },
        error: function (error) {
            console.error('Error fetching expenses:', error);
        }
    });
}
// fetch and display the annual summary in a table
function fetchAnnualSummary() {
    // AJAX request to get the annual summary data
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/view_annual_summary',
        success: function (response) {
            // console.log('Annual Summary data:', response);

            // create the table and header with the category and expenses
            var table = $('<table>').addClass('annual-summary-table');
            var header = $('<tr>').append('<th>Category</th>', '<th>Expenses</th>');
            table.append(header);

            var totalExpenses = 0; // Track the total expenses

            // Loop through the response data and create a row for each expense
            $.each(response.expenseRows, function (index, expense) {
                // Create the row with the category and total expense data
                var row = $('<tr>').append(
                    $('<td>').text(expense.category),
                    $('<td>').text('$' + expense.total_expense)
                );
                table.append(row);
                totalExpenses += parseFloat(expense.total_expense);
            });
            // Append total income, total expenses, and net income rows
            var netIncome = parseFloat(response.totalIncome) - totalExpenses;
            table.append(
                $('<tr>').append($('<td>').addClass('summary-label').text('Total Expenses'), $('<td>').addClass('summary-value').text('$' + totalExpenses.toFixed(2))),
                $('<tr>').append($('<td>').addClass('summary-label').text('Total Income'), $('<td>').addClass('summary-value').text('$' + response.totalIncome)),
                $('<tr>').append($('<td>').addClass('summary-label').text('Net Income'), $('<td>').addClass('summary-value').text('$' + netIncome.toFixed(2)))
            );
            // Add the table to the annual-summary div
            $('#annual-summary').html(table);
        },
        error: function (error) {
            console.error('Error fetching annual summary:', error);
        }
    });
}

$(document).ready(function () {

    // Call the functions to fetch and display the data on page load
    fetchTenantsList()
    fetchTenants('dropdown');
    fetchRentIncomeRecords();
    fetchExpenses();
    fetchAnnualSummary();

    // Add event listener to the Add Tenant form
    $('#add-tenant-form').submit(function (event) {
        event.preventDefault();

        // Get the name and apartment number from the form
        var name = $('#tenant-name').val();
        var apartmentNumber = $('#apartment-number').val();
        // AJAX request to add a new tenant
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/add_tenant',
            contentType: 'application/json',
            data: JSON.stringify({
                'name': name,
                'apartment_number': apartmentNumber
            }),
            success: function (response) {
                alert('Tenant added successfully');
                location.reload(); // Refresh the page to display the updated data

            },
            error: function (error) {
                alert('Error adding tenant');
            }
        });
    });

    // Add event listener to the Add Expense form
    $('#add-expense-form').submit(function (event) {
        event.preventDefault();

        // Get the date, payee, amount, and category from the form
        const date = $('#expense-date').val();
        const payee = $('#expense-payee').val();
        const amount = $('#expense-amount').val();
        const category = $('#expense-category option:selected').val();

        // AJAX request to add a new expense
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/add_expense',
            contentType: 'application/json',
            data: JSON.stringify({
                'date': date,
                'payee': payee,
                'amount': amount,
                'category': category
            }),
            success: function (response) {
                alert('Expense added successfully');
                location.reload(); // Refresh the page to display the updated data

            },
            error: function (error) {
                alert('Error adding expense');
            }
        });
    });

    // Add event listener to the Add Rent Payment form
    $('#add-rent-payment-form').submit(async (event) => {
        event.preventDefault();
        // Get the apartment number from the selected tenant
        var apartmentNumber = $('#tenant-name').val();
        var month = $('#rent-payment-month').val();
        var amount = $('#rent-payment-amount').val();

        try {
            const response = await $.ajax({
                url: 'http://localhost:3000/add_rent_payment',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    'apartment_number': apartmentNumber,
                    'month': month,
                    'amount': amount
                }),
            });

            alert('Rent payment added');
            location.reload(); // Refresh the page to display the updated data
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding the rent payment');
        }

    });

    // Add event listener to the "View Tenants" button
    $('#view-tenants-button').click(function () {
        // AJAX request to get the list of tenants
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/view_tenant_list',
            success: function (response) {
                // console.log('Tenant list:', response);

                // Create the table and header with the apartment number and tenant name
                var table = $('<table>').addClass('tenant-list-table');
                var header = $('<tr>').append('<th>Apartment Number</th>', '<th>Tenant Name</th>');
                table.append(header);

                // Loop through the response data and create a row for each tenant
                response.forEach(function (tenant) {
                    var row = $('<tr>').append(
                        $('<td>').text(tenant.apartment_number),
                        $('<td>').text(tenant.name)
                    );
                    table.append(row);
                });

                // Replace the old table with the new one
                $('#tenant-list-container').html(table);
            },
            error: function (error) {
                alert('Error fetching tenant list');
            }
        });
    });

    // Add event listener to the "View Annual Summary" button
    $('#view-annual-summary-button').click(function () {
        // AJAX request to get the annual summary data
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/view_annual_summary',
            contentType: 'application/json',
            success: function (response) {
                // console.log('Annual summary:', response);

                // Create the table and header with the category and total expense
                var table = $('<table>').addClass('annual-summary-table');
                var header = $('<tr>').append('<th>Category</th>', '<th>Total Expense</th>');
                table.append(header);
                // Loop through the response data and create a row for each expense
                $.each(response.expenseRows, function (index, expense) {
                    var row = $('<tr>').append(
                        $('<td>').text(expense.category),
                        $('<td>').text(expense.total_expense)
                    );
                    // Append the row to the table
                    table.append(row);
                });

                // Append total income, total expenses, and net income rows
                table.append(
                    $('<tr>').append($('<th>').text('Total Income'), $('<td>').text(response.totalIncome)),
                    $('<tr>').append($('<th>').text('Total Expenses'), $('<td>').text(response.totalExpenses)),
                    $('<tr>').append($('<th>').text('Net Income'), $('<td>').text(response.netIncome))
                );
                // Add the table to the annual-summary div
                $('#annual-summary').html(table);
            },
            error: function (error) {
                alert('Error getting annual summary');
            }
        });
    });

});
