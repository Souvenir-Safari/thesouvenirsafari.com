(function () {
  var ENDPOINT = "https://agii-vapi-bridge-9383.twil.io/web-contact";

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll("details[open]").forEach(function (item) {
      item.open = false;
    });
  });

  document.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 989px)").matches) {
        document.querySelectorAll("details[open]").forEach(function (item) {
          item.open = false;
        });
      }
    });
  });

  document.querySelectorAll("form[data-intake]").forEach(function (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-status]");
      var button = form.querySelector("button[type=submit]");
      var data = Object.fromEntries(new FormData(form).entries());
      data.business = "SS";
      data.source = form.getAttribute("data-source") || "thesouvenirsafari.com";

      if (data.website) {
        form.reset();
        status.textContent = "Thanks — message received. We'll be in touch shortly.";
        return;
      }

      if (!data.email && !data.phone) {
        status.textContent = "Please provide an email or phone number so we can reach you.";
        return;
      }

      if (form.getAttribute("data-intake") === "custom") {
        data.message = [
          "Custom intake for or from your trip",
          "Trip or destination: " + (data.destination || ""),
          "Product type: " + (data.product_type || ""),
          "For or from: " + (data.trip_direction || ""),
          "How many: " + (data.quantity || ""),
          "Timing: " + (data.timing || ""),
          "",
          data.notes || ""
        ].join("\n");
      }

      if (!data.message || !String(data.message).trim()) {
        status.textContent = "Please add a message so we know how to help.";
        return;
      }

      button.disabled = true;
      status.textContent = "Sending…";

      try {
        var response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        if (window.turnstile) {
          try { window.turnstile.reset(); } catch (ignore) {}
        }
        status.textContent = "Thanks — message received. We'll be in touch shortly.";
      } catch (error) {
        status.textContent = "Something went wrong. Please call or text (936) 297-6443.";
      } finally {
        button.disabled = false;
      }
    });
  });
})();
