  // Exemplo de estrutura do JSON da Bíblia para diferentes versões
  const biblias = {
    "nvi": {
        "genesis": {
            "nome": "Gênesis",
            "testamento": "antigo",
            "capitulos": {
                "1": [
                    "No princípio Deus criou os céus e a terra.",
                    "Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
                ]
            }
        }
    },
    "ara": {
        "genesis": {
            "nome": "Gênesis",
            "testamento": "antigo",
            "capitulos": {
                "1": [
                    "No princípio criou Deus os céus e a terra.",
                    "A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas.",
                ]
            }
        }
    }
};

let currentVersion = 'nvi';
let currentBook = '';
let currentChapter = 1;
let currentVerseForNote = '';

// Carregar destacamentos e anotações do localStorage
let highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
let notes = JSON.parse(localStorage.getItem('notes') || '{}');

function changeVersion() {
    currentVersion = document.getElementById('version-selector').value;
    if (document.getElementById('verses-screen').classList.contains('active')) {
        showVerses(currentChapter);
    } else {
        showBooks();
    }
}

function showBooks() {
    const oldTestament = document.getElementById('old-testament');
    const newTestament = document.getElementById('new-testament');

    oldTestament.innerHTML = '';
    newTestament.innerHTML = '';

    const biblia = biblias[currentVersion];
    for (let key in biblia) {
        const book = biblia[key];
        const button = document.createElement('button');
        button.className = 'book-btn';
        button.textContent = book.nome;
        button.onclick = () => showChapters(key);

        if (book.testamento === 'antigo') {
            oldTestament.appendChild(button);
        } else {
            newTestament.appendChild(button);
        }
    }
}

function showChapters(bookKey) {
    currentBook = bookKey;
    const book = biblias[currentVersion][bookKey];
    document.getElementById('book-title').textContent = book.nome;
    
    const chaptersGrid = document.getElementById('chapters-grid');
    chaptersGrid.innerHTML = '';

    const numChapters = Object.keys(book.capitulos).length;
    
    for (let i = 1; i <= numChapters; i++) {
        const button = document.createElement('button');
        button.className = 'chapter-btn';
        button.textContent = i;
        button.onclick = () => showVerses(i);
        chaptersGrid.appendChild(button);
    }

    showScreen('chapters-screen');
}

function showVerses(chapter) {
    currentChapter = chapter;
    const book = biblias[currentVersion][currentBook];
    document.getElementById('chapter-title').textContent = `${book.nome} ${chapter}`;
    
    const verseContent = document.getElementById('verse-content');
    verseContent.innerHTML = '';

    const verses = book.capitulos[chapter];
    verses.forEach((verse, index) => {
        const verseId = `${currentBook}-${chapter}-${index + 1}`;
        const div = document.createElement('div');
        div.className = 'verse';
        if (isHighlighted(verseId)) {
            div.classList.add('highlighted');
        }

        const noteIndicator = hasNote(verseId) ? '<span class="verse-note-indicator"></span>' : '';
        
        div.innerHTML = `
            ${noteIndicator}
            <span>${index + 1}. ${verse}</span>
            <div class="verse-tools">
                <button class="tool-btn" onclick="toggleHighlight('${verseId}')">Destacar</button>
                <button class="tool-btn" onclick="openNoteModal('${verseId}')">Anotar</button>
            </div>
        `;
        verseContent.appendChild(div);
    });

    showScreen('verses-screen');
}

function navigateChapter(direction) {
    const book = biblias[currentVersion][currentBook];
    const numChapters = Object.keys(book.capitulos).length;
    const newChapter = currentChapter + direction;

    if (newChapter >= 1 && newChapter <= numChapters) {
        showVerses(newChapter);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function toggleHighlight(verseId) {
    highlights[verseId] = !highlights[verseId];
    localStorage.setItem('highlights', JSON.stringify(highlights));
    showVerses(currentChapter);
}

function isHighlighted(verseId) {
    return highlights[verseId] || false;
}

function openNoteModal(verseId) {
    currentVerseForNote = verseId;
    const modal = document.getElementById('note-modal');
    const textarea = document.getElementById('note-textarea');
    textarea.value = notes[verseId] || '';
    modal.style.display = 'flex';
}

function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
}

function saveNote() {
    const note = document.getElementById('note-textarea').value;
    if (note.trim()) {
        notes[currentVerseForNote] = note;
    } else {
        delete notes[currentVerseForNote];
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    closeNoteModal();
    showVerses(currentChapter);
}

function hasNote(verseId) {
    return notes[verseId] && notes[verseId].trim().length > 0;
}

// Inicializar o aplicativo
showBooks();