// --- NAV & APP SHELL CONTROLS ---
const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');

function activatePanel(target) {
  navButtons.forEach((button) => button.classList.toggle('active', button.dataset.target === target));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === target));
  if (target === 'battlefield') document.getElementById('battlefieldCanvas').focus({ preventScroll: true });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => activatePanel(button.dataset.target));
});

document.getElementById('launchBattlefieldBtn').addEventListener('click', () => activatePanel('battlefield'));

// Summary Counters
const homeSummaryScore = document.getElementById('homeSummaryScore');
const schoolSummaryCount = document.getElementById('schoolSummaryCount');
const legoSummaryPieces = document.getElementById('legoSummaryPieces');

// --- FOOTBALL SIMULATION ENGINE (REALISTIC PHYSICS) ---
const teamNameInput = document.getElementById('teamNameInput');
const teamNameDisplay = document.getElementById('teamNameDisplay');
const scoreHome = document.getElementById('scoreHome');
const scoreAway = document.getElementById('scoreAway');
const downValue = document.getElementById('downValue');
const driveValue = document.getElementById('driveValue');
const quarterValue = document.getElementById('quarterValue');
const gameLog = document.getElementById('gameLog');
const ballMarker = document.getElementById('ballMarker');
const footballThreeCanvas = document.getElementById('footballThreeCanvas');
const footballDownDistance = document.getElementById('footballDownDistance');
const footballPlayPhase = document.getElementById('footballPlayPhase');
const footballFieldPosition = document.getElementById('footballFieldPosition');
const possessionValue = document.getElementById('possessionValue');
const momentumValue = document.getElementById('momentumValue');
const clockValue = document.getElementById('clockValue');
const rushYards = document.getElementById('rushYards');
const passYards = document.getElementById('passYards');
const energyValue = document.getElementById('energyValue');

const getHomeTeamName = () => teamNameInput.value.trim() || 'Blue Hawks';
const getOpponentName = () => 'Rivals';

// Football Realistic Physics & Play State
const gameState = {
  homeScore: 0,
  awayScore: 0,
  quarterScores: Array.from({ length: 4 }, () => ({ home: 0, away: 0 })),
  down: 1,
  yardsToGo: 10,
  drivePosition: 50, // 0 to 100 yard scale
  quarter: 1,
  clockSeconds: 180,
  rushYards: 0,
  passYards: 0,
  energy: 100, // Stamina system (0-100)
  fatigue: 0,  // Cumulative wear-and-tear
  momentum: 'Neutral',
  possession: 'home',
  lastPlay: null
};

let footballThree = null;

function resetDrive() {
  gameState.down = 1;
  gameState.yardsToGo = 10;
  gameState.drivePosition = 50;
}

