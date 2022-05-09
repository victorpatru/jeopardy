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
            box.textContent = '$' + boxValue

            // Add event listener to each box that runs the getClue function when its clicked
            box.addEventListener('click', getClue, false)

            // Append all the 6 boxes we have create to the current row (6 boxes per 1 row (iteration))
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

// Calling the Jeopardy API

// Getting a random number between 1 and 181418 (corresponding to all the possible set of values we can request from the Jeopardy API)
function randInt() {
    return Math.floor(Math.random() * (18418) + 1)
}

let catArray = []

function buildCategories() {
    // If there are already categories displayed in the DOM (on the first row) then reset the board when running this function
    if (!(document.getElementById('category-row').firstChild.innerText == '')) {
        resetBoard()
    }

    // Making six separate requests with random categories which are stored in six different fetchReq variables
    const fetchReq1 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    const fetchReq2 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    const fetchReq3 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    const fetchReq4 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    const fetchReq5 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    const fetchReq6 = fetch(`https://jservice.io/api/category?&id=${randInt()}`).then(res => res.json())

    // We wait for all the fetches to return back our desired information before using it further down our codebase
    const allData = Promise.all([fetchReq1,fetchReq2,fetchReq3,fetchReq4,fetchReq5,fetchReq6])

    allData.then((res) => {
        catArray = res
        setCategories(catArray)
    })

    // Ultimately we get six categories formatted as objects that we store in the catArray variable for use further down the road
}

// Reset the board function
function resetBoard() {
    // If there exists a child element nested within the section with the class name of "clue-board" or "category-row"; remove them
    let clueParent = document.getElementById('clue-board')
    let catParent = document.getElementById('category-row')

    while (clueParent.firstChild) {
        clueParent.removeChild(clueParent.firstChild)
    }
    while (catParent.firstChild) {
        catParent.removeChild(catParent.firstChild)
    }

    // Reset score
    document.getElementById('score').innerText = 0

    // After having cleared the board, reinitialize the whole board (including the category row)
    initBoard()
    initCatRow()

}

// Display categories on the board (DOM)

function setCategories(catArray) {
    let element = document.getElementById('category-row')
    // Sets the children variable equal to all the children of the section with the class name "category-row"
    let children = element.children

    // Loop through all of category boxes and add the title into the DOM
    for (let i = 0; i < children.length; i++) {
        children[i].innerHTML = catArray[i].title
    }

}

// Match the clicked box with the appropriate clue value 

function getClue(event) {
    // Add the class list of "clicked-box" to the box the user clicked
    let child = event.currentTarget
    child.classList.add('clicked-box')

    // Get the dollar value inside of the clicked box (minus the $ character)
    let boxValue = child.innerHTML.slice(1)

    // Look up the index of the children element to figure out which category the clicked box belongs to
    let parent = child.parentNode
    let index = Array.prototype.findIndex.call(parent.children, (c) => c === child)

    // Using the index of the box we clicked store the clues for the corresponding box inside the variables cluesList
    let cluesList = catArray[index].clues

    // Make sure to match the clue to the dollar value chosen by the user ($200 clue is different than $1000 clue)
    let clue = cluesList.find(obj => {
        return obj.value == boxValue
    })

    showQuestion(clue, child, boxValue)
}

function showQuestion(clue, target, boxValue) {
    // Use the question clue from the API and showcase it to the user as a prompt
    let userAnswer = prompt(clue.question).toLowerCase()

    // Get the correct answer off of the object we got back from the Jeopardy API. Apply some regex to standardize the output
    let correctAnswer = clue.answer.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "")

    // Force type conversion to Number (using the unary operator)
    let possiblePoints = +(boxValue)

    // Change the HTML of the box to the answer
    target.innerHTML = clue.answer

    // To make sure further clicks on the box will not run the whole process again, remove the event listener
    target.removeEventListener('click', getClue, false)

    evaluateAnswer(userAnswer, correctAnswer, possiblePoints)
}

// Evaluate answer
function evaluateAnswer(userAnswer, correctAnswer, possiblePoints) {
    // Check whether user input matches correct answer
    let checkAnswer = (userAnswer == correctAnswer) ? 'correct' : 'incorrect'

    // Ensuring edge case where user's answer is the correct one but our input cleaning efforts don't succeed
    let confirmAnswer = confirm(`For $${possiblePoints}, you answered "${userAnswer}", and the correct answer was "${correctAnswer}". Your answer appears to be ${checkAnswer}. Click OK to accept or click Cancel if the answer was not properly evaluated.`)

    awardPoints(checkAnswer, confirmAnswer, possiblePoints)
}

// Award Points
function awardPoints(checkAnswer, confirmAnswer, possiblePoints) {
    // Award points in all cases besides the one where the answer is incorrect and the user confirms it
    if(!(checkAnswer == 'incorrect' && confirmAnswer == true)) {
        // Get the DOM element for score counting element 
        let target = document.getElementById('score')
        // Get the score that is already in the DOM
        let currentScore = +(target.innerText)
        // Append the value from the object we get from the API
        currentScore += possiblePoints
        // Update the score in the DOM
        target.innerText = currentScore
    } else {
        alert('No points awarded!')
    }
}