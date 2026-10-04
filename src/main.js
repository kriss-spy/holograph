import "./atlas.css";
import("./atlas.js").catch((error) => {
  console.error(error);
  const box = document.querySelector("#loading");
  box.hidden = false;
  box.textContent =
    "The map could not load. Please reload this page. Research notes and downloadable data are still available below.";
  box.setAttribute("role", "alert");
});
