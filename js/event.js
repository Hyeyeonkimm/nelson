let btn1 = document.querySelector("#btn1");

btn1.addEventListener("click", () =>{
    console.log("버튼1이 클릭됨.");
});

// 함수선언
function greet(name){
    return 'Hello, ${name}!';
}