function createFootballPlayerModel(team, number, role) {
  const isHome = team === 'home';
  const teamColor = isHome ? '#28503b' : '#882738';
  const jerseyMaterial = new THREE.MeshStandardMaterial({ color: teamColor, roughness: 0.78 });
  const padMaterial = new THREE.MeshStandardMaterial({ color: isHome ? '#304036' : '#493039', roughness: 0.86 });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: isHome ? '#e6e5dc' : '#d9d7ce', roughness: 0.88 });
  const helmetMaterial = new THREE.MeshStandardMaterial({ color: isHome ? '#e9e9e2' : '#dcb744', metalness: 0.12, roughness: 0.38 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#ae8062', roughness: 0.92 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#252a29', metalness: 0.24, roughness: 0.54 });
  const group = new THREE.Group();

  function addBox(material, size, position, parent = group) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addBar(start, end, radius, material, parent = group) {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = to.clone().sub(from);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 6), material);
    bar.position.copy(from).add(to).multiplyScalar(0.5);
    bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    bar.castShadow = true;
    parent.add(bar);
    return bar;
  }

  addBox(jerseyMaterial, [0.66, 0.7, 0.4], [0, 1.23, 0]);
  addBox(padMaterial, [0.92, 0.24, 0.52], [0, 1.47, 0]);
  addBox(pantsMaterial, [0.56, 0.3, 0.42], [0, 0.76, 0]);
  addBox(padMaterial, [0.16, 0.23, 0.44], [-0.31, 1.37, 0]);
  addBox(padMaterial, [0.16, 0.23, 0.44], [0.31, 1.37, 0]);

  // Player Mass/Weight and Velocity Physics Data
  const roleWeights = { QB: 100, RB: 98, WR: 90, C: 140, G: 145, T: 150, TE: 115, DE: 125, DT: 140, LB: 110, CB: 88, S: 95 };
  group.userData = {
    role,
    number,
    team,
    mass: roleWeights[role] || 100,
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    limbs: []
  };

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.14, 8), skinMaterial);
  neck.position.y = 1.64;
  group.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), skinMaterial);
  head.position.set(0, 1.82, 0.025);
  head.scale.set(0.84, 1.04, 0.82);
  head.castShadow = true;
  group.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), helmetMaterial);
  helmet.position.set(0, 1.91, 0);
  helmet.scale.set(1.12, 0.72, 1.02);
  helmet.castShadow = true;
  group.add(helmet);

  function addLimb(x, y, width, upperLength, lowerLength, material, arms = false) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    group.add(pivot);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.78, width, upperLength, 7), material);
    upper.position.y = -upperLength / 2;
    upper.castShadow = true;
    pivot.add(upper);
    const lowerPivot = new THREE.Group();
    lowerPivot.position.y = -upperLength + 0.02;
    pivot.add(lowerPivot);
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.72, width * 0.8, lowerLength, 7), material);
    lower.position.y = -lowerLength / 2;
    lower.castShadow = true;
    lowerPivot.add(lower);
    if (!arms) addBox(darkMaterial, [width * 1.15, 0.13, 0.32], [0, -lowerLength + 0.01, 0.1], lowerPivot);
    group.userData.limbs.push({ pivot, lowerPivot });
  }

  addLimb(-0.18, 0.68, 0.15, 0.38, 0.36, pantsMaterial);
  addLimb(0.18, 0.68, 0.15, 0.38, 0.36, pantsMaterial);
  addLimb(-0.39, 1.48, 0.12, 0.34, 0.34, jerseyMaterial, true);
  addLimb(0.39, 1.48, 0.12, 0.34, 0.34, jerseyMaterial, true);

  return group;
}

