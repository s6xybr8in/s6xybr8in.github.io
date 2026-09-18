/**
 * Midnight Garden - Instant Category Filtering
 * Filters notes smoothly without page reload
 */
function initCategoryFilter() {
  const filterButtons = document.querySelectorAll(".filter-tab-btn");
  const noteRows = document.querySelectorAll(".note-row");
  const emptyState = document.getElementById("notes-empty-state");

  if (!filterButtons.length || !noteRows.length) return;

  function applyFilter(category) {
    category = (category || "all").toLowerCase().trim();
    let visibleCount = 0;

    // Update active tab styling
    filterButtons.forEach((btn) => {
      const btnFilter = (btn.getAttribute("data-filter") || "").toLowerCase().trim();
      if (btnFilter === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Filter note rows
    noteRows.forEach((row) => {
      const categories = (row.getAttribute("data-categories") || "").toLowerCase();
      let isMatch = false;

      if (category === "all") {
        isMatch = true;
      } else if (category === "cs") {
        isMatch = categories.includes("cs") || categories.includes("computer science");
      } else if (category === "math") {
        isMatch = categories.includes("math") || categories.includes("mathematics");
      } else if (category === "ps") {
        isMatch = categories.includes("ps") || categories.includes("problem solving");
      } else {
        isMatch = categories.includes(category);
      }

      if (isMatch) {
        row.style.display = "grid";
        row.style.opacity = "1";
        visibleCount++;
      } else {
        row.style.display = "none";
        row.style.opacity = "0";
      }
    });

    // Handle empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add("show");
      } else {
        emptyState.classList.remove("show");
      }
    }
  }

  // Add click listener to tabs
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const filterValue = this.getAttribute("data-filter");
      applyFilter(filterValue);

      // Update URL hash without jumping
      if (history.replaceState) {
        history.replaceState(null, null, filterValue === "all" ? window.location.pathname : "#" + filterValue);
      }
    });
  });

  // Check URL hash on page load (e.g. #cs, #math, #ps)
  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const validFilters = ["all", "cs", "math", "ps"];
    if (validFilters.includes(hash)) {
      applyFilter(hash);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCategoryFilter);
} else {
  initCategoryFilter();
}

