const canvas = document.getElementById("gameWindow")
const engine = new BABYLON.Engine(canvas, true)

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
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 6, Math.PI / 2.5, 5, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")

    // Light source pointing upward from the sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.5, 0, 1), scene)
    //light.diffuse = new BABYLON.Color3(0.7,0.6,0.4)

    // Cube
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene)
    const spinSpeed = 0.05

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width:6, height:6}, scene)
    ground.position.y = -1

    const box2 = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene)
    box2.position.x = 1
    box2.position.y = 1
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

const scene = createScene()

// Run the engines main render loop
engine.runRenderLoop(() => {
    scene.render()
    //Run 2 scenes
})

// Watch for browser resizing
window.addEventListener("resize", () => {
    engine.resize()
})


//Game funcs below
//SpawnText ect