function initializeFootballThree() {
  if (!window.THREE) return;
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#111b20');
    scene.fog = new THREE.FogExp2('#293632', 0.0035);
    const camera = new THREE.PerspectiveCamera(48, 960 / 400, 0.1, 240);
    const renderer = new THREE.WebGLRenderer({ canvas: footballThreeCanvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(960, 400, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.HemisphereLight('#dbe6ef', '#18271d', 0.72));
    const floodLight = new THREE.DirectionalLight('#fff1d5', 1.45);
    floodLight.position.set(-18, 34, -12);
    floodLight.castShadow = true;
    scene.add(floodLight);

    // Turf Ground
    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(54, 120),
      new THREE.MeshStandardMaterial({ color: '#245a32', roughness: 0.96 })
    );
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    scene.add(field);

    // Scrimmage & First Down Markers
    const scrimmage = new THREE.Mesh(new THREE.BoxGeometry(53.6, 0.035, 0.18), new THREE.MeshBasicMaterial({ color: '#4797f0' }));
    const firstDownLine = new THREE.Mesh(new THREE.BoxGeometry(53.6, 0.026, 0.12), new THREE.MeshBasicMaterial({ color: '#f2c84b' }));
    scene.add(scrimmage, firstDownLine);

    // Ball with Physics Velocity Vector
    const football = new THREE.Group();
    const footballBody = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 9), new THREE.MeshStandardMaterial({ color: '#884c2e', roughness: 0.78 }));
    footballBody.scale.set(0.68, 0.62, 1.2);
    football.add(footballBody);
    football.userData = { velocity: new THREE.Vector3(0, 0, 0), spin: 0 };
    scene.add(football);

    // Formations
    const homeFormation = [
      { role: 'QB', number: 12, x: 0, z: -6 }, { role: 'RB', number: 25, x: -1.5, z: -8 },
      { role: 'C', number: 62, x: 0, z: 0 }, { role: 'G', number: 68, x: -1.5, z: 0 },
      { role: 'G', number: 65, x: 1.5, z: 0 }, { role: 'T', number: 74, x: -3, z: 0 },
      { role: 'T', number: 72, x: 3, z: 0 }, { role: 'TE', number: 87, x: 5, z: -0.5 },
      { role: 'WR', number: 11, x: -17, z: -1 }, { role: 'WR', number: 14, x: 17, z: -1 },
      { role: 'FB', number: 30, x: 1.3, z: -4.5 }
    ];
    const awayFormation = [
      { role: 'DE', number: 96, x: -5, z: 2 }, { role: 'DT', number: 91, x: -1.7, z: 2 },
      { role: 'DT', number: 94, x: 1.7, z: 2 }, { role: 'DE', number: 98, x: 5, z: 2 },
      { role: 'LB', number: 55, x: -4, z: 6 }, { role: 'LB', number: 52, x: 0, z: 5 },
      { role: 'LB', number: 58, x: 4, z: 6 }, { role: 'CB', number: 23, x: -15, z: 8 },
      { role: 'CB', number: 24, x: 15, z: 8 }, { role: 'S', number: 31, x: -7, z: 15 },
      { role: 'S', number: 22, x: 7, z: 15 }
    ];

    const homePlayers = homeFormation.map((p) => ({ ...p, model: createFootballPlayerModel('home', p.number, p.role) }));
    const awayPlayers = awayFormation.map((p) => ({ ...p, model: createFootballPlayerModel('away', p.number, p.role) }));
    homePlayers.forEach((p) => scene.add(p.model));
    awayPlayers.forEach((p) => scene.add(p.model));

    footballThree = {
      scene, camera, renderer, homePlayers, awayPlayers, football, scrimmage, firstDownLine
    };
    document.querySelector('.field-wrapper').classList.add('three-active');
  } catch (error) {
    footballThree = null;
    console.warn('3D football engine falling back to standard simulation.', error);
  }
}

function playAction(type) {
  if (gameState.clockSeconds <= 0) return;

  const homeTeamName = getHomeTeamName();
  const fatigueMultiplier = 1 - (gameState.fatigue * 0.003); // Performance degrades with fatigue
  const staminaCost = type === 'deep' ? 12 : type === 'run' ? 8 : 6;

  gameState.energy = Math.max(10, gameState.energy - staminaCost);
  gameState.fatigue = Math.min(100, gameState.fatigue + staminaCost * 0.4);

  // Realistic Ballistic Trajectory & Physics Run Play Evaluation
  let gain = 0;
  let turnover = false;

  if (type === 'run') {
    // Mass & momentum simulation: Power runs depend on stamina + line pushing power
    const linePush = (Math.random() * 6 - 1) * fatigueMultiplier;
    gain = Math.max(-2, Math.floor(linePush + Math.random() * 8));
    if (Math.random() < 0.04) turnover = true; // Fumble chance on heavy tackle collision
  } else if (type === 'pass' || type === 'deep') {
    // Air resistance, release velocity & passer pressure
    const passDistance = type === 'deep' ? 20 + Math.random() * 25 : 5 + Math.random() * 12;
    const accuracy = (0.85 - (type === 'deep' ? 0.25 : 0.05)) * fatigueMultiplier;
    
    if (Math.random() < accuracy) {
      gain = Math.floor(passDistance);
      gameState.passYards += gain;
    } else {
      gain = 0; // Incomplete pass
      if (Math.random() < (type === 'deep' ? 0.12 : 0.04)) turnover = true; // Interception
    }
  } else if (type === 'fieldGoal') {
    const distance = Math.max(0, 55 - gameState.drivePosition);
    const kickSuccess = Math.random() < Math.max(0.2, (0.88 - distance * 0.015) * fatigueMultiplier);
    if (kickSuccess) {
      addQuarterScore('home', 3);
      addLog(`Field goal successful from ${distance + 17} yards!`);
    } else {
      addLog('Field goal attempt missed wide.');
    }
    resetDrive();
    updateGameState();
    return;
  }

  if (turnover) {
    gameState.possession = 'away';
    addLog(`Turnover! The defense forces a takeaway.`);
    resetDrive();
  } else {
    gameState.drivePosition = Math.min(100, gameState.drivePosition + gain);
    gameState.yardsToGo = Math.max(0, gameState.yardsToGo - gain);
    if (gain > 0 && type === 'run') gameState.rushYards += gain;

    if (gameState.drivePosition >= 100) {
      addQuarterScore('home', 7);
      addLog(`TOUCHDOWN! ${homeTeamName} scores on a brilliant play!`);
      resetDrive();
    } else if (gameState.yardsToGo <= 0) {
      gameState.down = 1;
      gameState.yardsToGo = 10;
      addLog(`First Down! Gain of ${gain} yards.`);
    } else {
      gameState.down += 1;
      if (gameState.down > 4) {
        gameState.possession = 'away';
        addLog(`Turnover on downs! Defense halts the drive.`);
        resetDrive();
      } else {
        addLog(`Play completed for ${gain} yard(s).`);
      }
    }
  }

  gameState.clockSeconds = Math.max(0, gameState.clockSeconds - 14);
  gameState.lastPlay = { type, gain, startedAt: performance.now() };
  updateGameState();
}

