// POSITIONS


  // Add Positon

  fetch('http://localhost:3000/positions')
    .then(response => response.json())
    .then(data => {
        console.log('Positions:', data);
    })
    .catch(error => console.error('Error during GET request:', error));


    function addPosition() {
      const newPosition = document.getElementById('newPositionInput').value;
  
      // Отправляем данные на сервер
      fetch('http://localhost:3000/positions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: newPosition,
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('New Position:', data);
          document.getElementById('newPositionInput').value = '';
      })
      .catch(error => console.error('Error during POST request:', error));
  }

// /Add Position



// Get Position

function getPositions() {
  fetch('http://localhost:3000/positions')
    .then(response => response.json())
    .then(data => {
      const positionDropdown = document.getElementById('positionDropdown');

      data.forEach(position => {
        const listItem = document.createElement('li');
        const positionName = position.name !== undefined ? position.name : undefined;

        if (positionName !== undefined) {
          listItem.innerHTML = `<a class="dropdown-item" href="#" onclick="selectPosition('${positionName}')">${positionName}</a>`;
          positionDropdown.appendChild(listItem);
        }
      });
    })
    .catch(error => console.error('Error fetching positions:', error));
}

function selectPosition(selectedPosition) {
  const dropdownButton = document.getElementById('dropdownMenuButton');
  dropdownButton.innerText = selectedPosition;
}

document.addEventListener('DOMContentLoaded', () => {
  getPositions();
  new bootstrap.Dropdown(document.getElementById('dropdownMenuButton'));
});

// /Get Position


// Delete Position

function getPositionsForDelete() {
  fetch('http://localhost:3000/positions')
    .then(response => response.json())
    .then(data => {
      const positionDropdownDelete = document.getElementById('positionDropdown-delete');
      positionDropdownDelete.innerHTML = '';

      data.forEach(position => {
        const listItem = document.createElement('li');
        const positionName = position.name !== undefined ? position.name : '';
        listItem.innerHTML = `<a class="dropdown-item" href="#" onclick="selectPositionForDelete('${positionName}', '${position.id}')">${positionName}</a>`;
        positionDropdownDelete.appendChild(listItem);
      });

      new bootstrap.Dropdown(document.getElementById('dropdownMenuButton-delete'));
    })
    .catch(error => console.error('Error fetching positions:', error));
}

function selectPositionForDelete(selectedPosition, selectedPositionId) {
  const dropdownButton = document.getElementById('dropdownMenuButton-delete');
  dropdownButton.innerText = selectedPosition;
  dropdownButton.setAttribute('data-id', selectedPositionId);
}

function deletePosition() {
  const selectedPositionId = document.getElementById('dropdownMenuButton-delete').getAttribute('data-id');

  // Проверка, чтобы избежать отправки запроса с отсутствующим ID
  if (!selectedPositionId) {
    console.error('Position ID is null or undefined');
    return;
  }

  console.log('Selected Position ID:', selectedPositionId);


  getPositionsForDelete();

  fetch(`http://localhost:3000/positions/${selectedPositionId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      console.log('Server response:', result);

      const deletePositionModal = new bootstrap.Modal(document.getElementById('delete-position-modal'));
      deletePositionModal.hide();
    })
    .catch(error => console.error('Error during DELETE request:', error));
}


document.addEventListener('DOMContentLoaded', getPositionsForDelete);

document.getElementById('delete-position-button').addEventListener('click', deletePosition);

// /Delete Position


function initDropdown() {
  new bootstrap.Dropdown(document.getElementById('dropdownMenuButton-edit'));
}

// Edit Position

let positionsData = [];

function getPositionsForEdit() {
  fetch('http://localhost:3000/positions')
    .then(response => response.json())
    .then(data => {
      positionsData = data;
      const positionDropdownEdit = document.getElementById('positionDropdown-edit');
      positionDropdownEdit.innerHTML = '';

      data.forEach(position => {
        const listItem = document.createElement('li');
        const positionName = position.name !== undefined ? position.name : ''; // Используем пустую строку, если name не определен
        listItem.innerHTML = `<a class="dropdown-item" href="#" onclick="selectPositionForEdit('${positionName}')">${positionName}</a>`;
        positionDropdownEdit.appendChild(listItem);
      });

      initDropdown();
    })
    .catch(error => console.error('Error fetching positions:', error));
}

function selectPositionForEdit(selectedPosition) {
  const dropdownButton = document.getElementById('dropdownMenuButton-edit');
  dropdownButton.innerText = selectedPosition;
}

function editPosition() {
  const selectedPosition = document.getElementById('dropdownMenuButton-edit').innerText;
  const newPositionName = document.getElementById('newPositionInput-edit').value;

  if (!selectedPosition) {
    console.error('Selected position is null or undefined');
    return;
  }


  const selectedPositionId = positionsData.find(position => position.name === selectedPosition)?.id;

  if (!selectedPositionId) {
    console.error('Selected position ID is null or undefined');
    return;
  }

  fetch(`http://localhost:3000/positions/${selectedPositionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newPositionName }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      console.log('Server response:', result);
    })
    .catch(error => console.error('Error during PUT request:', error));
}


