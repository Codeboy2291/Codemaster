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

const homeSummaryScore = document.getElementById('homeSummaryScore');
const schoolSummaryCount = document.getElementById('schoolSummaryCount');
const legoSummaryPieces = document.getElementById('legoSummaryPieces');

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

const assignmentNameInput = document.getElementById('assignmentName');
const assignmentSubjectInput = document.getElementById('assignmentSubject');
const assignmentDueInput = document.getElementById('assignmentDue');
const assignmentPrioritySelect = document.getElementById('assignmentPriority');
const addAssignmentBtn = document.getElementById('addAssignmentBtn');
const assignmentList = document.getElementById('assignmentList');
const taskCount = document.getElementById('taskCount');
const nextTaskName = document.getElementById('nextTaskName');
const studyHours = document.getElementById('studyHours');
const gpaValue = document.getElementById('gpaValue');

const agendaDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const agendaDaysContainer = document.getElementById('agendaDays');
const agendaList = document.getElementById('agendaList');
const addAgendaBtn = document.getElementById('addAgendaBtn');
const agendaForm = document.getElementById('agendaForm');
const agendaTitleInput = document.getElementById('agendaTitle');
const agendaTimeInput = document.getElementById('agendaTime');
const agendaTypeSelect = document.getElementById('agendaType');
const saveAgendaBtn = document.getElementById('saveAgendaBtn');
const schoolAgenda = {
  Monday: [
    { id: 1, title: 'Algebra review', time: '08:30', type: 'Study', done: false },
    { id: 2, title: 'History essay', time: '16:00', type: 'Assignment', done: false }
  ],
  Tuesday: [
    { id: 3, title: 'Science lab prep', time: '09:00', type: 'Study', done: true },
    { id: 4, title: 'Track club', time: '15:45', type: 'Club', done: false }
  ],
  Wednesday: [
    { id: 5, title: 'Math quiz', time: '10:15', type: 'Exam', done: false }
  ],
  Thursday: [
    { id: 6, title: 'Reading notes', time: '07:45', type: 'Study', done: false }
  ],
  Friday: [
    { id: 7, title: 'Project check-in', time: '12:30', type: 'Assignment', done: false },
    { id: 8, title: 'Movie break', time: '19:00', type: 'Break', done: false }
  ],
  Saturday: [
    { id: 9, title: 'Homework sprint', time: '11:00', type: 'Study', done: false }
  ],
  Sunday: [
    { id: 10, title: 'Weekly reset', time: '18:00', type: 'Break', done: false }
  ]
};
let selectedAgendaDay = 'Monday';

const buildIdeaInput = document.getElementById('buildIdeaInput');
const themeSelect = document.getElementById('themeSelect');
const pieceRange = document.getElementById('pieceRange');
const pieceValue = document.getElementById('pieceValue');
const addSetBtn = document.getElementById('addSetBtn');
const builderList = document.getElementById('builderList');
const designSummary = document.getElementById('designSummary');
const designPreview = document.getElementById('designPreview');
const setTotalCost = document.getElementById('setTotalCost');
const colorSwatches = document.querySelectorAll('.color-swatch');

const gameState = {
  homeScore: 0,
  awayScore: 0,
  quarterScores: Array.from({ length: 4 }, () => ({ home: 0, away: 0 })),
  down: 1,
  yardsToGo: 10,
  drivePosition: 50,
  quarter: 1,
  clockSeconds: 180,
  rushYards: 0,
  passYards: 0,
  energy: 82,
  momentum: 'Balanced',
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

  const numberCanvas = document.createElement('canvas');
  numberCanvas.width = 128;
  numberCanvas.height = 96;
  const numberContext = numberCanvas.getContext('2d');
  numberContext.clearRect(0, 0, 128, 96);
  numberContext.font = '900 76px Arial, sans-serif';
  numberContext.textAlign = 'center';
  numberContext.textBaseline = 'middle';
  numberContext.lineWidth = 6;
  numberContext.strokeStyle = isHome ? '#172820' : '#56202b';
  numberContext.strokeText(String(number), 64, 49);
  numberContext.fillStyle = '#fffdf4';
  numberContext.fillText(String(number), 64, 49);
  const numberTexture = new THREE.CanvasTexture(numberCanvas);
  if ('encoding' in numberTexture && THREE.sRGBEncoding) numberTexture.encoding = THREE.sRGBEncoding;
  const numberMaterial = new THREE.MeshBasicMaterial({ map: numberTexture, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const chestNumber = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.25), numberMaterial);
  chestNumber.position.set(0, 1.25, 0.205);
  group.add(chestNumber);
  const backNumber = chestNumber.clone();
  backNumber.position.z = -0.205;
  backNumber.rotation.y = Math.PI;
  group.add(backNumber);

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
  addBar([-0.23, 1.82, 0.13], [0.23, 1.82, 0.13], 0.025, darkMaterial);
  addBar([-0.23, 1.82, 0.13], [-0.12, 1.64, 0.13], 0.022, darkMaterial);
  addBar([0.23, 1.82, 0.13], [0.12, 1.64, 0.13], 0.022, darkMaterial);
  addBar([-0.12, 1.64, 0.13], [0.12, 1.64, 0.13], 0.022, darkMaterial);

  const limbs = [];
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
    if (arms) addBar([0, -lowerLength + 0.02, 0], [0, -lowerLength - 0.09, 0.02], 0.085, skinMaterial, lowerPivot);
    else addBox(darkMaterial, [width * 1.15, 0.13, 0.32], [0, -lowerLength + 0.01, 0.1], lowerPivot);
    limbs.push({ pivot, lowerPivot });
  }

  addLimb(-0.18, 0.68, 0.15, 0.38, 0.36, pantsMaterial);
  addLimb(0.18, 0.68, 0.15, 0.38, 0.36, pantsMaterial);
  addLimb(-0.39, 1.48, 0.12, 0.34, 0.34, jerseyMaterial, true);
  addLimb(0.39, 1.48, 0.12, 0.34, 0.34, jerseyMaterial, true);

  group.userData.role = role;
  group.userData.number = number;
  group.userData.limbs = limbs;
  group.userData.team = team;
  return group;
}

function initializeFootballThree() {
  if (!window.THREE) return;
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#111b20');
    scene.fog = new THREE.FogExp2('#293632', 0.0035);
    const camera = new THREE.PerspectiveCamera(48, 960 / 400, 0.1, 240);
    const renderer = new THREE.WebGLRenderer({ canvas: footballThreeCanvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(960, 400, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.84;
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    scene.add(new THREE.HemisphereLight('#dbe6ef', '#18271d', 0.72));
    const floodLight = new THREE.DirectionalLight('#fff1d5', 1.45);
    floodLight.position.set(-18, 34, -12);
    floodLight.castShadow = true;
    floodLight.shadow.mapSize.set(1024, 1024);
    floodLight.shadow.camera.left = -34;
    floodLight.shadow.camera.right = 34;
    floodLight.shadow.camera.top = 44;
    floodLight.shadow.camera.bottom = -44;
    scene.add(floodLight);

    const fieldTextureCanvas = document.createElement('canvas');
    fieldTextureCanvas.width = 512;
    fieldTextureCanvas.height = 1024;
    const fieldContext = fieldTextureCanvas.getContext('2d');
    fieldContext.fillStyle = '#245a32';
    fieldContext.fillRect(0, 0, 512, 1024);
    for (let stripe = 0; stripe < 16; stripe += 1) {
      fieldContext.fillStyle = stripe % 2 ? 'rgba(186,211,142,.045)' : 'rgba(5,27,14,.11)';
      fieldContext.fillRect(0, stripe * 64, 512, 64);
    }
    for (let index = 0; index < 2500; index += 1) {
      fieldContext.fillStyle = index % 2 ? 'rgba(185,204,143,.08)' : 'rgba(8,38,17,.12)';
      fieldContext.fillRect((index * 79) % 512, (index * 139) % 1024, 1 + (index % 2), 2);
    }
    const fieldTexture = new THREE.CanvasTexture(fieldTextureCanvas);
    if ('encoding' in fieldTexture && THREE.sRGBEncoding) fieldTexture.encoding = THREE.sRGBEncoding;
    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(54, 120),
      new THREE.MeshStandardMaterial({ map: fieldTexture, roughness: 0.96 })
    );
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    scene.add(field);

    const homeEndzone = new THREE.Mesh(new THREE.PlaneGeometry(54, 10), new THREE.MeshStandardMaterial({ color: '#173b30', roughness: 0.9 }));
    homeEndzone.rotation.x = -Math.PI / 2;
    homeEndzone.position.set(0, 0.012, -55);
    scene.add(homeEndzone);
    const awayEndzone = new THREE.Mesh(new THREE.PlaneGeometry(54, 10), new THREE.MeshStandardMaterial({ color: '#81293b', roughness: 0.9 }));
    awayEndzone.rotation.x = -Math.PI / 2;
    awayEndzone.position.set(0, 0.012, 55);
    scene.add(awayEndzone);

    function createEndzoneLabel(text, backgroundColor) {
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 768;
      labelCanvas.height = 160;
      const labelContext = labelCanvas.getContext('2d');
      labelContext.fillStyle = backgroundColor;
      labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelContext.strokeStyle = 'rgba(255,255,255,.74)';
      labelContext.lineWidth = 8;
      labelContext.strokeRect(10, 10, labelCanvas.width - 20, labelCanvas.height - 20);
      labelContext.fillStyle = '#fffdf0';
      labelContext.font = '900 88px Arial, sans-serif';
      labelContext.textAlign = 'center';
      labelContext.textBaseline = 'middle';
      labelContext.fillText(text.toUpperCase().slice(0, 18), labelCanvas.width / 2, labelCanvas.height / 2, 690);
      const texture = new THREE.CanvasTexture(labelCanvas);
      if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 5), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(0, 0.035, text === getHomeTeamName() ? -55 : 55);
      scene.add(mesh);
      return { canvas: labelCanvas, context: labelContext, texture, mesh, text };
    }
    const homeEndzoneLabel = createEndzoneLabel(getHomeTeamName(), '#173b30');
    const awayEndzoneLabel = createEndzoneLabel('Rivals', '#81293b');

    const lineMaterial = new THREE.MeshBasicMaterial({ color: '#e7eadb', transparent: true, opacity: 0.78 });
    for (let yard = -50; yard <= 50; yard += 5) {
      const yardLine = new THREE.Mesh(new THREE.BoxGeometry(53.5, 0.018, yard % 10 === 0 ? 0.14 : 0.08), lineMaterial);
      yardLine.position.set(0, 0.03, yard);
      scene.add(yardLine);
    }
    const hashMaterial = new THREE.MeshBasicMaterial({ color: '#d6ddc9', transparent: true, opacity: 0.56 });
    const hashMarks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 0.015, 0.75), hashMaterial, 400);
    const hashTransform = new THREE.Object3D();
    let hashIndex = 0;
    for (let yard = -49; yard <= 49; yard += 1) {
      if (yard % 5 === 0) continue;
      [-7.5, 7.5].forEach((x) => {
        hashTransform.position.set(x, 0.03, yard);
        hashTransform.updateMatrix();
        hashMarks.setMatrixAt(hashIndex, hashTransform.matrix);
        hashIndex += 1;
      });
    }
    hashMarks.count = hashIndex;
    scene.add(hashMarks);

    function addFieldNumber(text, x, z, rotation = 0) {
      const numberCanvas = document.createElement('canvas');
      numberCanvas.width = 128;
      numberCanvas.height = 96;
      const context = numberCanvas.getContext('2d');
      context.fillStyle = 'rgba(15,45,24,.76)';
      context.fillRect(0, 0, 128, 96);
      context.strokeStyle = 'rgba(235,242,216,.65)';
      context.lineWidth = 4;
      context.strokeRect(3, 3, 122, 90);
      context.fillStyle = '#f4f2e6';
      context.font = 'bold 70px Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 64, 49);
      const texture = new THREE.CanvasTexture(numberCanvas);
      if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
      const label = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }));
      label.rotation.x = -Math.PI / 2;
      label.rotation.z = rotation;
      label.position.set(x, 0.04, z);
      scene.add(label);
    }
    for (let yard = -40; yard <= 40; yard += 10) {
      const label = String(Math.abs(yard));
      addFieldNumber(label, -21.5, yard, Math.PI);
      addFieldNumber(label, 21.5, yard, 0);
    }

    const goalMaterial = new THREE.MeshStandardMaterial({ color: '#f0bd43', metalness: 0.35, roughness: 0.38 });
    [-57, 57].forEach((z) => {
      const post = new THREE.Group();
      function goalPart(size, position) {
        const part = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, size[1], 8), goalMaterial);
        part.position.set(...position);
        post.add(part);
        return part;
      }
      goalPart([0.1, 8.5, 0.1], [0, 4.25, 0]);
      goalPart([0.1, 5.5, 0.1], [-2.7, 9.5, 0]);
      goalPart([0.1, 5.5, 0.1], [2.7, 9.5, 0]);
      const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.5, 8), goalMaterial);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.position.set(0, 6.8, 0);
      post.add(crossbar);
      post.position.z = z;
      scene.add(post);
    });

    const standMaterial = new THREE.MeshStandardMaterial({ color: '#303a38', roughness: 0.92 });
    [-1, 1].forEach((side) => {
      for (let tier = 0; tier < 5; tier += 1) {
        const row = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.48, 116), new THREE.MeshStandardMaterial({ color: tier % 2 ? '#535850' : '#454c49', roughness: 0.92 }));
        row.position.set(side * (31.5 + tier * 1.35), 0.8 + tier * 1.12, 0);
        row.receiveShadow = true;
        scene.add(row);
      }
    });
    const crowdMaterial = new THREE.MeshStandardMaterial({ color: '#aab1a6', roughness: 0.94 });
    const crowdGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.6, 5);
    const crowd = new THREE.InstancedMesh(crowdGeometry, crowdMaterial, 2200);
    const crowdTransform = new THREE.Object3D();
    const crowdColors = ['#702d34', '#d8d2c0', '#234652', '#a37c49', '#2e493e', '#76827d', '#992f31'];
    let fanCount = 0;
    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < 5; row += 1) {
        for (let seat = 0; seat < 220; seat += 1) {
          const z = -54 + (seat / 219) * 108;
          const x = side * (28.2 + row * 1.05 + Math.sin(seat * 2.1 + row) * 0.18);
          crowdTransform.position.set(x, 1.5 + row * 1.12, z);
          crowdTransform.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
          crowdTransform.updateMatrix();
          crowd.setMatrixAt(fanCount, crowdTransform.matrix);
          crowd.setColorAt(fanCount, new THREE.Color(crowdColors[(seat * 13 + row * 7) % crowdColors.length]));
          fanCount += 1;
        }
      }
    }
    crowd.count = fanCount;
    crowd.instanceMatrix.needsUpdate = true;
    if (crowd.instanceColor) crowd.instanceColor.needsUpdate = true;
    scene.add(crowd);

    const endStand = new THREE.Mesh(new THREE.BoxGeometry(62, 12, 5), standMaterial);
    endStand.position.set(0, 6, 65);
    endStand.receiveShadow = true;
    scene.add(endStand);
    const endCrowd = new THREE.InstancedMesh(crowdGeometry, crowdMaterial, 660);
    let endFanCount = 0;
    for (let row = 0; row < 6; row += 1) {
      for (let seat = 0; seat < 110; seat += 1) {
        crowdTransform.position.set(-29 + seat * 0.53, 1.8 + row * 1.1, 61.3 + row * 0.42);
        crowdTransform.rotation.y = Math.PI;
        crowdTransform.updateMatrix();
        endCrowd.setMatrixAt(endFanCount, crowdTransform.matrix);
        endCrowd.setColorAt(endFanCount, new THREE.Color(crowdColors[(seat * 11 + row * 5) % crowdColors.length]));
        endFanCount += 1;
      }
    }
    endCrowd.count = endFanCount;
    endCrowd.instanceMatrix.needsUpdate = true;
    if (endCrowd.instanceColor) endCrowd.instanceColor.needsUpdate = true;
    scene.add(endCrowd);

    const lightMaterial = new THREE.MeshBasicMaterial({ color: '#e9f3ff' });
    [-1, 1].forEach((side) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 18, 7), standMaterial);
      tower.position.set(side * 34, 9, -44);
      scene.add(tower);
      for (let light = 0; light < 5; light += 1) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.15), lightMaterial);
        lamp.position.set(side * 34, 17.7, -46 + light * 0.8);
        scene.add(lamp);
      }
    });

    const scrimmage = new THREE.Mesh(new THREE.BoxGeometry(53.6, 0.035, 0.18), new THREE.MeshBasicMaterial({ color: '#4797f0' }));
    const firstDownLine = new THREE.Mesh(new THREE.BoxGeometry(53.6, 0.026, 0.12), new THREE.MeshBasicMaterial({ color: '#f2c84b' }));
    scene.add(scrimmage, firstDownLine);

    const football = new THREE.Group();
    const footballBody = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 9), new THREE.MeshStandardMaterial({ color: '#884c2e', roughness: 0.78 }));
    footballBody.scale.set(0.68, 0.62, 1.2);
    football.add(footballBody);
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.035), new THREE.MeshBasicMaterial({ color: '#f6ead1' }));
    lace.position.y = 0.22;
    football.add(lace);
    scene.add(football);

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
    const homePlayers = homeFormation.map((player) => ({ ...player, model: createFootballPlayerModel('home', player.number, player.role) }));
    const awayPlayers = awayFormation.map((player) => ({ ...player, model: createFootballPlayerModel('away', player.number, player.role) }));
    homePlayers.forEach((player) => scene.add(player.model));
    awayPlayers.forEach((player) => scene.add(player.model));

    footballThree = {
      scene,
      camera,
      renderer,
      field,
      homeEndzoneLabel,
      awayEndzoneLabel,
      homePlayers,
      awayPlayers,
      football,
      scrimmage,
      firstDownLine,
      viewWidth: 0,
      viewHeight: 0
    };
    document.querySelector('.field-wrapper').classList.add('three-active');
  } catch (error) {
    footballThree = null;
    console.warn('3D football stadium unavailable. Using the local field view.', error);
  }
}

