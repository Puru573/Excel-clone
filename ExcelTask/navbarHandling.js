let pageAction=document.querySelectorAll(".page-action");

pageAction.forEach((page)=>{
    page.addEventListener("click",(e)=>{
        let activePage=document.querySelector(".page-action.active");
        if(activePage){
            activePage.classList.remove("active");
        }
        page.classList.add("active");

    })
})
