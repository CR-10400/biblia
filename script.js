// Exemplo de estrutura do JSON da Bíblia
const biblia = {
    "genesis": {
        "nome": "Gênesis",
        "testamento": "antigo",
        "capitulos": {
            "1": [
                "No princípio criou Deus o céu e a terra.",
                "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
                // ... mais versículos
            ],
            // ... mais capítulos
        }
    },
    // ... mais livros
};

let currentBook = '';
let currentChapter = 1;

// Função para mostrar livros na tela inicial
function showBooks() {
    const oldTestament = document.getElementById('old-testament');
    const newTestament = document.getElementById('new-testament');

    oldTestament.innerHTML = '';
    newTestament.innerHTML = '';

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

// Função para mostrar capítulos de um livro
function showChapters(bookKey) {
    currentBook = bookKey;
    const book = biblia[bookKey];
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

// Função para mostrar versículos de um capítulo
function showVerses(chapter) {
    currentChapter = chapter;
    const book = biblia[currentBook];
    document.getElementById('chapter-title').textContent = `${book.nome} ${chapter}`;

    const verseContent = document.getElementById('verse-content');
    verseContent.innerHTML = '';

    const verses = book.capitulos[chapter];
    verses.forEach((verse, index) => {
        const p = document.createElement('p');
        p.textContent = `${index + 1}. ${verse}`;
        verseContent.appendChild(p);
    });

    showScreen('verses-screen');
}

// Função para navegar entre capítulos
function navigateChapter(direction) {
    const book = biblia[currentBook];
    const numChapters = Object.keys(book.capitulos).length;
    const newChapter = currentChapter + direction;

    if (newChapter >= 1 && newChapter <= numChapters) {
        showVerses(newChapter);
    }
}

// Função para alternar entre telas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// [O código JavaScript permanece o mesmo, apenas removemos a chamada inicial do changeVersion]
        
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Atualizar a versão selecionada quando mostrar a tela de versículos
    if (screenId === 'verses-screen') {
        document.getElementById('version-selector').value = currentVersion;
    }
}

// Inicializar o aplicativo
showBooks();