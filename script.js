let aw = document.querySelector(".add-btn");
let jojo = document.querySelector(".remove-btn");
let maincan = document.querySelector(".main-cont");
let MC = document.querySelector(".modal-cont");
let TAC = document.querySelector(".textarea-cont");
let allPrio = document.querySelectorAll(".priority-color");
let tolbox = document.querySelectorAll(".color");

let colar = ["lightpink", "lightblue", "lightgreen", "black"];
let modalllll = colar[colar.length - 1];

let addflg = false;
let remFlg = false;

let LOkClas = "fa-lock";
let unLOkClas = "fa-lock-open";

let TIKArr = [];

if(localStorage.getItem("jira_tickets")){
    //retrieve and display tickets
    TIKArr = JSON.parse(localStorage.getItem("jira_tickets"));
    TIKArr.forEach((ticketObj) =>{
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
    })
}

for(let i = 0 ;  i < tolbox.length ; i++){
    tolbox[i].addEventListener("click" , (e) =>{
        let currenttolbox = tolbox[i].classList[0];

        let filteredTickets = TIKArr.filter((ticketObj , idx) =>{
            return currenttolbox === ticketObj.ticketColor;
        })
        
        //Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        
        //Display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) =>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask , ticketObj.ticketID);
        })

    })
    tolbox[i].addEventListener("dblclick" , (e) =>{
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        TIKArr.forEach((ticketObj , idx) =>{
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })
}

//Listener for modal priority coloring
allPrio.forEach((ColorElem, idx) => {
    ColorElem.addEventListener("click", (e) => {
        allPrio.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        ColorElem.classList.add("border");

        modalllll = ColorElem.classList[0];
    })
})

aw.addEventListener("click", (e) => {
    //Display Modal
    //Generate ticket
    console.log("Vibhu");
    //addflg , true -> Modal Display
    //addflg , false -> Modal None;
    addflg = !addflg;
    if (addflg) {
        MC.style.display = "flex";
    } else {
        MC.style.display = "none";
    }
})

jojo.addEventListener("click", (e) => {
    remFlg = !remFlg;
    if(remFlg){
        removeBtn.classList.add("kn");
    }
    else{
        removeBtn.classList.remove("kn");
    }

})

MC.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter") {
        createTicket(modalllll, TAC.value);
        addflg = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class = "ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid"></i>
    </div>
    `;
    maincan.appendChild(ticketCont);

    // create Object of ticket and add to array 
    if(!ticketID) {
        
        TIKArr.push({ticketColor , ticketTask , ticketID : id});
        localStorage.setItem("jira_tickets",JSON.stringify(TIKArr));
    }

    handleRemoval(ticketCont ,id);
    handleLock(ticketCont , id);
    handleColor(ticketCont , id);
}

function handleRemoval(ticket , id) {
    //remFlg -> true -> remove
    ticket.addEventListener("click" , (e) =>{
        if(!remFlg) return ;
        
        let idx = getTicketIdx(id);
        //DB removal
        TIKArr.splice(idx , 1);
        let strTIKArr = JSON.stringify(TIKArr);
        localStorage.setItem("jira_tickets", strTIKArr);
        ticket.remove(); // UI removal
    })
}


function handleLock(ticket , id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if (ticketLock.classList.contains(LOkClas)) {
            ticketLock.classList.remove(LOkClas);
            ticketLock.classList.add(unLOkClas);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unLOkClas);
            ticketLock.classList.add(LOkClas);
            ticketTaskArea.setAttribute("contentedittable", "true");
        }
        //Modify data in localStorage (Ticket Task)
        TIKArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorag.setItem("jira_tickets",JSON.stringify(TIKArr));
    })
}

function handleColor(ticket ,id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // Get ticket index from the ticket array
        let ticketIdx = getTicketIdx(id);
        
        let currentTicketColor = ticketColor.classList[1];
        // get ticket color idx
        let currentTicketColorIdx = colar.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colar.length;
        let newTicketColor = colar[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //Modify data in localStorage  (priority color change)
        TIKArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets" , JSON.stringify(TIKArr));
    })  
}

function getTicketIdx(id) {
    let ticketIdx = TIKArr.findIndex((ticketObj) =>{
        return ticketObj.ticketID == id;
    })
    return ticketIdx;
}

function setModalToDefault(){
    MC.style.display = "none";
    TAC.value = "";
    allPrio.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPrio[allPrio.length - 1].classList.add("border");

}