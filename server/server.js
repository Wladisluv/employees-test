const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// EMPLOYEES

app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/employees/:id', async (req, res) => {
  const employeeId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [employeeId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error in GET /employees/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Пример эндпоинта для добавления сотрудника и вывода его в консоль
app.post('/employees', async (req, res) => {
  const { first_name, last_name, middle_name, position, hire_date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO employees (first_name, last_name, middle_name, position, hire_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, middle_name, position, hire_date]
    );
    const newEmployee = result.rows[0];

    // Выводим добавленного сотрудника в консоль
    console.log('New Employee:', newEmployee);

    res.json(newEmployee);
  } catch (error) {
    console.error('Error in POST /employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/employees/:id', async (req, res) => {
  const employeeId = req.params.id;

  try {
    // Удаляем сотрудника с указанным ID из базы данных
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [employeeId]);
    
    if (result.rows.length > 0) {
      // Возвращаем удаленного сотрудника в ответе
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error in DELETE /employees/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/employees/:id', async (req, res) => {
  const employeeId = req.params.id;
  const { first_name, last_name, middle_name, position, hire_date } = req.body;

  try {
      const result = await pool.query(
          'UPDATE employees SET first_name=$1, last_name=$2, middle_name=$3, position=$4, hire_date=$5 WHERE id=$6 RETURNING *',
          [first_name, last_name, middle_name, position, hire_date, employeeId]
      );

      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).json({ error: 'Employee not found' });
      }
  } catch (error) {
      console.error('Error in PUT /employees/:id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /EMPLOYEES



// POSITIONS

app.get('/positions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM positions');
    const distinctPositionsResult = await pool.query('SELECT DISTINCT position FROM employees');
    
    const positions = result.rows.concat(distinctPositionsResult.rows);

    res.json(positions);
  } catch (error) {
    console.error('Error in GET /positions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/positions', async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING *',
      [name]
    );
    const newPosition = result.rows[0];

    console.log('New Position:', newPosition);
    res.json(newPosition);
  } catch (error) {
    console.error('Error in POST /positions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/positions/:id', async (req, res) => {
  const positionId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM positions WHERE id = $1 RETURNING *',
      [positionId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Position not found' });
    }
  } catch (error) {
    console.error('Error in DELETE /positions/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/positions/:id', async (req, res) => {
  const positionId = req.params.id;
  const { name } = req.body;

  try {
    const result = await pool.query(
      'UPDATE positions SET name = $1 WHERE id = $2 RETURNING *',
      [name, positionId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Position not found' });
    }
  } catch (error) {
    console.error('Error in PUT /positions/:id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /POSITIONS

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
