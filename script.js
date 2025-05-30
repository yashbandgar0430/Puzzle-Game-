const imageSelect = document.getElementById('imageSelect');
const startGameBtn = document.getElementById('startGameBtn');
const referenceContainer = document.getElementById('referenceContainer');
const puzzleContainer = document.getElementById('puzzleContainer');
const navbarLinks = document.querySelectorAll('.navbar-links a');

let puzzlePieces = [];

startGameBtn.addEventListener('click', () => {
  const selectedImageSrc = imageSelect.value;
  if (!selectedImageSrc) {
    alert('Please select an image first!');
    return;
  }

  // Show the reference image
  referenceContainer.innerHTML = '';
  const refImg = document.createElement('img');
  refImg.src = selectedImageSrc;
  refImg.style.maxWidth = '100%';
  refImg.style.maxHeight = '100%';
  referenceContainer.appendChild(refImg);

  // Slice and shuffle the image
  sliceAndShuffleImage(selectedImageSrc, 3, 3);
});

function sliceAndShuffleImage(imageSrc, rows, cols) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const pieceWidth = img.width / cols;
    const pieceHeight = img.height / rows;

    const pieces = [];
    const canvas = document.createElement('canvas');
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;
    const ctx = canvas.getContext('2d');

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.clearRect(0, 0, pieceWidth, pieceHeight);
        ctx.drawImage(
          img,
          c * pieceWidth,
          r * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        );
        pieces.push(canvas.toDataURL());
      }
    }

    // Shuffle pieces
    const shuffledPieces = pieces
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    displayShuffledPieces(shuffledPieces, rows, cols);
  };
  img.onerror = () => {
    alert('Failed to load image. Please try another.');
  };
  img.src = imageSrc;
}

function displayShuffledPieces(pieces, rows, cols) {
  puzzleContainer.innerHTML = ''; // Clear previous pieces

  puzzleContainer.style.display = 'grid';
  puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  puzzlePieces = [];

  for (let i = 0; i < pieces.length; i++) {
    const img = document.createElement('img');
    img.src = pieces[i];
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.className = 'puzzle-piece';
    img.style.cursor = 'pointer';

    img.setAttribute('draggable', true);
    img.addEventListener('dragstart', (e) => dragStart(e, i));
    img.addEventListener('dragover', allowDrop);
    img.addEventListener('drop', (e) => dropPiece(e, i));

    // Optional click to swap with a previously selected piece (if you want)
    // img.addEventListener('click', () => selectPieceToSwap(i));

    puzzleContainer.appendChild(img);
    puzzlePieces.push(img);
  }
}

let draggedIndex = null;

function dragStart(e, index) {
  draggedIndex = index;
  e.dataTransfer.setData('text/plain', index);
}

function allowDrop(e) {
  e.preventDefault();
}

function dropPiece(e, dropIndex) {
  e.preventDefault();

  if (draggedIndex === null || draggedIndex === dropIndex) return;

  // Swap images between dragged and dropped pieces
  swapPieces(draggedIndex, dropIndex);

  draggedIndex = null;
}

function swapPieces(i1, i2) {
  const tempSrc = puzzlePieces[i1].src;
  puzzlePieces[i1].src = puzzlePieces[i2].src;
  puzzlePieces[i2].src = tempSrc;
}
navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbarLinks.forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');
  });
});
function checkPuzzleCompletion() {
  const pieces = document.querySelectorAll('.puzzle-piece'); // All puzzle pieces
  let solved = true;

  pieces.forEach((piece) => {
    const parent = piece.parentElement; // Current slot the piece is in
    const pieceId = piece.getAttribute('data-id'); // ID of the piece
    const slotId = parent.getAttribute('data-id'); // ID of the slot

    // If any piece is not in the correct slot, the puzzle is not solved
    if (pieceId !== slotId) {
      solved = false;
    }
  });

  if (solved) {
    showSuccessMessage();
  }
}

// Show success message
function showSuccessMessage() {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'success-message';
  messageContainer.textContent = 'Puzzle Solved Successfully! 🎉';

  document.body.appendChild(messageContainer);

  // Optional: Remove the message after 3 seconds
  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}