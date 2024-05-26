async function fetchJson() {
  const response = await fetch("./data.json");
  if (!response.ok) {
    throw new Error(`Data is Not Rendered: ${response.statusText}`);
  }
  const data = await response.json();

  let employees = data;
  let selectedEmployeeId = employees[0].id;
  let selectedEmployee = employees[0];

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  // Add Employee Logic //
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  if (createEmployee && addEmployeeModal) {
    createEmployee.addEventListener("click", () => {
      addEmployeeModal.style.display = "flex";
    });

    addEmployeeModal.addEventListener("click", (e) => {
      if (e.target.className === "addEmployee") {
        addEmployeeModal.style.display = "none";
      }
    });

    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18} - ${new Date()
      .toISOString()
      .slice(5, 10)}`;

    addEmployeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(addEmployeeForm);
      const values = [...formData.entries()];

      let empData = {};
      values.forEach((val) => (empData[val[0]] = val[1]));

      empData.id = employees[employees.length - 1].id + 1;
      empData.age =
        new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
      empData.imageUrl =
        empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

      employees.push(empData);
      renderEmployees();
      addEmployeeForm.reset();
      addEmployeeModal.style.display = "none";
      console.log(employees);
    });
  }

  // Select Employee Logic //

  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployee();
    }

    // Employee Delete Logic - START
    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0]?.id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployees();
    }
    // Employee Delete Logic - END
  });

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employee__names--item");

      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(employee);
    });
  };

  const renderSingleEmployee = () => {
    // Employee Delete Logic - START
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }
    // Employee Delete Logic - END
    employeeInfo.innerHTML = `
    <img  src= "${selectedEmployee.imageUrl}"/>
    <span class="employees__single--heading">${selectedEmployee.firstName} ${selectedEmployee.lastName} ${selectedEmployee.age}</span>
    <span>${selectedEmployee.address}</span>
    <span>${selectedEmployee.email}</span>
    <span> Mobile -  ${selectedEmployee.contactNumber}</span>
    <span> DOB - ${selectedEmployee.dob}</span>
    `;
  };

  if (selectedEmployee) renderSingleEmployee();

  renderEmployees();
}
fetchJson();
