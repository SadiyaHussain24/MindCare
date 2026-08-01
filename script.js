/* =========================================================
   MINDCARE — SHARED SCRIPT (script.js)
   This file is linked on EVERY page. It handles things that
   every page needs: the mobile navigation menu, scroll-in
   animations, highlighting the active nav link, and the
   contact form (only runs if a contact form exists on the page).
   ========================================================= */

// Wait until the whole HTML page has loaded before running any code.
// This prevents errors from trying to grab elements that don't exist yet.
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. MOBILE NAVIGATION TOGGLE ---------- */
  // Grabs the hamburger button and the link list from the navbar.
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      // Toggling the "open" class shows/hides the menu on mobile (see style.css)
      navLinks.classList.toggle("open");
    });

    // Close the mobile menu automatically after a link is clicked,
    // so the menu doesn't stay open when navigating to a new page.
    const allLinks = navLinks.querySelectorAll("a");
    allLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- 2. HIGHLIGHT CURRENT PAGE IN NAV ---------- */
  // Compares the current file name (e.g. "about.html") to each
  // nav link's href, and adds the "active" class to the match.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(function (link) {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  /* ---------- 3. SCROLL-REVEAL ANIMATIONS ---------- */
  // Any element with the class "reveal" will fade + slide into
  // view the first time it enters the browser viewport.
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Stop watching this element once it has animated in
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 } // triggers when 15% of the element is visible
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for very old browsers: just show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- 4. CONTACT FORM HANDLING ---------- */
  // This block only does something on contact.html, because that
  // is the only page containing an element with id="contactForm".
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      // Stop the form from actually submitting/reloading the page,
      // since we have no backend server to send this data to.
     // event.preventDefault();

      // Basic values a beginner can inspect with console.log if curious
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields before sending your message.");
        return;
      }

      // In a real project, this is where you would send the data
      // to a server using fetch(). Since this is a front-end-only
      // college project, we simply show a success message instead.
      console.log("Contact form submitted:", { name, email, message });

      // Show the green success banner
      if (successMessage) {
        successMessage.classList.add("show");
      }

      // Clear the form fields
      contactForm.reset();

      // Hide the success message again after a few seconds
      setTimeout(function () {
        if (successMessage) {
          successMessage.classList.remove("show");
        }
      }, 5000);
    });
  }

});