function updateFootballThree(timestamp) {
  if (!footballThree || !document.getElementById('game').classList.contains('active')) return;
  const bounds = footballThreeCanvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  if (bounds.width !== footballThree.viewWidth || bounds.height !== footballThree.viewHeight) {
    footballThree.viewWidth = bounds.width;
    footballThree.viewHeight = bounds.height;
    footballThree.camera.aspect = bounds.width / bounds.height;
    footballThree.camera.updateProjectionMatrix();
    footballThree.renderer.setSize(bounds.width, bounds.height, false);
  }

  const direction = gameState.possession === 'home' ? 1 : -1;
  const lineZ = gameState.drivePosition - 50;
  const playDuration = gameState.lastPlay?.type === 'deep' ? 2100 : 1650;
  const livePlay = gameState.lastPlay && timestamp - gameState.lastPlay.startedAt < playDuration;
  const progress = livePlay ? Math.min(1, (timestamp - gameState.lastPlay.startedAt) / playDuration) : 1;
  const playGain = livePlay ? gameState.lastPlay.gain || 0 : 0;
  const offense = gameState.possession === 'home' ? footballThree.homePlayers : footballThree.awayPlayers;
  const defense = gameState.possession === 'home' ? footballThree.awayPlayers : footballThree.homePlayers;
  const receiver = offense.find((player) => player.number === gameState.lastPlay?.receiverNumber)
    || offense.find((player) => player.role === 'WR');
  const isPassPlay = livePlay && ['pass', 'deep'].includes(gameState.lastPlay.type);

  offense.forEach((player) => {
    let targetX = player.x;
    let targetZ = lineZ + player.z * direction;
    if (livePlay && player.role === 'RB' && gameState.lastPlay.type === 'run') targetZ += direction * playGain * progress * 0.7;
    if (livePlay && player.role === 'WR' && ['pass', 'deep'].includes(gameState.lastPlay.type)) {
      targetZ += direction * Math.min(playGain, 28) * progress * 0.68;
      targetX += Math.sin(progress * Math.PI) * (player.x > 0 ? -2.4 : 2.4);
    }
    if (livePlay && player.role === 'QB' && gameState.lastPlay.type === 'pass') targetZ -= direction * progress * 1.2;
    if (livePlay && ['C', 'G', 'T', 'TE', 'FB'].includes(player.role)) targetZ += direction * Math.min(playGain, 8) * progress * 0.28;
    player.model.position.lerp(new THREE.Vector3(targetX, 0, targetZ), 0.3);
    player.model.rotation.y = direction > 0 ? 0 : Math.PI;
    player.model.userData.limbs.forEach((limb, index) => {
      const running = livePlay && ['RB', 'WR', 'QB', 'C', 'G', 'T', 'TE', 'FB'].includes(player.role);
      limb.pivot.rotation.x = running ? Math.sin(timestamp * 0.014 + index * Math.PI) * 0.44 : 0;
      if (index < 2) limb.lowerPivot.rotation.x = running ? Math.max(0, -limb.pivot.rotation.x) * 0.72 : 0;
    });
    if (livePlay && player.role === 'QB' && gameState.lastPlay.type === 'pass') {
      player.model.userData.limbs[2].pivot.rotation.x = -0.9 * Math.min(1, progress * 2);
      player.model.userData.limbs[3].pivot.rotation.x = -0.72 * Math.min(1, progress * 2);
    }
    if (isPassPlay && receiver && player.number === receiver.number && progress > 0.72) {
      player.model.userData.limbs[2].pivot.rotation.x = -1.05;
      player.model.userData.limbs[3].pivot.rotation.x = -1.05;
    }
  });
  defense.forEach((player) => {
    const targetZ = lineZ + player.z * direction;
    const chaseTarget = isPassPlay ? receiver : offense.find((candidate) => candidate.role === 'RB');
    const converge = livePlay ? Math.max(0, progress - 0.22) * (chaseTarget ? 3.2 : 0.75) : 0;
    const targetX = chaseTarget ? chaseTarget.x : 0;
    player.model.position.lerp(new THREE.Vector3(
      player.x + (targetX - player.x) * converge * 0.16,
      0,
      targetZ - direction * converge
    ), 0.26);
    player.model.rotation.y = direction > 0 ? Math.PI : 0;
    player.model.userData.limbs.forEach((limb) => {
      limb.pivot.rotation.x = livePlay ? Math.sin(timestamp * 0.013 + player.number) * 0.3 : 0;
    });
  });

  const ballPosition = new THREE.Vector3(0, 0.24, lineZ);
  if (isPassPlay && receiver) {
    const quarterback = offense.find((player) => player.role === 'QB');
    const start = new THREE.Vector3(quarterback?.x || 0, 2.05, lineZ + (quarterback?.z || -6) * direction);
    const end = new THREE.Vector3(receiver.x, 1.65, lineZ + (receiver.z + Math.min(playGain, 28) * 0.68) * direction);
    const trajectory = Math.min(1, progress * 1.2);
    ballPosition.lerpVectors(start, end, trajectory);
    ballPosition.y += Math.sin(trajectory * Math.PI) * Math.min(5, 1.4 + playGain * 0.12);
    footballThree.football.rotation.x = Math.PI / 2 + progress * Math.PI * 4;
    footballThree.football.rotation.z = Math.sin(timestamp * 0.025) * 0.12;
  } else {
    ballPosition.set(0, 0.24, lineZ + (livePlay ? direction * playGain * progress * 0.7 : 0));
    footballThree.football.rotation.x = Math.PI / 2;
  }
  footballThree.football.position.copy(ballPosition);
  footballThree.scrimmage.position.set(0, 0.055, lineZ);
  footballThree.firstDownLine.position.set(0, 0.04, lineZ + direction * gameState.yardsToGo);
  const cameraFocusX = isPassPlay && receiver ? receiver.x * progress * 0.28 : 0;
  const cameraFocusZ = livePlay && gameState.lastPlay.type === 'run' ? direction * playGain * progress * 0.18 : 0;
  footballThree.camera.position.set(cameraFocusX * 0.3, 6.6 + Math.sin(timestamp * 0.025) * (livePlay ? 0.045 : 0), lineZ - direction * 15 + cameraFocusZ);
  footballThree.camera.lookAt(cameraFocusX, 0.8 + ballPosition.y * 0.12, lineZ + direction * 24 + cameraFocusZ);
  footballThree.renderer.render(footballThree.scene, footballThree.camera);

  footballPlayPhase.textContent = gameState.quarter === 4 && gameState.clockSeconds === 0
    ? 'FINAL'
    : livePlay ? 'LIVE PLAY' : 'PRE-SNAP';
}

const schoolAssignments = [
  { id: 1, name: 'History essay draft', subject: 'History', due: '2026-10-12', priority: 'High' },
  { id: 2, name: 'Biology lab review', subject: 'Science', due: '2026-10-13', priority: 'Medium' },
  { id: 3, name: 'Algebra worksheet', subject: 'Math', due: '2026-10-14', priority: 'High' }
];

const legoSets = [];
let selectedColor = 'Yellow';

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateHomeSummary() {
  homeSummaryScore.textContent = `${gameState.homeScore} - ${gameState.awayScore}`;
}

function addQuarterScore(team, points) {
  const quarterScore = gameState.quarterScores[gameState.quarter - 1];
  if (quarterScore) quarterScore[team] += points;
  gameState[team === 'home' ? 'homeScore' : 'awayScore'] += points;
}

function addLog(message) {
  const item = document.createElement('li');
  item.textContent = message;
  gameLog.prepend(item);

  while (gameLog.children.length > 6) {
    gameLog.removeChild(gameLog.lastChild);
  }
}

function updateGameState() {
  const downLabelMap = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };
  const driveZone = gameState.drivePosition >= 75 ? 'Red zone' : gameState.drivePosition >= 40 ? 'Midfield' : 'Own half';
  const homeTeamName = getHomeTeamName();

  teamNameDisplay.textContent = homeTeamName;
  scoreHome.textContent = gameState.homeScore;
  scoreAway.textContent = gameState.awayScore;
  downValue.textContent = `${downLabelMap[gameState.down] || '4th'} & ${gameState.yardsToGo}`;
  driveValue.textContent = driveZone;
  quarterValue.textContent = `Q${gameState.quarter}`;
  clockValue.textContent = formatClock(gameState.clockSeconds);
  possessionValue.textContent = gameState.possession === 'home' ? homeTeamName : getOpponentName();
  momentumValue.textContent = gameState.momentum;
  rushYards.textContent = gameState.rushYards;
  passYards.textContent = gameState.passYards;
  energyValue.textContent = `${gameState.energy}%`;
  footballDownDistance.textContent = `${downLabelMap[gameState.down] || '4th'} & ${gameState.yardsToGo}`;
  footballFieldPosition.textContent = driveZone.toUpperCase();
  if (gameState.clockSeconds === 0 && gameState.quarter === 4) footballPlayPhase.textContent = 'FINAL';
  if (footballThree?.homeEndzoneLabel) {
    const { canvas, context, texture } = footballThree.homeEndzoneLabel;
    context.fillStyle = '#173b30';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255,255,255,.74)';
    context.lineWidth = 8;
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    context.fillStyle = '#fffdf0';
    context.font = '900 88px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(homeTeamName.toUpperCase().slice(0, 18), canvas.width / 2, canvas.height / 2, 690);
    texture.needsUpdate = true;
    footballThree.homeEndzoneLabel.text = homeTeamName;
  }
  document.getElementById('homeQuarterName').textContent = homeTeamName;
  document.getElementById('homeFinalScore').textContent = gameState.homeScore;
  document.getElementById('awayFinalScore').textContent = gameState.awayScore;
  gameState.quarterScores.forEach((score, index) => {
    const quarterNumber = index + 1;
    document.getElementById(`homeQuarter${quarterNumber}`).textContent = score.home;
    document.getElementById(`awayQuarter${quarterNumber}`).textContent = score.away;
  });
  document.querySelectorAll('[data-quarter-cell]').forEach((cell) => {
    cell.classList.toggle('current-quarter', Number(cell.dataset.quarterCell) === gameState.quarter && gameState.clockSeconds > 0);
  });
  gameButtons.forEach((button) => { button.disabled = gameState.quarter === 4 && gameState.clockSeconds === 0; });

  const ballX = Math.min(92, Math.max(8, gameState.drivePosition));
  ballMarker.style.left = `${ballX}%`;
  ballMarker.style.top = `50%`;

  updateHomeSummary();
}

