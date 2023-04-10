/*
Read it, a simple reddit clone.

1. Setup npm, parcel and packages
    - install bootstrap
    - install parcel and set up
    - change the index.html file to point to an index.js file where we
        - import bootstrap
        - import main.js
2. Run the base server (in a separate folder) and ensure you understand how to interact with the api.
    NOTE: look at backend-json-server with the readit-db.json
3. Create api.js file to interact with our server.
    - talk about how to use promises when returning a promise.
    - create the different promises for
        - post
        - patch
    - talk about headers and how we need to specify "application/json" for
      the content type to make a header.
4. Use the api.js functions in the main.js 
    - in the create add a post with the api.
    - update the score in the "changescore" function
    - at the bottom of the file fetch all the posts

Note: talk about REST Clients
- Boomerang (https://boomerangapi.com/)
- Postman (https://www.postman.com/)

*/
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/main.css'

import { getAllPosts, newPost, updateScore } from './api'

let readitItemsElement = document.querySelector(".readit-items")

let readitForm = document.querySelector("#add-readit-item")

// adding piece
readitForm.addEventListener("submit", async (event)=> {
    event.preventDefault()
    let form = event.target
    let title = form.elements["title"]
    let url = form.elements["item-url"]

    let post = await newPost({
        title: title.value,
        url: url.value,
        score: 0
    })

    addReaditItem(post.title, post.url, post.score, post.id)
    // reset elements
    title.value = ""
    url.value = ""
})

const addReaditItem = (title, url, scoreValue, id)=> {
    // create the card
    let card = document.createElement("div")
    card.classList.add("card", "mt-2") // adds both classes
    card.setAttribute("post-id", id)
    //create card body
    let cardBody = document.createElement("div")
    cardBody.classList.add("card-body", "d-flex", "flex-row")
    // create up button
    let upButton = document.createElement("button")
    upButton.classList.add("btn", "vote-up", "m-1", "btn-secondary")
    upButton.textContent = "up"
    // create score
    let score = document.createElement("p")
    score.classList.add("score", "h4", "m-2")
    if (scoreValue) {
        score.textContent = scoreValue
    }
    else {
        score.textContent = '0'
    }
    // create down button
    let downButton = document.createElement("button")
    downButton.classList.add("btn", "vote-down", "m-1", "btn-secondary")
    downButton.textContent = "down"
    // create link
    let newLink = document.createElement("a")
    newLink.classList.add("h4", "m-2")
    newLink.setAttribute("href", url)
    newLink.textContent = title
    console.log(newLink)
   
    // patch altogether
    card.appendChild(cardBody)
    cardBody.appendChild(upButton)
    cardBody.appendChild(score)
    cardBody.appendChild(downButton)
    cardBody.appendChild(newLink)

    // append to list
    readitItemsElement.appendChild(card)
}

// Ranking Piece
readitItemsElement.addEventListener("click", (event)=> {
    let element = event.target
    
    if (element.classList.contains("vote-up")) {
        voteUp(element)
    } else if (element.classList.contains("vote-down")) {
        voteDown(element)
    }
})

const voteUp = async (buttonElement) => {
    // gets the parent which is the element with the class "card-body"
    let cardBodyElement = buttonElement.parentNode
    let scoreElement = cardBodyElement.children[1] // the second element
    changeScore(scoreElement, 1)
    changeItemOrder(cardBodyElement)
    await updateScore({
        id: scoreElement.parentElement.parentElement.getAttribute("post-id"),
        score: getScoreFromCard(scoreElement.parentElement.parentElement)
    })
}

const voteDown = async (buttonElement)=> {
    let cardBodyElement = buttonElement.parentNode
    let scoreElement = cardBodyElement.children[1] // the second element
    changeScore(scoreElement, -1)
    changeItemOrder(cardBodyElement)
    await updateScore({
        id: scoreElement.parentElement.parentElement.getAttribute("post-id"),
        score: getScoreFromCard(scoreElement.parentElement.parentElement)
    })
}

const changeScore = (scoreElement, value) => {
    let currentScore = parseInt(scoreElement.textContent)
    scoreElement.textContent = currentScore + value
}

const changeItemOrder = (cardBodyElement) => {
    let card = cardBodyElement.parentElement
    let upperCardElement = card.previousElementSibling
    let lowerCardElement = card.nextElementSibling

    if (upperCardElement) {
        swapItemUp(upperCardElement, card)
    }

    if (lowerCardElement) {
        swapItemDown(card, lowerCardElement)
    }
}

const swapItemUp = (topCardElement, bottomCardElement) => {
    let topCardScore = getScoreFromCard(topCardElement)
    let bottomCardScore = getScoreFromCard(bottomCardElement)

    while (topCardElement && (bottomCardScore > topCardScore)) {
        readitItemsElement.insertBefore(bottomCardElement, topCardElement)
        upAnimation(bottomCardElement)
        topCardElement = bottomCardElement.previousElementSibling
        if (topCardElement) {
            topCardScore = getScoreFromCard(topCardElement)
        }
    }
}

const swapItemDown = (topCardElement, bottomCardElement) => {
    let topCardScore = getScoreFromCard(topCardElement)
    let bottomCardScore = getScoreFromCard(bottomCardElement)

    while (bottomCardElement && (topCardScore < bottomCardScore)) {
        readitItemsElement.insertBefore(bottomCardElement, topCardElement)
        downAnimation(topCardElement)
        bottomCardElement = topCardElement.nextElementSibling
        if (bottomCardElement) {
            bottomCardScore = getScoreFromCard(bottomCardElement)
        }
    }
}

const getScoreFromCard = (card) => {
    return parseInt(card.children[0].children[1].textContent)
}

// this css is given to us to add this 
const ANIMATION_LENGTH = 1000

const upAnimation = (element) => {
    element.classList.add("up-fade")
    setTimeout(()=> {
        element.classList.remove("up-fade")
    }, ANIMATION_LENGTH)
}

const downAnimation = (element) => {
    element.classList.add("down-fade")
    setTimeout(()=> {
        element.classList.remove("down-fade")
    }, ANIMATION_LENGTH)
}

const getAndRenderPosts = async () => {
    let data = await getAllPosts()
    data.map((post) => {
        addReaditItem(post.title, post.url, post.score, post.id)
    })
}

getAndRenderPosts()

console.log("LOl")