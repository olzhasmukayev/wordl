let todaysWord = null;
let currentRow = 0;
const wordsSet = new Set();

window.onload = async () => {
    const words = await getWords();
    const want = Array.from(words).filter((elmt) => {
        return elmt.length == 5;
    });
    
    want.forEach((elt) => {
        wordsSet.add(elt);
    });

    const idx = Math.floor(Math.random() * want.length);
    todaysWord = want[idx];
    console.log(todaysWord);
}

async function getWords() {
    const words = await axios.get("../words/words.json").then((res) => {return res.data});
    return words;
}

function closeModalWindow() {
    const modalElement = document.querySelector(".window");
    modalElement.classList.add("window__hide");
    setInterval(() => {
        modalElement.classList.add("window__clear");
    }, 300);
}

function markTheWord(word, elems) {
    let matched = [];
    let include = [];
    if (wordsSet.has(word)) {
        Array.from(word).forEach((el, idx) => {
            if (el == todaysWord[idx]) {
                matched.push(elems[idx]);
            } else if (todaysWord.includes(el)) {
                include.push(elems[idx]);
            }
            elems[idx].setAttribute("disabled", "true");
        })
        include.forEach((el) => {
          el.style.backgroundColor = "#b59f3b";
        });
        matched.forEach((el) => {
          el.style.backgroundColor = "#538d4e";
        });
        if (matched.length == word.length) {
            alert("You Won!");
            location.reload();
        }
        return true;
    } else {
        return false;
    }
}

const elts = document.getElementsByClassName("col-inside");
Array.from(elts).forEach(function (elt, idx) {
  elt.addEventListener("keydown", function (event) {
    if (typeof elts[idx + 1] !== 'undefined' && elt.value.length == 1) {
        elts[idx + 1].focus();
    } else if (typeof elts[idx - 1] !== 'undefined' && (event.keyCode === 8 || event.keyCode === 46)) {
        elts[idx + 1].blur();
        elts[idx - 1].focus();
    }
  });
});   

Array.from(elts).forEach(function (elt, idx) {
  elt.addEventListener("keyup", function () {
    // for row check
    let start = 0 + currentRow * 5;
    let end = (elts.length / 6 - 1) + (currentRow * 5);
    let counter = 0;
    let userWord = "";
    let inpToChange = [];
    for (let i = start; i <= end; i++) {
        if (elts[i].value != '') {
            inpToChange.push(elts[i]);
            userWord += elts[i].value;
            counter++;
        }
    }
    if (counter == 5) {
        let flag = markTheWord(userWord, inpToChange);
        if (flag) {
            currentRow++;
            let start = 0 + currentRow * 5;
            let end = currentRow * 5 + 4;
            for (let i = start; i <= end; i++) {
                elts[i].disabled = false;
            }
            elts[idx + 1].focus();
        }
    }
  });
}); 