function tickGameClock() {
  if (!document.getElementById('game').classList.contains('active')) return;
  if (gameState.clockSeconds > 0) {
    gameState.clockSeconds -= 1;

    if (gameState.clockSeconds % 25 === 0 && gameState.clockSeconds > 0) {
      gameState.energy = Math.max(38, gameState.energy - 2);
    }

    if (gameState.clockSeconds === 0) {
      if (gameState.quarter < 4) {
        gameState.quarter += 1;
        gameState.clockSeconds = 180;
        gameState.down = 1;
        gameState.yardsToGo = 10;
        gameState.drivePosition = 50;
        gameState.lastPlay = null;
        addLog(`End of Q${gameState.quarter - 1}. The teams reset for the next quarter.`);
      } else {
        addLog('The final whistle blows. The fourth quarter is over and the game is decided.');
      }
      gameState.momentum = gameState.homeScore >= gameState.awayScore ? 'Winning' : 'Fighting';
    }

    updateGameState();
  }
}

function playAction(type) {
  const playMap = {
    run: { label: 'Power Run', gainMin: 2, gainMax: 12, turnoverChance: 0.08, risk: 0.1 },
    pass: { label: 'Quick Pass', gainMin: 4, gainMax: 16, turnoverChance: 0.12, risk: 0.14 },
    deep: { label: 'Deep Shot', gainMin: 8, gainMax: 28, turnoverChance: 0.2, risk: 0.22 },
    fieldGoal: { label: 'Field Goal', gainMin: 0, gainMax: 0, turnoverChance: 0, risk: 0 }
  };

  const play = playMap[type];
  if (!play || gameState.clockSeconds <= 0) return;

  const homeTeamName = getHomeTeamName();
  const startDrivePosition = gameState.drivePosition;
  const receiverOptions = type === 'deep' ? [11, 14] : [87, 11, 14];
  const receiverNumber = receiverOptions[Math.floor(Math.random() * receiverOptions.length)];

  if (type === 'fieldGoal') {
    const distance = Math.max(0, 55 - gameState.drivePosition);
    const successChance = Math.max(0.45, 0.82 - distance / 100);
    const success = Math.random() < successChance;

    if (success) {
      addQuarterScore('home', 3);
      gameState.momentum = 'Three points';
      addLog(`The kick is good from range. ${homeTeamName} get the points.`);
    } else {
      gameState.momentum = 'Missed kick';
      addLog('The field goal misses wide left. Tough break.');
    }

    gameState.drivePosition = 50;
    gameState.down = 1;
    gameState.yardsToGo = 10;
    gameState.possession = 'home';
    gameState.clockSeconds = Math.max(0, gameState.clockSeconds - 12);
    gameState.lastPlay = { type, gain: 0, startDrivePosition, startedAt: performance.now(), receiverNumber };
    updateGameState();
    return;
  }

  const isPass = type !== 'run';
  const rngRoll = Math.random();
  let gain = 0;

  if (rngRoll > play.risk || type === 'run') {
    gain = Math.floor(Math.random() * (play.gainMax - play.gainMin + 1)) + play.gainMin;
  } else {
    gain = Math.max(1, Math.floor(Math.random() * 4));
  }

  const turnover = Math.random() < play.turnoverChance;

  if (turnover) {
    gameState.possession = 'away';
    addQuarterScore('away', 3);
    gameState.momentum = 'Turnover';
    addLog(`${play.label} breaks down. The defense forces a turnover and ${getOpponentName()} take the lead.`);
    gameState.drivePosition = 50;
    gameState.down = 1;
    gameState.yardsToGo = 10;
    gameState.clockSeconds = Math.max(0, gameState.clockSeconds - 18);
    gameState.lastPlay = { type, gain: 0, startDrivePosition, startedAt: performance.now(), turnover: true, receiverNumber };
    updateGameState();
    return;
  }

  if (isPass) {
    gameState.passYards += gain;
  } else {
    gameState.rushYards += gain;
  }

  const goAhead = Math.random() < (type === 'deep' ? 0.18 : 0.08);
  gameState.drivePosition = Math.min(100, gameState.drivePosition + gain);
  gameState.yardsToGo = Math.max(1, gameState.yardsToGo - gain);
  gameState.energy = Math.max(28, gameState.energy - (isPass ? 3 : 5));
  gameState.momentum = gain >= 12 ? 'Hot streak' : goAhead ? 'Momentum swing' : 'Balanced';
  addLog(`${play.label} gains ${gain} yards and keeps the drive alive.`);

  if (gameState.drivePosition >= 100) {
    addQuarterScore('home', 7);
    gameState.momentum = 'Touchdown!';
    gameState.possession = 'home';
    addLog(`Touchdown! ${homeTeamName} finish a clean drive and celebrate on the sideline.`);
    gameState.drivePosition = 50;
    gameState.down = 1;
    gameState.yardsToGo = 10;
  } else if (gameState.yardsToGo <= 0) {
    gameState.down = 1;
    gameState.yardsToGo = 10;
    gameState.possession = 'home';
    gameState.momentum = 'First down';
    addLog('First down! The offense resets and keeps marching.');
  } else if (gameState.down >= 4) {
    gameState.possession = 'away';
    gameState.down = 1;
    gameState.yardsToGo = 10;
    gameState.drivePosition = 50;
    gameState.momentum = 'Turnover on downs';
    addLog('Turnover on downs. Momentum flips and the defense takes over.');
  } else {
    gameState.down += 1;
  }

  gameState.clockSeconds = Math.max(0, gameState.clockSeconds - 12);
  if (gameState.clockSeconds === 0) {
    gameState.momentum = gameState.homeScore >= gameState.awayScore ? 'Winning' : 'Fight to the end';
    addLog('The clock expires and the game tightens up in the closing seconds.');
  }

  gameState.lastPlay = { type, gain, startDrivePosition, startedAt: performance.now(), receiverNumber };
  updateGameState();
}

const gameButtons = document.querySelectorAll('.play-btn');
gameButtons.forEach((button) => {
  button.addEventListener('click', () => playAction(button.dataset.play));
});

document.getElementById('resetGameBtn').addEventListener('click', () => {
  Object.assign(gameState, {
    homeScore: 0,
    awayScore: 0,
    quarterScores: Array.from({ length: 4 }, () => ({ home: 0, away: 0 })),
    down: 1,
    yardsToGo: 10,
    drivePosition: 50,
    quarter: 1,
    clockSeconds: 180,
    rushYards: 0,
    passYards: 0,
    energy: 82,
    momentum: 'Balanced',
    possession: 'home',
    lastPlay: null
  });
  gameLog.replaceChildren();
  addLog('Kickoff. Four quarters on the board. Make this drive count.');
  updateGameState();
});
teamNameInput.addEventListener('input', updateGameState);

const battlefieldStorageKey = 'codemaster-battlefield-v1';
const threeRuntimeUrl = 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js';
const battlefieldWeapons = [
  { id: 'rifle', name: 'Kestrel AR-4', className: 'Assault rifle', accuracy: 72, magazine: 24, reserve: 96, unlockXp: 0 },
  { id: 'smg', name: 'Viper SMG-9', className: 'Submachine gun', accuracy: 82, magazine: 30, reserve: 120, unlockXp: 100 },
  { id: 'marksman', name: 'Longshot DMR', className: 'Marksman rifle', accuracy: 91, magazine: 12, reserve: 48, unlockXp: 300 },
  { id: 'pulse', name: 'Arc Pulse-6', className: 'Pulse carbine', accuracy: 96, magazine: 18, reserve: 72, unlockXp: 600 }
];
const battlefieldDefault = {
  xp: 0,
  kills: 0,
  missions: 0,
  mission: 1,
  hostiles: 3,
  health: 100,
  ammo: 24,
  reserve: 96,
  raidCredits: 0,
  credits: 0,
  intelRecovered: false,
  weapon: 'rifle',
  covered: false,
  log: ['Connection established. Awaiting deployment.']
};
let battlefieldState = loadBattlefieldState();
const battlefieldCanvas = document.getElementById('battlefieldCanvas');
const battlefieldContext = battlefieldCanvas.getContext('2d');
const battlefieldThreeCanvas = document.getElementById('battlefieldThreeCanvas');
const sceneReticle = document.getElementById('sceneReticle');
const battlefieldKeys = new Set();
const touchMovementKeys = new Set();
const battlefieldEnemies = [];
const battlefieldTracers = [];
const operator = { x: 110, y: 240, angle: 0, speed: 190, shotCooldown: 0 };
const battlefieldMovement = { active: false };
const battlefieldThemeColors = { operator: '#34847b', highlight: '#78f5df' };
const operatorAim = { x: 480, y: 240 };
const battlefieldAimNdc = { x: 0, y: 0 };
const battlefieldWorld = { width: 960, height: 480 };
let battlefieldFrameTime = 0;
let enemyAttackTimer = 1.8;
let lastOperatorAccessibleState = '';
let battlefieldThree = null;

function fieldCover() {
  return [
    { x: 270, y: 84, width: 106, height: 60 },
    { x: 420, y: 328, width: 142, height: 68 },
    { x: 622, y: 174, width: 94, height: 122 },
    { x: 800, y: 54, width: 76, height: 56 }
  ];
}

function createBattlefieldSoldier(isHostile = false) {
  const group = new THREE.Group();
  const armorMaterial = new THREE.MeshStandardMaterial({
    color: isHostile ? '#8f4038' : battlefieldThemeColors.operator,
    roughness: 0.82
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: isHostile ? '#432b2a' : '#4a5747',
    roughness: 0.9
  });
  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: isHostile ? '#4b3b35' : '#303e37',
    roughness: 0.96
  });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#bd9476', roughness: 0.84 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: '#1b2424', metalness: 0.42, roughness: 0.55 });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: isHostile ? '#ff6d5e' : battlefieldThemeColors.highlight,
    emissive: isHostile ? '#6e160f' : battlefieldThemeColors.highlight,
    emissiveIntensity: 0.3,
    roughness: 0.45
  });

  function addBox(material, size, position, parent = group) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addLimb(x, y, material, upperLength, lowerLength, isArm = false) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    group.add(pivot);
    const width = isArm ? 0.14 : 0.19;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.78, width, upperLength, 7), material);
    upper.position.y = -upperLength / 2;
    upper.castShadow = true;
    pivot.add(upper);
    const lowerPivot = new THREE.Group();
    lowerPivot.position.y = -upperLength + 0.03;
    pivot.add(lowerPivot);
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.68, width * 0.78, lowerLength, 7), material);
    lower.position.y = -lowerLength / 2;
    lower.castShadow = true;
    lowerPivot.add(lower);
    if (!isArm) {
      addBox(fabricMaterial, [width * 1.15, 0.14, 0.38], [0, -lowerLength + 0.02, 0.12], lowerPivot);
    } else {
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 6), skinMaterial);
      glove.position.set(0, -lowerLength - 0.06, 0.02);
      lowerPivot.add(glove);
    }
    return { pivot, lowerPivot };
  }

  addBox(fabricMaterial, [0.4, 0.5, 0.18], [0, 1.17, -0.29]);
  addBox(trimMaterial, [0.42, 0.07, 0.05], [0, 1.34, -0.39]);
  addBox(trimMaterial, [0.42, 0.07, 0.05], [0, 1.06, -0.39]);
  addBox(fabricMaterial, [0.15, 0.2, 0.07], [-0.12, 1.2, -0.4]);
  addBox(fabricMaterial, [0.15, 0.2, 0.07], [0.12, 1.2, -0.4]);
  addBox(accentMaterial, [0.08, 0.08, 0.025], [0, 1.48, -0.385]);
  addBox(trimMaterial, [0.36, 0.67, 0.32], [0, 1.17, -0.02]);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.34, 0.75, 8), armorMaterial);
  torso.position.y = 1.17;
  torso.castShadow = true;
  group.add(torso);
  addBox(trimMaterial, [0.48, 0.17, 0.34], [0, 0.84, 0.03]);
  addBox(armorMaterial, [0.19, 0.16, 0.32], [-0.13, 1.32, 0.17]);
  addBox(armorMaterial, [0.19, 0.16, 0.32], [0.13, 1.32, 0.17]);
  addBox(trimMaterial, [0.16, 0.25, 0.1], [-0.3, 1.06, 0]);
  addBox(trimMaterial, [0.16, 0.25, 0.1], [0.3, 1.06, 0]);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.09, 0.13, 7), skinMaterial);
  neck.position.y = 1.57;
  group.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 9, 7), skinMaterial);
  head.position.set(0, 1.73, 0.025);
  head.scale.set(0.82, 1.05, 0.86);
  head.castShadow = true;
  group.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 9, 7), armorMaterial);
  helmet.position.set(0, 1.84, -0.015);
  helmet.scale.set(1.08, 0.62, 1.05);
  helmet.castShadow = true;
  group.add(helmet);
  addBox(trimMaterial, [0.28, 0.05, 0.1], [0, 1.78, 0.14]);
  addBox(accentMaterial, [0.07, 0.07, 0.025], [0, 1.78, 0.193]);
  addBox(trimMaterial, [0.13, 0.17, 0.3], [-0.3, 1.13, -0.04]);
  addBox(trimMaterial, [0.13, 0.17, 0.3], [0.3, 1.13, -0.04]);

  const leftLeg = addLimb(-0.17, 0.8, fabricMaterial, 0.43, 0.42);
  const rightLeg = addLimb(0.17, 0.8, fabricMaterial, 0.43, 0.42);
  const leftArm = addLimb(-0.36, 1.35, armorMaterial, 0.34, 0.38, true);
  const rightArm = addLimb(0.36, 1.35, armorMaterial, 0.34, 0.38, true);
  const rifle = addBox(metalMaterial, [0.1, 0.11, 0.8], [0.12, 1.19, 0.58]);
  rifle.rotation.x = -0.06;
  addBox(metalMaterial, [0.08, 0.2, 0.13], [0.13, 1.02, 0.42]);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.42, 6), metalMaterial);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.12, 1.2, 1.12);
  group.add(barrel);
  addBox(accentMaterial, [0.08, 0.08, 0.04], [0.12, 1.2, 1.34]);

  group.userData.limbs = [leftLeg, rightLeg, leftArm, rightArm];
  group.userData.armorMaterial = armorMaterial;
  group.userData.accentMaterial = accentMaterial;
  group.userData.isHostile = isHostile;
  return group;
}

