const APP_STORAGE_KEY = 'notepocket';
const titleInput = document.querySelector('#title-input');
const descriptionInput = document.querySelector('#description-input');
const importantCheckbox = document.querySelector('#highlighted-checkbox');
const modalLayer = document.querySelector('#modal-layer');
const createNoteButton = document.querySelector('#btn-create-note');
const showModalButton = document.querySelector('#btn-show-modal');
const closeModalButton = document.querySelector('#btn-close-modal');
const notesContainer = document.querySelector('#notes-container');
const messageContainer = document.querySelector('#message');

let notes = [];
//inicjowanie notatek z local storage
initialize();

function initialize() {
    notes = notesFromStorage();

    renderNotes(notes);

    createNoteButton.addEventListener('click', onNewNoteClicked);
    showModalButton.addEventListener('click', onShowModalClicked);
    closeModalButton.addEventListener('click', onCloseModalClicked);
}
//tworzenie nowej notatki
function onNewNoteClicked(event) {
    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title.length) {
        const note = createNewNote(
            title,
            description,
            importantCheckbox.checked
        );

        addNote(note);
        resetInputs();
        renderNotes(notes);
        hideModal();
    }
}

function onShowModalClicked(event) {
    event.preventDefault();
    showModal();
}

function onCloseModalClicked(event) {
    event.preventDefault();
    hideModal();
}
// data utworzenia notatki
function createNewNote(title, description, isImportant) {
    const creationDate = Date.now();
    const randomNumber = Math.round(Math.random() * 10000);

    return {
        id: randomNumber.toString(),
        title,
        description,
        creationDate,
        isImportant
    };
}
//dodawanie nowej notatki 
function addNote(note) {
    notes.push(note);
    saveNotes(notes);
}

function saveNotes(notes) {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(notes));
}

function notesFromStorage() {
    const savedNotesString = localStorage.getItem(APP_STORAGE_KEY);

    return savedNotesString ? JSON.parse(savedNotesString) : [];
}

function resetInputs() {
    titleInput.value = '';
    descriptionInput.value = '';
    importantCheckbox.removeAttribute('checked');
}

function renderNotes(notesToRender) {
    removeNotesListeners();

    notesContainer.innerHTML = notesToRender
        .map(note => getNoteTemplate(note))
        .join('');

    addNotesListeners();

    if (notes.length) {
        messageContainer.classList.add('is-hidden');
    } else {
        messageContainer.classList.remove('is-hidden');
    }
}
//usuwanie notatek
function addNotesListeners() {
    const removeButtonsNodes = document.querySelectorAll('.btn-remove-note');

    Array.from(removeButtonsNodes).forEach(btnRemove => {
        btnRemove.addEventListener('click', onNoteRemoveClicked);
    });
}

function removeNotesListeners() {
    const removeButtonsNodes = document.querySelectorAll('.btn-remove-note');

    Array.from(removeButtonsNodes).forEach(btnRemove => {
        btnRemove.removeEventListener('click', onNoteRemoveClicked);
    });
}

function onNoteRemoveClicked(event) {
    event.preventDefault();

    const parent = event.target.parentNode;
    const noteId = parent.getAttribute('data-id');

    notes = notes.filter(note => note.id !== noteId);

    saveNotes(notes);
    renderNotes(notes);
}

function showModal() {
    modalLayer.classList.remove('is-hidden');
}

function hideModal() {
    modalLayer.classList.add('is-hidden');
}


function getNoteTemplate(note) {
    console.log(note)
    const highlightedClass = note.isImportant ? 'is-important' : '';
    const date = new Date(note.creationDate).toDateString();

    return `
        <div class="note ${highlightedClass}" data-id="${note.id}">
            <div class="note__title">${note.title}</div>   
            <div class="note__description">${note.description}</div>
            <div class="note__date">${date}</div>
            <button class="btn btn-close btn-remove-note"></button>  
        </div>
    `;
}