const API_URL = "https://script.google.com/macros/s/AKfycbySpJoZ3UkphejN8QGmFr11mlFWwWjXD9Azrbir2mp0C5b7mFcjyVztcgbSgLLlvKAK/exec";
const SECRET_KEY = "my-secret-key"; 

const gallery = document.getElementById("gallery");

const listPage = document.getElementById("listPage");
const detailPage = document.getElementById("detailPage");
const formPage = document.getElementById("formPage");

let currentData = [];
let scrollPosition = 0;

// ✅ 데이터 불러오기
function loadGallery(){
    fetch(API_URL)
    .then(res => {
        if(!res.ok) throw new Error("API 오류");
        return res.json();
    })
    .then(data => {
        currentData = data;

        gallery.innerHTML = ""; // 🔥 중복 방지

        data.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${item.thumbnail}">
                <p>${item.title}</p>
            `;

            card.onclick = () => showDetail(index);
            gallery.appendChild(card);
        });
    })
    .catch(err => {
        console.error(err);
        gallery.innerHTML = "<p>데이터를 불러오지 못했습니다 😢</p>";
    });
}

loadGallery();


// ✅ 상세
function showDetail(index){
    const item = currentData[index];

    scrollPosition = window.scrollY;

    listPage.style.display="none";
    formPage.style.display="none";
    detailPage.style.display="block";

    document.getElementById("detailImage").src = item.image;
    document.getElementById("detailTitle").innerText = item.title;
    document.getElementById("detailDesc").innerText = item.desc;

    window.scrollTo(0,0);
    history.pushState({page:"detail"}, "", "");
}


// ✅ 문의 페이지 이동
function goForm(){
    scrollPosition = window.scrollY;

    listPage.style.display="none";
    detailPage.style.display="none";
    formPage.style.display="block";

    window.scrollTo(0,0);
    history.pushState({page:"form"}, "", "");
}


// ✅ 뒤로가기
function goBack(){
    detailPage.style.display="none";
    formPage.style.display="none";
    listPage.style.display="block";

    window.scrollTo(0, scrollPosition);
}


// ✅ 브라우저 뒤로가기
window.onpopstate = function(){
    goBack();
};


// ✅ 폼 제출
function submitForm(){
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const agree = document.getElementById("agree").checked;
    const msg = document.getElementById("formMsg");

    if(name === "" || phone === "" || !agree){
        msg.innerText = "모든 항목을 입력해주세요.";
        msg.style.color = "red";
        return;
    }

    // 🔥 중복 클릭 방지
    const btn = document.querySelector(".form-box button");
    btn.disabled = true;
    btn.innerText = "전송중...";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            name,
            phone,
            key: SECRET_KEY
        })
    })
    .then(res => res.text())
    .then(() => {
        msg.innerText = "제출 완료! 🎉";
        msg.style.color = "green";

        // 입력 초기화
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("agree").checked = false;
    })
    .catch(() => {
        msg.innerText = "오류 발생 😢";
        msg.style.color = "red";
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "제출하기";
    });
}
