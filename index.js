// Declare variables which are responsible for creating new elements and getting ui elements
let nameOfSortField = document.querySelector("#nameOfSort");
let sortByField = document.querySelector("#sortBy");
let sendFormDataButton = document.querySelector("#sendDataButton");
let resultField = document.querySelector("#resultField");
let chooseFilter = document.querySelector("#chooseFilter");
let formWrapper = document.querySelector(".form-wrapper");
const hiddenList = document.querySelector(".hidden-list");
const showList = document.querySelector("#show-list");

showList.addEventListener("click", function(){
    hiddenList.style.display = "block";
})

// Put listener to call result function
sendFormDataButton.addEventListener('click', Validation)

// Give data from JSON file
let conversionRules = {};
fetch("measureSystem.json")
    .then(response => response.json())
    .then(data => {
        conversionRules = data;
    })
    .catch(error => console.log(error));

setTimeout(()=>{
    console.log(conversionRules.data)
    conversionRules.data.forEach(item =>{
        hiddenList.innerHTML += `<div><b>${item.name}</b> - <span>${item.email}</span></div>`
    })
    hiddenList.innerHTML += '<button class="close-list">Close</button>';

    const closeList = document.querySelector(".close-list");

    closeList.addEventListener("click", function(){
        hiddenList.style.display = "none";
    })
},1000)


// Conditions which consist of filter
let conditions = {
    include: function (data, condition) {
        return data.data.filter(element => {
            for (let key in condition.include[0]) {
                if (element[key] != condition.include[0][key]) return false;
            }
            return true;
        })
    },
    exclude: function (data, condition) {
        return data.data.filter(element => {
            for (let key in condition.exclude[0]) {
                if (element[key] == condition.exclude[0][key]) return false;
            }
            return true;
        })
    },
    sortBy: function (data, condition) {
        return data.sort((a, b) => {
            for (let key in condition.sortBy[0]) {
                if (a[key] > b[key]) return 1;
                else return -1;
            }
        })
    }
}

// Function which filter data
function makeFilterOperations(data) {
    let condition = data.condition;
    for (let key in condition) {
        if (conditions.hasOwnProperty(key)) {
            data = conditions[key](data, condition)
        }
    }
    console.log({ result: [data] });
    resultField.innerHTML = '';
    data.forEach(el => { resultField.innerHTML += "<div>"; for (let obj in el) { resultField.innerHTML += `<span> ${obj}: ${el[obj]};</span>` } resultField.innerHTML += "</div>" });
}

function Validation() {
    if (nameOfSortField.value.length > 0 && sortByField.value.length > 0) {
        formWrapper.classList.remove("error");
        resultField.classList.remove("error");
        formWrapper.style = "";
        resultField.style = "";
        getFilterResult(nameOfSortField.value, sortByField.value);
    } else {
        formWrapper.classList.add("error");
        resultField.classList.add("error");
        formWrapper.style = "border: 1px solid red";
        resultField.style = "color: red";
        resultField.innerHTML = "You should enter value in every fields";
    }
}

// Function which calls on click and call another function to get result of filter
function getFilterResult(nameOfSortField, sortByField) {
    // 1. Main task 
    let inputData = { "data": conversionRules.data, "condition": { [chooseFilter.value]: [{ "name": nameOfSortField }], "sortBy": [sortByField] } };
    makeFilterOperations(inputData);
    // 2. Extension of app
    // makeFilterOperations({
    //     "data": [{ "user": "mike@mail.com", "rating": 20, "disabled": false },
    //     { "user": "greg@mail.com", "rating": 14, "disabled": false },
    //     { "user": "john@mail.com", "rating": 25, "disabled": true }],
    //     "condition": { [chooseFilter.value]: [{ "disabled": true }], "sortBy": [sortByField] }
    // })
}