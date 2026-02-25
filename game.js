// ============================================
// FISHING MASTER V3 - RIZKY'S EDITION
// Developed by RIZKY
// ============================================

// Game Variables
let money = 1000;
let bait = 50;
let fishCount = 0;
let level = 1;
let exp = 0;
let expToNextLevel = 100;
let luckyPoint = 0;
let gems = 0;
let spinLeft = 3;

// Stats Variables
let totalCasts = 0;
let totalFishCaught = 0;
let totalMoneyEarned = 0;
let legendaryFishCaught = 0;

// Equipment
let currentRod = 'basic';
let currentHook = 'basic';
let rods = {
    basic: { name: 'Basic Rod', power: 1.0, lucky: 0, owned: true },
    silver: { name: 'Silver Rod', power: 1.5, lucky: 10, owned: false, price: 500 },
    golden: { name: 'Golden Rod', power: 2.0, lucky: 25, owned: false, price: 1500 },
    diamond: { name: 'Diamond Rod', power: 3.0, lucky: 50, owned: false, price: 5000 },
    legendary: { name: 'Legendary Rod', power: 5.0, lucky: 100, owned: false, price: '100 Gems' }
};

let hooks = {
    basic: { name: 'Basic Hook', catchRate: 50, owned: true },
    sharp: { name: 'Sharp Hook', catchRate: 65, owned: false, price: 300 },
    barbed: { name: 'Barbed Hook', catchRate: 80, owned: false, price: 800 },
    magnetic: { name: 'Magnetic Hook', catchRate: 95, owned: false, price: 2000 }
};

// Fishing State
let isFishing = false;
let isFishBiting = false;
let fishStrength = 0;
let fishingTimer = null;
let fishPosition = { x: 0, y: 0 };
let bobberPosition = { x: 0, y: 0 };

// MOD Features
let godMode = false;
let infiniteSpin = false;
let rareFishOnly = false;
let particlesEnabled = true;

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fish Database
const fishTypes = [
    { name: 'Ikan Kecil', value: 10, exp: 5, rarity: 'common', color: '#87CEEB', size: 20 },
    { name: 'Ikan Mas', value: 25, exp: 10, rarity: 'common', color: '#FFD700', size: 25 },
    { name: 'Ikan Nila', value: 15, exp: 8, rarity: 'common', color: '#C0C0C0', size: 22 },
    { name: 'Gurame', value: 30, exp: 12, rarity: 'uncommon', color: '#8B4513', size: 28 },
    { name: 'Mujair', value: 20, exp: 9, rarity: 'common', color: '#A9A9A9', size: 23 },
    { name: 'Lele', value: 35, exp: 15, rarity: 'uncommon', color: '#2F4F4F', size: 30 },
    { name: 'Patin', value: 45, exp: 18, rarity: 'uncommon', color: '#696969', size: 32 },
    { name: 'Bawal', value: 50, exp: 20, rarity: 'rare', color: '#D3D3D3', size: 25 },
    { name: 'Kakap Merah', value: 75, exp: 30, rarity: 'rare', color: '#DC143C', size: 35 },
    { name: 'Kerapu', value: 100, exp: 40, rarity: 'rare', color: '#F4A460', size: 38 },
    { name: 'Tuna', value: 150, exp: 50, rarity: 'epic', color: '#1E90FF', size: 45 },
    { name: 'Marlin', value: 200, exp: 60, rarity: 'epic', color: '#4682B4', size: 50 }
];

const rareFish = fishTypes.filter(f => f.rarity === 'rare' || f.rarity === 'epic');
const legendaryFish = [
    { name: '🐉 Naga Laut', value: 1000, exp: 500, rarity: 'legendary', color: '#9400D3', size: 70 },
    { name: '🦈 Megalodon', value: 800, exp: 400, rarity: 'legendary', color: '#8B0000', size: 65 },
    { name: '👑 Ikan Mas Legendaris', value: 2000, exp: 1000, rarity: 'mythic', color: '#FFD700', size: 60 }
];

