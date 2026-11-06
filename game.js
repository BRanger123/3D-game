const canvas = document.getElementById("gameWindow")
const engine = new BABYLON.Engine(canvas, true)

let levelGlobal = 1

const createScene = () => {
    const scene = new BABYLON.Scene(engine)

    const inputMap = {}
    scene.actionManager = new BABYLON.ActionManager(scene)
    
    // Keydown
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = true
    }))
    // Keyup
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = false
    }))

    // Camera rotates around target point (Alpha, Beta, Radius, Target, Scene)
    // Alpha: horizontal, Beta: Vertical
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 8, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")

    // Light source pointing upward from the sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.3, 0.1, 0), scene)
    //light.diffuse = new BABYLON.Color3(0.7,0.6,0.4)

    // Cube
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene)
    const spinSpeed = 0.05

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width:6, height:6}, scene)
    ground.position.y = -1

    const box2 = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene)
    box2.position.x = -1
    box2.position.y = 1
    box2.position.z = 1
    // Simple frame-by-frame animation loop to spin the box
    scene.onBeforeRenderObservable.add(() => {
        box2.rotation.y += 0.01
        box2.rotation.x += 0.005
    })

    //User input here
    scene.onBeforeRenderObservable.add(() => {
        if (inputMap["arrowleft"] || inputMap["a"]) {
            box.rotation.y -= spinSpeed
        }
        if (inputMap["arrowright"] || inputMap["d"]) {
            box.rotation.y += spinSpeed
        }
        if (inputMap["arrowup"] || inputMap["w"]) {
            box.rotation.x -= spinSpeed
        }
        if (inputMap["arrowdown"] || inputMap["s"]) {
            box.rotation.x += spinSpeed
        }
        if (inputMap["u"]) {
            ground.position.y += 0.02
        }
        if (inputMap["j"]) {
            ground.position.y -= 0.02
        }
    })

    return scene
}

const createScene2 = function () {
    const scene = new BABYLON.Scene(engine)

    // Add environmental lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.5, 0.7, 0), scene)
    light.intensity = 0.7

    // Create a Ground Plane
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene)
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene)
    groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    ground.material = groundMaterial

    // Create a Cube Obstacle (something to look at)
    const obstacle = BABYLON.MeshBuilder.CreateBox("obstacle", { size: 2 }, scene)
    obstacle.position.set(0, 1, 5)
    const boxMaterial = new BABYLON.StandardMaterial("boxMat", scene)
    obstacle.material = boxMaterial



    const camera = new BABYLON.UniversalCamera("FPSCamera", new BABYLON.Vector3(0, 3, 0), scene)
    
    // Look straight ahead down the Z-axis
    camera.setTarget(new BABYLON.Vector3(0, 2, 5))
    
    // Attach mouse and keyboard input systems to the canvas
    camera.attachControl(canvas, true)

    // Map WASD Keys for First-Person movement (using standard JavaScript Key Codes)
    camera.keysUp.push(87)
    camera.keysDown.push(83)
    camera.keysLeft.push(65)
    camera.keysRight.push(68)

    // Adjust built-in movement parameters
    camera.speed = 1  // Walk speed
    camera.inertia = 0.2    // How quickly the camera stops sliding after releasing a key



    let isPointerLocked = false
    
    scene.onPointerDown = function () {
        if (!isPointerLocked) {
            canvas.requestPointerLock()
            isPointerLocked = true
        }
    }

    document.addEventListener("pointerlockchange", () => {
        if (document.pointerLockElement !== canvas) {
            isPointerLocked = false
        }
    })


    let verticalVelocity = 0
    const gravity = -0.01 // Acceleration pulling down every frame
    const jumpForce = 0.22 // The upward velocity kick applied on spacebar
    let isGrounded = true // Prevents jumping while airborne
    const eyeLevelHeight = 3 // The default camera eye level when standing on ground

    // Listen globally for Spacebar clicks
    window.addEventListener("keydown", (event) => {
        if (event.code === "Space" && isGrounded) {
            verticalVelocity = jumpForce
            isGrounded = false
        }
    })


    // Evaluates gravity and jump movement calculations before processing every single frame draw
    scene.onBeforeRenderObservable.add(() => {
        // Continuously apply gravity acceleration
        verticalVelocity += gravity
        
        // Displace the camera's height step-by-step using current velocity
        camera.position.y += verticalVelocity

        // Ground check: stop falling if player reaches eye level on the floor plane
        if (camera.position.y <= eyeLevelHeight) {
            camera.position.y = eyeLevelHeight  // Force camera clamp to correct standing posture
            verticalVelocity = 0  // Terminate fall impact speed
            isGrounded = true  // Free up jumping capability
        }
    })

    return scene
}

levels = []
levels.push(createScene(), createScene2())

// Run the engines main render loop
engine.runRenderLoop(() => {
    levels[levelGlobal-1].render()
})


// Watch for browser resizing
window.addEventListener("resize", () => {
    engine.resize()
})


//Game funcs below
//SpawnText ect