function updateGameState() {
  const downLabelMap = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };
  teamNameDisplay.textContent = getHomeTeamName();
  scoreHome.textContent = gameState.homeScore;
  scoreAway.textContent = gameState.awayScore;
  downValue.textContent = `${downLabelMap[gameState.down] || '4th'} & ${gameState.yardsToGo}`;
  driveValue.textContent = `Yard ${gameState.drivePosition}`;
  quarterValue.textContent = `Q${gameState.quarter}`;
  clockValue.textContent = formatClock(gameState.clockSeconds);
  possessionValue.textContent = gameState.possession === 'home' ? getHomeTeamName() : getOpponentName();
  momentumValue.textContent = gameState.energy > 60 ? 'High' : gameState.energy > 30 ? 'Moderate' : 'Exhausted';
  rushYards.textContent = gameState.rushYards;
  passYards.textContent = gameState.passYards;
  energyValue.textContent = `${Math.round(gameState.energy)}%`;
  homeSummaryScore.textContent = `${gameState.homeScore} - ${gameState.awayScore}`;
}

function addQuarterScore(team, points) {
  gameState.quarterScores[gameState.quarter - 1][team] += points;
  gameState[team === 'home' ? 'homeScore' : 'awayScore'] += points;
}

function formatClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function addLog(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  gameLog.prepend(item);
  while (gameLog.children.length > 5) gameLog.removeChild(gameLog.lastChild);
}

document.querySelectorAll('.play-btn').forEach((btn) => {
  btn.addEventListener('click', () => playAction(btn.dataset.play));
});


// --- TACTICAL MILSIM SIMULATOR (REPLACING DELTA FORCE) ---
const battlefieldStorageKey = 'codemaster-battlefield-v2';
const battlefieldWeapons = [
  { id: 'rifle', name: 'M4A1 SpecOps', className: 'Assault Rifle', recoil: 1.8, velocity: 880, magazine: 30, reserve: 120, unlockXp: 0 },
  { id: 'smg', name: 'MP5A3 Tactical', className: 'SMG', recoil: 0.9, velocity: 400, magazine: 30, reserve: 150, unlockXp: 100 },
  { id: 'marksman', name: 'M24 SWS', className: 'Sniper Rifle', recoil: 4.5, velocity: 920, magazine: 5, reserve: 30, unlockXp: 300 },
  { id: 'shotgun', name: 'M4 Super 90', className: 'Shotgun', recoil: 5.2, velocity: 410, magazine: 8, reserve: 40, unlockXp: 500 }
];

const battlefieldDefault = {
  xp: 0,
  kills: 0,
  missions: 0,
  health: 100,
  headHp: 100,
  torsoHp: 100,
  legsHp: 100,
  stamina: 100,
  weight: 18, // Gear weight in kg
  ammo: 30,
  reserve: 120,
  credits: 0,
  weapon: 'rifle',
  log: ['Tactical deployment initiated. Stay low and watch vectors.']
};

