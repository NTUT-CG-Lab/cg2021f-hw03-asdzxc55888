const perAngel = Math.PI / 180;

export class FacialParameter {
    constructor(right = [0, 0], left = [0, 0]) {
        // rotation [x y]
        this.leftEyeRotation = [left[0] * perAngel, left[1] * perAngel];
        this.rightEyeRotation = [right[0] * perAngel, right[1] * perAngel];
    }

    getEyeRotation() {
        return [this.rightEyeRotation, this.leftEyeRotation];
    }

    getEyeAngel(direction) {
        if (direction == 0) {
            return [(this.rightEyeRotation[0] / perAngel).toFixed(1), (this.rightEyeRotation[1] / perAngel).toFixed(1)]
        } else {
            return [(this.leftEyeRotation[0] / perAngel).toFixed(1), (this.leftEyeRotation[1] / perAngel).toFixed(1)]
        }
    }

    setEyeRotation(direction, rotationX, rotationY) {
        if (direction == 0) {
            this.rightEyeRotation[0] = rotationX;
            this.rightEyeRotation[1] = rotationY;
        } else {
            this.leftEyeRotation[0] = rotationX;
            this.leftEyeRotation[1] = rotationY;
        }
    }

    //direction 0 1 => 右 左
    updateEyeRotation(direction, moveAngelX, moveAngelY) {
        if (direction == 0) {
            this.rightEyeRotation[0] += moveAngelX * perAngel;
            this.rightEyeRotation[1] += moveAngelY * perAngel;
        } else {
            this.leftEyeRotation[0] += moveAngelX * perAngel;
            this.leftEyeRotation[1] += moveAngelY * perAngel;
        }
    }
}