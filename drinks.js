var something = "";
var drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${something}`;
//will need to update alcohol type with drinkSelection variable
var recipeTitle = document.getElementById("recipe-title");
var ingredientContainer = document.getElementById("ingredients");
//console.log(recipeTitle)

function getDrink() {
  // Getting the value of the user's drink selection based on which radio button they picked
  drinkSelection = $("input[name=answer]:checked").val();
  console.log(drinkSelection);
  // will need to add + drinkSelection to the drinkUrl
  var drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drinkSelection}`;
  // }
  // we kicked this Async operation off right away
  fetch(drinkUrl)
    .then(function (response) {
      //  Conditional for the the response.status; checking to make sure the status is good
      if (response.status === 200) {
        //need to pass this information to the next .then
        //the first .then needs to complete before the next .then
        //.json() returns the json object and converts it to javascript object
        //in json the keys and values are both strings

        return response.json();
      } else {
        // if the status is not 200, then we throw an error
        throw new Error("Something went wrong");
      }
    })
    //the response object in javascript
    //we need to pull out the info we need from data- data is our js object
    .then(function (data) {
      console.log(data);
      //Randomizing the drink selection//
      var randomDrink = Math.floor(Math.random() * data.drinks.length);
      console.log(randomDrink);
      // the data returns a value idDrink and then we can use a new API endpoint to search by idDrink
      //set the random drink's ID into a variable
      //need to use ID and not drink name because of the underscore problem in the url
      idDrink = data.drinks[randomDrink].idDrink;
      console.log(idDrink);
      drinkName = data.drinks[randomDrink].strDrink; //stDrink is the name; taken from the data object
      console.log(drinkName);
      drinkImg = data.drinks[randomDrink].strDrinkThumb; //grabs the drink image
      //new API endpoint where you can use drink's ID from the previous call
      var drinkByIdUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + idDrink;
      console.log(drinkByIdUrl);
      getIngredients(drinkByIdUrl);
    })
    // IF we have an ERROR in our API request (it get's handled here)
    .catch(function (error) {
      console.log(error);
    });
}
//need to get the Ingredients
function getIngredients(drinkByIdUrl) {
  fetch(drinkByIdUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      recipeTitle.textContent = data.drinks[0].strDrink;
      instructions = data.drinks[0].strInstructions;

      //need to get the ingredients and measurements from a different endpoint that has the drink ID
      //need to loop through the 16 ingredients and measurements
      //need to check if they are == null??
      for (var i = 1; i < 16; i++) {
        ingredient = data.drinks[0]["strIngredient" + i];
        unit = data.drinks[0]["strMeasure" + i];
        console.log(ingredient, unit);
        // breakout condition
        if (ingredient == null) {
          console.log("Not more ingredients");
          break;
        }

        // need to add image to page

        let newcontentContainer = document.createElement("div");
        newcontentContainer.setAttribute("class", "bingo");
        // dynamically create new elements with classes/ids data
        let tempIngredientAmt = document.createElement("li");
        tempIngredientAmt.setAttribute("class", "ingredient-amount");
        tempIngredientAmt.textContent = unit;
        // tempIngredient.innerHTML = "<li>Ingredient: ";
        let tempIngredient = document.createElement("li");
        tempIngredient.setAttribute("class", "ingredient-item");
        tempIngredient.textContent = ingredient;
        //new paragraph element for the instructions
        let instructionsContainer = document.createElement("div");
        let tempInstructions = document.createElement("p");
        tempInstructions.textContent = instructions;

        console.log(tempIngredient);
        console.log(tempIngredientAmt);
        console.log(instructions);
        // once the new elements are created WE HAVE TO ADD THEM TO THE DOM/BROWSER
        newcontentContainer.append(tempIngredientAmt, tempIngredient);
        ingredientContainer.append(newcontentContainer);

        let cardContentContainer = document.getElementById("drink");
        instructionsContainer.append(tempInstructions);
        cardContentContainer.append(instructionsContainer);
      }
    });
}

//add click event to the functions but not sure which one? getDrink or getIngredients?
var drinkButton = document.getElementById("cocktail");
drinkButton.addEventListener("click", getDrink);

// //displaying the recipes on the page

// //local storage-previous searches
// // localStorage.setItem(key, value).JSON.stringify(recipeArray);
// // console.log(recipeArray);