function createFirstPersonWeapon(camera) {
  const rig = new THREE.Group();
  const rifleMaterial = new THREE.MeshStandardMaterial({ color: '#242c2b', metalness: 0.68, roughness: 0.38 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: '#505750', metalness: 0.58, roughness: 0.42 });
  const sleeveMaterial = new THREE.MeshStandardMaterial({ color: '#17241d', roughness: 0.98 });
  const gloveMaterial = new THREE.MeshStandardMaterial({ color: '#111a17', roughness: 0.92 });
  const lensMaterial = new THREE.MeshStandardMaterial({ color: '#233d42', metalness: 0.42, roughness: 0.18 });

  function addCameraBox(material, size, position) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    rig.add(mesh);
    return mesh;
  }

  function addForearm(start, end, radius) {
    const first = new THREE.Vector3(...start);
    const second = new THREE.Vector3(...end);
    const direction = second.clone().sub(first);
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius, direction.length(), 8), sleeveMaterial);
    sleeve.position.copy(first).add(second).multiplyScalar(0.5);
    sleeve.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    rig.add(sleeve);
    const glove = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.84, 8, 7), gloveMaterial);
    glove.position.copy(second);
    rig.add(glove);
  }

  addForearm([-0.76, -0.58, -0.24], [-0.03, -0.31, -0.78], 0.14);
  addForearm([0.83, -0.65, -0.16], [0.48, -0.32, -0.79], 0.15);
  addCameraBox(rifleMaterial, [0.25, 0.2, 0.74], [0.31, -0.3, -0.87]);
  addCameraBox(edgeMaterial, [0.17, 0.17, 0.38], [0.31, -0.34, -0.42]);
  addCameraBox(rifleMaterial, [0.12, 0.29, 0.17], [0.31, -0.52, -0.78]);
  addCameraBox(edgeMaterial, [0.08, 0.13, 0.1], [0.31, -0.15, -0.72]);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.052, 0.84, 10), rifleMaterial);
  barrel.rotation.x = -Math.PI / 2;
  barrel.position.set(0.31, -0.28, -1.5);
  rig.add(barrel);
  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.061, 0.09, 10), edgeMaterial);
  muzzle.rotation.x = -Math.PI / 2;
  muzzle.position.set(0.31, -0.28, -1.93);
  rig.add(muzzle);

  const optic = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.085, 0.3, 12), edgeMaterial);
  optic.rotation.x = -Math.PI / 2;
  optic.position.set(0.31, -0.12, -0.8);
  rig.add(optic);
  const opticLens = new THREE.Mesh(new THREE.CircleGeometry(0.072, 12), lensMaterial);
  opticLens.position.set(0.31, -0.12, -0.955);
  rig.add(opticLens);
  const opticBack = opticLens.clone();
  opticBack.position.z = -0.645;
  rig.add(opticBack);
  addCameraBox(edgeMaterial, [0.13, 0.04, 0.04], [0.31, -0.015, -0.8]);

  const muzzleFlash = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.48, 7),
    new THREE.MeshBasicMaterial({ color: '#ffd77a' })
  );
  muzzleFlash.rotation.x = -Math.PI / 2;
  muzzleFlash.position.set(0.31, -0.28, -2.24);
  muzzleFlash.visible = false;
  rig.add(muzzleFlash);
  rig.scale.setScalar(0.58);
  rig.position.set(0.04, -0.03, 0);
  rig.userData.muzzleFlash = muzzleFlash;
  camera.add(rig);
  return rig;
}

function createLeafTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext('2d');
  context.fillStyle = '#32452e';
  context.fillRect(0, 0, 256, 256);
  const leafColors = ['#536b3f', '#647a49', '#3c5b39', '#72824b', '#465f3a'];
  for (let index = 0; index < 850; index += 1) {
    const x = (index * 73) % 256;
    const y = (index * 151) % 256;
    context.save();
    context.translate(x, y);
    context.rotate((index * 0.71) % Math.PI);
    context.fillStyle = leafColors[index % leafColors.length];
    context.beginPath();
    context.ellipse(0, 0, 2 + index % 4, 5 + index % 7, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function createMasonryTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext('2d');
  context.fillStyle = '#453f34';
  context.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 12; row += 1) {
    const stagger = row % 2 ? 18 : 0;
    for (let column = -1; column < 7; column += 1) {
      const index = row * 7 + column + 1;
      const x = column * 42 + stagger;
      const y = row * 22;
      const shade = ['#615b4c', '#716b58', '#514c40', '#77705d'][Math.abs(index) % 4];
      context.fillStyle = shade;
      context.fillRect(x + 1, y + 1, 39, 19);
      context.strokeStyle = 'rgba(31, 33, 28, 0.55)';
      context.strokeRect(x + 1.5, y + 1.5, 38, 18);
      if (index % 5 === 0) {
        context.strokeStyle = 'rgba(32, 31, 26, 0.35)';
        context.beginPath();
        context.moveTo(x + 8, y + 4);
        context.lineTo(x + 13, y + 12);
        context.lineTo(x + 11, y + 17);
        context.stroke();
      }
    }
  }
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function initializeBattlefieldThree() {
  if (!window.THREE) return;

  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#536862');
    scene.fog = new THREE.FogExp2('#788274', 0.017);
    const camera = new THREE.PerspectiveCamera(62, 960 / 480, 0.1, 140);
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas: battlefieldThreeCanvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(960, 480, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    scene.add(new THREE.HemisphereLight('#d5e6db', '#243428', 0.68));
    const keyLight = new THREE.DirectionalLight('#fff0d0', 1.25);
    keyLight.position.set(-9, 17, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -24;
    keyLight.shadow.camera.right = 24;
    keyLight.shadow.camera.top = 24;
    keyLight.shadow.camera.bottom = -24;
    scene.add(keyLight);

    const groundGeometry = new THREE.PlaneGeometry(68, 54, 44, 36);
    const vertices = groundGeometry.attributes.position;
    for (let index = 0; index < vertices.count; index += 1) {
      const x = vertices.getX(index);
      const z = vertices.getY(index);
      vertices.setZ(index, Math.sin(x * 0.19) * 0.16 + Math.cos(z * 0.23) * 0.12);
    }
    groundGeometry.computeVertexNormals();
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    const textureContext = textureCanvas.getContext('2d');
    textureContext.fillStyle = '#48523c';
    textureContext.fillRect(0, 0, 256, 256);
    for (let index = 0; index < 1800; index += 1) {
      const shade = index % 3 === 0 ? '#8a9064' : index % 3 === 1 ? '#343f31' : '#686c4b';
      textureContext.globalAlpha = 0.12 + (index % 5) * 0.025;
      textureContext.fillStyle = shade;
      textureContext.fillRect((index * 73) % 256, (index * 139) % 256, 1 + index % 3, 1 + (index + 1) % 2);
    }
    textureContext.globalAlpha = 1;
    const groundTexture = new THREE.CanvasTexture(textureCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(12, 10);
    if ('encoding' in groundTexture && THREE.sRGBEncoding) groundTexture.encoding = THREE.sRGBEncoding;
    const ground = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({ map: groundTexture, color: '#788b63', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);

    const route = new THREE.Mesh(
      new THREE.PlaneGeometry(68, 2.8),
      new THREE.MeshStandardMaterial({ color: '#8a7551', roughness: 1, transparent: true, opacity: 0.62 })
    );
    route.rotation.x = -Math.PI / 2;
    route.rotation.z = -0.05;
    route.position.set(0, -0.09, 1.8);
    route.receiveShadow = true;
    scene.add(route);

    const grid = new THREE.GridHelper(68, 34, '#c4c4a4', '#b9b89e');
    grid.position.y = -0.08;
    grid.material.transparent = true;
    grid.material.opacity = 0.08;
    scene.add(grid);

    const grassPositions = [];
    function addGrassBlade(angle, height, width) {
      const sideX = -Math.sin(angle) * width / 2;
      const sideZ = Math.cos(angle) * width / 2;
      const leanX = Math.cos(angle) * 0.13;
      const leanZ = Math.sin(angle) * 0.13;
      grassPositions.push(
        -sideX, 0, -sideZ,
        sideX, 0, sideZ,
        leanX, height, leanZ
      );
    }
    addGrassBlade(0, 0.74, 0.15);
    addGrassBlade(0.82, 0.56, 0.13);
    addGrassBlade(1.63, 0.68, 0.14);
    addGrassBlade(2.39, 0.51, 0.12);
    const grassGeometry = new THREE.BufferGeometry();
    grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grassPositions, 3));
    grassGeometry.computeVertexNormals();
    const grassMaterial = new THREE.MeshStandardMaterial({ color: '#637d4b', roughness: 1, flatShading: true, side: THREE.DoubleSide });
    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, 3200);
    const grassTransform = new THREE.Object3D();
    let grassCount = 0;
    for (let index = 0; index < 8500 && grassCount < 3200; index += 1) {
      const x = Math.sin(index * 12.9898) * 30;
      const z = Math.cos(index * 7.233) * 21;
      if (Math.abs(z - 1.8) < 1.25) continue;
      const inCover = fieldCover().some((cover) => {
        const coverX = (cover.x + cover.width / 2 - 480) / 30;
        const coverZ = (cover.y + cover.height / 2 - 240) / 24;
        return Math.abs(x - coverX) < cover.width / 60 + 0.5 && Math.abs(z - coverZ) < cover.height / 48 + 0.5;
      });
      if (inCover) continue;
      grassTransform.position.set(x, 0, z);
      grassTransform.rotation.y = index * 1.73;
      grassTransform.scale.set(0.7 + (index % 4) * 0.18, 0.65 + (index % 5) * 0.12, 0.7 + (index % 3) * 0.2);
      grassTransform.updateMatrix();
      grass.setMatrixAt(grassCount, grassTransform.matrix);
      grass.setColorAt(grassCount, new THREE.Color().setHSL(0.22 + (index % 5) * 0.012, 0.28 + (index % 4) * 0.025, 0.3 + (index % 3) * 0.025));
      grassCount += 1;
    }
    grass.count = grassCount;
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    grass.receiveShadow = true;
    scene.add(grass);

    const foliageTexture = createLeafTexture();
    const bushMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture, color: '#c0d0a0', roughness: 1, flatShading: true });
    const leafMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture, color: '#91aa72', roughness: 1, flatShading: true });
    const flowerMaterial = new THREE.MeshStandardMaterial({ color: '#e2ddc4', roughness: 0.9 });
    const pollenMaterial = new THREE.MeshStandardMaterial({ color: '#d8b65f', roughness: 0.8 });
    const shrubGeometry = new THREE.DodecahedronGeometry(0.65, 1);
    const flowerGeometry = new THREE.SphereGeometry(0.055, 5, 4);
    const gardenBeds = [
      { x: -9, z: -4, scale: 1 }, { x: -3, z: -6, scale: 1.25 },
      { x: 4, z: -5, scale: 1.1 }, { x: 10, z: -4, scale: 0.95 },
      { x: -6, z: 7, scale: 1.2 }, { x: 2, z: 6, scale: 1.05 },
      { x: 9, z: 6, scale: 1.25 }, { x: 16, z: 4, scale: 0.9 }
    ];
    gardenBeds.forEach((bed, bedIndex) => {
      for (let leaf = 0; leaf < 5; leaf += 1) {
        const shrub = new THREE.Mesh(shrubGeometry, leaf % 2 ? bushMaterial : leafMaterial);
        shrub.position.set(bed.x + Math.sin(leaf * 5 + bedIndex) * bed.scale * 0.62, 0.44 + (leaf % 2) * 0.18, bed.z + Math.cos(leaf * 4 + bedIndex) * bed.scale * 0.58);
        shrub.scale.set(bed.scale, bed.scale * (0.82 + (leaf % 3) * 0.12), bed.scale * 0.72);
        shrub.castShadow = true;
        scene.add(shrub);
      }
      for (let flower = 0; flower < 7; flower += 1) {
        const bloom = new THREE.Mesh(flowerGeometry, flower % 4 === 0 ? pollenMaterial : flowerMaterial);
        bloom.position.set(bed.x + Math.sin(flower * 8 + bedIndex) * 1.25, 0.42, bed.z + Math.cos(flower * 6 + bedIndex) * 1.1);
        scene.add(bloom);
      }
    });

    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#554a37', roughness: 1 });
    const palmMaterial = new THREE.MeshStandardMaterial({ color: '#3e6840', roughness: 1, side: THREE.DoubleSide });
    const frondShape = new THREE.Shape();
    frondShape.moveTo(0, 0);
    frondShape.quadraticCurveTo(-0.26, 1.1, 0, 3.7);
    frondShape.quadraticCurveTo(0.26, 1.1, 0, 0);
    const frondGeometry = new THREE.ShapeGeometry(frondShape, 5);
    const palms = [{ x: -7, z: -13, height: 8 }, { x: 2, z: 14, height: 7 }, { x: 12, z: -13, height: 9 }, { x: 21, z: 12, height: 8 }];
    palms.forEach((palm) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.42, palm.height, 8), trunkMaterial);
      trunk.position.set(palm.x, palm.height / 2 - 0.1, palm.z);
      trunk.rotation.z = -0.045;
      trunk.castShadow = true;
      scene.add(trunk);
      for (let frond = 0; frond < 8; frond += 1) {
        const angle = (frond / 8) * Math.PI * 2;
        const leaf = new THREE.Mesh(frondGeometry, palmMaterial);
        leaf.position.set(palm.x + Math.cos(angle) * 0.55, palm.height - 0.25, palm.z + Math.sin(angle) * 0.55);
        const direction = new THREE.Vector3(Math.cos(angle), -0.55, Math.sin(angle)).normalize();
        leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        leaf.rotation.y += angle;
        leaf.castShadow = true;
        scene.add(leaf);
      }
    });

    const masonryTexture = createMasonryTexture();
    const concrete = new THREE.MeshStandardMaterial({ map: masonryTexture, color: '#a29b82', roughness: 0.96 });
    const concreteTop = new THREE.MeshStandardMaterial({ map: masonryTexture, color: '#a29b82', roughness: 0.9 });
    const coverMeshes = [];
    fieldCover().forEach((cover, index) => {
      const width = cover.width / 30;
      const depth = cover.height / 24;
      const height = 1.35 + (index % 2) * 0.2;
      const block = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), concrete);
      block.position.set((cover.x + cover.width / 2 - 480) / 30, height / 2, (cover.y + cover.height / 2 - 240) / 24);
      block.castShadow = true;
      block.receiveShadow = true;
      scene.add(block);
      const top = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, 0.1, depth * 0.92), concreteTop);
      top.position.set(block.position.x, height + 0.04, block.position.z);
      top.castShadow = true;
      scene.add(top);
      coverMeshes.push(block);
    });

    for (let index = 0; index < 24; index += 1) {
      const x = Math.sin(index * 17.13) * 29;
      const z = Math.cos(index * 9.71) * 22;
      const size = 0.18 + (index % 4) * 0.08;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        new THREE.MeshStandardMaterial({ color: index % 2 ? '#4b4d42' : '#77715b', roughness: 1 })
      );
      rock.position.set(x, size * 0.48, z);
      rock.scale.set(1.4, 0.75, 1);
      rock.castShadow = true;
      scene.add(rock);
    }

    const skylineMaterial = new THREE.MeshStandardMaterial({ color: '#50544c', roughness: 0.98 });
    const ridgeMaterial = new THREE.MeshStandardMaterial({ color: '#565649', roughness: 1 });
    for (let index = 0; index < 8; index += 1) {
      const ridge = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), ridgeMaterial);
      ridge.position.set(-29 + index * 8.1, 2.1 + (index % 3) * 0.45, -25 - (index % 2) * 2);
      ridge.scale.set(5.5, 3.5 + (index % 3), 2.4);
      ridge.castShadow = true;
      scene.add(ridge);
    }
    for (let index = 0; index < 9; index += 1) {
      const height = 2.5 + (index * 7 % 5);
      const building = new THREE.Mesh(new THREE.BoxGeometry(1.6 + (index % 3) * 0.7, height, 1.4), skylineMaterial);
      building.position.set(-27 + index * 6.7, height / 2 - 0.1, -22 - (index % 2) * 1.8);
      building.castShadow = true;
      scene.add(building);
    }

    const oldStone = new THREE.MeshStandardMaterial({ map: masonryTexture, color: '#a29b82', roughness: 0.96 });
    const gateX = 17;
    [-4.6, 4.6].forEach((z) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(1.65, 4.5, 2.25), oldStone);
      pier.position.set(gateX, 2.2, z);
      pier.castShadow = true;
      pier.receiveShadow = true;
      scene.add(pier);
      for (let stone = 0; stone < 4; stone += 1) {
        const course = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.12, 2.32), concreteTop);
        course.position.set(gateX, 0.75 + stone * 0.9, z);
        scene.add(course);
      }
    });
    const gateLintel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 10.4), oldStone);
    gateLintel.position.set(gateX, 4.55, 0);
    gateLintel.castShadow = true;
    scene.add(gateLintel);
    const gateArch = new THREE.Mesh(new THREE.TorusGeometry(4.15, 0.32, 6, 20, Math.PI), oldStone);
    gateArch.rotation.y = Math.PI / 2;
    gateArch.position.set(gateX, 4.55, 0);
    gateArch.castShadow = true;
    scene.add(gateArch);

    const player = createBattlefieldSoldier(false);
    player.visible = false;
    scene.add(player);
    const weaponRig = createFirstPersonWeapon(camera);
    const intel = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.42, 0.58),
      new THREE.MeshStandardMaterial({ color: '#f1bd5b', emissive: '#9a581c', emissiveIntensity: 0.7, metalness: 0.22, roughness: 0.48 })
    );
    intel.position.set(0, 0.28, 0);
    scene.add(intel);
    const extraction = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.035, 6, 32),
      new THREE.MeshBasicMaterial({ color: battlefieldThemeColors.highlight })
    );
    extraction.rotation.x = Math.PI / 2;
    extraction.position.set(13.6, 0.04, 0);
    scene.add(extraction);

    battlefieldThree = {
      scene,
      camera,
      renderer,
      player,
      weaponRig,
      intel,
      extraction,
      coverMeshes,
      enemyModels: new Map(),
      raycaster: new THREE.Raycaster(),
      tracers: [],
      cameraPosition: new THREE.Vector3(),
      cameraTarget: new THREE.Vector3(),
      cameraPitch: -0.055,
      cameraRecoil: 0,
      muzzleFlashTimer: 0,
      viewWidth: 0,
      viewHeight: 0
    };
    battlefieldCanvas.classList.add('three-rendered');
    sceneReticle.classList.add('visible');
  } catch (error) {
    battlefieldThree = null;
    console.warn('3D battlefield unavailable. Using the local tactical view.', error);
  }
}