// Achievements
let achievements = {
    novice: { id: 'novice', name: 'Novice Fisher', desc: 'Tangkap 10 ikan', icon: '🎣', requirement: 10, reward: '+100 Uang', unlocked: false },
    angler: { id: 'angler', name: 'Skilled Angler', desc: 'Tangkap 50 ikan', icon: '🏆', requirement: 50, reward: '+500 Uang', unlocked: false },
    master: { id: 'master', name: 'Fishing Master', desc: 'Tangkap 100 ikan', icon: '👑', requirement: 100, reward: '+1000 Uang', unlocked: false },
    legendary: { id: 'legendary', name: 'Legendary Hunter', desc: 'Tangkap 10 ikan legendaris', icon: '🐉', requirement: 10, reward: 'Legendary Rod', unlocked: false },
    millionaire: { id: 'millionaire', name: 'Millionaire', desc: 'Kumpulkan 10.000 uang', icon: '💰', requirement: 10000, reward: 'Magnetic Hook', unlocked: false },
    lucky: { id: 'lucky', name: 'Lucky Player', desc: 'Dapatkan 100 lucky point', icon: '⭐', requirement: 100, reward: '+50 Lucky Point', unlocked: false },
    persistent: { id: 'persistent', name: 'Persistent', desc: 'Lakukan 500 kali pancingan', icon: '⚡', requirement: 500, reward: 'Infinity Bait', unlocked: false }
};

// Leaderboard data
let leaderboardData = [
    { name: 'RIZKY', fish: 999, legendary: 99, points: 50000 },
    { name: 'FISHER_KING', fish: 850, legendary: 75, points: 42000 },
    { name: 'PRO_ANGLER', fish: 720, legendary: 60, points: 36000 },
    { name: 'LEGEND_HUNTER', fish: 600, legendary: 45, points: 30000 },
    { name: 'LUCKY_PLAYER', fish: 500, legendary: 30, points: 25000 },
    { name: 'YOU', fish: 0, legendary: 0, points: 0, isPlayer: true }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    draw();
    initEventListeners();
    initLuckyWheel();
    updateLeaderboardStats();
    renderAchievements();
    
    console.log('%c🎣 FISHING MASTER V3 - RIZKY\'S EDITION', 'color: #ffd700; font-size: 16px;');
});

