document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.getElementById("todo-form");
  const taskInput = document.getElementById("task-input");
  const priorityInput = document.getElementById("priority-input");
  const todoList = document.getElementById("todo-list"); // List 'To Do' (ul)
  const doneList = document.getElementById("done-list"); // List 'Done' (ul)
  const deleteAllButton = document.getElementById("delete-all-button");
  const timeDisplay = document.getElementById("time-display");

  const profileName = document.getElementById("profile-name");
  const profileJob = document.getElementById("profile-job");
  const editProfileButton = document.getElementById("edit-profile-button");
  const profileDiv = document.querySelector(".profile");

  const STORAGE_KEY_NAME = "todoAppName";
  const STORAGE_KEY_JOB = "todoAppJob";

  function tampilkanWaktu() {
    const now = new Date();
    // Opsi format tanggal 'id-ID' (Bahasa Indonesia)
    const options = {
      weekday: "long", // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
      day: "numeric", // '28', etc
      month: "long", // 'Oktober', etc
      year: "numeric", // '2025'
    };
    timeDisplay.innerText = now.toLocaleDateString("id-ID", options);
  }
  tampilkanWaktu();

  function loadProfile() {
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    const savedJob = localStorage.getItem(STORAGE_KEY_JOB);

    if (savedName) {
      profileName.innerText = savedName;
    }
    if (savedJob) {
      profileJob.innerText = savedJob;
    }
  }
  loadProfile();

  editProfileButton.addEventListener("click", function () {
    const inEditMode = editProfileButton.innerText === "Simpan";

    if (inEditMode) {
      const newName = document.getElementById("name-input").value;
      const newJob = document.getElementById("job-input").value;

      localStorage.setItem(STORAGE_KEY_NAME, newName);
      localStorage.setItem(STORAGE_KEY_JOB, newJob);

      profileName.innerText = newName;
      profileJob.innerText = newJob;

      document.getElementById("name-input").remove();
      document.getElementById("job-input").remove();

      profileName.style.display = "block";
      profileJob.style.display = "block";

      editProfileButton.innerText = "Edit";
    } else {
      const currentName = profileName.innerText;
      const currentJob = profileJob.innerText;

      profileName.style.display = "none";
      profileJob.style.display = "none";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.id = "name-input";
      nameInput.value = currentName;
      nameInput.className = "profile-edit-input"; // Pakai class CSS

      const jobInput = document.createElement("input");
      jobInput.type = "text";
      jobInput.id = "job-input";
      jobInput.value = currentJob;
      jobInput.className = "profile-edit-input"; // Pakai class CSS

      profileDiv.insertBefore(nameInput, editProfileButton);
      profileDiv.insertBefore(jobInput, editProfileButton);

      editProfileButton.innerText = "Simpan";
    }
  });

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    const priorityText = priorityInput.value;

    if (taskText === "") {
      alert("Nama tugas tidak boleh kosong!");
      return; // Hentikan fungsi
    }

    const li = document.createElement("li");
    li.classList.add("todo-item"); // Tambahkan class CSS

    const now = new Date();
    const timeString = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    li.innerHTML = `
            <div class="task-details">
                <input type="checkbox" class="todo-checkbox">
            </div>
            <span class="task-text">${taskText}</span>
            <span class="task-time">${timeString}</span>
            <span class="task-priority ${priorityText}">${priorityText}</span>
            <button class="delete-button">Hapus</button>
        `;

    todoList.appendChild(li);

    taskInput.value = "";
    priorityInput.value = "Low"; // Kembalikan ke default
  });

  todoList.addEventListener("click", function (event) {
    const clickedElement = event.target; // Elemen apa yang di-klik?

    if (clickedElement.classList.contains("todo-checkbox")) {
      const taskItem = clickedElement.closest(".todo-item");
      pindahkanKeDone(taskItem);
    }

    if (clickedElement.classList.contains("delete-button")) {
      // Ambil <li> (induk terdekat dari tombol)
      const taskItem = clickedElement.closest(".todo-item");
      taskItem.remove(); // Langsung hapus elemen <li>
    }
  });

  doneList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const taskItem = event.target.closest(".todo-item");
      taskItem.remove();
    }
  });

  function pindahkanKeDone(taskItem) {
    taskItem.classList.add("done");

    const checkbox = taskItem.querySelector(".todo-checkbox");
    if (checkbox) {
      checkbox.checked = true; // Pastikan tercentang
      checkbox.disabled = true; // Nonaktifkan
    }

    doneList.appendChild(taskItem);
  }

  deleteAllButton.addEventListener("click", function () {
    if (
      confirm("Apakah kamu yakin ingin menghapus SEMUA tugas (To Do dan Done)?")
    ) {
      todoList.innerHTML = "";
      doneList.innerHTML = "";
    }
  });
});
