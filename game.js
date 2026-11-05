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
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.5, 1, 0), scene)

    // Create a simple box (cube)
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene)
    const spinSpeed = 0.05

    // Simple frame-by-frame animation loop to spin the box
    //scene.onBeforeRenderObservable.add(() => {
    //    box.rotation.y += 0.01
    //    box.rotation.x += 0.005
    //})

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