function initEventListeners() {
    document.getElementById('castBtn').addEventListener('click', castLine);
    document.getElementById('reelBtn').addEventListener('click', reelIn);
    document.getElementById('shopBtn').addEventListener('click', () => showModal('shopModal'));
    document.getElementById('luckyBtn').addEventListener('click', () => showModal('luckyModal'));
    document.getElementById('shopeefoodBtn').addEventListener('click', () => showModal('shopeefoodModal'));
    document.getElementById('modBtn').addEventListener('click', () => showModal('modModal'));
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

function showModal(id) { document.getElementById(id).style.display = 'block'; }

// ============================================
// GAME FUNCTIONS
// ============================================
function castLine() {
    if (bait <= 0) { showMessage('Umpan habis!', 'error'); return; }
    if (isFishing) return;
    
    bait--;
    totalCasts++;
    isFishing = true;
    document.getElementById('castBtn').disabled = true;
    document.getElementById('reelBtn').disabled = false;
    
    bobberPosition.x = Math.random() * (canvas.width - 150) + 75;
    bobberPosition.y = Math.random() * (canvas.height - 200) + 100;
    
    showMessage('🎣 Melempar pancing...', 'info');
    
    let biteTime = godMode ? 500 : (Math.random() * 3000 + 2000);
    
    fishingTimer = setTimeout(() => {
        if (isFishing) {
            isFishBiting = true;
            let rodPower = rods[currentRod].power;
            let luckyBonus = rods[currentRod].lucky + luckyPoint;
            let baseStrength = 30 + Math.random() * 70;
            fishStrength = baseStrength / (rodPower * (1 + luckyBonus/100));
            
            fishPosition.x = bobberPosition.x + (Math.random() * 100 - 50);
            fishPosition.y = bobberPosition.y + (Math.random() * 50 - 25);
            showMessage('🐟 Ikan menggigit!', 'success');
        }
    }, biteTime);
}

function reelIn() {
    if (!isFishing) return;
    clearTimeout(fishingTimer);
    
    if (isFishBiting) {
        let catchRate = hooks[currentHook].catchRate / 100;
        let rodBonus = rods[currentRod].power * 0.3;
        let luckyBonus = (rods[currentRod].lucky + luckyPoint) / 100;
        let totalCatchChance = catchRate + rodBonus + luckyBonus;
        
        if (godMode || Math.random() < totalCatchChance) {
            let caughtFish;
            let rand = Math.random();
            
            if (rareFishOnly) {
                caughtFish = rareFish[Math.floor(Math.random() * rareFish.length)];
            } else if (rand < 0.01 + luckyBonus/10) {
                caughtFish = legendaryFish[Math.floor(Math.random() * legendaryFish.length)];
                legendaryFishCaught++;
            } else if (rand < 0.1 + luckyBonus/5) {
                caughtFish = rareFish[Math.floor(Math.random() * rareFish.length)];
            } else {
                caughtFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
            }
            
            money += caughtFish.value;
            fishCount++;
            totalFishCaught++;
            totalMoneyEarned += caughtFish.value;
            
            if (caughtFish.rarity === 'legendary' || caughtFish.rarity === 'mythic') {
                luckyPoint += 10;
            }
            
            exp += caughtFish.exp;
            while (exp >= expToNextLevel) {
                level++;
                exp -= expToNextLevel;
                expToNextLevel = Math.floor(expToNextLevel * 1.5);
                luckyPoint += 5;
                showMessage(`🎉 LEVEL UP! Level ${level}!`, 'success');
            }
            
            showMessage(`✨ Dapat ${caughtFish.name}! +${caughtFish.value} uang!`, 'success');
            updateLeaderboardStats();
        } else {
            showMessage('😫 Ikan lepas!', 'error');
        }
    }
    
    isFishing = false;
    isFishBiting = false;
    document.getElementById('castBtn').disabled = false;
    document.getElementById('reelBtn').disabled = true;
    updateUI();
}

// ============================================
// POINT SYSTEM
// ============================================
function calculateTotalPoints() {
    let fishPoints = totalFishCaught * 10;
    let moneyPoints = Math.floor(totalMoneyEarned / 100);
    let legendaryPoints = legendaryFishCaught * 1000;
    let levelPoints = level * 500;
    
    return {
        total: fishPoints + moneyPoints + legendaryPoints + levelPoints,
        breakdown: { fishPoints, moneyPoints, legendaryPoints, levelPoints }
    };
}

function updateLeaderboardStats() {
    let points = calculateTotalPoints();
    
    document.getElementById('totalCasts').textContent = totalCasts;
    document.getElementById('totalFish').textContent = totalFishCaught;
    document.getElementById('totalMoney').textContent = totalMoneyEarned.toLocaleString();
    document.getElementById('totalPoints').textContent = points.total.toLocaleString();
    document.getElementById('legendaryCount').textContent = legendaryFishCaught;
    
    let breakdownHtml = `
        <div class="breakdown-item"><span>🐟 Ikan:</span><span>${points.breakdown.fishPoints}</span></div>
        <div class="breakdown-item"><span>💰 Uang:</span><span>${points.breakdown.moneyPoints}</span></div>
        <div class="breakdown-item"><span>🐉 Legendaris:</span><span>${points.breakdown.legendaryPoints}</span></div>
        <div class="breakdown-item"><span>⭐ Level:</span><span>${points.breakdown.levelPoints}</span></div>
        <div class="breakdown-item" style="border-top:1px solid #ffd700"><span>🏆 TOTAL:</span><span style="color:#ff6b6b">${points.total}</span></div>
    `;
    document.getElementById('pointBreakdown').innerHTML = breakdownHtml;
    
    leaderboardData[5] = { name: 'YOU', fish: totalFishCaught, legendary: legendaryFishCaught, points: points.total, isPlayer: true };
    let sorted = [...leaderboardData].sort((a, b) => b.points - a.points);
    let leaderboardHtml = '';
    for (let i = 0; i < sorted.length; i++) {
        let p = sorted[i];
        let rankClass = i === 0 ? 'rank-1' : (i === 1 ? 'rank-2' : (i === 2 ? 'rank-3' : ''));
        leaderboardHtml += `<tr class="${rankClass}"><td>${i+1}</td><td>${p.name} ${p.isPlayer ? '(YOU)' : ''}</td><td>${p.points}</td><td>${p.fish}</td><td>${p.legendary}</td></tr>`;
    }
    document.getElementById('leaderboardBody').innerHTML = leaderboardHtml;
    
    checkAchievements();
}

// ============================================
// ACHIEVEMENTS
// ============================================
function checkAchievements() {
    let unlockedCount = 0;
    if (totalFishCaught >= 10 && !achievements.novice.unlocked) unlockAchievement('novice');
    if (totalFishCaught >= 50 && !achievements.angler.unlocked) unlockAchievement('angler');
    if (totalFishCaught >= 100 && !achievements.master.unlocked) unlockAchievement('master');
    if (legendaryFishCaught >= 10 && !achievements.legendary.unlocked) unlockAchievement('legendary');
    if (totalMoneyEarned >= 10000 && !achievements.millionaire.unlocked) unlockAchievement('millionaire');
    if (luckyPoint >= 100 && !achievements.lucky.unlocked) unlockAchievement('lucky');
    if (totalCasts >= 500 && !achievements.persistent.unlocked) unlockAchievement('persistent');
    
    for (let id in achievements) if (achievements[id].unlocked) unlockedCount++;
    document.getElementById('achievementCount').textContent = `${unlockedCount}/7`;
    renderAchievements();
}

function unlockAchievement(id) {
    achievements[id].unlocked = true;
    switch(id) {
        case 'novice': money += 100; break;
        case 'angler': money += 500; break;
        case 'master': money += 1000; break;
        case 'legendary': rods.legendary.owned = true; break;
        case 'millionaire': hooks.magnetic.owned = true; break;
        case 'lucky': luckyPoint += 50; break;
        case 'persistent': bait = 9999; break;
    }
    showMessage(`🏆 ${achievements[id].name} Unlocked!`, 'success');
    updateUI();
}

function renderAchievements() {
    let html = '';
    for (let id in achievements) {
        let ach = achievements[id];
        let progress = 0;
        if (id.includes('novice') || id.includes('angler') || id.includes('master')) progress = (totalFishCaught / ach.requirement) * 100;
        else if (id === 'legendary') progress = (legendaryFishCaught / ach.requirement) * 100;
        else if (id === 'millionaire') progress = (totalMoneyEarned / ach.requirement) * 100;
        else if (id === 'lucky') progress = (luckyPoint / ach.requirement) * 100;
        else if (id === 'persistent') progress = (totalCasts / ach.requirement) * 100;
        
        html += `<div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
            <div class="achievement-progress"><div class="achievement-progress-bar" style="width:${Math.min(100,progress)}%"></div></div>
            <div class="achievement-reward">${ach.reward}</div>
        </div>`;
    }
    document.getElementById('achievementsGrid').innerHTML = html;
}

// ============================================
// DRAW FUNCTIONS
// ============================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Water
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Waves
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 150 + i * 40);
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.lineTo(x, 150 + i * 40 + Math.sin(x / 50 + Date.now() / 1000) * 10);
        }
        ctx.stroke();
    }
    
    if (isFishing) {
        drawFishingRod();
        drawBobber();
        if (isFishBiting) {
            drawFish();
            drawFishStrengthMeter();
        }
    }
    
    requestAnimationFrame(draw);
}

