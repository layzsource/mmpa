// humanoid.js - Viscous Dancing Humanoid
// Based on viscous humanoid MIDI & Audio visualizer

import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

console.log('🕺 humanoid.js loaded');

let humanoidGroup = null;
let humanoidMesh = null;
let skeleton = null;
let clock = new THREE.Clock();
let lastLoopTime = 0;
let currentArmVariant = 0;
let danceState = 'dancing';
let turnStartTime = 0;
let turnDirection = 1;
let baseRotationY = 0;

// --- Humanoid Factory Function (Creates SkinnedMesh) ---
function createHumanoid(material) {
  const bones = [];
  const geometries = [];

  // --- Bone Creation ---
  const hipRoot = new THREE.Bone(); hipRoot.name = 'hipRoot'; hipRoot.position.y = 1.0;
  const belly = new THREE.Bone(); belly.name = 'belly'; belly.position.y = 0.1; hipRoot.add(belly);
  const chest = new THREE.Bone(); chest.name = 'chest'; chest.position.y = 0.8; belly.add(chest);
  const neck = new THREE.Bone(); neck.name = 'neck'; neck.position.y = 0.8; chest.add(neck);
  const head = new THREE.Bone(); head.name = 'head'; head.position.y = 0.8; neck.add(head);

  const upperArmL = new THREE.Bone(); upperArmL.name = 'upperArmL'; upperArmL.position.set(-1.1, 0.7, 0); chest.add(upperArmL);
  const forearmL = new THREE.Bone(); forearmL.name = 'forearmL'; forearmL.position.y = -1.2; upperArmL.add(forearmL);
  const handL = new THREE.Bone(); handL.name = 'handL'; handL.position.y = -1.2; forearmL.add(handL);

  const upperArmR = new THREE.Bone(); upperArmR.name = 'upperArmR'; upperArmR.position.set(1.1, 0.7, 0); chest.add(upperArmR);
  const forearmR = new THREE.Bone(); forearmR.name = 'forearmR'; forearmR.position.y = -1.2; upperArmR.add(forearmR);
  const handR = new THREE.Bone(); handR.name = 'handR'; handR.position.y = -1.2; forearmR.add(handR);

  const upperLegL = new THREE.Bone(); upperLegL.name = 'upperLegL'; upperLegL.position.set(-0.8, 0, 0); hipRoot.add(upperLegL);
  const lowerLegL = new THREE.Bone(); lowerLegL.name = 'lowerLegL'; lowerLegL.position.y = -1.5; upperLegL.add(lowerLegL);
  const footL = new THREE.Bone(); footL.name = 'footL'; footL.position.y = -1.5; lowerLegL.add(footL);

  const upperLegR = new THREE.Bone(); upperLegR.name = 'upperLegR'; upperLegR.position.set(0.8, 0, 0); hipRoot.add(upperLegR);
  const lowerLegR = new THREE.Bone(); lowerLegR.name = 'lowerLegR'; lowerLegR.position.y = -1.5; upperLegR.add(lowerLegR);
  const footR = new THREE.Bone(); footR.name = 'footR'; footR.position.y = -1.5; lowerLegR.add(footR);

  const boneList = [hipRoot, belly, chest, neck, head, upperArmL, forearmL, handL, upperArmR, forearmR, handR, upperLegL, lowerLegL, footL, upperLegR, lowerLegR, footR];
  boneList.forEach(b => bones.push(b));

  hipRoot.updateWorldMatrix(true, true);

  // --- Skinning Helper ---
  const addSkinning = (geometry, boneName) => {
    const boneIndex = bones.findIndex(b => b.name === boneName);
    const position = geometry.attributes.position;
    const vertexCount = position.count;
    const skinIndices = new THREE.Float32BufferAttribute(vertexCount * 4, 4);
    const skinWeights = new THREE.Float32BufferAttribute(vertexCount * 4, 4);
    for (let i = 0; i < vertexCount; i++) {
      skinIndices.setX(i, boneIndex);
      skinWeights.setX(i, 1);
    }
    geometry.setAttribute('skinIndex', skinIndices);
    geometry.setAttribute('skinWeight', skinWeights);
    return geometry;
  };

  const createLimbGeometry = (bone1, bone2, radius, boneNameToSkin) => {
    const p1 = new THREE.Vector3(); const p2 = new THREE.Vector3();
    bone1.getWorldPosition(p1); bone2.getWorldPosition(p2);
    const length = p1.distanceTo(p2);
    if (length < radius * 2) return null;
    const geo = new THREE.CapsuleGeometry(radius, length - radius * 2, 16, 32);
    const tempMesh = new THREE.Mesh();
    tempMesh.position.copy(p1).lerp(p2, 0.5);
    const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
    if (direction.lengthSq() > 0.0001) {
      tempMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    }
    tempMesh.updateMatrix();
    geo.applyMatrix4(tempMesh.matrix);
    return addSkinning(geo, boneNameToSkin);
  };

  const createEndEffector = (geo, bone) => {
    const newGeo = geo.clone();
    const mesh = new THREE.Mesh(newGeo);
    bone.getWorldPosition(mesh.position);
    bone.getWorldQuaternion(mesh.quaternion);
    mesh.updateMatrix();
    newGeo.applyMatrix4(mesh.matrix);
    geometries.push(addSkinning(newGeo, bone.name));
  };

  // --- Body Geometries ---
  const hipsGeo = new THREE.SphereGeometry(0.9, 32, 16);
  hipsGeo.translate(0, 1.0, 0);
  geometries.push(addSkinning(hipsGeo, 'hipRoot'));

  // Belly cylinder
  const bellyP1 = new THREE.Vector3(); const bellyP2 = new THREE.Vector3();
  belly.getWorldPosition(bellyP1); chest.getWorldPosition(bellyP2);
  const bellyHeight = bellyP1.distanceTo(bellyP2);
  const bellyGeo = new THREE.CylinderGeometry(0.9, 0.8, bellyHeight, 32);
  const bellyMesh = new THREE.Mesh();
  bellyMesh.position.copy(bellyP1).lerp(bellyP2, 0.5);
  const bellyDir = new THREE.Vector3().subVectors(bellyP2, bellyP1).normalize();
  if (bellyDir.lengthSq() > 0.0001) {
    bellyMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bellyDir);
  }
  bellyMesh.updateMatrix();
  bellyGeo.applyMatrix4(bellyMesh.matrix);
  geometries.push(addSkinning(bellyGeo, 'belly'));

  // Chest box
  const chestGeo = new THREE.BoxGeometry(2.0, 1.2, 0.9);
  const chestMesh = new THREE.Mesh(chestGeo);
  chest.getWorldPosition(chestMesh.position);
  chestMesh.position.y += 0.2;
  chestMesh.updateMatrix();
  chestGeo.applyMatrix4(chestMesh.matrix);
  geometries.push(addSkinning(chestGeo, 'chest'));

  // Neck cylinder
  const neckP1 = new THREE.Vector3(); const neckP2 = new THREE.Vector3();
  neck.getWorldPosition(neckP1); head.getWorldPosition(neckP2);
  const neckHeight = neckP1.distanceTo(neckP2);
  const neckGeo = new THREE.CylinderGeometry(0.4, 0.4, neckHeight, 16);
  const neckMesh = new THREE.Mesh();
  neckMesh.position.copy(neckP1).lerp(neckP2, 0.5);
  const neckDir = new THREE.Vector3().subVectors(neckP2, neckP1).normalize();
  if (neckDir.lengthSq() > 0.0001) {
    neckMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), neckDir);
  }
  neckMesh.updateMatrix();
  neckGeo.applyMatrix4(neckMesh.matrix);
  geometries.push(addSkinning(neckGeo, 'neck'));

  const headSphere = new THREE.SphereGeometry(0.8, 64, 32);
  createEndEffector(headSphere, head);

  const armRadius = 0.3, forearmRadius = 0.28;
  const legRadius = 0.4, lowerLegRadius = 0.38;

  geometries.push(createLimbGeometry(upperArmL, forearmL, armRadius, 'upperArmL'));
  geometries.push(createLimbGeometry(forearmL, handL, forearmRadius, 'forearmL'));
  geometries.push(createLimbGeometry(upperArmR, forearmR, armRadius, 'upperArmR'));
  geometries.push(createLimbGeometry(forearmR, handR, forearmRadius, 'forearmR'));
  geometries.push(createLimbGeometry(upperLegL, lowerLegL, legRadius, 'upperLegL'));
  geometries.push(createLimbGeometry(lowerLegL, footL, lowerLegRadius, 'lowerLegL'));
  geometries.push(createLimbGeometry(upperLegR, lowerLegR, legRadius, 'upperLegR'));
  geometries.push(createLimbGeometry(lowerLegR, footR, lowerLegRadius, 'lowerLegR'));

  const handGeo = new THREE.CapsuleGeometry(forearmRadius * 1.1, 0.4, 16, 32);
  handGeo.translate(0, -0.2, 0);
  const footGeo = new THREE.CapsuleGeometry(legRadius, 0.6, 16, 32);
  footGeo.rotateX(Math.PI / 2);
  footGeo.translate(0, 0, 0.3);

  createEndEffector(handGeo, handL);
  createEndEffector(handGeo, handR);
  createEndEffector(footGeo, footL);
  createEndEffector(footGeo, footR);

  // --- Merge & Create SkinnedMesh ---
  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries.filter(g => g !== null), false);
  const skeletonObj = new THREE.Skeleton(bones);
  material.skinning = true;
  const mesh = new THREE.SkinnedMesh(mergedGeometry, material);

  mesh.add(skeletonObj.bones[0]);
  mesh.bind(skeletonObj);

  return { mesh, skeleton: skeletonObj };
}

