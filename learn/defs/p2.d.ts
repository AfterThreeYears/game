// Type definitions for p2.js v0.6.0
// Project: https://github.com/schteppe/p2.js/

declare module p2 {
    
        export class AABB {
    
            constructor(options?: {
                upperBound?: number[];
                lowerBound?: number[];
            });
    
            setFromPoints(points: number[][], position: number[], angle: number, skinSize: number): void;
            copy(aabb: AABB): void;
            extend(aabb: AABB): void;
            overlaps(aabb: AABB): boolean;
    
        }
    
        export class Broadphase {
    
            static AABB: number;
            static BOUNDING_CIRCLE: number;
    
            static NAIVE: number;
            static SAP: number;
    
            static boundingRadiusCheck(bodyA: Body, bodyB: Body): boolean;
            static aabbCheck(bodyA: Body, bodyB: Body): boolean;
            static canCollide(bodyA: Body, bodyB: Body): boolean;
    
            constructor(type: number);
    
            type: number;
            result: Body[];
            world: World;
            boundingVolumeType: number;
    
            setWorld(world: World): void;
            getCollisionPairs(world: World): Body[];
            boundingVolumeCheck(bodyA: Body, bodyB: Body): boolean;
    
        }
    
        export class GridBroadphase extends Broadphase {
    
            constructor(options?: {
                xmin?: number;
                xmax?: number;
                ymin?: number;
                ymax?: number;
                nx?: number;
                ny?: number;
            });
    
            xmin: number;
            xmax: number;
            ymin: number;
            ymax: number;
            nx: number;
            ny: number;
            binsizeX: number;
            binsizeY: number;
    
        }
    
        export class NativeBroadphase extends Broadphase {
    
        }
    
        export class Narrowphase {
    
            contactEquations: ContactEquation[];
            frictionEquations: FrictionEquation[];
            enableFriction: boolean;
            slipForce: number;
            frictionCoefficient: number;
            surfaceVelocity: number;
            reuseObjects: boolean;
            resuableContactEquations: any[];
            reusableFrictionEquations: any[];
            restitution: number;
            stiffness: number;
            relaxation: number;
            frictionStiffness: number;
            frictionRelaxation: number;
            enableFrictionReduction: boolean;
            contactSkinSize: number;
    
            collidedLastStep(bodyA: Body, bodyB: Body): boolean;
            reset(): void;
            createContactEquation(bodyA: Body, bodyB: Body, shapeA: Shape, shapeB: Shape): ContactEquation;
            createFrictionFromContact(c: ContactEquation): FrictionEquation;
    
        }
    
        export class SAPBroadphase extends Broadphase {
    
            axisList: Body[];
            axisIndex: number;
    
        }
    
        export class Constraint {
    