document.addEventListener('DOMContentLoaded', getPositionsForEdit);

// /Edit Position


// /POSITIONS



// EMPLOYEES

// Add Employee

  const addEmployeeBtn = document.getElementById('addEmployeeBtn');

  addEmployeeBtn.addEventListener('click', function () {
    // Получаем значения из полей ввода
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const middleName = document.getElementById('middleName').value;


    const selectedPosition = document.getElementById('dropdownMenuButton-add-user').textContent;


    const sanitizedPosition = selectedPosition === 'undefined' ? '' : selectedPosition;


    const hireDate = document.getElementById('hire-date').value.toString();


    const data = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      position: sanitizedPosition,
      hire_date: hireDate,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const url = 'http://localhost:3000/employees';

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log('Server response:', result);
      })
      .catch((error) => {
        console.error('Error during POST request:', error);
      });
      window.location.reload();
  });

  fetch('http://localhost:3000/positions')
  .then((response) => response.json())
  .then((data) => {
    const positionDropdownAddUser = document.getElementById('positionDropdown-add-user');

    data.forEach((position) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.classList.add('dropdown-item');
      link.href = '#';

      const positionName = position.name !== undefined ? position.name : undefined;

      if (positionName !== undefined) {
        link.textContent = positionName;
        link.onclick = () => selectPositionForAddUser(positionName);
        listItem.appendChild(link);
        positionDropdownAddUser.appendChild(listItem);
      }
    });
  })
  .catch((error) => console.error('Error fetching positions:', error));

function selectPositionForAddUser(selectedPosition) {
  const dropdownButton = document.getElementById('dropdownMenuButton-add-user');
  dropdownButton.innerText = selectedPosition;
}

// /Add Employee



 // Get Employee

 function formatDateStringWithNoTime(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function displayEmployees(employees) {
  const employeeList = document.querySelector('.employee-list');

  employeeList.innerHTML = '';

  employees.forEach(employee => {
    const employeeElement = document.createElement('div');
    employeeElement.classList.add('employee-list-employee');

    const aboutElement = document.createElement('div');
    aboutElement.classList.add('employee-list-employee-about');

    const nameElement = document.createElement('div');
    nameElement.classList.add('employee-list-employee__name');
    const positionElement = document.createElement('div');
    positionElement.classList.add('employee-list-employee__position');
    const dateElement = document.createElement('div');
    dateElement.classList.add('employee-list-employee__date');

    nameElement.innerHTML = `<h4 class="employee-about">${employee.first_name} ${employee.last_name} ${employee.middle_name}</h4>`;
    positionElement.innerHTML = `<h4 class="employee-about">${employee.position}</h4>`;

    const formattedHireDate = formatDateStringWithNoTime(employee.hire_date);
    dateElement.innerHTML = `<h4 class="employee-about">${formattedHireDate}</h4>`;

    aboutElement.appendChild(nameElement);
    aboutElement.appendChild(positionElement);
    aboutElement.appendChild(dateElement);

    employeeElement.appendChild(aboutElement);

    const buttonsElement = document.createElement('div');
    buttonsElement.classList.add('employee-list-employee-buttons');

    // Создаем кнопку "Редактировать"
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.classList.add('edit-employee-btn', 'btn', 'btn-primary', 'ml-1');
    editButton.setAttribute('data-id', employee.id);
    editButton.dataset.bsTarget = "#edit-employee-modal";
    editButton.dataset.bsWhatever = "@getbootstrap";
    editButton.dataset.bsToggle = "modal";
    editButton.textContent = 'Редактировать';
    
    // Создаем кнопку "Удалить" с data-id
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-employee-btn', 'btn', 'btn-primary', 'ml-1');
    deleteButton.setAttribute('data-id', employee.id);
    deleteButton.textContent = 'Удалить';

    deleteButton.addEventListener('click', function() {
      deleteEmployee(employee.id);
    });

    // Добавляем кнопки в buttonsElement
    buttonsElement.appendChild(editButton);
    buttonsElement.appendChild(deleteButton);

    // Добавляем buttonsElement в employeeElement
    employeeElement.appendChild(buttonsElement);

    // Добавляем employeeElement в список
    employeeList.appendChild(employeeElement);
  });
}

fetch('http://localhost:3000/employees')
  .then(response => response.json())
  .then(data => {
    displayEmployees(data);
  })
  .catch(error => console.error('Error during GET request:', error));

// /Get Employee



// Delete Employee

function deleteEmployee(employeeId) {
    fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(deletedEmployee => {
        console.log('Deleted employee:', deletedEmployee);
      })
      .catch(error => console.error('Error during DELETE request:', error));
  }

  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-employee-btn')) {
      const employeeId = event.target.getAttribute('data-id');

      deleteEmployee(employeeId);
    }
  });