// --- Initialize Humanoid ---
export function initHumanoid(scene) {
  if (humanoidGroup) {
    console.warn('🕺 Humanoid already initialized');
    return;
  }

  humanoidGroup = new THREE.Group();
  humanoidGroup.visible = false; // Hidden by default
  // Position at origin - foot planting adjusts height via targetGroundLevel
  humanoidGroup.position.set(0, 0, 0);
  humanoidGroup.scale.set(0.35, 0.35, 0.35);

  const humanoidMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.95,
    roughness: 0.1,
  });

  const result = createHumanoid(humanoidMaterial);
  humanoidMesh = result.mesh;
  skeleton = result.skeleton;

  // Don't manually position - foot planting code will handle it
  humanoidGroup.add(humanoidMesh);
  scene.add(humanoidGroup);

  console.log('🕺 Humanoid dancer initialized: scale 0.35, targetGroundLevel: -1.0');
}

// --- Animation Update ---
export function updateHumanoid(morphPosition) {
  if (!humanoidGroup || !humanoidMesh || !skeleton) return;
  if (!humanoidGroup.visible) return;

  // Position and scale are set once during initialization - don't override here!
  const elapsedTime = clock.getElapsedTime();

  // Get bone references
  const hipRoot = skeleton.getBoneByName('hipRoot');
  const belly = skeleton.getBoneByName('belly');
  const chest = skeleton.getBoneByName('chest');
  const neck = skeleton.getBoneByName('neck');
  const upperArmL = skeleton.getBoneByName('upperArmL');
  const forearmL = skeleton.getBoneByName('forearmL');
  const handL = skeleton.getBoneByName('handL');
  const upperArmR = skeleton.getBoneByName('upperArmR');
  const forearmR = skeleton.getBoneByName('forearmR');
  const handR = skeleton.getBoneByName('handR');
  const upperLegL = skeleton.getBoneByName('upperLegL');
  const lowerLegL = skeleton.getBoneByName('lowerLegL');
  const upperLegR = skeleton.getBoneByName('upperLegR');
  const lowerLegR = skeleton.getBoneByName('lowerLegR');
  const footL = skeleton.getBoneByName('footL');
  const footR = skeleton.getBoneByName('footR');

  // --- Dance Routine ---
  const danceSpeed = 0.8;
  const time = elapsedTime * danceSpeed;
  const oneCountDuration = Math.PI / 2;
  const eightCountDuration = oneCountDuration * 8;
  const loopTime = (time) % eightCountDuration;

  // --- Reset bones ---
  belly.rotation.set(0, 0, 0);
  chest.rotation.set(0, 0, 0);
  neck.rotation.set(0, 0, 0);
  upperArmL.rotation.set(0, 0, 0);
  forearmL.rotation.set(0, 0, 0);
  handL.rotation.set(0, 0, 0);
  upperArmR.rotation.set(0, 0, 0);
  forearmR.rotation.set(0, 0, 0);
  handR.rotation.set(0, 0, 0);
  hipRoot.rotation.set(0, 0, 0);
  upperLegL.rotation.set(0, 0, 0);
  lowerLegL.rotation.set(0, 0, 0);
  upperLegR.rotation.set(0, 0, 0);
  lowerLegR.rotation.set(0, 0, 0);

  humanoidMesh.position.x = 0;
  humanoidMesh.rotation.y = baseRotationY;
  hipRoot.position.y = 1.0;

  // --- State switching ---
  if (loopTime < lastLoopTime) {
    if (danceState === 'dancing') {
      const rand = Math.random();
      if (rand < 0.2) currentArmVariant = 1;
      else if (rand < 0.4) currentArmVariant = 2;
      else if (rand < 0.6) currentArmVariant = 3;
      else if (rand < 0.8) currentArmVariant = 4;
      else currentArmVariant = 0;

      if (Math.random() < 0.25) {
        danceState = 'turning';
        turnStartTime = elapsedTime;
        turnDirection = Math.random() < 0.5 ? 1 : -1;
      }
    } else if (danceState === 'turning') {
      danceState = 'returning';
      turnStartTime = elapsedTime;
      baseRotationY = (baseRotationY + turnDirection * Math.PI) % (Math.PI * 2);
    } else if (danceState === 'returning') {
      danceState = 'dancing';
    }
  }
  lastLoopTime = loopTime;

  // --- Torso rhythm ---
  const hipSwayX = Math.sin(time * 3) * 0.2;
  const hipSwayZ = Math.cos(time * 1.5) * 0.1;
  const popBeat = time * 2;
  const popCurve = Math.pow(Math.sin(popBeat * Math.PI) * 0.5 + 0.5, 2);
  const popAmount = popCurve * -0.2;

  hipRoot.rotation.y = Math.sin(time * 2) * 0.25;
  belly.rotation.x = (hipSwayZ + popAmount) * 0.6;
  chest.rotation.x = (hipSwayZ + popAmount) * 0.4;
  belly.rotation.z = -hipSwayX * 0.8;
  chest.rotation.z = -hipSwayX * 0.4;

  // --- State-specific leg motion ---
  if (danceState === 'turning') {
    const turnDuration = eightCountDuration / danceSpeed;
    let turnProgress = (elapsedTime - turnStartTime) / turnDuration;
    turnProgress = Math.min(turnProgress, 1.0);

    const stepFreq = time * 2;

    if (turnProgress < 0.5) {
      const phaseProgress = turnProgress * 2;
      const smoothProgress = (1 - Math.cos(phaseProgress * Math.PI)) / 2;
      humanoidMesh.position.x = THREE.MathUtils.lerp(0, turnDirection * 2.5, smoothProgress);
      humanoidMesh.rotation.y = baseRotationY + (smoothProgress * (turnDirection * Math.PI / 2));
    } else {
      const phaseProgress = (turnProgress - 0.5) * 2;
      const smoothProgress = (1 - Math.cos(phaseProgress * Math.PI)) / 2;
      humanoidMesh.position.x = turnDirection * 2.5;
      const startRot = baseRotationY + (turnDirection * Math.PI / 2);
      const endRot = baseRotationY + (turnDirection * Math.PI);
      humanoidMesh.rotation.y = THREE.MathUtils.lerp(startRot, endRot, smoothProgress);
    }

    upperLegL.rotation.x = Math.max(0, Math.sin(stepFreq)) * -0.8;
    lowerLegL.rotation.x = Math.max(0, Math.sin(stepFreq)) * 1.5;
    upperLegR.rotation.x = Math.max(0, -Math.sin(stepFreq)) * -0.8;
    lowerLegR.rotation.x = Math.max(0, -Math.sin(stepFreq)) * 1.5;

  } else if (danceState === 'returning') {
    const returnDuration = eightCountDuration / danceSpeed;
    let returnProgress = (elapsedTime - turnStartTime) / returnDuration;
    returnProgress = Math.min(returnProgress, 1.0);
    const smoothProgress = (1 - Math.cos(returnProgress * Math.PI)) / 2;

    humanoidMesh.position.x = THREE.MathUtils.lerp(turnDirection * 2.5, 0, smoothProgress);
    humanoidMesh.rotation.y = baseRotationY;

    const stepFreq = time * 2;
    upperLegL.rotation.x = Math.max(0, Math.sin(stepFreq)) * -0.8;
    lowerLegL.rotation.x = Math.max(0, Math.sin(stepFreq)) * 1.5;
    upperLegR.rotation.x = Math.max(0, -Math.sin(stepFreq)) * -0.8;
    lowerLegR.rotation.x = Math.max(0, -Math.sin(stepFreq)) * 1.5;

  } else {
    humanoidMesh.rotation.y = baseRotationY;
    const kneeBend = popCurve * 0.4;
    const liftBeat = time * 2;
    const liftAmount = 1.5;
    const rightFootLift = Math.max(0, Math.sin(liftBeat)) * liftAmount;
    const leftFootLift = Math.max(0, -Math.sin(liftBeat)) * liftAmount;

    upperLegL.rotation.x = -hipSwayX * 0.5 - leftFootLift * 0.5;
    lowerLegL.rotation.x = kneeBend + leftFootLift;
    upperLegR.rotation.x = hipSwayX * 0.5 - rightFootLift * 0.5;
    lowerLegR.rotation.x = kneeBend + rightFootLift;
  }

  // --- Arm animation with blending ---
  const armL_X_1 = Math.sin(time * 0.7 + Math.PI / 2) * 0.6 + 0.3;
  const armL_Y_1 = Math.sin(time * 0.4) * 0.3;
  const armL_Z_1 = (Math.cos(time * 0.9) + 1) / 2 * -1.2;
  const elbowL_X_1 = (Math.sin(time * 1.1) + 1) / 2 * -1.2;

  const armR_X_1 = Math.sin(time * 0.7) * 0.6 + 0.3;
  const armR_Y_1 = Math.sin(time * 0.4 + 0.2) * -0.3;
  const armR_Z_1 = (Math.cos(time * 0.9 + Math.PI / 2) + 1) / 2 * 1.2;
  const elbowR_X_1 = (Math.sin(time * 1.1 + Math.PI / 2) + 1) / 2 * -1.2;

  const armSway = Math.sin(time * 1.5) * 0.2;
  const elbowBend = Math.sin(time * 2.5) * -0.2 - 1.57;

  const goalPostL = { x: -0.2, y: -0.5, z: -1.4 + armSway, elbow: elbowBend };
  const goalPostR = { x: -0.2, y: 0.5, z: 1.4 - armSway, elbow: elbowBend };
  const armUp = { x: -Math.PI / 1.8, y: 0, z: 0.2, elbow: -0.2 };
  const armDown = { x: 0.2, y: 0, z: 0, elbow: 0.2 };

  let armL_X_2, armL_Y_2, armL_Z_2, elbowL_X_2;
  let armR_X_2, armR_Y_2, armR_Z_2, elbowR_X_2;

  switch (currentArmVariant) {
    case 1:
      armL_X_2 = armUp.x; armL_Y_2 = armUp.y; armL_Z_2 = armUp.z; elbowL_X_2 = armUp.elbow;
      armR_X_2 = goalPostR.x; armR_Y_2 = goalPostR.y; armR_Z_2 = goalPostR.z; elbowR_X_2 = goalPostR.elbow;
      break;
    case 2:
      armL_X_2 = goalPostL.x; armL_Y_2 = goalPostL.y; armL_Z_2 = goalPostL.z; elbowL_X_2 = goalPostL.elbow;
      armR_X_2 = armUp.x; armR_Y_2 = armUp.y; armR_Z_2 = armUp.z; elbowR_X_2 = armUp.elbow;
      break;
    case 3:
      armL_X_2 = armDown.x; armL_Y_2 = armDown.y; armL_Z_2 = armDown.z; elbowL_X_2 = armDown.elbow;
      armR_X_2 = goalPostR.x; armR_Y_2 = goalPostR.y; armR_Z_2 = goalPostR.z; elbowR_X_2 = goalPostR.elbow;
      break;
    case 4:
      armL_X_2 = goalPostL.x; armL_Y_2 = goalPostL.y; armL_Z_2 = goalPostL.z; elbowL_X_2 = goalPostL.elbow;
      armR_X_2 = armDown.x; armR_Y_2 = armDown.y; armR_Z_2 = armDown.z; elbowR_X_2 = armDown.elbow;
      break;
    default:
      armL_X_2 = goalPostL.x; armL_Y_2 = goalPostL.y; armL_Z_2 = goalPostL.z; elbowL_X_2 = goalPostL.elbow;
      armR_X_2 = goalPostR.x; armR_Y_2 = goalPostR.y; armR_Z_2 = goalPostR.z; elbowR_X_2 = goalPostR.elbow;
      break;
  }

  let blendFactor = 0;
  const transitionStartTimeUp = oneCountDuration * 3;
  const transitionEndTimeUp = oneCountDuration * 4;
  const transitionStartTimeDown = oneCountDuration * 7;
  const transitionEndTimeDown = oneCountDuration * 8;

  if (loopTime >= transitionEndTimeUp && loopTime < transitionStartTimeDown) {
    blendFactor = 1.0;
  } else if (loopTime >= transitionStartTimeUp && loopTime < transitionEndTimeUp) {
    const progress = (loopTime - transitionStartTimeUp) / oneCountDuration;
    blendFactor = (1 - Math.cos(progress * Math.PI)) / 2;
  } else if (loopTime >= transitionStartTimeDown && loopTime < transitionEndTimeDown) {
    const progress = (loopTime - transitionStartTimeDown) / oneCountDuration;
    blendFactor = 1.0 - (1 - Math.cos(progress * Math.PI)) / 2;
  } else {
    blendFactor = 0.0;
  }

  const armL_X = THREE.MathUtils.lerp(armL_X_1, armL_X_2, blendFactor);
  const armL_Y = THREE.MathUtils.lerp(armL_Y_1, armL_Y_2, blendFactor);
  const armL_Z = THREE.MathUtils.lerp(armL_Z_1, armL_Z_2, blendFactor);
  const elbowL_X = THREE.MathUtils.lerp(elbowL_X_1, elbowL_X_2, blendFactor);

  const armR_X = THREE.MathUtils.lerp(armR_X_1, armR_X_2, blendFactor);
  const armR_Y = THREE.MathUtils.lerp(armR_Y_1, armR_Y_2, blendFactor);
  const armR_Z = THREE.MathUtils.lerp(armR_Z_1, armR_Z_2, blendFactor);
  const elbowR_X = THREE.MathUtils.lerp(elbowR_X_1, elbowR_X_2, blendFactor);

  upperArmL.rotation.set(armL_X, armL_Y, armL_Z);
  forearmL.rotation.x = elbowL_X;
  upperArmR.rotation.set(armR_X, armR_Y, armR_Z);
  forearmR.rotation.x = elbowR_X;

  neck.rotation.y = Math.sin(time * 0.4) * 0.5;

  // --- Foot planting ---
  humanoidMesh.updateMatrixWorld(true);
  const ankleLWorld = new THREE.Vector3();
  const ankleRWorld = new THREE.Vector3();
  footL.getWorldPosition(ankleLWorld);
  footR.getWorldPosition(ankleRWorld);
  const lowestY = Math.min(ankleLWorld.y, ankleRWorld.y);
  const targetGroundLevel = -1.0; // Lower ground level
  humanoidMesh.position.y = THREE.MathUtils.lerp(humanoidMesh.position.y, humanoidMesh.position.y - (lowestY - targetGroundLevel), 0.8);
}

// --- Control Functions ---
export function setHumanoidVisible(visible) {
  if (humanoidGroup) {
    humanoidGroup.visible = visible;
    console.log(`🕺 Humanoid visibility: ${visible ? 'ON' : 'OFF'}`);
  }
}

export function getHumanoidGroup() {
  return humanoidGroup;
}