            static DISTANCE: number;
            static GEAR: number;
            static LOCK: number;
            static PRISMATIC: number;
            static REVOLUTE: number;
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
            });
    
            type: number;
            equeations: Equation[];
            bodyA: Body;
            bodyB: Body;
            collideConnected: boolean;
    
            update(): void;
            setStiffness(stiffness: number): void;
            setRelaxation(relaxation: number): void;
    
        }
    
        export class DistanceConstraint extends Constraint {
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
                distance?: number;
                localAnchorA?: number[];
                localAnchorB?: number[];
                maxForce?: number;
            });
    
            localAnchorA: number[];
            localAnchorB: number[];
            distance: number;
            maxForce: number;
            upperLimitEnabled: boolean;
            upperLimit: number;
            lowerLimitEnabled: boolean;
            lowerLimit: number;
            position: number;
    
            setMaxForce(f: number): void;
            getMaxForce(): number;
    
        }
    
        export class GearConstraint extends Constraint {
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
                angle?: number;
                ratio?: number;
                maxTorque?: number;
            });
    
            ratio: number;
            angle: number;
    
            setMaxTorque(torque: number): void;
            getMaxTorque(): number;
    
        }
    
        export class LockConstraint extends Constraint {
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
                localOffsetB?: number[];
                localAngleB?: number;
                maxForce?: number;
            });
    
            setMaxForce(force: number): void;
            getMaxForce(): number;
    
        }
    
        export class PrismaticConstraint extends Constraint {
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
                maxForce?: number;
                localAnchorA?: number[];
                localAnchorB?: number[];
                localAxisA?: number[];
                disableRotationalLock?: boolean;
                upperLimit?: number;
                lowerLimit?: number;
            });
    
            localAnchorA: number[];
            localAnchorB: number[];
            localAxisA: number[];
            position: number;
            velocity: number;
            lowerLimitEnabled: boolean;
            upperLimitEnabled: boolean;
            lowerLimit: number;
            upperLimit: number;
            upperLimitEquation: ContactEquation;
            lowerLimitEquation: ContactEquation;
            motorEquation: Equation;
            motorEnabled: boolean;
            motorSpeed: number;
    
            enableMotor(): void;
            disableMotor(): void;
            setLimits(lower: number, upper: number): void;
    
        }
    
        export class RevoluteConstraint extends Constraint {
    
            constructor(bodyA: Body, bodyB: Body, type: number, options?: {
                collideConnected?: boolean;
                wakeUpBodies?: boolean;
                worldPivot?: number[];
                localPivotA?: number[];
                localPivotB?: number[];
                maxForce?: number;
            });
    
            pivotA: number[];
            pivotB: number[];
            motorEquation: RotationalVelocityEquation;
            motorEnabled: boolean;
            angle: number;
            lowerLimitEnabled: boolean;
            upperLimitEnabled: boolean;
            lowerLimit: number;
            upperLimit: number;
            upperLimitEquation: ContactEquation;
            lowerLimitEquation: ContactEquation;
    
            enableMotor(): void;
            disableMotor(): void;
            motorIsEnabled(): boolean;
            setLimits(lower: number, upper: number): void;
            setMotorSpeed(speed: number): void;
            getMotorSpeed(): number;
    
        }
    
        export class AngleLockEquation extends Equation {
    
            constructor(bodyA: Body, bodyB: Body, options?: {
                angle?: number;
                ratio?: number;
            });
    
            computeGq(): number;
            setRatio(ratio: number): number;
            setMaxTorque(torque: number): number;
    
        }
    
        export class ContactEquation extends Equation {
    
            constructor(bodyA: Body, bodyB: Body);
    
            contactPointA: number[];
            penetrationVec: number[];
            contactPointB: number[];
            normalA: number[];
            restitution: number;
            firstImpact: boolean;
            shapeA: Shape;
            shapeB: Shape;
    
            computeB(a: number, b: number, h: number): number;
    
        }
    
        export class Equation {
    
            static DEFAULT_STIFFNESS: number;
            static DEFAULT_RELAXATION: number;
    
            constructor(bodyA: Body, bodyB: Body, minForce?: number, maxForce?: number);
    
            minForce: number;
            maxForce: number;
            bodyA: Body;
            bodyB: Body;
            stiffness: number;
            relaxation: number;
            G: number[];
            offset: number;
            a: number;
            b: number;
            epsilon: number;
            timeStep: number;
            needsUpdate: boolean;
            multiplier: number;
            relativeVelocity: number;
            enabled: boolean;
    
            gmult(G: number[], vi: number[], wi: number[], vj: number[], wj: number[]): number;
            computeB(a: number, b: number, h: number): number;
            computeGq(): number;
            computeGW(): number;
            computeGWlambda(): number;
            computeGiMf(): number;
            computeGiMGt(): number;
            addToWlambda(deltalambda: number): number;
            computeInvC(eps: number): number;
    
        }
    
        export class FrictionEquation extends Equation {
    
            constructor(bodyA: Body, bodyB: Body, slipForce: number);
    
            contactPointA: number[];
            contactPointB: number[];
            t: number[];
            shapeA: Shape;
            shapeB: Shape;
            frictionCoefficient: number;
    
            setSlipForce(slipForce: number): number;
            getSlipForce(): number;
            computeB(a: number, b: number, h: number): number;
    
        }
    
        export class RotationalLockEquation extends Equation {
    
            constructor(bodyA: Body, bodyB: Body, options?: {
                angle?: number;
            });
    
            angle: number;
    
            computeGq(): number;
    
        }
    
        export class RotationalVelocityEquation extends Equation {
    
            constructor(bodyA: Body, bodyB: Body);
    
            computeB(a: number, b: number, h: number): number;
    
        }
    
        export class EventEmitter {
    
            on(type: string, listener: Function, context: any): EventEmitter;
            has(type: string, listener: Function): boolean;
            off(type: string, listener: Function): EventEmitter;
            emit(event: any): EventEmitter;
    
        }
    
        export class ContactMaterialOptions {
    
            friction: number;
            restitution: number;
            stiffness: number;
            relaxation: number;
            frictionStiffness: number;
            frictionRelaxation: number;
            surfaceVelocity: number;
    
        }
    
        export class ContactMaterial {
    
            static idCounter: number;
    
            constructor(materialA: Material, materialB: Material, options?: ContactMaterialOptions);
    
            id: number;
            materialA: Material;
            materialB: Material;
            friction: number;
            restitution: number;
            stiffness: number;
            relaxation: number;
            frictionStuffness: number;
            frictionRelaxation: number;
            surfaceVelocity: number;
            contactSkinSize: number;
    
        }
    
        export class Material {
    
            static idCounter: number;
    
            constructor(id: number);
    
            id: number;
    
        }
    
        export class vec2 {
    
            static crossLength(a: number[], b: number[]): number;
            static crossVZ(out: number[], vec: number[], zcomp: number): number;
            s