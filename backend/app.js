// JavaScript Libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const db = require('./database');


// Handle 500 Internal Server Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain').status(500).send('500 - Internal Server Error');
});

// Route to add a new tenant
app.post('/add_tenant', async (req, res, next) => {
    const { name, apartment_number } = req.body;

    try {
        const [result] = await db.promise().query('INSERT INTO tenants (name, apartment_number) VALUES (?, ?)', [name, apartment_number]);
        res.status(201).json({ message: 'Tenant added successfully', tenantId: result.insertId });
    } catch (error) {
        console.error('Error in /add_tenant route:', error);
        next(error);
    }
});

// Route to add a new expense
app.post('/add_expense', async (req, res, next) => {
    const { date, payee, amount, category } = req.body;

    try {
        const [result] = await db.promise().query('INSERT INTO expenses (date, payee, amount, category) VALUES (?, ?, ?, ?)', [date, payee, amount, category]);
        res.status(201).json({ message: 'Expense added successfully', expenseId: result.insertId });
    } catch (error) {
        console.error('Error in /add_expense route:', error);
        next(error);
    }
});

// Route to add a new rent payment
app.post('/add_rent_payment', async (req, res) => {
    try {
        const { apartment_number, month, amount } = req.body;
        const fullDate = `${month}-01`;
        const [result] = await db.promise().query('INSERT INTO rent_payments (apartment_number, month, amount) VALUES (?, ?, ?)', [apartment_number, fullDate, amount]);
        res.status(201).send('Rent payment added');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding the rent payment');
    }
});

// Route to get the list of tenants
app.get('/view_tenant_list', async (req, res, next) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM tenants');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error in /view_tenant_list route:', error);
        next(error);
    }
});

// Route to get rent income records
app.get('/view_rent_income_records', async (req, res, next) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT apartment_number,
                SUM(IF(MONTH(month)=1, amount, 0)) AS 'Jan',
                SUM(IF(MONTH(month)=2, amount, 0)) AS 'Feb',
                SUM(IF(MONTH(month)=3, amount, 0)) AS 'Mar',
                SUM(IF(MONTH(month)=4, amount, 0)) AS 'Apr',
                SUM(IF(MONTH(month)=5, amount, 0)) AS 'May',
                SUM(IF(MONTH(month)=6, amount, 0)) AS 'Jun',
                SUM(IF(MONTH(month)=7, amount, 0)) AS 'Jul',
                SUM(IF(MONTH(month)=8, amount, 0)) AS 'Aug',
                SUM(IF(MONTH(month)=9, amount, 0)) AS 'Sep',
                SUM(IF(MONTH(month)=10, amount, 0)) AS 'Oct',
                SUM(IF(MONTH(month)=11, amount, 0)) AS 'Nov',
                SUM(IF(MONTH(month)=12, amount, 0)) AS 'Dec'
            FROM rent_payments
            GROUP BY apartment_number
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error in /view_rent_income_records route:', error);
        next(error);
    }
});

// Route to get expense records
app.get('/view_expense_report', async (req, res, next) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM expenses');
        console.log('Fetched expenses:', rows); // Add this line
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error in /view_expense_report route:', error);
        res.status(500).json({ message: 'Error fetching expenses', error: error.message });
    }
});

// Route to get annual summary
app.get('/view_annual_summary', async (req, res, next) => {
    try {
        const [incomeRows] = await db.promise().query('SELECT SUM(amount) as total_income FROM rent_payments');
        const [expenseRows] = await db.promise().query('SELECT category, SUM(amount) as total_expense FROM expenses GROUP BY category');
        const totalIncome = incomeRows[0].total_income;
        const totalExpenses = expenseRows.reduce((total, row) => total + row.total_expense, 0);
        const netIncome = totalIncome - totalExpenses;
        const annualSummary = { totalIncome, totalExpenses, netIncome, expenseRows };
        res.status(200).json(annualSummary);
    } catch (error) {
        console.error('Error in /view_annual_summary route:', error);
        next(error);
    }
});