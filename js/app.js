function PlanCare(brand, year, type) {
  (this.brand = brand), (this.year = year), (this.type = type);
}

PlanCare.prototype.planCareQuotization = function () {
  /* 
        1 = Americano + 1.15
        2 = Asiatico + 1.05
        3 = Americano + 1.35
    */
  let amount;
  const base = 2000;

  switch (this.brand) {
    case "1":
      amount = base * 1.15;
      break;
    case "2":
      amount = base * 1.05;
      break;
    case "3":
      amount = base * 1.35;
      break;

    default:
      amount = base;
      break;
  }

  // every passed year the value will be 3% less
  const gap = new Date().getFullYear() - this.year;
  amount -= (gap * 3 * amount) / 100;

  /* 
        type basic * 30%
        type total * 50%
    */
  if (this.type === "basico") {
    amount *= 1.3;
  } else {
    amount *= 1.5;
  }

  return amount;
};

function UI() {}

UI.prototype.buildOptions = () => {
  const maxDate = new Date().getFullYear(),
    minDate = maxDate - 20;

  const yearSelect = document.querySelector("#year");

  for (let date = maxDate; date > minDate; date--) {
    let option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    yearSelect.appendChild(option);
  }
};

UI.prototype.showAlerts = (msg, type) => {
  const div = document.createElement("div");
  if (type === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }
  div.classList.add("mensaje", "mt-10");
  div.textContent = msg;

  const form = document.querySelector("#cotizar-seguro");
  form.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.showResults = function (totalAmount, planCare) {
  const div = document.createElement("div");
  const { brand, year, type } = planCare;
  let textBrand;
  div.classList.add("mt-10");

  switch (brand) {
    case "1":
      textBrand = "Americo";
      break;
    case "2":
      textBrand = "Asiatico";
      break;
    case "3":
      textBrand = "Europeo";
      break;

    default:
      textBrand = "";
      break;
  }

  div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textBrand}</span> </p>
    <p class="font-bold">Año: <span class="font-normal"> ${year}</span> </p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${type}</span> </p>
    <p class="font-bold">Total: <span class="font-normal"> $${totalAmount}</span> </p>
    `;
  const resultDiv = document.querySelector("#resultado");

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none";
    resultDiv.appendChild(div);
  }, 3000);
};

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.buildOptions();
});

eventListeners();
function eventListeners() {
  const form = document.querySelector("#cotizar-seguro");

  form.addEventListener("submit", planCaresQuotation);
}

function planCaresQuotation(e) {
  e.preventDefault();

  const brand = document.querySelector("#marca").value;
  const year = document.querySelector("#year").value;
  const type = document.querySelector('input[name="tipo"]:checked').value;

  if (brand === "" || year === "" || type === "") {
    ui.showAlerts("Todos los campos son obligatorios.", "error");
    return;
  }

  ui.showAlerts("Cotizando...", "exito");

  const results = document.querySelector("#resultado div");
  if (results != null) {
    results.remove();
  }

  const planCare = new PlanCare(brand, year, type);
  const totalAmount = planCare.planCareQuotization();
  ui.showResults(totalAmount, planCare);
}