let battlefieldState = loadBattlefieldState();
const battlefieldCanvas = document.getElementById('battlefieldCanvas');
const battlefieldContext = battlefieldCanvas.getContext('2d');
const sceneReticle = document.getElementById('sceneReticle');
const battlefieldKeys = new Set();
const battlefieldEnemies = [];
const battlefieldBullets = []; // Dynamic Ballistic Bullets
const operator = { x: 110, y: 240, angle: 0, speed: 180, shotCooldown: 0, recoilOffset: 0 };
const operatorAim = { x: 480, y: 240 };
const battlefieldWorld = { width: 960, height: 480 };

function loadBattlefieldState() {
  try {
    const saved = JSON.parse(localStorage.getItem(battlefieldStorageKey));
    return saved ? { ...battlefieldDefault, ...saved } : { ...battlefieldDefault };
  } catch {
    return { ...battlefieldDefault };
  }
}

function saveBattlefieldState() {
  localStorage.setItem(battlefieldStorageKey, JSON.stringify(battlefieldState));
}

function currentBattlefieldWeapon() {
  return battlefieldWeapons.find((w) => w.id === battlefieldState.weapon) || battlefieldWeapons[0];
}

function fireOperatorWeapon() {
  if (battlefieldState.health <= 0 || operator.shotCooldown > 0) return;
  if (battlefieldState.ammo <= 0) {
    document.getElementById('combatFeedback').textContent = 'Mag empty! Press R to reload.';
    return;
  }

  const weapon = currentBattlefieldWeapon();
  battlefieldState.ammo -= 1;
  operator.shotCooldown = 0.15;

  // Recoil impulse & ballistic deviation
  const recoilDeviation = (Math.random() - 0.5) * (weapon.recoil * 0.08);
  const fireAngle = operator.angle + recoilDeviation;

  // Ballistic Bullet Creation (Milsim trajectory & speed)
  battlefieldBullets.push({
    x: operator.x + Math.cos(fireAngle) * 15,
    y: operator.y + Math.sin(fireAngle) * 15,
    vx: Math.cos(fireAngle) * (weapon.velocity * 1.5),
    vy: Math.sin(fireAngle) * (weapon.velocity * 1.5),
    penetration: weapon.velocity > 700 ? 2 : 1,
    life: 1.2
  });

  operator.recoilOffset = weapon.recoil * 4;
  saveBattlefieldState();
  renderBattlefield();
}

function tickOperatorCombat(deltaTime) {
  if (!document.getElementById('battlefield').classList.contains('active')) return;

  // Movement speed modified by leg health & gear loadout weight
  const legFactor = battlefieldState.legsHp / 100;
  const weightPenalty = Math.max(0.5, 1 - battlefieldState.weight * 0.015);
  const effectiveSpeed = operator.speed * legFactor * weightPenalty;

  let moveX = 0;
  let moveY = 0;
  if (battlefieldKeys.has('KeyW') || battlefieldKeys.has('ArrowUp')) moveY -= 1;
  if (battlefieldKeys.has('KeyS') || battlefieldKeys.has('ArrowDown')) moveY += 1;
  if (battlefieldKeys.has('KeyA') || battlefieldKeys.has('ArrowLeft')) moveX -= 1;
  if (battlefieldKeys.has('KeyD') || battlefieldKeys.has('ArrowRight')) moveX += 1;

  if (moveX !== 0 || moveY !== 0) {
    const len = Math.hypot(moveX, moveY);
    operator.x = Math.max(20, Math.min(940, operator.x + (moveX / len) * effectiveSpeed * deltaTime));
    operator.y = Math.max(20, Math.min(460, operator.y + (moveY / len) * effectiveSpeed * deltaTime));
  }

  // Aiming angle calculation with recoil dampening
  operator.angle = Math.atan2(operatorAim.y - operator.y, operatorAim.x - operator.x);
  operator.shotCooldown = Math.max(0, operator.shotCooldown - deltaTime);
  operator.recoilOffset = Math.max(0, operator.recoilOffset - deltaTime * 20);

  // Ballistic Bullets Physics Update
  for (let i = battlefieldBullets.length - 1; i >= 0; i--) {
    const b = battlefieldBullets[i];
    b.x += b.vx * deltaTime;
    b.y += b.vy * deltaTime;
    b.life -= deltaTime;

    // Hit registration against enemies
    for (let j = battlefieldEnemies.length - 1; j >= 0; j--) {
      const e = battlefieldEnemies[j];
      if (Math.hypot(b.x - e.x, b.y - e.y) < e.radius) {
        battlefieldEnemies.splice(j, 1);
        battlefieldBullets.splice(i, 1);
        battlefieldState.kills += 1;
        battlefieldState.xp += 50;
        document.getElementById('combatFeedback').textContent = 'Target eliminated! +50 XP';
        break;
      }
    }

    if (b && (b.life <= 0 || b.x < 0 || b.x > 960 || b.y < 0 || b.y > 480)) {
      battlefieldBullets.splice(i, 1);
    }
  }

  // Spawn hostile contacts if sector is clear
  if (battlefieldEnemies.length === 0) {
    for (let k = 0; k < 3; k++) {
      battlefieldEnemies.push({
        x: 600 + Math.random() * 300,
        y: 80 + Math.random() * 320,
        radius: 14
      });
    }
  }
}