function scenePositionFromField(x, y) {
  return new THREE.Vector3((x - 480) / 30, 0, (y - 240) / 24);
}

function updateBattlefieldThree(deltaTime, timestamp) {
  if (!battlefieldThree) return;
  const { scene, camera, renderer, player, intel, extraction } = battlefieldThree;
  const bounds = battlefieldThreeCanvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  if (bounds.width !== battlefieldThree.viewWidth || bounds.height !== battlefieldThree.viewHeight) {
    battlefieldThree.viewWidth = bounds.width;
    battlefieldThree.viewHeight = bounds.height;
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    renderer.setSize(bounds.width, bounds.height, false);
  }

  const playerPosition = scenePositionFromField(operator.x, operator.y);
  player.position.copy(playerPosition);
  player.rotation.y = Math.PI / 2 - operator.angle;
  player.userData.limbs.forEach((limb, index) => {
    const swing = battlefieldMovement.active ? Math.sin(timestamp * 0.012 + index * Math.PI) * 0.5 : 0;
    limb.pivot.rotation.x = swing;
    if (index < 2) limb.lowerPivot.rotation.x = Math.max(0, -swing) * 0.7;
    if (index >= 2) limb.lowerPivot.rotation.x = -0.4 + Math.max(0, swing) * 0.3;
  });
  player.userData.armorMaterial.color.set(battlefieldThemeColors.operator);
  player.userData.accentMaterial.color.set(battlefieldThemeColors.highlight);
  player.userData.accentMaterial.emissive.set(battlefieldThemeColors.highlight);
  battlefieldThree.muzzleFlashTimer = Math.max(0, battlefieldThree.muzzleFlashTimer - deltaTime);
  battlefieldThree.weaponRig.userData.muzzleFlash.visible = battlefieldThree.muzzleFlashTimer > 0;

  const activeActors = new Set(battlefieldEnemies);
  for (const [actor, model] of battlefieldThree.enemyModels) {
    if (!activeActors.has(actor)) {
      scene.remove(model);
      battlefieldThree.enemyModels.delete(actor);
    }
  }
  battlefieldEnemies.forEach((enemy) => {
    let model = battlefieldThree.enemyModels.get(enemy);
    if (!model) {
      model = createBattlefieldSoldier(true);
      battlefieldThree.enemyModels.set(enemy, model);
      scene.add(model);
    }
    model.position.copy(scenePositionFromField(enemy.x, enemy.y));
    model.rotation.y = Math.PI / 2 - Math.atan2(operator.y - enemy.y, operator.x - enemy.x);
    model.userData.limbs.forEach((limb, index) => {
      limb.pivot.rotation.x = Math.sin(timestamp * 0.002 + enemy.phase + index * Math.PI) * 0.06;
    });
  });

  intel.visible = battlefieldState.hostiles === 0 && !battlefieldState.intelRecovered;
  if (intel.visible) {
    intel.position.set(-0.6, 0.25 + Math.sin(timestamp * 0.003) * 0.08, 0);
    intel.rotation.y += deltaTime * 0.7;
  }
  extraction.visible = battlefieldState.intelRecovered;
  extraction.material.color.set(battlefieldThemeColors.highlight);
  extraction.position.y = 0.045 + Math.sin(timestamp * 0.004) * 0.025;

  const forwardX = Math.cos(operator.angle);
  const forwardZ = Math.sin(operator.angle);
  const crouching = battlefieldKeys.has('ShiftLeft') || battlefieldKeys.has('ShiftRight') || touchMovementKeys.has('ShiftLeft');
  const cameraHeight = crouching ? 1.18 : 1.64 + (battlefieldMovement.active ? Math.sin(timestamp * 0.014) * 0.035 : 0);
  battlefieldThree.cameraPosition.set(playerPosition.x, cameraHeight, playerPosition.z);
  const pitch = battlefieldThree.cameraPitch;
  const horizontalLook = 24 * Math.cos(pitch);
  battlefieldThree.cameraRecoil = Math.max(0, battlefieldThree.cameraRecoil - deltaTime * 0.72);
  battlefieldThree.cameraTarget.set(
    playerPosition.x + forwardX * horizontalLook,
    cameraHeight + Math.sin(pitch + battlefieldThree.cameraRecoil) * 24,
    playerPosition.z + forwardZ * horizontalLook
  );
  camera.position.copy(battlefieldThree.cameraPosition);
  camera.lookAt(battlefieldThree.cameraTarget);
  battlefieldThree.weaponRig.position.y = battlefieldMovement.active ? Math.sin(timestamp * 0.014) * 0.025 : 0;

  battlefieldThree.tracers.forEach((tracer) => { tracer.life -= deltaTime; });
  battlefieldThree.tracers = battlefieldThree.tracers.filter((tracer) => {
    if (tracer.life > 0) return true;
    scene.remove(tracer.line);
    tracer.line.geometry.dispose();
    tracer.line.material.dispose();
    return false;
  });
  renderer.render(scene, camera);
}

function updateThreeAim(point) {
  if (!battlefieldThree) {
    operator.angle = Math.atan2(point.y - operator.y, point.x - operator.x);
    return;
  }
  battlefieldAimNdc.x = (point.x / battlefieldWorld.width) * 2 - 1;
  battlefieldAimNdc.y = 1 - (point.y / battlefieldWorld.height) * 2;
  battlefieldThree.raycaster.setFromCamera(battlefieldAimNdc, battlefieldThree.camera);
  const direction = battlefieldThree.raycaster.ray.direction;
  if (Math.hypot(direction.x, direction.z) > 0.001) operator.angle = Math.atan2(direction.z, direction.x);
  battlefieldThree.cameraPitch = Math.max(-0.38, Math.min(0.28, Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1))));
}

function battlefieldThreeTarget() {
  if (!battlefieldThree) return null;
  battlefieldThree.raycaster.setFromCamera(battlefieldAimNdc, battlefieldThree.camera);
  const models = [...battlefieldThree.enemyModels.values()];
  const hit = battlefieldThree.raycaster.intersectObjects(models, true)[0];
  if (!hit) return null;
  let model = hit.object;
  while (model && !battlefieldEnemies.some((enemy) => battlefieldThree.enemyModels.get(enemy) === model)) model = model.parent;
  const index = battlefieldEnemies.findIndex((enemy) => battlefieldThree.enemyModels.get(enemy) === model);
  return index < 0 ? null : { index, distance: hit.distance };
}

function addBattlefieldThreeTracer(target) {
  if (!battlefieldThree) return;
  const start = new THREE.Vector3();
  battlefieldThree.camera.getWorldPosition(start);
  const direction = new THREE.Vector3();
  battlefieldThree.camera.getWorldDirection(direction);
  start.addScaledVector(direction, 0.55);
  let end;
  if (target) {
    const enemy = battlefieldEnemies[target.index];
    const model = battlefieldThree.enemyModels.get(enemy);
    end = new THREE.Vector3();
    if (model) {
      model.getWorldPosition(end);
      end.y += 1.45;
    } else {
      end.copy(start).addScaledVector(direction, 42);
    }
  } else {
    end = start.clone().addScaledVector(direction, 42);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: '#ffe2a6', transparent: true, opacity: 0.94 });
  const line = new THREE.Line(geometry, material);
  battlefieldThree.scene.add(line);
  battlefieldThree.tracers.push({ line, life: 0.12 });
  battlefieldThree.muzzleFlashTimer = 0.1;
  battlefieldThree.cameraRecoil = Math.min(0.22, battlefieldThree.cameraRecoil + 0.095);
}

function syncBattlefieldActors() {
  while (battlefieldEnemies.length > battlefieldState.hostiles) battlefieldEnemies.pop();
  while (battlefieldEnemies.length < battlefieldState.hostiles) {
    const slot = battlefieldEnemies.length;
    battlefieldEnemies.push({
      x: 710 + Math.floor(slot / 3) * 84,
      y: [112, 240, 368][slot % 3],
      radius: 13,
      phase: slot * 1.7
    });
  }
}

function battlefieldPoint(event) {
  const bounds = battlefieldCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * battlefieldWorld.width,
    y: ((event.clientY - bounds.top) / bounds.height) * battlefieldWorld.height
  };
}

