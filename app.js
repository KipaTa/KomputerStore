const computersElement = document.getElementById("laptops")
const descriptionElemenent = document.getElementById("description")
const buyComputerElement = document.getElementById("buyButton")
const specsElement = document.getElementById("specs")

const balanceElement = document.getElementById("balance")
const loanButtonElement = document.getElementById("getLoanButton")
const outstandingLoanElement = document.getElementById("outstandingLoan")

const payElement = document.getElementById("pay")
const workButtonElement = document.getElementById("workButton")
const repayLoanButtonElement = document.getElementById("repayLoanButton")
const payBankButtonElement = document.getElementById("payBankButton")

let computers = []
let computerPrice = ""

let bankBalance = 200.0
let loanValue = 0.00
let hasLoan = false

let payBalance = 0.00



//bank features start
balanceElement.innerText = bankBalance
outstandingLoanElement.innerText = loanValue

const getLoan = () => {

    const loanPrompt = Number(window.prompt("Type the loan amount:"))

    if (bankBalance <= 0) {
        alert("Your bankBalance is 0. You can't get a loan")
    }
    else if (loanPrompt >= bankBalance * 2) {
        alert("The loan requested was too high")
    }
    else if (hasLoan){
        alert("You already have a loan. Pay it back first!")
    }
    else if (loanPrompt > 0){
        loanValue = loanPrompt
        bankBalance += loanValue
        outstandingLoanElement.innerText = "Outstanding loan: " + loanValue + "kr"
        balanceElement.innerText = bankBalance
        hasLoan = true
        outstandingLoanElement.hidden = false
        repayLoanVisible()  //Makes repayLoanButton visible  
    } else {
        alert("Something went wrong")
    }
}

loanButtonElement.addEventListener('click', getLoan)
//bank features stop

//work features start
payElement.innerText = payBalance

const work = () => {
    payBalance += 100
    payElement.innerText = payBalance
}

//Makes repayLoanButton visible 
const repayLoanVisible = () => {
    if (hasLoan) {
        repayLoanButtonElement.hidden = false
    }
}

//Pay loan by payBalance
const payLoan = () => {
    if (payBalance > 0 ) {
        if (payBalance < loanValue) {
        loanValue = loanValue - payBalance
        payBalance = 0
        outstandingLoanElement.innerText = "Outstanding loan: " + loanValue + "kr"
        } 
        else if (payBalance >= loanValue) {
            payBalance = payBalance - loanValue
            loanValue = 0
            hasLoan = false
            outstandingLoanElement.hidden = true
            repayLoanButtonElement.hidden = true

        } else {
            console.log("something is wrong")
        }

        payElement.innerText = payBalance
       
    } else {
        alert ("You need to work first!")
    }
}

//Transfer pay to bank, if has loan, 10% will go to loanpayment
const bankPay = () => {
    if (hasLoan) {
        const tenProcent = 0.1 * payBalance
        const ninetyProcent = 0.9 * payBalance

        if (tenProcent >= loanValue) {
            bankBalance = bankBalance + (payBalance-loanValue)
            loanValue = 0
            payBalance = 0
            hasLoan = false
            outstandingLoanElement.hidden = true
            repayLoanButtonElement.hidden = true
            balanceElement.innerText = bankBalance
        }
        else {
        loanValue = loanValue - tenProcent
        bankBalance = bankBalance + ninetyProcent
        payBalance = 0

        balanceElement.innerText = bankBalance
        outstandingLoanElement.innerText = "Outstanding loan: " + loanValue + "kr"
        
        }

    } else {
        bankBalance = bankBalance + payBalance
        payBalance = 0

        balanceElement.innerText = bankBalance
    }

    payElement.innerText = payBalance

}
 

payBankButtonElement.addEventListener('click', bankPay)
workButtonElement.addEventListener('click', work)
repayLoanButtonElement.addEventListener('click', payLoan)
//work fetures stop

// Laptop features start
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToList(computers))
//try/catch async/await?

//iterates available computers to dropdown list and displays first computers details
const addComputersToList = (computers) => {
    computers.forEach(x => addComputerToList(x))
    title.innerText = computers[0].title
    descriptionElemenent.innerText = computers[0].description
    image.src = "https://hickory-quilled-actress.glitch.me/" + computers[0].image
    price.innerText = computers[0].price + " KR"
    specsElement.innerText = getSpecs(computers[0])
    computerPrice = computers[0].price
}

const addComputerToList = (computer) => {
    const computerElement = document.createElement("option")
    computerElement.value = computer.id
    computerElement.appendChild(document.createTextNode(computer.title))
    computersElement.appendChild(computerElement)
}

//iterates list of computer specs to dispalyable format
const getSpecs = (computer) => { 
    let text = ""
    computer.specs.forEach(spec => text += spec + "\n")
    return text
}



//handles change of computer on the dropdown list and displays correct computer details on the screen
const handleComputerListChange = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    descriptionElemenent.innerText = selectedComputer.description
    specsElement.innerText = getSpecs(selectedComputer)
    title.innerText = selectedComputer.title
    image.src = "https://hickory-quilled-actress.glitch.me/" + selectedComputer.image
    price.innerText = selectedComputer.price + " NOK"
    computerPrice = selectedComputer.price
    
}

const buyComputer = () => {
    if (computerPrice <= bankBalance ) {
        bankBalance = bankBalance - computerPrice
        balanceElement.innerText = bankBalance
        alert("You are a owner of the new laptop!")
    } else {
        alert("Sorry, you can't afford the laptop")
    }
}

computersElement.addEventListener("change", handleComputerListChange)
buyComputerElement.addEventListener('click', buyComputer)


// Laptop features end