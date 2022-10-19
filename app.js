// récupération des inputs
const inputs = document.querySelectorAll("input");

// écouteur d'évènements sur les inputs
inputs.forEach((input) => {
  input.addEventListener("invalid", handleValidation);
  input.addEventListener("input", handleValidation);
});

// fonction handleValidation
function handleValidation(e) {
  if (e.type === "invalid") {
    // change le message (bulle) de l'input et affiche quand vide
    e.target.setCustomValidity("Ce champ ne peut être vide");
  } else if (e.type === "input") {
    // s'enlève quad input rempli
    e.target.setCustomValidity("");
  }
}

const cookieForm = document.querySelector("form");
cookieForm.addEventListener("submit", handleForm);
// bloque le comportement par défaut
function handleForm(e) {
  e.preventDefault();

  const newCookie = {};
  // création d'objet récupération des inpts
  inputs.forEach((input) => {
    const nameAttribute = input.getAttribute("name");
    newCookie[nameAttribute] = input.value;
  });
  // expiration du cookie pile 1 semaine après
  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

  createCookie(newCookie);
}

// création de cookies
function createCookie(newCookie) {
  if (doesCookiesExist(newCookie.name)) {
    createToast({ name: newCookie.name, state: "modifié", color: "orangered" });
  } else {
    createToast({ name: newCookie.name, state: "modifié", color: "green" });
  }

  document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(
    newCookie.value
  )};expires=${newCookie.expires.toUTCString()}`;
}

function doesCookiesExist(name) {
  const cookies = document.cookie.replace(/\s/g, "").split(";");
  const onlyCookiesName = cookies.map((cookie) => cookie.split("=")[0]);
  console.log(cookies, onlyCookiesName);
  const cookiePresence = onlyCookiesName.find(
    (cookie) => cookie === encodeURIComponent(name)
  );
  return cookiePresence;
}

const toastsContainer = document.querySelector(".toasts-container");

function createToast({ name, state, color }) {
  const toastInfo = document.createElement("p");
  toastInfo.className = "toast";

  toastInfo.textContent = `Cookie ${name} ${state}.`;
  toastInfo.style.backgroundColor = color;
  toastsContainer.appendChild(toastInfo);

  setTimeout(() => {
    toastInfo.remove();
  }, 2500);
}

const cookiesList = document.querySelector(".cookies-list");
const displayCookieBtn = document.querySelector(".display-cookie-btn");
const infoTxt = document.querySelector(".info-txt");

displayCookieBtn.addEventListener("click", displayCookies);

let lock = false;
function displayCookies() {
  if (cookiesList.children.length) cookiesList.textContent = "";

  const cookies = document.cookie.replace(/\s/g, "").split(";").reverse();
  console.log(cookies);

  if (!cookies[0]) {
    if (lock) return;

    lock = true;
    infoTxt.textContent = "Pas de cookies à afficher, créez-en un!";

    setTimeout(() => {
      infoTxt.textContent = "";
      lock = false;
    }, 1500);
    return;
  }

  createElements(cookies);
}

function createElements(cookies) {
  cookies.forEach((cookie) => {
    const formatCookie = cookie.split("=");
    const listItem = document.createElement("li");
    const name = decodeURIComponent(formatCookie[0]);
    listItem.innerHTML = `
      <p>
        <span>Nom</span> : ${name}
      </p>
      <p>
        <span>Valeur</span>: ${decodeURIComponent(formatCookie[1])}
      </p>
      <button>X</button>
    `;
    listItem.querySelector("button").addEventListener("click", (e) => {
      createToast({ name: name, state: "supprimé", color: "crimson" });
      document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
      e.target.parentElement.remove();
    });
    cookiesList.appendChild(listItem);
  });
}