function drawOperator(context, x, y, angle, isHostile = false, isMoving = false) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  const responsiveScale = battlefieldWorld.height / battlefieldCanvas.clientHeight;
  const canvasScale = isHostile ? Math.min(1.35, responsiveScale) : Math.min(3.4, responsiveScale * 2.3);
  const stride = isMoving ? Math.sin(performance.now() / 75) * 5 : 0;
  context.scale(canvasScale, canvasScale);
  context.fillStyle = 'rgba(0, 0, 0, 0.42)';
  context.beginPath();
  context.ellipse(0, 6, 19, 13, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = isHostile ? '#d9aa87' : '#9ad5c8';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(-7, 5);
  context.lineTo(-10 - stride, 17);
  context.moveTo(5, 5);
  context.lineTo(8 + stride, 17);
  context.stroke();
  context.fillStyle = isHostile ? '#9f5247' : '#233b38';
  context.fillRect(-12, -7, 7, 15);
  context.fillRect(5, -7, 7, 15);
  context.fillStyle = isHostile ? '#9f5247' : battlefieldThemeColors.operator;
  context.beginPath();
  context.moveTo(-9, -9);
  context.lineTo(-6, -13);
  context.lineTo(6, -13);
  context.lineTo(10, -8);
  context.lineTo(9, 7);
  context.lineTo(5, 11);
  context.lineTo(-6, 11);
  context.lineTo(-10, 7);
  context.closePath();
  context.fill();
  context.fillStyle = isHostile ? '#6c3b35' : '#c1a66e';
  context.fillRect(-6, -6, 12, 12);
  context.strokeStyle = isHostile ? '#d9aa87' : '#c7cfc0';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(-9, -7);
  context.lineTo(-15, 0);
  context.lineTo(-12, 5);
  context.moveTo(9, -7);
  context.lineTo(15, -1);
  context.lineTo(11, 4);
  context.stroke();
  context.fillStyle = isHostile ? '#e18a69' : '#b5cdb4';
  context.fillRect(-5, -17, 10, 5);
  context.fillStyle = isHostile ? '#d6aa91' : '#c7a985';
  context.beginPath();
  context.arc(0, -11, 6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = isHostile ? '#a93e39' : '#304542';
  context.beginPath();
  context.arc(0, -13, 7, Math.PI, Math.PI * 2);
  context.fill();
  context.fillStyle = isHostile ? '#d5a779' : '#91a59a';
  context.fillRect(-3, -15, 6, 2);
  context.strokeStyle = '#202a28';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(8, -2);
  context.lineTo(25, -2);
  context.stroke();
  context.strokeStyle = isHostile ? '#ff7968' : battlefieldThemeColors.highlight;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(10, -2);
  context.lineTo(28, -2);
  context.stroke();
  context.restore();
}

function drawBattlefield() {
  const bounds = battlefieldCanvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const pixelRatio = window.devicePixelRatio || 1;
  const renderWidth = Math.round(bounds.width * pixelRatio);
  const renderHeight = Math.round(bounds.height * pixelRatio);
  if (battlefieldCanvas.width !== renderWidth || battlefieldCanvas.height !== renderHeight) {
    battlefieldCanvas.width = renderWidth;
    battlefieldCanvas.height = renderHeight;
  }
  battlefieldContext.setTransform(
    (bounds.width / battlefieldWorld.width) * pixelRatio,
    0,
    0,
    (bounds.height / battlefieldWorld.height) * pixelRatio,
    0,
    0
  );

  const context = battlefieldContext;
  context.clearRect(0, 0, battlefieldWorld.width, battlefieldWorld.height);
  context.fillStyle = '#26352d';
  context.fillRect(0, 0, battlefieldWorld.width, battlefieldWorld.height);

  const ground = context.createLinearGradient(0, 0, battlefieldWorld.width, battlefieldWorld.height);
  ground.addColorStop(0, '#354239');
  ground.addColorStop(0.52, '#6b6247');
  ground.addColorStop(1, '#343b32');
  context.fillStyle = ground;
  context.fillRect(0, 0, battlefieldWorld.width, battlefieldWorld.height);

  context.strokeStyle = 'rgba(205, 228, 191, 0.08)';
  context.lineWidth = 1;
  for (let x = 0; x < battlefieldWorld.width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, battlefieldWorld.height);
    context.stroke();
  }
  for (let y = 0; y < battlefieldWorld.height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(battlefieldWorld.width, y);
    context.stroke();
  }

  context.fillStyle = 'rgba(190, 145, 91, 0.32)';
  context.beginPath();
  context.moveTo(0, 196);
  context.lineTo(960, 152);
  context.lineTo(960, 212);
  context.lineTo(0, 278);
  context.closePath();
  context.fill();

  fieldCover().forEach((cover) => {
    context.fillStyle = 'rgba(8, 16, 17, 0.42)';
    context.fillRect(cover.x + 8, cover.y + 10, cover.width, cover.height);
    context.fillStyle = '#35413b';
    context.fillRect(cover.x, cover.y, cover.width, cover.height);
    context.fillStyle = '#718071';
    context.fillRect(cover.x + 5, cover.y + 5, cover.width - 10, 7);
    context.strokeStyle = 'rgba(198, 208, 176, 0.35)';
    context.strokeRect(cover.x + 0.5, cover.y + 0.5, cover.width - 1, cover.height - 1);
  });

  battlefieldEnemies.forEach((enemy) => {
    const idleOffset = Math.sin(performance.now() / 520 + enemy.phase) * 3;
    const angle = Math.atan2(operator.y - enemy.y, operator.x - enemy.x);
    drawOperator(context, enemy.x, enemy.y + idleOffset, angle, true);
    context.fillStyle = 'rgba(255, 117, 94, 0.9)';
    context.font = 'bold 10px Consolas, monospace';
    context.fillText('HOSTILE', enemy.x - 20, enemy.y - 26 + idleOffset);
  });

  if (battlefieldState.hostiles === 0 && !battlefieldState.intelRecovered) {
    context.fillStyle = '#ffbd66';
    context.fillRect(462, 224, 34, 30);
    context.strokeStyle = '#fff0ca';
    context.strokeRect(462, 224, 34, 30);
    context.fillStyle = '#171b18';
    context.font = 'bold 10px Consolas, monospace';
    context.fillText('INTEL', 461, 270);
  }
  if (battlefieldState.intelRecovered) {
    context.strokeStyle = battlefieldThemeColors.highlight;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(888, 240, 22 + Math.sin(performance.now() / 260) * 3, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = battlefieldThemeColors.highlight;
    context.font = 'bold 10px Consolas, monospace';
    context.fillText('EXFIL', 872, 278);
  }

  battlefieldTracers.forEach((tracer) => {
    context.globalAlpha = Math.max(0, tracer.life / 0.12);
    context.strokeStyle = '#ffd48b';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(tracer.startX, tracer.startY);
    context.lineTo(tracer.endX, tracer.endY);
    context.stroke();
    context.globalAlpha = 1;
  });

  drawOperator(context, operator.x, operator.y, operator.angle, false, battlefieldMovement.active);
  context.strokeStyle = battlefieldThemeColors.highlight;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(operatorAim.x, operatorAim.y, 9, 0, Math.PI * 2);
  context.moveTo(operatorAim.x - 15, operatorAim.y);
  context.lineTo(operatorAim.x - 5, operatorAim.y);
  context.moveTo(operatorAim.x + 5, operatorAim.y);
  context.lineTo(operatorAim.x + 15, operatorAim.y);
  context.moveTo(operatorAim.x, operatorAim.y - 15);
  context.lineTo(operatorAim.x, operatorAim.y - 5);
  context.moveTo(operatorAim.x, operatorAim.y + 5);
  context.lineTo(operatorAim.x, operatorAim.y + 15);
  context.stroke();

  const accessibleState = `Battlefield tactical view. Operator position ${Math.round(operator.x)}, ${Math.round(operator.y)}. ${battlefieldState.hostiles} hostiles remaining.`;
  if (accessibleState !== lastOperatorAccessibleState) {
    battlefieldCanvas.setAttribute('aria-label', accessibleState);
    lastOperatorAccessibleState = accessibleState;
  }
}

function fireOperatorWeapon() {
  if (battlefieldState.health <= 0 || battlefieldState.hostiles <= 0 || operator.shotCooldown > 0) return;
  if (battlefieldState.ammo <= 0) {
    document.getElementById('combatFeedback').textContent = 'Magazine empty. Reload before firing.';
    return;
  }

  const weapon = currentBattlefieldWeapon();
  const directionX = Math.cos(operator.angle);
  const directionY = Math.sin(operator.angle);
  const candidates = battlefieldEnemies.map((enemy, index) => {
    const offsetX = enemy.x - operator.x;
    const offsetY = enemy.y - operator.y;
    const distance = offsetX * directionX + offsetY * directionY;
    const missDistance = Math.abs(offsetX * directionY - offsetY * directionX);
    return { index, distance, missDistance };
  }).filter((target) => target.distance > 0 && target.distance < 820 && target.missDistance < 10 + weapon.accuracy * 0.1)
    .sort((first, second) => first.distance - second.distance);

  const target = battlefieldThree ? battlefieldThreeTarget() : candidates[0];
  const distance = target ? target.distance : 700;
  battlefieldTracers.push({
    startX: operator.x + directionX * 18,
    startY: operator.y + directionY * 18,
    endX: operator.x + directionX * distance,
    endY: operator.y + directionY * distance,
    life: 0.12
  });
  operator.shotCooldown = 0.22;
  battlefieldState.ammo -= 1;
  addBattlefieldThreeTracer(target);
  if (target) {
    battlefieldEnemies.splice(target.index, 1);
    battlefieldState.hostiles -= 1;
    battlefieldState.kills += 1;
    battlefieldState.xp += 35;
    battlefieldState.raidCredits += 25;
    addCombatLog(`Hostile neutralized with ${weapon.name}. +35 XP.`);
    document.getElementById('sceneMessage').textContent = battlefieldState.hostiles
      ? 'Target down. Scan for the next contact.'
      : 'Sector clear. Recover the intel cache.';
    document.getElementById('combatFeedback').textContent = `Confirmed hit. +35 XP, +25 CR salvage.`;
  } else {
    addCombatLog(`${weapon.name} fired. No target hit.`);
    document.getElementById('combatFeedback').textContent = 'Shot fired. Adjust your aim.';
  }
  saveBattlefieldState();
  renderBattlefield();
  battlefieldCanvas.focus({ preventScroll: true });
}

function tickOperatorCombat(deltaTime) {
  if (!document.getElementById('battlefield').classList.contains('active')) return;
  const heldKeys = new Set([...battlefieldKeys, ...touchMovementKeys]);
  let forward = Number(heldKeys.has('ArrowUp') || heldKeys.has('KeyW')) - Number(heldKeys.has('ArrowDown') || heldKeys.has('KeyS'));
  let right = Number(heldKeys.has('ArrowRight') || heldKeys.has('KeyD')) - Number(heldKeys.has('ArrowLeft') || heldKeys.has('KeyA'));
  battlefieldMovement.active = forward !== 0 || right !== 0;
  const movementLength = Math.hypot(forward, right) || 1;
  forward /= movementLength;
  right /= movementLength;
  const facingX = Math.cos(operator.angle);
  const facingY = Math.sin(operator.angle);
  const rightX = -facingY;
  const rightY = facingX;
  const movementX = facingX * forward + rightX * right;
  const movementY = facingY * forward + rightY * right;
  const movementScale = operator.speed * deltaTime;
  const nextX = Math.max(20, Math.min(940, operator.x + movementX * movementScale));
  const nextY = Math.max(24, Math.min(456, operator.y + movementY * movementScale));
  const blocked = fieldCover().some((cover) => nextX > cover.x - 14 && nextX < cover.x + cover.width + 14 && nextY > cover.y - 14 && nextY < cover.y + cover.height + 14);
  if (!blocked) {
    operator.x = nextX;
    operator.y = nextY;
  }
  if (!battlefieldThree) operator.angle = Math.atan2(operatorAim.y - operator.y, operatorAim.x - operator.x);
  operator.shotCooldown = Math.max(0, operator.shotCooldown - deltaTime);
  battlefieldTracers.forEach((tracer) => { tracer.life -= deltaTime; });
  while (battlefieldTracers.length && battlefieldTracers[0].life <= 0) battlefieldTracers.shift();

  const enemyInRange = battlefieldEnemies.some((enemy) => Math.hypot(enemy.x - operator.x, enemy.y - operator.y) < 480);
  battlefieldEnemies.forEach((enemy) => {
    const offsetX = operator.x - enemy.x;
    const offsetY = operator.y - enemy.y;
    const distance = Math.hypot(offsetX, offsetY) || 1;
    const movement = Math.min(26 * deltaTime, Math.max(0, distance - 180));
    if (movement <= 0) return;
    const stepX = (offsetX / distance) * movement;
    const stepY = (offsetY / distance) * movement;
    const options = [
      { x: enemy.x + stepX, y: enemy.y + stepY },
      { x: enemy.x + stepX, y: enemy.y },
      { x: enemy.x, y: enemy.y + stepY },
      { x: enemy.x + stepX, y: enemy.y - stepY }
    ];
    const nextPosition = options.find((position) => !fieldCover().some((cover) =>
      position.x > cover.x - 12 && position.x < cover.x + cover.width + 12
      && position.y > cover.y - 12 && position.y < cover.y + cover.height + 12));
    if (nextPosition) {
      enemy.x = nextPosition.x;
      enemy.y = nextPosition.y;
    }
  });
  if (battlefieldState.health > 0 && battlefieldState.hostiles > 0 && enemyInRange) {
    enemyAttackTimer -= deltaTime;
    if (enemyAttackTimer <= 0) {
      enemyAttackTimer = 2.8;
      const baseDamage = Math.floor(Math.random() * 8) + 5;
      const takingCover = heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight');
      const damage = takingCover ? Math.max(1, Math.floor(baseDamage * 0.45)) : baseDamage;
      battlefieldState.health = Math.max(0, battlefieldState.health - damage);
      if (battlefieldState.health <= 0) {
        battlefieldState.raidCredits = 0;
        battlefieldState.hostiles = missionHostileCount();
        battlefieldState.intelRecovered = false;
        document.getElementById('sceneMessage').textContent = 'Raid lost. Redeploy and return to the contract.';
        addCombatLog('Operator down. Unbanked salvage lost; contract reset.');
      } else {
        addCombatLog(`Incoming fire. Armor integrity reduced by ${damage}%.`);
      }
      saveBattlefieldState();
      renderBattlefield();
    }
  } else if (!enemyInRange) {
    enemyAttackTimer = 1.8;
  }
}

function battlefieldFrame(timestamp) {
  const deltaTime = battlefieldFrameTime ? Math.min((timestamp - battlefieldFrameTime) / 1000, 0.05) : 0;
  battlefieldFrameTime = timestamp;
  tickOperatorCombat(deltaTime);
  drawBattlefield();
  if (battlefieldThree) updateBattlefieldThree(deltaTime, timestamp);
  if (footballThree) updateFootballThree(timestamp);
  requestAnimationFrame(battlefieldFrame);
}

document.addEventListener('keydown', (event) => {
  if (!document.getElementById('battlefield').classList.contains('active')) return;
  if (event.target.matches('input, select, textarea, button')) return;
  const supportedKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
  if (supportedKeys.includes(event.code)) battlefieldKeys.add(event.code);
  if (event.code === 'Space') {
    event.preventDefault();
    fireOperatorWeapon();
  }
  if (event.code === 'KeyR') document.getElementById('reloadBtn').click();
  if (event.code === 'KeyE') {
    const objectiveButton = battlefieldState.hostiles === 0 && !battlefieldState.intelRecovered
      ? document.getElementById('recoverIntelBtn')
      : document.getElementById('extractBtn');
    if (!objectiveButton.disabled) objectiveButton.click();
  }
  if (event.code.startsWith('Arrow')) event.preventDefault();
});

document.addEventListener('keyup', (event) => {
  battlefieldKeys.delete(event.code);
});

window.addEventListener('blur', () => {
  battlefieldKeys.clear();
  touchMovementKeys.clear();
});

document.querySelectorAll('[data-move]').forEach((button) => {
  const beginMove = (event) => {
    event.preventDefault();
    touchMovementKeys.add(button.dataset.move);
    button.setPointerCapture(event.pointerId);
  };
  const endMove = () => touchMovementKeys.delete(button.dataset.move);
  button.addEventListener('pointerdown', beginMove);
  button.addEventListener('pointerup', endMove);
  button.addEventListener('pointercancel', endMove);
  button.addEventListener('lostpointercapture', endMove);
});

battlefieldCanvas.addEventListener('pointermove', (event) => {
  const point = battlefieldPoint(event);
  operatorAim.x = point.x;
  operatorAim.y = point.y;
  updateThreeAim(point);
  sceneReticle.style.left = `${(point.x / battlefieldWorld.width) * 100}%`;
  sceneReticle.style.top = `${(point.y / battlefieldWorld.height) * 100}%`;
});

battlefieldCanvas.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  const point = battlefieldPoint(event);
  operatorAim.x = point.x;
  operatorAim.y = point.y;
  updateThreeAim(point);
  sceneReticle.style.left = `${(point.x / battlefieldWorld.width) * 100}%`;
  sceneReticle.style.top = `${(point.y / battlefieldWorld.height) * 100}%`;
  fireOperatorWeapon();
});

