// Initialize the game Board on page load ()
initCatRow()

initBoard()

// Event listener on our "Start New Game" button
// Run the function buildCategories when the buttons is clicked

document.querySelector('button').addEventListener('click', buildCategories)

// Create the category row
// First row of our Jeopardy table

function initCatRow() {
    // Store in the variable the reference to the section (category-row) element in our HTML (DOM manipulation)
    let catRow = document.getElementById('category-row')

    for (let i = 0; i < 6; i++) {
        // Create the box itself which is itself a div
        let box = document.createElement('div')
        // Add to the created box two class names: 'clue-box' and 'category-box'
        box.className = 'clue-box category-box'
        // Append the created box (div with two class names) to the category row (first row of the Jeopardy game table)
        catRow.appendChild(box)

        // Do this whole process 6 times consecutive times
    }
}

// Create the clue board


function initBoard() {
    // Store the clue-board HTML element in the board variable (DOM manipulation)
    let board = document.getElementById('clue-board')

    // Create 5 rows and 6 columns
    for (let i = 0; i < 5; i++) {
        // Create a div element that will act as our row in the clue board (top => bottom)
        let row = document.createElement('div')
        // Make sure that each new row has a different box value (eg. first row = 200; second row = 400; third row = 600 etc)
        let boxValue = 200 * (i + 1)
        // Add to the div element the class name of 'clue-row'
        row.className = 'clue-row'

        for (let j = 0; j < 6; j++) {
            // Creat a div element that will act as the boxes for our jeopardy board
            let box = document.createElement('div')
            // Add the box the class name of 'clue-box'
            box.className = 'clue-box'
            // Put the dollar value of the box inside the box div element
            box.textContent = `$ ${boxValue}`

            box.addEventListener('click', getClue, false)

            // Append all the 6 boxes we have create to the current row (6 boxes per 1 row (iteration))
            row.appendChild(box)
        }
    }
}