function drawBattlefield() {
  const bounds = battlefieldCanvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  battlefieldCanvas.width = bounds.width;
  battlefieldCanvas.height = bounds.height;

  const ctx = battlefieldContext;
  ctx.scale(bounds.width / battlefieldWorld.width, bounds.height / battlefieldWorld.height);

  // Terrain
  ctx.fillStyle = '#1c2826';
  ctx.fillRect(0, 0, battlefieldWorld.width, battlefieldWorld.height);

  // Bullets Rendering
  ctx.strokeStyle = '#ffe596';
  ctx.lineWidth = 2;
  battlefieldBullets.forEach((b) => {
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - b.vx * 0.02, b.y - b.vy * 0.02);
    ctx.stroke();
  });

  // Hostiles Rendering
  ctx.fillStyle = '#b84435';
  battlefieldEnemies.forEach((e) => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player Character Rendering
  ctx.save();
  ctx.translate(operator.x, operator.y);
  ctx.rotate(operator.angle);
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  // Weapon Barrel with Dynamic Recoil Position
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(10 - operator.recoilOffset, -3, 18, 6);
  ctx.restore();
}

function battlefieldFrame(timestamp) {
  tickOperatorCombat(0.016);
  drawBattlefield();
  requestAnimationFrame(battlefieldFrame);
}

document.addEventListener('keydown', (e) => {
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    battlefieldKeys.add(e.code);
  }
  if (e.code === 'KeyR') {
    const w = currentBattlefieldWeapon();
    const needed = w.magazine - battlefieldState.ammo;
    const reloadAmount = Math.min(needed, battlefieldState.reserve);
    battlefieldState.ammo += reloadAmount;
    battlefieldState.reserve -= reloadAmount;
    renderBattlefield();
  }
});

document.addEventListener('keyup', (e) => battlefieldKeys.delete(e.code));

battlefieldCanvas.addEventListener('pointermove', (e) => {
  const rect = battlefieldCanvas.getBoundingClientRect();
  operatorAim.x = ((e.clientX - rect.left) / rect.width) * battlefieldWorld.width;
  operatorAim.y = ((e.clientY - rect.top) / rect.height) * battlefieldWorld.height;
});

battlefieldCanvas.addEventListener('pointerdown', fireOperatorWeapon);

function renderBattlefield() {
  document.getElementById('ammoValue').textContent = battlefieldState.ammo;
  document.getElementById('reserveAmmo').textContent = battlefieldState.reserve;
  document.getElementById('healthValue').textContent = `${battlefieldState.health}%`;
  document.getElementById('operatorXp').textContent = `${battlefieldState.xp} XP`;
}

// Initialize Application Engine
initializeFootballThree();
updateGameState();
renderBattlefield();
requestAnimationFrame(battlefieldFrame);