// /Delete Employee

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('edit-employee-btn')) {
    const employeeId = event.target.getAttribute('data-id');

    fillEditModal(employeeId);
  }
});

// Edit Employee

function fillEditModal(employeeId) {
  fetch(`http://localhost:3000/employees/${employeeId}`)
    .then(response => response.json())
    .then(employee => {
      document.getElementById('edit-firstName').value = employee.first_name;
      document.getElementById('edit-lastName').value = employee.last_name;
      document.getElementById('edit-middleName').value = employee.middle_name;
      document.getElementById('positionDropdown').innerText = employee.position;
      document.getElementById('edit-hire-date').value = employee.hire_date;

      const editButtonModal = document.getElementById('editButton');
      
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn btn-primary';
      editButton.textContent = 'Редактировать';
      editButton.setAttribute('data-bs-dismiss', 'modal');
      editButton.addEventListener('click', () => editEmployee(employee.id));
      
      const modalFooter = document.querySelector('#edit-employee-modal .modal-footer');
      
      modalFooter.appendChild(editButton);
    })
    .catch(error => console.error('Error during fetch:', error));
}

function editButtonClickHandler() {
  const employeeId = document.getElementById('editButton').dataset.id;

  editEmployee(employeeId);
}

function editEmployee(employeeId) {
  if (!employeeId) {
    console.error('Employee ID is null or undefined');
    return;
  }

  const firstName = document.getElementById('edit-firstName').value;
  const lastName = document.getElementById('edit-lastName').value;
  const middleName = document.getElementById('edit-middleName').value;
  const position = document.getElementById('dropdownMenuButton').textContent;
  const hireDate = document.getElementById('edit-hire-date').value;

  const editedData = {
    first_name: firstName,
    last_name: lastName,
    middle_name: middleName,
    position: position,
    hire_date: hireDate || null,
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedData),
  };

  fetch(`http://localhost:3000/employees/${employeeId}`, options)
    .then(response => response.json())
    .then(result => {
      console.log('Server response:', result);
      window.location.reload();
      const editEmployeeModal = new bootstrap.Modal(document.getElementById('edit-employee-modal'));
      editEmployeeModal.hide();
    })
    .catch(error => console.error('Error during PUT request:', error));
}
  
  // /Edit Employee


// /EMPLOYEES



// Validation

  function validateInput(input) {
    const inputValue = input.value.trim();
    const errorId = `${input.id}Error`;
    const errorElement = document.getElementById(errorId);
  
    // Регулярное выражение для проверки наличия только русских и английских букв
    const regex = /^[а-яА-Яa-zA-Z]+$/;
  
    if (!inputValue.match(regex)) {
      errorElement.textContent = 'Введите только русские или английские буквы';
    } else {
      errorElement.textContent = '';
    }
  }
  
  function validateForm() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const middleNameInput = document.getElementById('middleName');
    const newPositionInput = document.getElementsByClassName('newPositionInput');
  
    if (validateSingleInput(firstNameInput) && validateSingleInput(lastNameInput) && validateSingleInput(middleNameInput)) {
      document.getElementById('myForm').submit();
    } else {
      console.log('Форма содержит ошибки. Пожалуйста, проверьте введенные данные.');
    }

    if (validateSingleInput(newPositionInput)) {
      document.getElementById('newPositionForm').submit();
    } else {
      console.log('Форма содержит ошибки. Пожалуйста, проверьте введенные данные.');
    }
  }
  
  function validateSingleInput(input) {
    const inputValue = input.value.trim();
    const errorId = `${input.id}Error`;
    const errorElement = document.getElementById(errorId);
  
    const regex = /^[а-яА-Яa-zA-Z]+$/;
  
    if (!inputValue.match(regex)) {
      errorElement.textContent = 'Введите только русские или английские буквы';
      return false;
    } else {
      errorElement.textContent = '';
      return true;
    }
  }

// /Validation