document.getElementById('operatorFireBtn').addEventListener('click', fireOperatorWeapon);
requestAnimationFrame(battlefieldFrame);

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
  return battlefieldWeapons.find((weapon) => weapon.id === battlefieldState.weapon) || battlefieldWeapons[0];
}

function missionHostileCount() {
  return Math.min(3 + Math.floor(battlefieldState.missions / 2), 7);
}

function addCombatLog(message) {
  battlefieldState.log.unshift(message);
  battlefieldState.log = battlefieldState.log.slice(0, 5);
}

function renderBattlefield() {
  syncBattlefieldActors();
  const weapon = currentBattlefieldWeapon();
  const level = Math.floor(battlefieldState.xp / 100) + 1;
  const unlockedWeapons = battlefieldWeapons.filter((item) => battlefieldState.xp >= item.unlockXp);
  const weaponSelect = document.getElementById('weaponSelect');
  const healthBar = document.getElementById('healthBar');

  document.getElementById('operatorLevel').textContent = String(level).padStart(2, '0');
  document.getElementById('operatorXp').textContent = `${battlefieldState.xp} XP`;
  document.getElementById('rankProgress').style.width = `${battlefieldState.xp % 100}%`;
  document.getElementById('missionNumber').textContent = String(battlefieldState.mission).padStart(2, '0');
  document.getElementById('hostileCount').textContent = String(battlefieldState.hostiles).padStart(2, '0');
  document.getElementById('combatStatus').textContent = battlefieldState.health > 0 ? 'ACTIVE' : 'DOWN';
  document.getElementById('objectiveStatus').textContent = battlefieldState.health <= 0
    ? 'Operator down. Raid salvage lost.'
    : battlefieldState.hostiles > 0
      ? 'Clear hostiles, recover intel, extract.'
      : battlefieldState.intelRecovered
        ? 'Intel recovered. Reach extraction.'
        : 'Sector clear. Recover the intel cache.';
  document.getElementById('raidCreditsValue').textContent = `${battlefieldState.raidCredits} CR`;
  document.getElementById('creditsValue').textContent = `${battlefieldState.credits} CR`;
  document.getElementById('healthValue').textContent = `${battlefieldState.health}%`;
  healthBar.style.width = `${battlefieldState.health}%`;
  healthBar.classList.toggle('critical', battlefieldState.health <= 30);
  document.getElementById('ammoValue').textContent = battlefieldState.ammo;
  document.getElementById('reserveAmmo').textContent = battlefieldState.reserve;
  document.getElementById('eliminationCount').textContent = battlefieldState.kills;
  document.getElementById('weaponClass').textContent = weapon.className.toUpperCase();
  document.getElementById('weaponAccuracy').textContent = `${weapon.accuracy}%`;
  document.getElementById('weaponMagazine').textContent = weapon.magazine;
  document.getElementById('unlockCount').textContent = `${String(unlockedWeapons.length).padStart(2, '0')} / 04`;

  weaponSelect.innerHTML = battlefieldWeapons.map((item) => {
    const locked = battlefieldState.xp < item.unlockXp;
    return `<option value="${item.id}" ${locked ? 'disabled' : ''}>${locked ? 'LOCKED · ' : ''}${item.name}${locked ? ` · ${item.unlockXp} XP` : ''}</option>`;
  }).join('');
  weaponSelect.value = weapon.id;
  document.getElementById('weaponList').innerHTML = battlefieldWeapons.map((item) => {
    const unlocked = battlefieldState.xp >= item.unlockXp;
    return `<li class="weapon-entry ${unlocked ? 'unlocked' : 'locked'}"><span class="weapon-state">${unlocked ? '●' : '×'}</span><span><strong>${item.name}</strong><small>${unlocked ? item.className : `Unlock at ${item.unlockXp} XP`}</small></span><span class="weapon-tier">${unlocked ? 'READY' : 'LOCKED'}</span></li>`;
  }).join('');
  document.getElementById('combatLog').innerHTML = battlefieldState.log.map((message) => `<li>${message}</li>`).join('');
  document.getElementById('engageBtn').disabled = battlefieldState.health <= 0 || battlefieldState.hostiles <= 0;
  document.getElementById('operatorFireBtn').disabled = battlefieldState.health <= 0 || battlefieldState.hostiles <= 0;
  document.getElementById('coverBtn').disabled = battlefieldState.hostiles <= 0;
  document.getElementById('coverBtn').innerHTML = battlefieldState.health <= 0 ? '<span>02</span> Redeploy' : '<span>02</span> Take cover';
  document.getElementById('reloadBtn').disabled = battlefieldState.health <= 0 || battlefieldState.hostiles <= 0 || battlefieldState.ammo >= weapon.magazine || battlefieldState.reserve <= 0;
  document.getElementById('recoverIntelBtn').disabled = battlefieldState.health <= 0 || battlefieldState.hostiles > 0 || battlefieldState.intelRecovered;
  document.getElementById('extractBtn').disabled = battlefieldState.health <= 0 || battlefieldState.hostiles > 0 || !battlefieldState.intelRecovered;
}

function enemyResponse() {
  if (battlefieldState.hostiles <= 0 || battlefieldState.health <= 0) return;
  const damage = battlefieldState.covered ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 17) + 8;
  battlefieldState.health = Math.max(0, battlefieldState.health - damage);
  battlefieldState.covered = false;
  if (battlefieldState.health <= 0) {
    battlefieldState.raidCredits = 0;
    battlefieldState.hostiles = missionHostileCount();
    battlefieldState.intelRecovered = false;
    document.getElementById('sceneMessage').textContent = 'Raid lost. Redeploy and return to the contract.';
    addCombatLog('Operator down. Unbanked salvage lost; contract reset.');
  } else {
    addCombatLog(`Incoming fire. Armor integrity reduced by ${damage}%.`);
  }
}

document.getElementById('engageBtn').addEventListener('click', fireOperatorWeapon);

document.getElementById('coverBtn').addEventListener('click', () => {
  if (battlefieldState.hostiles <= 0) return;
  if (battlefieldState.health <= 0) {
    battlefieldState.health = 100;
    battlefieldState.covered = false;
    battlefieldState.ammo = currentBattlefieldWeapon().magazine;
    battlefieldState.reserve = currentBattlefieldWeapon().reserve;
    operator.x = 110;
    operator.y = 240;
    addCombatLog('Operator redeployed. Contract reset; recover intel and extract.');
    document.getElementById('sceneMessage').textContent = 'Operator back in the field. Secure the objective.';
    document.getElementById('combatFeedback').textContent = 'Redeployed with full armor. Contract progress was reset.';
    saveBattlefieldState();
    renderBattlefield();
    battlefieldCanvas.focus({ preventScroll: true });
    return;
  }
  battlefieldState.covered = true;
  document.getElementById('combatFeedback').textContent = 'Taking cover. Incoming fire reduced.';
  enemyResponse();
  saveBattlefieldState();
  renderBattlefield();
  battlefieldCanvas.focus({ preventScroll: true });
});

document.getElementById('recoverIntelBtn').addEventListener('click', () => {
  if (battlefieldState.health <= 0 || battlefieldState.hostiles > 0 || battlefieldState.intelRecovered) return;
  battlefieldState.intelRecovered = true;
  battlefieldState.raidCredits += 100;
  addCombatLog('Intel package recovered. +100 CR salvage. Proceed to extraction.');
  document.getElementById('sceneMessage').textContent = 'Intel secured. Extraction coordinates uploaded.';
  document.getElementById('combatFeedback').textContent = 'Intel recovered. Extract to bank your raid salvage.';
  saveBattlefieldState();
  renderBattlefield();
  battlefieldCanvas.focus({ preventScroll: true });
});

document.getElementById('reloadBtn').addEventListener('click', () => {
  const weapon = currentBattlefieldWeapon();
  if (battlefieldState.health <= 0 || battlefieldState.hostiles <= 0 || battlefieldState.reserve <= 0) return;
  const loaded = Math.min(weapon.magazine - battlefieldState.ammo, battlefieldState.reserve);
  battlefieldState.ammo += loaded;
  battlefieldState.reserve -= loaded;
  document.getElementById('combatFeedback').textContent = `${weapon.name} reloaded. ${loaded} rounds added.`;
  addCombatLog(`Reload complete. ${battlefieldState.ammo} rounds in magazine.`);
  enemyResponse();
  saveBattlefieldState();
  renderBattlefield();
  battlefieldCanvas.focus({ preventScroll: true });
});

document.getElementById('extractBtn').addEventListener('click', () => {
  if (battlefieldState.hostiles > 0 || !battlefieldState.intelRecovered || battlefieldState.health <= 0) return;
  const securedCredits = battlefieldState.raidCredits;
  battlefieldState.missions += 1;
  battlefieldState.mission += 1;
  battlefieldState.xp += 100;
  battlefieldState.credits += securedCredits;
  battlefieldState.raidCredits = 0;
  battlefieldState.intelRecovered = false;
  battlefieldState.hostiles = missionHostileCount();
  battlefieldState.health = 100;
  battlefieldState.covered = false;
  battlefieldState.ammo = currentBattlefieldWeapon().magazine;
  battlefieldState.reserve = currentBattlefieldWeapon().reserve;
  operator.x = 110;
  operator.y = 240;
  addCombatLog(`Extraction complete. +100 XP, ${securedCredits} CR banked. Mission ${battlefieldState.missions} cleared.`);
  document.getElementById('sceneMessage').textContent = 'New objective received. Move to the next sector.';
  document.getElementById('combatFeedback').textContent = `Extraction confirmed. +100 XP, ${securedCredits} CR banked.`;
  saveBattlefieldState();
  renderBattlefield();
  battlefieldCanvas.focus({ preventScroll: true });
});

document.getElementById('weaponSelect').addEventListener('change', (event) => {
  const nextWeapon = battlefieldWeapons.find((weapon) => weapon.id === event.target.value);
  if (!nextWeapon || battlefieldState.xp < nextWeapon.unlockXp) return;
  if (battlefieldState.hostiles !== missionHostileCount() || battlefieldState.health < 100 || battlefieldState.intelRecovered) {
    document.getElementById('combatFeedback').textContent = 'Loadout changes are only available at mission deployment.';
    renderBattlefield();
    return;
  }
  battlefieldState.weapon = nextWeapon.id;
  battlefieldState.ammo = nextWeapon.magazine;
  battlefieldState.reserve = nextWeapon.reserve;
  document.getElementById('combatFeedback').textContent = `${nextWeapon.name} equipped. Fresh magazine issued.`;
  saveBattlefieldState();
  renderBattlefield();
});

function renderAssignments() {
  assignmentList.innerHTML = '';

  schoolAssignments.forEach((assignment) => {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.innerHTML = `
      <div class="detail">
        <strong>${assignment.name}</strong>
        <span>${assignment.subject} • Due ${assignment.due}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="badge">${assignment.priority}</span>
        <button data-id="${assignment.id}">Done</button>
      </div>
    `;
    assignmentList.appendChild(item);
  });

  const sorted = [...schoolAssignments].sort((a, b) => a.due.localeCompare(b.due));
  const next = sorted[0]?.name ?? 'None';
  nextTaskName.textContent = next;
  taskCount.textContent = schoolAssignments.length;
  schoolSummaryCount.textContent = schoolAssignments.length;
  studyHours.textContent = `${Math.max(2, schoolAssignments.length * 2)}h`;

  const gpa = (schoolAssignments.length * 0.4 + 3.5).toFixed(1);
  gpaValue.textContent = gpa;

  const buttons = assignmentList.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const index = schoolAssignments.findIndex((item) => item.id === id);
      if (index >= 0) {
        schoolAssignments.splice(index, 1);
        renderAssignments();
      }
    });
  });
}

function renderAgenda() {
  agendaDaysContainer.innerHTML = '';

  agendaDays.forEach((day) => {
    const button = document.createElement('button');
    button.className = `agenda-day ${day === selectedAgendaDay ? 'active' : ''}`;
    button.textContent = day;
    button.addEventListener('click', () => {
      selectedAgendaDay = day;
      renderAgenda();
    });
    agendaDaysContainer.appendChild(button);
  });

  const currentEvents = schoolAgenda[selectedAgendaDay] || [];
  agendaList.innerHTML = '';

  if (!currentEvents.length) {
    agendaList.innerHTML = '<li class="agenda-empty">No events planned yet.</li>';
    return;
  }

  currentEvents.forEach((event) => {
    const item = document.createElement('li');
    item.className = `agenda-item ${event.done ? 'done' : ''}`;
    item.innerHTML = `
      <div>
        <strong>${event.title}</strong>
        <span>${event.time} • ${event.type}</span>
      </div>
      <div class="agenda-actions">
        <button class="agenda-toggle" data-id="${event.id}">${event.done ? 'Undo' : 'Done'}</button>
        <button class="agenda-delete" data-id="${event.id}">×</button>
      </div>
    `;
    agendaList.appendChild(item);
  });

  agendaList.querySelectorAll('.agenda-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const events = schoolAgenda[selectedAgendaDay];
      const event = events.find((item) => item.id === id);
      if (event) {
        event.done = !event.done;
        renderAgenda();
      }
    });
  });

  agendaList.querySelectorAll('.agenda-delete').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const events = schoolAgenda[selectedAgendaDay];
      const index = events.findIndex((item) => item.id === id);
      if (index >= 0) {
        events.splice(index, 1);
        renderAgenda();
      }
    });
  });
}

