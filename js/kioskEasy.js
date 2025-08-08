// Swiper 초기화
var swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },
});

// 장바구니 데이터, 객체
const cart = {};
const DISCOUNT_RATE = 0.1; // 10% 할인율

// HTML 요소 참조
const cartDisplay = document.querySelector("#cart");
const originalTotalDisplay = document.querySelector('#original-total'); //추가
const discountAmountDisplay = document.querySelector('#discount-amount'); //추가
const totalDisplay = document.querySelector("#total");

// 메뉴 카드 버튼 클릭 이벤트 추가 (DOM이 로드된 후)
document.addEventListener("DOMContentLoaded", () => {
    const menuCards = document.querySelectorAll(".menu-card-button");
    
    menuCards.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");

            // 가격에서 쉼표 제거 후 숫자로 변환
            const priceText = (button.getAttribute("data-price"));
            const price = Number(priceText.replace(/,/g, ""));

            // 장바구니 추가 또는 수량 증가
            if (cart[name]) {
                cart[name].count++;
            } else {
                cart[name] = { price, count: 1 };
            }

            // UI 업데이트
            updateCart(); // 외부에 선언된 함수콜링

            //시각적 피드백 - 버튼이 클릭되었음을 보여주기
            const menuCard = button.querySelector(".menu-card");
            menuCard.style.boxShadow = '0 0 0 3px #e74c3c'; // 클릭 시 테두리 강조
            setTimeout(() => {
                menuCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; // 0.5초 후 테두리 제거
            }, 300);
        });
    });
});

// 장바구니와 총액 업데이트
function updateCart() {
    cartDisplay.innerHTML = ""; // 변수 cartDisplay의 자식 태그구성을 공백으로 초기화
    let originalTotal = 0; // 원래 총액
    let discountedTotal = 0; // 할인 후 총액

    // 장바구니가 비어있는지 확인
    if (Object.keys(cart).length === 0) {
        cartDisplay.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
    } else {
        // 각 상품에 대한 장바구니 항목 생성
        for (const name in cart) {
            const { price, count } = cart[name];
            const itemTotal = price * count; // 해당 상품의 총액
            originalTotal += itemTotal; // 원가 합계에 추가

            const discountedItemTotal = itemTotal * (1 - DISCOUNT_RATE); // 할인된 가격
            discountedTotal += discountedItemTotal; // 할인된 총액에 추가

            // 장바구니 아이템 UI 생성
            const item = document.createElement("div");
            item.className = "cart-item";

            // 아이템 컨텐츠 구성
            item.innerHTML = `
                <div class="cart-item-name">${name}</div>
                <div class="cart-item-control">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-name="${name}">-</button>
                        <span>${count}</span>
                        <button class="quantity-btn plus" data-name="${name}">+</button>
                    </div>
                    <div class="cart-item-price">${Math.round(discountedItemTotal).toLocaleString()}원</div>
                    <button class="remove-btn" data-name="${name}">삭제</button>
                </div>
            `;
            cartDisplay.appendChild(item);
        }
    
        // 수량 조절 및 삭제 버튼 이벤트 추가
        setupCartControls();
    }

    // 합계 표시 업데이트
    originalTotalDisplay.textContent = originalTotal.toLocaleString();
    const discountAmount = originalTotal - discountedTotal;
    discountAmountDisplay.textContent = Math.round(discountAmount).toLocaleString();
    totalDisplay.textContent = Math.round(discountedTotal).toLocaleString();
}

// 장바구니 컨트롤(수량 조절, 삭제) 설정
function setupCartContronls() {
    //수량 감소 버튼 이벤트
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (cart[name].count > 1) {
                cart[name].count--;
            } else {
                delete cart[name]; // 수량이 0이면 항목 삭제
            }
            updateCart();
        });
    });

    // 수량 증가 버튼 이벤트
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            cart[name].count++;
            updateCart();
        });
    });

    // 삭제 버튼 이벤트
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            delete cart[name];
            updateCart();
        });
    });
}