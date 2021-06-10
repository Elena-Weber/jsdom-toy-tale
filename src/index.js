// form is hidden
let addToy = false;

// connection with db url
const API_DATABASE_URL = "http://localhost:3000/toys"
  console.log("Hey! This is our Toy Database URL ->", API_DATABASE_URL)

// shows everything clicked in console
document.addEventListener("click", (event)=>{ console.log("You Just Clicked on ", event.target)})

// starts functioning after all DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
// choosing an add toy button
  const addBtn = document.querySelector("#new-toy-btn");
// choosing a container for a form
  const toyFormContainer = document.querySelector(".container");

// listening for a click on an add toy button
  addBtn.addEventListener("click", () => {
// toggling form that creates toys - if it's true, display the form; otherwise - don't display
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

// display a single toy (create a card)
  const renderToy =(toyObj)=> {
// create div for every toy
    const cardDiv = document.createElement("div")
// add class to every toy with div
    cardDiv.classList.add("card")
// add attribute and id to each toy
    cardDiv.setAttribute("data-id", toyObj.id)
    cardDiv.id = toyObj.id
// how a card for each toy looks like (name, image, likes, buttons)
    cardDiv.innerHTML = `
      <h2>${toyObj.name}</h2>
      <img src=${toyObj.image} class="toy-avatar" />
      <p>${toyObj.likes} Likes </p>
      <button data-id="${toyObj.id}" class="like-btn">LIKE</button>
      <button data-id="${toyObj.id}" class="update-btn">UPDATE</button>
      <button data-id="${toyObj.id}" class="delete-btn">DELETE</button>
      `
// choosing where a toy is shown, populate it with a new toy
    const collectionDiv = document.querySelector("#toy-collection")
    collectionDiv.append(cardDiv)
  }

// display all toys (take them from a previous function)
  const renderAllToys =(toyArray)=> {
    toyArray.forEach(toyObj => { renderToy(toyObj) })
  }

// send request to db, transform response to json
  fetch(API_DATABASE_URL).then(response => response.json())
// display toys array in console and on web page (with previous function)
  .then(fetchedArray => { console.log(fetchedArray);
  renderAllToys(fetchedArray)
  })

// choose new toy form
  const newToyForm = document.querySelector(".add-toy-form")

// listen for a submit button on it, prevent page refreshing
  newToyForm.addEventListener("submit", event => { event.preventDefault();
// collect values from name and image
    const name = event.target.name.value
    const image = event.target.image.value
// saving submit action to a const
    const submit = event.target.submit

// send request to db with data to add there (name, image, likes)
    fetch(API_DATABASE_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        "name": name,
        "image": image,
        "likes": 10
      })
    })
// transform response to json
    .then(response => response.json())
// display new toy on web page
    .then(newToy => renderToy(newToy))
  })

// where all displayed toys are
  const cardsCollection = document.querySelector("#toy-collection")

// listen for clicks on it, prevent page refreshing
  cardsCollection.addEventListener("click", event => { event.preventDefault();

// if clicked on delete button, show in console, assign id of a clicked toy card
    if(event.target.matches(".delete-btn")){
    console.log(event.target) 
    const id = event.target.dataset.id
    const toBeDeleted = document.getElementById(id)

// send request to db to delete toy with this id, transform response to json, delete toy with this id
    fetch(`${API_DATABASE_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(toBeDeleted.remove())
    }
    
// if clicked on update button, show in console, get id of a clicked toy card
    if(event.target.matches(".update-btn")){
      console.log(event.target)
      const id = event.target.dataset.id
      // const toBeUpdated = document.getElementById(id)
      toyFormContainer.style.display = "block";
// debugger

      // const name = event.target.name.value
      // const image = event.target.image.value
      const name = document.querySelector("h2").innerText
      // const image = document.querySelector(".toy-avatar").innerText
      const formName = document.querySelector("#toyname")
      // const formImage = document.querySelector("#toyimage")
      formName.value = name
      // formImage.value = image

      fetch(`${API_DATABASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      body: JSON.stringify({
        "name": name,
        "image": image
      })
    
      .then(response => response.json())
      .then(data => renderToy(data))
      }

// if clicked on like button, choose this card p, parse number of likes, increase by 1, get id of this toy, change number of likes
    if (event.target.matches(".like-btn")) {
      const pTagWithLikes = event.target.closest(".card").querySelector("p")
      const likeCount = parseInt(pTagWithLikes.textContent)
      const newLikes = likeCount + 1
      const id = event.target.dataset.id
      const bodyObj = {likes: newLikes}

// send request to db to update number of likes with toy's id, transform response to json
      fetch(`${API_DATABASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      })
      .then(response => response.json())
// display updated likes in console and on web page
      .then(updatedToy => {
        console.log(updatedToy)
        pTagWithLikes.textContent = `${updatedToy.likes} Likes`
      })
    }
  })
});