let secretNumber;
let attempts;

function startGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById("result").innerText = "";
    document.getElementById("attempts").innerText = "";

    let userGuess;
    let validInput = false;

    while (!validInput) {
        userGuess = prompt("請輸入你的猜測（1-100）：");

        if (userGuess === null) {
            alert("遊戲已取消。");
            return;
        }

        userGuess = parseInt(userGuess);
        attempts++;

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            alert("請輸入 1 到 100 的數字！");
        } else {
            validInput = true;
            if (userGuess < secretNumber) {
                document.getElementById("result").innerText = "再大一點！";
            } else if (userGuess > secretNumber) {
                document.getElementById("result").innerText = "再小一點！";
            } else {
                document.getElementById("result").innerText = "恭喜你！猜對了！";
                document.getElementById("attempts").innerText = `你總共猜了 ${attempts} 次。`;
            }
        }
    }
}

document.getElementById("startGame").addEventListener("click", startGame);