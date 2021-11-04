import { MMDLoader } from '../jsm/loaders/MMDLoader.js';
import * as THREE from '../build/three.module.js';
import { FacialParameter } from './facialParameter.js';
const length = 1.25;
const lineGeometry = new THREE.PlaneGeometry(0.002, length);
const redLineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const greenLineMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const bludLineMaterial = new THREE.MeshBasicMaterial({ color: 0x000088, side: THREE.DoubleSide });
const purpleLineMaterial = new THREE.MeshBasicMaterial({ color: 0x880088, side: THREE.DoubleSide });
const loader = new MMDLoader();

export class Model {
    constructor(modelInfo, rotationInit) {
        this.modelPath = modelInfo.modelPath;
        this.lineLocation = [modelInfo.line_location_1, modelInfo.line_location_2, modelInfo.line_location_3, modelInfo.line_location_4];
        this.facialParameters = this._initalFacialParameter(rotationInit);
        this.mesh = null;
        this.rightLine = [];
        this.leftLine = [];
        this.leftEyeIndex = null;
        this.rightEyeIndex = null;
        this._loadModel();
        this.createLineMeshs();
    }

    _initalFacialParameter(rotationInit) {
        let facialParameters = [];
        facialParameters.push(new FacialParameter([rotationInit.RightXNegativeAngle, 0], [rotationInit.LeftXNegativeAngle, 0]));
        facialParameters.push(new FacialParameter([rotationInit.RightXPositiveAngle, 0], [rotationInit.LeftXPositiveAngle, 0]));
        facialParameters.push(new FacialParameter([0, rotationInit.RightYNegativeAngle], [0, rotationInit.LeftYNegativeAngle]));
        facialParameters.push(new FacialParameter([0, rotationInit.RightYPositiveAngle], [0, rotationInit.LeftYPositiveAngle]));
        return facialParameters;
    }

    _loadModel() {
        loader.load(this.modelPath, (object) => this.setMesh(object));
    }

    setMesh(object) {
        this.mesh = object;
        this.mesh.position.y = - 10;
    }

    setEyeRotation(targetIndex, rotationX, rotationY) {
        let facialIndex = Math.floor(targetIndex / 2);
        let dicrectionIndex = targetIndex % 2;
        this.facialParameters[facialIndex].setEyeRotation(dicrectionIndex, rotationX, rotationY)
    }

    updateEyeRotation(cameraTargetIndex, moveAngelX, moveAngelY) {
        let facialIndex = Math.floor(cameraTargetIndex / 2);
        let dicrectionIndex = cameraTargetIndex % 2;
        this.facialParameters[facialIndex].updateEyeRotation(dicrectionIndex, moveAngelX, moveAngelY);
    }

    getPath() {
        return this.modelPath;
    }

    getMesh() {
        if (this.mesh == null) {
            return null;
        } else {
            return this.mesh
        }
    }

    getOffsetY() {
        return (this.lineLocation[0][0] + this.lineLocation[1][0]) / 2;
    }

    getOffsetX() {
        return (this.lineLocation[0][1] + this.lineLocation[2][1]) / 2;
    }

    getOffset(index) {
        if (index % 2 == 0) {
            return [-this.getOffsetX(), this.getOffsetY()];
        } else {
            return [this.getOffsetX(), this.getOffsetY()];
        }
    }

    getLineMeshs(index) {
        if (index == 0) {
            return this.rightLine;
        } else {
            return this.leftLine;
        }
    }

    getEyeRotation(targetIndex) {
        let facialIndex = Math.floor(targetIndex / 2);
        let dicrectionIndex = targetIndex % 2;
        return this.facialParameters[facialIndex].getEyeRotation()[dicrectionIndex];
    }

    getEyeRotationAngel(targetIndex) {
        let facialIndex = Math.floor(targetIndex / 2);
        let dicrectionIndex = targetIndex % 2;
        return this.facialParameters[facialIndex].getEyeAngel(dicrectionIndex);
    }

    updateFacialParameter(index) {
        let [rightEyeRotation, leftEyeRotation] = this.facialParameters[index].getEyeRotation();

        if(this.leftEyeIndex == null)
            this.leftEyeIndex = this.mesh.skeleton.bones.findIndex(bone => bone.name == "左目");
        if(this.rightEyeIndex == null)
            this.rightEyeIndex = this.mesh.skeleton.bones.findIndex(bone => bone.name == "右目");

        this.mesh.skeleton.bones[this.leftEyeIndex].rotation.x = leftEyeRotation[0];
        this.mesh.skeleton.bones[this.leftEyeIndex].rotation.y = leftEyeRotation[1];
        this.mesh.skeleton.bones[this.rightEyeIndex].rotation.x = rightEyeRotation[0];
        this.mesh.skeleton.bones[this.rightEyeIndex].rotation.y = rightEyeRotation[1];
    }

    createLineMeshs() {
        let stepDistanceY = (this.lineLocation[1][0] - this.lineLocation[0][0]) / 4;
        for (let index = 0; index < 5; index++) {
            this.leftLine.push(this.createLineMesh(this.getOffsetX(), this.lineLocation[1][0] - (index * stepDistanceY), lineGeometry, greenLineMaterial, 0));
            this.rightLine.push(this.createLineMesh(-1 * this.getOffsetX(), this.lineLocation[1][0] - (index * stepDistanceY), lineGeometry, bludLineMaterial, 0));
        }

        let stepDistanceX = (this.lineLocation[0][1] - this.lineLocation[2][1]) / 8;
        for (let index = 0; index < 9; index++) {
            this.leftLine.push(this.createLineMesh(this.lineLocation[0][1] - index * stepDistanceX, this.getOffsetY(), lineGeometry, redLineMaterial, 1));
            this.rightLine.push(this.createLineMesh(-1 * (this.lineLocation[0][1] - index * stepDistanceX), this.getOffsetY(), lineGeometry, purpleLineMaterial, 1));
        }
    }

    //direction 0 or 1 0 水平 1垂直
    createLineMesh(x, y, lineGeometry, material, direction) {
        let line = new THREE.Mesh(lineGeometry, material);
        line.position.x = x;
        line.position.y = y;
        line.position.z = 5;

        if (direction == 0) line.rotateZ(Math.PI / 2);
        return line;
    }
}