function drawFishingRod() {
    ctx.save();
    ctx.translate(100, 50);
    ctx.rotate(Math.PI / 6);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 20, 80);
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(20, 40);
    ctx.lineTo(150, -50);
    ctx.stroke();
    ctx.restore();
}

function drawBobber() {
    ctx.save();
    ctx.translate(bobberPosition.x, bobberPosition.y);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

function drawFish() {
    ctx.save();
    ctx.translate(fishPosition.x, fishPosition.y);
    ctx.rotate(Math.sin(Date.now() / 200) * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4444';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

function drawFishStrengthMeter() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(10, 10, 200, 20);
    ctx.fillStyle = fishStrength > 70 ? '#ff4444' : (fishStrength > 30 ? '#ffaa00' : '#00ff88');
    ctx.fillRect(10, 10, 200 * (fishStrength / 100), 20);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Kekuatan: ${Math.round(fishStrength)}%`, 15, 25);
}

// ============================================
// UI FUNCTIONS
// ============================================
function showMessage(text, type) {
    let msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type}`;
}

function updateUI() {
    document.getElementById('money').textContent = money;
    document.getElementById('bait').textContent = bait;
    document.getElementById('fishCount').textContent = fishCount;
    document.getElementById('level').textContent = level;
    document.getElementById('luckyPoint').textContent = luckyPoint;
    document.getElementById('spinLeft').textContent = spinLeft;
}

// ============================================
// ROD & HOOK SELECTION
// ============================================
function selectRod(rodId) {
    if (!rods[rodId].owned) { showMessage(`Beli ${rods[rodId].name} dulu!`, 'error'); return; }
    currentRod = rodId;
    document.querySelectorAll('.rod-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`rod${rodId.charAt(0).toUpperCase()+rodId.slice(1)}`).classList.add('selected');
    showMessage(`Pancing ${rods[rodId].name} dipilih!`, 'success');
}

function selectHook(hookId) {
    if (!hooks[hookId].owned) { showMessage(`Beli ${hooks[hookId].name} dulu!`, 'error'); return; }
    currentHook = hookId;
    document.querySelectorAll('.hook-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`hook${hookId.charAt(0).toUpperCase()+hookId.slice(1)}`).classList.add('selected');
    showMessage(`Mata kail ${hooks[hookId].name} dipilih!`, 'success');
}

// ============================================
// SHOP FUNCTIONS
// ============================================
function buyItem(item, amount, price) {
    if (money < price) { showMessage('Uang tidak cukup!', 'error'); return; }
    money -= price;
    if (item === 'bait') bait += amount;
    else if (item === 'superBait') { bait += amount; luckyPoint += 5; }
    else if (item === 'goldenRod') rods.golden.owned = true;
    else if (item === 'sharpHook') hooks.sharp.owned = true;
    updateUI();
    showMessage('✅ Pembelian berhasil!', 'success');
}

function buyShopeeFood(item) {
    showMessage('🔄 Memproses pesanan...', 'info');
    setTimeout(() => {
        if (item === 'burger') { bait += 20; luckyPoint += 5; }
        else if (item === 'sushi') { bait += 30; luckyPoint += 10; hooks.magnetic.owned = true; }
        else if (item === 'seafood') { bait += 50; luckyPoint += 20; rods.legendary.owned = true; }
        else if (item === 'fishing') { bait += 100; hooks.magnetic.owned = true; rods.legendary.owned = true; }
        updateUI();
        showMessage('✅ Pesanan berhasil!', 'success');
    }, 2000);
}

// ============================================
// LUCKY WHEEL
// ============================================
let spinWheel = null;
function initLuckyWheel() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (wheelCanvas) {
        spinWheel = new LuckyWheel(wheelCanvas);
        document.getElementById('spinBtn').addEventListener('click', spinLuckyWheel);
    }
}

function spinLuckyWheel() {
    if (spinLeft <= 0 && !infiniteSpin) { showMessage('Spin habis!', 'error'); return; }
    if (!infiniteSpin) spinLeft--;
    spinWheel.spin(applyLuckyPrize);
}

function applyLuckyPrize(prize) {
    if (prize.includes('1000 Uang')) money += 1000;
    else if (prize.includes('5000 Uang')) money += 5000;
    else if (prize.includes('50 Umpan')) bait += 50;
    else if (prize.includes('10 Gems')) gems += 10;
    else if (prize.includes('5 Lucky Point')) luckyPoint += 5;
    else if (prize.includes('Ikan Legendaris')) { money += 2000; luckyPoint += 20; }
    else if (prize.includes('Rainbow Rod')) rods.legendary.owned = true;
    else if (prize.includes('Zonk')) showMessage('😫 Zonk!', 'error');
    updateUI();
}

class LuckyWheel {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.prizes = ['💰 1000 Uang', '💰 5000 Uang', '🎣 50 Umpan', '💎 10 Gems', '⭐ 5 Lucky Point', '🦈 Ikan Legendaris', '🌈 Rainbow Rod', '❌ Zonk'];
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB347'];
        this.rotation = 0;
        this.draw();
    }
    
    draw() {
        let ctx = this.ctx;
        let width = this.canvas.width;
        let height = this.canvas.height;
        let centerX = width/2, centerY = height/2, radius = Math.min(width,height)/2 - 20;
        let anglePerPrize = (Math.PI*2)/this.prizes.length;
        
        ctx.clearRect(0,0,width,height);
        for (let i=0; i<this.prizes.length; i++) {
            let start = i*anglePerPrize + this.rotation;
            let end = (i+1)*anglePerPrize + this.rotation;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, start, end);
            ctx.closePath();
            ctx.fillStyle = this.colors[i];
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    spin(callback) {
        let spinTime = 3000;
        let startRotation = this.rotation;
        let targetRotation = startRotation + (Math.PI*2)*(10 + Math.random()*5);
        let startTime = Date.now();
        
        let animate = () => {
            let now = Date.now();
            let progress = Math.min((now-startTime)/spinTime, 1);
            this.rotation = startRotation + (targetRotation - startRotation) * (1 - Math.pow(1-progress, 3));
            this.draw();
            
            if (progress < 1) requestAnimationFrame(animate);
            else {
                let anglePerPrize = (Math.PI*2)/this.prizes.length;
                let normalized = this.rotation % (Math.PI*2);
                let index = Math.floor((normalized + anglePerPrize/2)/anglePerPrize) % this.prizes.length;
                callback(this.prizes[index]);
            }
        };
        animate();
    }
}

// ============================================
// MOD FUNCTIONS
// ============================================
function modMoney(amount) { money = amount; updateUI(); showMessage('💰 Uang di-set!', 'success'); }
function modBait(amount) { bait = amount; updateUI(); showMessage('🎣 Umpan di-set!', 'success'); }
function modLuckyPoint(amount) { luckyPoint = amount; updateUI(); showMessage('⭐ Lucky Point di-set!', 'success'); }
function unlockAllRods() { for (let r in rods) rods[r].owned = true; showMessage('🔓 Semua pancing terbuka!', 'success'); }
function unlockAllHooks() { for (let h in hooks) hooks[h].owned = true; showMessage('🔓 Semua mata kail terbuka!', 'success'); }
function toggleGodMode() { godMode = !godMode; showMessage(`👑 God Mode: ${godMode ? 'ON' : 'OFF'}`, 'success'); }
function toggleInfiniteSpin() { infiniteSpin = !infiniteSpin; showMessage(`🎰 Infinite Spin: ${infiniteSpin ? 'ON' : 'OFF'}`, 'success'); }
function spawnRareFish() { rareFishOnly = !rareFishOnly; showMessage(`🐉 Rare Fish Only: ${rareFishOnly ? 'ON' : 'OFF'}`, 'success'); }
// ============================================
// PERAHU & ALAT SELAM FUNCTIONS
// ============================================

// Render boats
function renderBoats() {
    let html = '';
    for (let boatId in boats) {
        let boat = boats[boatId];
        let isOwned = boat.owned;
        let isSelected = currentBoat === boatId;
        
        html += `
            <div class="boat-card ${isOwned ? 'owned' : ''} ${isSelected ? 'selected' : ''}" 
                 onclick="${isOwned ? `selectBoat('${boatId}')` : ''}" data-level="${boat.level}">
                <div class="boat-icon">${boat.image}</div>
                <div class="boat-name">${boat.name}</div>
                <div class="boat-desc">${boat.desc}</div>
                <div class="boat-stats-detail">
                    <span>⚡ ${boat.speed}x</span>
                    <span>📦 ${boat.capacity}</span>
                    <span>🌊 ${boat.depth}m</span>
                </div>
                ${!isOwned ? `<div class="boat-price">💰 ${boat.price.toLocaleString()}</div>` : ''}
                ${!isOwned ? 
                    `<button class="boat-buy-btn" onclick="buyBoat('${boatId}')">BELI</button>` : 
                    (isSelected ? '<span class="selected-badge">✓ DIPILIH</span>' : '')}
            </div>
        `;
    }
    document.getElementById('boatsGrid').innerHTML = html;
}

// Render diving gear
function renderGear() {
    let html = '';
    for (let gearId in divingGear) {
        let gear = divingGear[gearId];
        let isOwned = gear.owned;
        let isSelected = currentGear === gearId;
        
        html += `
            <div class="gear-card ${isOwned ? 'owned' : ''} ${isSelected ? 'selected' : ''}" 
                 onclick="${isOwned ? `selectGear('${gearId}')` : ''}">
                <div class="boat-icon">🥽</div>
                <div class="boat-name">${gear.name}</div>
                <div class="boat-desc">${gear.desc}</div>
                <div class="boat-stats-detail">
                    <span>👁️ ${gear.visibility}x</span>
                    <span>🌊 ${gear.depth}m</span>
                </div>
                ${!isOwned ? `<div class="boat-price">💰 ${gear.price.toLocaleString()}</div>` : ''}
                ${!isOwned ? 
                    `<button class="boat-buy-btn" onclick="buyGear('${gearId}')">BELI</button>` : 
                    (isSelected ? '<span class="selected-badge">✓ DIPILIH</span>' : '')}
            </div>
        `;
    }
    document.getElementById('gearGrid').html = html;
}

// Render Sultan Shop
function renderSultanShop() {
    let sultanItems = [
        { name: '💎 Fuel Refill', desc: 'Isi bahan bakar', price: 10000, icon: '⛽', action: 'refillFuel' },
        { name: '🫧 Oxygen Tank', desc: 'Isi oksigen', price: 5000, icon: '🫧', action: 'refillOxygen' },
        { name: '🔦 Underwater Light', desc: 'Penerangan 24 jam', price: 25000, icon: '🔦', action: 'buyLight' },
        { name: '🧲 Magnet Crane', desc: 'Ambil harta lebih mudah', price: 50000, icon: '🧲', action: 'buyMagnet' },
        { name: '🚁 Underwater Drone', desc: 'Cari harta otomatis', price: 100000, icon: '🚁', action: 'buyDrone' },
        { name: '💊 Sultan Pack', desc: 'Semua item + rod langka', price: 500000, icon: '👑', action: 'buySultanPack' }
    ];
    
    let html = '';
    sultanItems.forEach(item => {
        html += `
            <div class="sultan-item">
                <div class="sultan-item-icon">${item.icon}</div>
                <div class="sultan-item-name">${item.name}</div>
                <div class="sultan-item-desc">${item.desc}</div>
                <div class="sultan-item-price">💰 ${item.price.toLocaleString()}</div>
                <button class="sultan-item-btn" onclick="${item.action}()">BELI</button>
            </div>
        `;
    });
    document.getElementById('sultanItems').innerHTML = html;
}

// Select boat
function selectBoat(boatId) {
    if (boats[boatId].owned) {
        currentBoat = boatId;
        document.getElementById('currentBoatName').textContent = boats[boatId].name;
        renderBoats();
        showMessage(`🚤 Sekarang menggunakan ${boats[boatId].name}!`, 'success');
    }
}

// Select gear
function selectGear(gearId) {
    if (divingGear[gearId].owned) {
        currentGear = gearId;
        document.getElementById('currentGearName').textContent = divingGear[gearId].name;
        renderGear();
        showMessage(`🥽 Sekarang menggunakan ${divingGear[gearId].name}!`, 'success');
    }
}

// Buy boat
function buyBoat(boatId) {
    let boat = boats[boatId];
    if (money >= boat.price) {
        money -= boat.price;
        boat.owned = true;
        showMessage(`🚤 Selamat! Mendapatkan ${boat.name}!`, 'success');
        updateUI();
        renderBoats();
        createSultanEffect();
    } else {
        showMessage('💰 Uang tidak cukup!', 'error');
    }
}

// Buy gear
function buyGear(gearId) {
    let gear = divingGear[gearId];
    if (money >= gear.price) {
        money -= gear.price;
        gear.owned = true;
        showMessage(`🥽 Selamat! Mendapatkan ${gear.name}!`, 'success');
        updateUI();
        renderGear();
        createSultanEffect();
    } else {
        showMessage('💰 Uang tidak cukup!', 'error');
    }
}

// Diving functions
let isDiving = false;
let diveInterval = null;

function startDiving() {
    if (boatFuel <= 0) {
        showMessage('⛽ Bahan bakar habis!', 'error');
        return;
    }
    
    if (oxygenLevel <= 0) {
        showMessage('🫧 Oksigen habis!', 'error');
        return;
    }
    
    isDiving = true;
    document.getElementById('diveBtn').disabled = true;
    document.getElementById('surfaceBtn').disabled = false;
    document.getElementById('searchTreasureBtn').disabled = false;
    
    diveInterval = setInterval(() => {
        if (isDiving) {
            // Increase depth
            boatDepth = Math.min(boatDepth + 1, boats[currentBoat].depth);
            
            // Consume fuel and oxygen
            boatFuel = Math.max(boatFuel - 0.1, 0);
            oxygenLevel = Math.max(oxygenLevel - 0.2, 0);
            
            // Update UI
            updateDepthUI();
            
            // Check if dead
            if (boatFuel <= 0 || oxygenLevel <= 0) {
                emergencySurface();
            }
        }
    }, 1000);
    
    showMessage('🌊 Mulai menyelam!', 'success');
}

function surface() {
    isDiving = false;
    clearInterval(diveInterval);
    
    // Decrease depth
    let surfaceInterval = setInterval(() => {
        if (boatDepth > 0) {
            boatDepth = Math.max(boatDepth - 5, 0);
            updateDepthUI();
        } else {
            clearInterval(surfaceInterval);
            document.getElementById('diveBtn').disabled = false;
            document.getElementById('surfaceBtn').disabled = true;
            document.getElementById('searchTreasureBtn').disabled = true;
            showMessage('🏝️ Kembali ke permukaan', 'info');
        }
    }, 500);
}

function emergencySurface() {
    isDiving = false;
    clearInterval(diveInterval);
    showMessage('🚨 DARURAT! Muncul ke permukaan!', 'error');
    surface();
}

function updateDepthUI() {
    document.getElementById('boatDepth').textContent = Math.floor(boatDepth);
    document.getElementById('boatFuel').textContent = Math.floor(boatFuel);
    document.getElementById('oxygenLevel').textContent = Math.floor(oxygenLevel);
    
    let depthPercent = (boatDepth / boats[currentBoat].depth) * 100;
    document.getElementById('depthFill').style.width = depthPercent + '%';
    
    if (boatDepth >= 1000) {
        document.getElementById('depthText').textContent = 'Zona Sultan! 💎';
    } else if (boatDepth >= 500) {
        document.getElementById('depthText').textContent = 'Zona Legendaris! 👑';
    } else if (boatDepth >= 100) {
        document.getElementById('depthText').textContent = 'Zona Dalam! 🌊';
    } else {
        document.getElementById('depthText').textContent = 'Permukaan ☀️';
    }
    
    // Show treasure hints
    let availableTreasures = underwaterTreasures.filter(t => t.depth <= boatDepth);
    if (availableTreasures.length > 0) {
        let randomTreasure = availableTreasures[Math.floor(Math.random() * availableTreasures.length)];
        document.getElementById('treasureHint').innerHTML = 
            `💎 Ada ${randomTreasure.name} di kedalaman ${randomTreasure.depth}m!`;
    }
}

function searchTreasure() {
    if (!isDiving) {
        showMessage('Harus menyelam dulu!', 'error');
        return;
    }
    
    // Find treasures at current depth
    let possibleTreasures = underwaterTreasures.filter(t => t.depth <= boatDepth);
    
    if (possibleTreasures.length > 0) {
        // Chance based on gear visibility
        let visibility = divingGear[currentGear].visibility;
        let chance = Math.random() * 100;
        
        if (chance < 30 * visibility) {
            let treasure = possibleTreasures[Math.floor(Math.random() * possibleTreasures.length)];
            money += treasure.value;
            
            // Bonus for sultan gear
            if (currentGear === 'sultanGear') {
                money += treasure.value * 2;
            }
            
            showMessage(`✨ Menemukan ${treasure.name}! +${treasure.value} uang!`, 'success');
            
            // Special message for rare finds
            if (treasure.rarity === 'sultan' || treasure.rarity === 'godly') {
                showMessage(`👑 SELAMAT! Menemukan harta Sultan!`, 'success');
                createSultanEffect();
            }
        } else {
            showMessage('😕 Tidak menemukan apa-apa...', 'info');
        }
    }
    
    // Consume oxygen
    oxygenLevel = Math.max(oxygenLevel - 5, 0);
    updateDepthUI();
    updateUI();
}

// Sultan Shop functions
function refillFuel() {
    if (money >= 10000) {
        money -= 10000;
        boatFuel = 100;
        showMessage('⛽ Bahan bakar full!', 'success');
        updateUI();
        updateDepthUI();
    }
}

function refillOxygen() {
    if (money >= 5000) {
        money -= 5000;
        oxygenLevel = 100;
        showMessage('🫧 Oksigen full!', 'success');
        updateUI();
        updateDepthUI();
    }
}

function buyLight() {
    if (money >= 25000) {
        money -= 25000;
        divingGear.nightVision.owned = true;
        showMessage('🔦 Night Vision unlocked!', 'success');
        renderGear();
        updateUI();
    }
}

function buyMagnet() {
    if (money >= 50000) {
        money -= 50000;
        // Permanent boost
        showMessage('🧲 Magnet Crane aktif! Treasure chance +20%', 'success');
        updateUI();
    }
}

function buyDrone() {
    if (money >= 100000) {
        money -= 100000;
        divingGear.underwaterDrone.owned = true;
        showMessage('🚁 Underwater Drone unlocked!', 'success');
        renderGear();
        updateUI();
    }
}

function buySultanPack() {
    if (money >= 500000) {
        money -= 500000;
        
        // Unlock all sultan items
        divingGear.sultanGear.owned = true;
        boats.luxurySubmarine.owned = true;
        gems += 100;
        luckyPoint += 200;
        bait += 500;
        
        showMessage('👑 SELAMAT! Menjadi Sultan! Semua item terbuka!', 'success');
        createSultanEffect();
        renderBoats();
        renderGear();
        updateUI();
    }
}

function createSultanEffect() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createParticle(canvas.width/2, canvas.height/2);
        }, i * 20);
    }
}

// Initialize boat and gear
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    renderBoats();
    renderGear();
    renderSultanShop();
    
    // Set initial depth UI
    updateDepthUI();
});