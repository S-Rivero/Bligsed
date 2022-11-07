const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

window.onload = function() {
  var url = window.location.href;
  if(url.substring(url.lastIndexOf("/") + 1) == "registro")
    container.classList.add("sign-up-mode");
}

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.getElementById('formRegistro').addEventListener('submit', e => {
  e.preventDefault();
  alert('En la brevedad nos pondremos en contacto');
  //e.target.children[3].textContent = 'En la brevedad te contactaremos ' + e.target.username.value;
});