(function () {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const gridEl = document.querySelector(".calendar-grid");
  const monthEl = document.getElementById("calendar-month");
  const yearEl = document.getElementById("calendar-year");
  const monthSelectEl = document.getElementById("month-select");
  const yearSelectEl = document.getElementById("year-select");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (
    !gridEl ||
    !monthEl ||
    !yearEl ||
    !prevBtn ||
    !nextBtn ||
    !monthSelectEl ||
    !yearSelectEl
  ) {
    return;
  }

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-based

  let entriesByDate = null; // loaded from entries.json

  function pad2(n) {
    return n.toString().padStart(2, "0");
  }

  function daysInMonth(year, monthIndex) {
    // monthIndex is 0-11
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function ensureEntriesLoaded() {
    if (entriesByDate !== null) {
      return Promise.resolve(entriesByDate);
    }

    return fetch("entries.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("entries.json not found");
        }
        return response.json();
      })
      .then(function (data) {
        entriesByDate = data || {};
        return entriesByDate;
      })
      .catch(function () {
        entriesByDate = {};
        return entriesByDate;
      });
  }

  function syncSelectsToView() {
    monthSelectEl.value = String(viewMonth);
    yearSelectEl.value = String(viewYear);
  }

  function populateSelects() {
    monthSelectEl.innerHTML = "";
    monthNames.forEach(function (name, index) {
      const opt = document.createElement("option");
      opt.value = String(index);
      opt.textContent = name;
      monthSelectEl.appendChild(opt);
    });

    yearSelectEl.innerHTML = "";
    const baseYear = today.getFullYear();
    const startYear = baseYear - 5;
    const endYear = baseYear + 5;
    for (let y = startYear; y <= endYear; y += 1) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSelectEl.appendChild(opt);
    }

    syncSelectsToView();
  }

  function renderCalendar() {
    gridEl.innerHTML = "";

    monthEl.textContent = monthNames[viewMonth];
    yearEl.textContent = String(viewYear);

    // Header row
    weekdayNames.forEach((name) => {
      const cell = document.createElement("div");
      cell.className = "calendar-cell header";
      cell.textContent = name;
      gridEl.appendChild(cell);
    });

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const firstWeekday = firstOfMonth.getDay(); // 0 = Sun
    const currentMonthDays = daysInMonth(viewYear, viewMonth);

    const prevMonthIndex = (viewMonth + 11) % 12;
    const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const prevMonthDays = daysInMonth(prevMonthYear, prevMonthIndex);

    const leadingDays = firstWeekday;
    const totalCells = leadingDays + currentMonthDays;
    const rows = Math.ceil(totalCells / 7);
    const totalGridCells = rows * 7;

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    for (let cellIndex = 0; cellIndex < totalGridCells; cellIndex += 1) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell day";

      let displayDay;
      let yearForCell = viewYear;
      let monthForCell = viewMonth;
      let isCurrentMonth = true;

      if (cellIndex < leadingDays) {
        // Previous month
        displayDay = prevMonthDays - leadingDays + 1 + cellIndex;
        monthForCell = prevMonthIndex;
        yearForCell = prevMonthYear;
        isCurrentMonth = false;
        cell.classList.add("muted");
      } else if (cellIndex >= leadingDays + currentMonthDays) {
        // Next month
        const nextMonthIndex = (viewMonth + 1) % 12;
        const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;
        displayDay = cellIndex - leadingDays - currentMonthDays + 1;
        monthForCell = nextMonthIndex;
        yearForCell = nextMonthYear;
        isCurrentMonth = false;
        cell.classList.add("muted");
      } else {
        // Current month
        displayDay = cellIndex - leadingDays + 1;
      }

      cell.textContent = displayDay;

      if (
        isCurrentMonth &&
        yearForCell === todayYear &&
        monthForCell === todayMonth &&
        displayDay === todayDate
      ) {
        cell.classList.add("today");
      }

      if (isCurrentMonth) {
        const yearStr = String(yearForCell);
        const monthStr = pad2(monthForCell + 1);
        const dayStr = pad2(displayDay);
        const isoDate = `${yearStr}-${monthStr}-${dayStr}`;

        cell.dataset.year = yearStr;
        cell.dataset.month = monthStr;
        cell.dataset.day = dayStr;

        if (entriesByDate && entriesByDate[isoDate]) {
          cell.classList.add("has-entry");
        }

        cell.addEventListener("click", () => {
          const target = `entry.html?date=${encodeURIComponent(isoDate)}`;
          window.location.href = target;
        });
      }

      gridEl.appendChild(cell);
    }
  }

  prevBtn.addEventListener("click", () => {
    if (viewMonth === 0) {
      viewMonth = 11;
      viewYear -= 1;
    } else {
      viewMonth -= 1;
    }
    syncSelectsToView();
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    if (viewMonth === 11) {
      viewMonth = 0;
      viewYear += 1;
    } else {
      viewMonth += 1;
    }
    syncSelectsToView();
    renderCalendar();
  });

  monthSelectEl.addEventListener("change", () => {
    const newMonth = parseInt(monthSelectEl.value, 10);
    if (!Number.isNaN(newMonth)) {
      viewMonth = newMonth;
      renderCalendar();
    }
  });

  yearSelectEl.addEventListener("change", () => {
    const newYear = parseInt(yearSelectEl.value, 10);
    if (!Number.isNaN(newYear)) {
      viewYear = newYear;
      renderCalendar();
    }
  });

  populateSelects();
  ensureEntriesLoaded().finally(renderCalendar);
})();

