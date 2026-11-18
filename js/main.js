// Fasanya Joshua's Kitchen - main JavaScript
// Features: mobile menu toggle, menu category filter, contact form validation

document.addEventListener("DOMContentLoaded", function () {
  setYear();
  setupNavToggle();
  setupMenuFilter();
  setupContactForm();
});

// ----- Footer year -----
function setYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ----- Mobile navigation toggle -----
function setupNavToggle() {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ----- Interactive feature: filter dishes by category -----
function setupMenuFilter() {
  var buttons = document.querySelectorAll(".filter-btn");
  var dishes = document.querySelectorAll(".dish");
  var noResults = document.getElementById("noResults");
  if (buttons.length === 0) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      var shown = 0;

      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      dishes.forEach(function (dish) {
        var match = filter === "all" || dish.getAttribute("data-category") === filter;
        dish.classList.toggle("hidden", !match);
        if (match) shown++;
      });

      if (noResults) noResults.hidden = shown !== 0;
    });
  });
}

// ----- Contact form validation -----
function setupContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };
  var feedback = document.getElementById("formFeedback");

  // Returns an error message, or "" if the value is valid
  function validate(name, value) {
    value = value.trim();
    switch (name) {
      case "fullName":
        if (value === "") return "Please enter your full name.";
        if (value.length < 3) return "Name must be at least 3 characters.";
        if (!/^[A-Za-z][A-Za-z\s'.-]*$/.test(value)) return "Name may only contain letters and spaces.";
        return "";
      case "email":
        if (value === "") return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Please enter a valid email address.";
        return "";
      case "subject":
        if (value === "") return "Please enter a subject.";
        if (value.length < 3) return "Subject must be at least 3 characters.";
        return "";
      case "message":
        if (value === "") return "Please write a message.";
        if (value.length < 10) return "Message must be at least 10 characters.";
        return "";
    }
    return "";
  }

  function showResult(name) {
    var field = fields[name];
    var error = validate(name, field.value);
    document.getElementById(name + "Error").textContent = error;
    field.classList.toggle("invalid", error !== "");
    field.classList.toggle("valid", error === "" && field.value.trim() !== "");
    return error === "";
  }

  // Live feedback while the user types / leaves a field
  Object.keys(fields).forEach(function (name) {
    fields[name].addEventListener("blur", function () { showResult(name); });
    fields[name].addEventListener("input", function () {
      if (fields[name].classList.contains("invalid")) showResult(name);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var allValid = true;

    Object.keys(fields).forEach(function (name) {
      if (!showResult(name)) allValid = false;
    });

    feedback.className = "feedback";
    if (!allValid) {
      feedback.textContent = "Please fix the highlighted errors and try again.";
      feedback.classList.add("fail");
      return;
    }

    // No backend is connected, so nothing is actually sent.
    feedback.textContent = "Thank you, " + fields.fullName.value.trim() +
      "! Your form passed validation. (Demo only: no message was sent because no backend is connected.)";
    feedback.classList.add("success");
    form.reset();
    Object.keys(fields).forEach(function (name) { fields[name].classList.remove("valid", "invalid"); });
  });
}
