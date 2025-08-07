// 장바구니 데이터, 객체
const cart = {};
const DISCOUNT_RATE = 0.1; // 10% 할인율

// HTML 요소 참조
const menu = document.querySelector("#menu");
const cartDisplay = document.querySelector("#cart");
const originalTotalDisplay = document.querySelector('#original-total'); //추가
const discountAmountDisplay = document.querySelector('#discount-amount'); //추가
const totalDisplay = document.querySelector("#total");

// 메뉴 버튼 클릭 이벤트 추가
menu.addEventListener("click", (event) => {
    console.log(event.target.tagName);
    // 버튼 세개가 담겨있는 메뉴를 클릭했는데,
    // 니가 클릭한 그 위치(타겟)가 버튼이면 통과
    if (event.target.tagName === "BUTTON") {
        const name = event.target.getAttribute("data-name");
        // 그 타겟의 속성(data-name)좀 떼와, name에 할당해
        const price = Number(event.target.getAttribute("data-price")); // 숫자로 변환
        // 그 타켓의 속성(data-price)를 좀 떼와, price에 할당해


        // 장바구니 추가 또는 수량 증가, 삼항연산자 버전
        // cart[name] = cart[name] ? { price, count: cart[name].count + 1 } : { price, count: 1 };
        // 장바구니에 추가하거나 수량 증가, if문 버전

        // 객체 접근법: 1. 점표기법(객체명, 키이름) 2. 대괄호표기법(객체명[키이름])
        // 예시) cart.coffee  cart[coffee]
        // 위에 선언된 cart라는 객체에 접근을 할거야(초기값은 청)
        // 카트 현상황이 뭔지 모르겠으나, 내가 버튼을 눌러서 카트에 같은 상품이 있으면 갯수를 늘려주고 없으면 1개라고 표시해줘
        if (cart[name]) {
            cart[name].count++;
        } else {
            cart[name] = { price, count: 1 };
        }

        // UI 업데이트
        updateCart(); // 외부에 선언된 함수콜링
        console.log(cart); // 카트 현상태 보여줘
    }
});

// 장바구니와 총액 업데이트
function updateCart() {
    cartDisplay.innerHTML = ""; // 변수 cartDisplay의 자식 태그구성을 공백으로 초기화
    let originalTotal = 0; // 원래 총액
    let discountedTotal = 0; // 할인 후 총액 
    /**
     * 이 함수는 클릭
     * 그때마다 초기화를 해 버리면 오히려 비효율적이지 않나? 라는 생각을 할 수 있고
     * 이 방식은 비효율적인것이 맞습니다!
     * 스크립트가 모듈식으로 구성이 되어있다면 업데이트 된 조삭만 최신으로 유지하면 되거든요.
     * 그러한 모듈구성을 수월하게 만들어 주는것이 프레임 웨크이고
     * 프레임워크의 종류는 리맥트, 뷰 등등이 있는거다.
     */


    // for in 구문, 객체 안에서만 노는 반복문
    // 번외편) for of 구문, 배열 안에서만 노는 반복문 
    // cart라는 객체 안에서만 놀건데, 각 덩어리(메뉴)를 name이라는 변수로 부를게
    for (const name in cart) {
        const { price, count } = cart[name];
        // 구조 분해 할당을 함, 오른쪽의 값을 왼쪽의 구성으로 해체쇼
        // 값이 두개가 들어있는 상태라서 price와 count에 각각 할당 
        const itemTotal = price * count; //해당 상품의 총액
        originalTotal += itemTotal; // 원가 합계에 추가

        const discountedItemTotal = itemTotal * (1 - DISCOUNT_RATE); // 할인된 가격
        discountedTotal += discountedItemTotal; // 할인된 총액에 추가

        // 새로운 div 생성하여 상품 정보 표시
        const item = document.createElement("div");
       
        // 각 아이템에 마진 추가로 간격 넓히기
        item.style.marginBottom = "20px"; // 아이템 사이 간격 넓히기

        // 원가와 할인가 모두 표시 - 시각적 개선
        item.innerHTML = `${name} x${count} <br>
                           원가: <span style="text-decoration: line-through;">${itemTotal.toLocaleString()}원</span> <br><strong style="color: #e74c3c;">할인가: ${Math.round(discountedItemTotal).toLocaleString()}원</strong>`;


        cartDisplay.appendChild(item);
        // .appendChild(itme) 미리 만들어 둔 cartDisplay에 item을 자식으로 추가해줘
    }
    
    // 기존 합계 표시 업데이트(페이지 하단 부분)
    originalTotalDisplay.textContent = originalTotal.toLocaleString();
    const discountAmount = originalTotal - discountedTotal; //변수명 통일
    discountAmountDisplay.textContent = Math.round(discountAmount).toLocaleString(); // Math.round() 추가
    totalDisplay.textContent = Math.round(discountedTotal).toLocaleString(); // Math.round() 추가
}


