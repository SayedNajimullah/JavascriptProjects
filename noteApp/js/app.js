const addBtn = document.getElementById("add");
const notesEl = document.querySelector(".notes");

const notes = JSON.parse(localStorage.getItem("notes"));

if (notes) {
  notes.forEach((note) => {
    addNewNote(note);
  });
}
addBtn.addEventListener("click", () => {
  addNewNote();
});

const addNewNote = (text = "") => {
  const note = document.createElement("div");
  note.classList.add("note");

  note.innerHTML = `
    <div class="notes">
        <div class="toolbar">
            <button class="edit"><i class="fa fa-pencil"></i></button>
            <button class="delete"><i class="fa fa-trash" ></i></button>
        </div>
        <div class="main_text ${text ? "" : "hidden"} "></div>
        <textarea class="${text ? "hidden" : ""}"></textarea>
    </div> `;

  const deleteBtn = note.querySelector(".delete");
  const editBtn = note.querySelector(".edit");
  const textArea = note.querySelector("textarea");
  const main_text = note.querySelector(".main_text");

  textArea.value = text;
  main_text.innerHTML = text;

  // toggling the hidden class for main-text and textarea
  editBtn.addEventListener("click", () => {
    main_text.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  });

  // remove note
  deleteBtn.addEventListener("click", () => {
    note.remove();
    updateLocalStorage();
  });
  // Typing inside textarea
  textArea.addEventListener("input", (e) => {
    const { value } = e.target;
    main_text.innerHTML = marked(value);
    updateLocalStorage();
  });

  // add new Note
  document.body.appendChild(note);
};

const updateLocalStorage = () => {
  const notesText = document.querySelectorAll("textarea");

  const notes = [];

  notesText.forEach((note) => {
    notes.push(note.value);
  });
  localStorage.setItem("notes", JSON.stringify(notes));
};
