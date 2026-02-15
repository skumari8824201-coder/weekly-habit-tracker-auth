let isLogin = false;
let currentUser = null;

function toggleAuth() {
    isLogin = !isLogin;
    document.getElementById("authTitle").innerText = isLogin ? "Login" : "Sign Up";
}

function handleAuth() {
    const user = username.value;
    const pass = password.value;

    if (!user || !pass) return alert("Fill all fields");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (isLogin) {
        if (!users[user] || users[user].password !== pass) {
            alert("Invalid credentials");
            return;
        }
    } else {
        if (users[user]) {
            alert("User already exists");
            return;
        }
        users[user] = { password: pass, habits: [] };
        localStorage.setItem("users", JSON.stringify(users));
    }

    currentUser = user;
    authContainer.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderHabits();
}

function logout() {
    location.reload();
}

function addHabit() {
    const input = habitInput.value;
    if (!input) return;

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].habits.push({
        name: input,
        days: Array(7).fill(false)
    });

    localStorage.setItem("users", JSON.stringify(users));
    habitInput.value = "";
    renderHabits();
}

function toggleDay(habitIndex, dayIndex) {
    let users = JSON.parse(localStorage.getItem("users"));
    let habit = users[currentUser].habits[habitIndex];

    habit.days[dayIndex] = !habit.days[dayIndex];

    localStorage.setItem("users", JSON.stringify(users));
    renderHabits();
}

function renderHabits() {
    const list = document.getElementById("habitList");
    list.innerHTML = "";

    let users = JSON.parse(localStorage.getItem("users"));
    let habits = users[currentUser].habits;

    habits.forEach((habit, hIndex) => {
        let completed = habit.days.filter(d => d).length;
        let percent = (completed / 7) * 100;
        let streak = calculateStreak(habit.days);

        let daysHTML = "";
        habit.days.forEach((done, dIndex) => {
            daysHTML += `
            <div class="day ${done ? 'completed' : ''}"
            onclick="toggleDay(${hIndex},${dIndex})">
            ${dIndex + 1}
            </div>`;
        });

        let div = document.createElement("div");
        div.className = "habit";
        div.innerHTML = `
            <strong>${habit.name}</strong>
            <div class="days">${daysHTML}</div>
            <div class="progress-bar">
                <div class="progress" style="width:${percent}%"></div>
            </div>
            <small>${completed}/7 completed | 🔥 Streak: ${streak}</small>
        `;
        list.appendChild(div);
    });
}

function calculateStreak(days) {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i]) streak++;
        else break;
    }
    return streak;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