addAgendaBtn.addEventListener('click', () => {
  agendaForm.classList.toggle('hidden');
});

saveAgendaBtn.addEventListener('click', () => {
  const title = agendaTitleInput.value.trim();
  const time = agendaTimeInput.value;
  const type = agendaTypeSelect.value;

  if (!title || !time) {
    alert('Add an event title and time before saving.');
    return;
  }

  const events = schoolAgenda[selectedAgendaDay] || [];
  events.push({ id: Date.now(), title, time, type, done: false });
  agendaTitleInput.value = '';
  agendaTimeInput.value = '';
  agendaTypeSelect.value = 'Study';
  agendaForm.classList.add('hidden');
  renderAgenda();
});

addAssignmentBtn.addEventListener('click', () => {
  const name = assignmentNameInput.value.trim();
  const subject = assignmentSubjectInput.value.trim();
  const due = assignmentDueInput.value;
  const priority = assignmentPrioritySelect.value;

  if (!name || !subject || !due) {
    alert('Please complete the assignment form before adding it.');
    return;
  }

  schoolAssignments.push({
    id: Date.now(),
    name,
    subject,
    due,
    priority
  });

  assignmentNameInput.value = '';
  assignmentSubjectInput.value = '';
  assignmentDueInput.value = '';
  assignmentPrioritySelect.value = 'High';

  renderAssignments();
});

function buildInstructionSteps(theme, totalPieces, color, buildIdea = '') {
  const cleanIdea = buildIdea.trim() || 'custom build';
  const themeSpecific = {
    City: 'This build should feel like a compact city landmark with a strong front face and a practical base. Create a believable street-level object with clear entry points and visual weight.',
    Space: 'This build should feel like a futuristic spacecraft or station module. Keep the shape aerodynamic, layered, and visually advanced with a confident front section.',
    Castle: 'This build should feel like a grand defensive structure. Focus on tall walls, a central gate, and a silhouette that reads like a fortress from a distance.',
    Ninja: 'This build should feel stealthy and sharp. Use clean angles, dark accents, and a compact profile so the model feels disciplined and tactical.'
  };

  const ideaDescriptor = /car|vehicle|race|truck|bike|train|ship|plane|rocket|station|fortress|tower|castle|dragon|robot|dinosaur|monster|house|shop|base|cabin|bridge|garage|hangar|lab/.test(cleanIdea.toLowerCase())
    ? cleanIdea
    : `a ${cleanIdea}`;

  return [
    `Step 1: Start with the base. Lay the plates flat and build the footprint for ${ideaDescriptor} so the model feels solid and grounded.`,
    `Step 2: Create the main body. Stack the largest bricks around the center to form the core structure of ${ideaDescriptor}.`,
    `Step 3: Add the defining feature. Place the most important element of ${cleanIdea} in the front or center so the build reads clearly from the front.`,
    `Step 4: Use ${color.toLowerCase()} as the dominant color. Apply it to the largest visible surfaces so ${ideaDescriptor} stands out.`,
    `Step 5: Add a secondary layer. Fill in the side panels, roof edges, or lower sections with trim pieces and smaller accents.`,
    `Step 6: Shape the silhouette. Extend the walls, roof, or wing panels until the build has a clear, recognizable outline.`,
    `Step 7: Add detail. Attach a small accessory, window, tile, shield, antenna, or character pose that matches the concept of ${cleanIdea}.`,
    `Step 8: Final review. Check proportions, weight distribution, and color balance so the design feels intentional and complete at ${totalPieces} pieces.`,
    `${themeSpecific[theme] || 'Design a balanced build with a strong silhouette and layered details. '}This version is tailored around your idea: ${cleanIdea}.`
  ];
}

function renderCurrentSetSummary() {
  const pieces = Number(pieceRange.value);
  const theme = themeSelect.value;
  const buildIdea = buildIdeaInput.value.trim();
  const extras = (document.getElementById('miniFigure').checked ? 10 : 0)
    + (document.getElementById('basePlate').checked ? 18 : 0)
    + (document.getElementById('specialTile').checked ? 8 : 0);

  const totalPieces = pieces + extras;
  const steps = buildInstructionSteps(theme, totalPieces, selectedColor, buildIdea);

  pieceValue.textContent = pieces;
  designSummary.innerHTML = `
    <strong>${theme}</strong><br>
    Build: ${buildIdea || 'Custom build'}<br>
    Color: ${selectedColor}<br>
    Total pieces: ${totalPieces}<br>
    <ol class="instruction-list">
      ${steps.map((step) => `<li>${step}</li>`).join('')}
    </ol>
  `;

  const brickColors = {
    Yellow: '#f4d35e',
    Red: '#ef476f',
    Blue: '#118ab2',
    Green: '#2a9d8f',
    Black: '#1d3557'
  };

  designPreview.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const color = brickColors[selectedColor];
    return `<div class="brick" style="background:${color}; opacity:${0.7 + (index % 5) * 0.06};"></div>`;
  }).join('');

  setTotalCost.textContent = 'Booklet';
}

pieceRange.addEventListener('input', renderCurrentSetSummary);
themeSelect.addEventListener('change', renderCurrentSetSummary);
buildIdeaInput.addEventListener('input', renderCurrentSetSummary);

document.getElementById('miniFigure').addEventListener('change', renderCurrentSetSummary);
document.getElementById('basePlate').addEventListener('change', renderCurrentSetSummary);
document.getElementById('specialTile').addEventListener('change', renderCurrentSetSummary);

colorSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    colorSwatches.forEach((item) => item.classList.toggle('active', item === swatch));
    selectedColor = swatch.dataset.color;
    renderCurrentSetSummary();
  });
});

function renderLegoSets() {
  builderList.innerHTML = '';

  legoSets.forEach((set) => {
    const steps = buildInstructionSteps(set.theme, set.pieces, set.color, set.idea || 'custom build');
    const item = document.createElement('li');
    item.className = 'lego-item';
    item.innerHTML = `
      <div>
        <strong>${set.title || set.theme}</strong><br>
        <span>${set.pieces} pieces • ${set.color} • ${set.theme}</span>
      </div>
      <div class="lego-instructions">
        ${steps.slice(0, 3).map((step) => `<div>${step}</div>`).join('')}
      </div>
    `;
    builderList.appendChild(item);
  });

  setTotalCost.textContent = 'Booklet';
  legoSummaryPieces.textContent = legoSets.reduce((sum, set) => sum + set.pieces, 0).toString();
}

addSetBtn.addEventListener('click', () => {
  const theme = themeSelect.value;
  const basePieces = Number(pieceRange.value);
  const extras = (document.getElementById('miniFigure').checked ? 10 : 0)
    + (document.getElementById('basePlate').checked ? 18 : 0)
    + (document.getElementById('specialTile').checked ? 8 : 0);

  const totalPieces = basePieces + extras;
  const customIdea = buildIdeaInput.value.trim() || 'Custom build';

  legoSets.push({
    id: Date.now(),
    title: customIdea,
    theme,
    pieces: totalPieces,
    color: selectedColor,
    idea: customIdea,
    cost: totalPieces
  });

  renderLegoSets();
  renderCurrentSetSummary();
});

setInterval(tickGameClock, 1000);
updateGameState();
renderAssignments();
renderAgenda();
renderCurrentSetSummary();
renderLegoSets();
renderBattlefield();

const themeStorageKey = 'codemaster-theme-v1';
const themeDefaults = {
  background: '#0b1220',
  surface: '#101a2a',
  accent: '#22c55e',
  highlight: '#38bdf8',
  text: '#ecf4ff',
  muted: '#b3c1d9',
  font: 'system'
};
const themePresets = {
  operations: themeDefaults,
  arctic: { background: '#081820', surface: '#102832', accent: '#54d6cf', highlight: '#90b9ff', text: '#eaf9fa', muted: '#a9c5c9', font: 'technical' },
  canopy: { background: '#101a13', surface: '#1b2b20', accent: '#93c47d', highlight: '#dfb65d', text: '#f0f5e9', muted: '#bac5af', font: 'system' },
  ember: { background: '#1b1114', surface: '#2a1b20', accent: '#ff765e', highlight: '#ffbf69', text: '#fff2eb', muted: '#d6b8ad', font: 'editorial' }
};
const themeColorInputs = {
  background: document.getElementById('themeBackground'),
  surface: document.getElementById('themeSurface'),
  accent: document.getElementById('themeAccent'),
  highlight: document.getElementById('themeHighlight'),
  text: document.getElementById('themeText'),
  muted: document.getElementById('themeMuted')
};
const themePresetInput = document.getElementById('themePresetInput');
const themeFontInput = document.getElementById('themeFontInput');
const themeFontFamilies = {
  system: '"Segoe UI", Tahoma, sans-serif',
  technical: '"Consolas", "Courier New", monospace',
  editorial: 'Georgia, "Times New Roman", serif'
};

function themeFromInputs() {
  return {
    ...Object.fromEntries(Object.entries(themeColorInputs).map(([key, input]) => [key, input.value])),
    font: themeFontInput.value
  };
}

function applyTheme(theme, preset = 'custom', persist = true) {
  const normalized = { ...themeDefaults };
  for (const [key, input] of Object.entries(themeColorInputs)) {
    const value = theme[key];
    normalized[key] = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : themeDefaults[key];
    input.value = normalized[key];
  }
  normalized.font = Object.hasOwn(themeFontFamilies, theme.font) ? theme.font : themeDefaults.font;
  themeFontInput.value = normalized.font;

  const root = document.documentElement.style;
  root.setProperty('--bg', normalized.background);
  root.setProperty('--bg-soft', `color-mix(in srgb, ${normalized.background} 76%, ${normalized.highlight})`);
  root.setProperty('--panel', normalized.surface);
  root.setProperty('--panel-alt', `color-mix(in srgb, ${normalized.surface} 72%, ${normalized.background})`);
  root.setProperty('--card', `color-mix(in srgb, ${normalized.surface} 88%, ${normalized.background})`);
  root.setProperty('--card-strong', normalized.surface);
  root.setProperty('--accent', normalized.accent);
  root.setProperty('--accent-2', normalized.highlight);
  root.setProperty('--accent-3', normalized.highlight);
  root.setProperty('--accent-4', normalized.accent);
  root.setProperty('--text', normalized.text);
  root.setProperty('--muted', normalized.muted);
  root.setProperty('--line', `color-mix(in srgb, ${normalized.text} 22%, transparent)`);
  root.setProperty('--font-body', themeFontFamilies[normalized.font]);
  battlefieldThemeColors.operator = normalized.accent;
  battlefieldThemeColors.highlight = normalized.highlight;
  document.querySelector('meta[name="theme-color"]').content = normalized.background;
  themePresetInput.value = Object.hasOwn(themePresets, preset) ? preset : 'custom';

  if (persist) {
    try {
      localStorage.setItem(themeStorageKey, JSON.stringify({ ...normalized, preset: themePresetInput.value }));
    } catch {
      document.getElementById('combatFeedback').textContent = 'Theme updated for this session but could not be saved.';
    }
  }
}

function restoreTheme() {
  try {
    const savedTheme = JSON.parse(localStorage.getItem(themeStorageKey));
    if (savedTheme) {
      applyTheme(savedTheme, savedTheme.preset, false);
      return;
    }
  } catch {
    localStorage.removeItem(themeStorageKey);
  }
  applyTheme(themeDefaults, 'operations', false);
}

themePresetInput.addEventListener('change', () => {
  const preset = themePresets[themePresetInput.value];
  if (preset) applyTheme(preset, themePresetInput.value);
});

Object.values(themeColorInputs).forEach((input) => {
  input.addEventListener('input', () => applyTheme(themeFromInputs()));
});
themeFontInput.addEventListener('change', () => applyTheme(themeFromInputs()));
document.getElementById('resetThemeBtn').addEventListener('click', () => applyTheme(themeDefaults, 'operations'));
window.addEventListener('storage', (event) => {
  if (event.key !== themeStorageKey) return;
  try {
    if (event.newValue) {
      const savedTheme = JSON.parse(event.newValue);
      applyTheme(savedTheme, savedTheme.preset, false);
    } else {
      applyTheme(themeDefaults, 'operations', false);
    }
  } catch {
    applyTheme(themeDefaults, 'operations', false);
  }
});
restoreTheme();
initializeBattlefieldThree();
initializeFootballThree();

const installAppButton = document.getElementById('installAppBtn');
const installHelpDialog = document.getElementById('installHelpDialog');
let deferredInstallPrompt = null;

function setInstallHelp(message, steps) {
  document.getElementById('installHelpText').textContent = message;
  const stepList = document.getElementById('installSteps');
  stepList.replaceChildren();
  steps.forEach((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    stepList.appendChild(item);
  });
  installHelpDialog.showModal();
}

function showManualInstallHelp() {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) {
    setInstallHelp('Add this app to your Home Screen from Safari.', [
      'Open the Share menu.',
      'Choose Add to Home Screen.',
      'Confirm by choosing Add.'
    ]);
    return;
  }

  if (/Android/i.test(navigator.userAgent)) {
    setInstallHelp('Install this app from your browser menu.', [
      'Open the browser menu.',
      'Choose Install app or Add to Home screen.',
      'Confirm the install prompt.'
    ]);
    return;
  }

  setInstallHelp('Install this app from a supported browser.', [
    'Use the install icon in the address bar, or open the browser menu.',
    'Choose Install Code Master Hub.',
    'Confirm the install prompt.'
  ]);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  installAppButton.textContent = 'Installed';
  installAppButton.disabled = true;
});

installAppButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    showManualInstallHelp();
    return;
  }

  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;
  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  if (choice.outcome === 'accepted') {
    installAppButton.textContent = 'Installed';
    installAppButton.disabled = true;
  }
});

document.getElementById('closeInstallHelpBtn').addEventListener('click', () => installHelpDialog.close());

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('./service-worker.js').catch((error) => {
    console.warn('Offline app support could not be registered.', error);
  });
}
