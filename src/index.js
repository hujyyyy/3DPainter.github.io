var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene, MeshBuilder, StandardMaterial, Color3, HemisphericLight, Texture, VertexBuffer } from "@babylonjs/core/";
import { Vector3, Matrix } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/";
import "@babylonjs/core/Materials/standardMaterial";
import { AdvancedDynamicTexture, Container, Button, Rectangle, StackPanel, Control, ColorPicker, ScrollViewer, TextBlock, TextWrapping, Slider } from "@babylonjs/gui";
// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
//import {MeshBuilder} from  "@babylonjs/core/Meshes/meshBuilder";
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
var statusbar;
//var statusbar2:any;
var dropdownMenu;
var dropdownMenu2;
var selected_color = "#57606f";
var selected_color2 = "#ff6b81";
var selected_color3 = "#ff4757";
var camera;
var UIplane;
var UIplane2;
var disToUIplane = 1.2; //1.2
var disstrok = 0.05;
var strokeThickness = 0.035;
var UIswitch = 1;
var tool_id = 0;
var texture_id = -1;
var BrushMat;
var meshes = new Array();
var textures = new Array();
var drawingControl;
/******* Add the Playground Class with a static CreateScene function ******/
var Playground = /** @class */ (function () {
    function Playground() {
    }
    Playground.CreateScene = function (engine, canvas) {
        // Create the scene space
        var scene = new Scene(engine);
        var light = new HemisphericLight("hemiLight", new Vector3(-1, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.specular = new Color3(1, 1, 1);
        light.groundColor = new Color3(1, 1, 1);
        // Add a camera to the scene and attach it to the canvas
        // var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, 
        //                                  new Vector3(0,0,40), scene);
        // camera.attachControl(canvas, true);
        //scene.createDefaultCameraOrLight(true, true, true);
        camera = new FreeCamera("Camera", new Vector3(0, 1, 0.5), scene);
        camera.attachControl(canvas, true);
        scene.createDefaultEnvironment();
        //Buttons to switch between two UIs
        var advancedTexture2d = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var UIbutton1;
        var UIbutton2;
        BrushMat = new StandardMaterial("BrushMat", scene);
        BrushMat.diffuseColor = new Color3(1, 1, 1);
        BrushMat.diffuseTexture = null;
        var box = MeshBuilder.CreateBox("b", {}, scene);
        box.position.z = 5;
        box.material = BrushMat;
        //////////////////////////////////////////////////////
        //VR GUI 1 (legacy)
        {
            //DropDown Menu( this one is kept because inheritance problem.. )
            var dropdownH = "80px";
            var dropdownW = "180px";
            dropdownMenu = new DropdownMenu(parseInt(dropdownH), parseInt(dropdownW));
        }
        /////////////////////////////////////////////////////
        //VR GUI 2
        {
            var UI2_size = 0.2;
            UIplane2 = MeshBuilder.CreatePlane("UI", { width: UI2_size, height: UI2_size }, scene);
            var UIPlane2_colorPicker = MeshBuilder.CreatePlane("UI", { width: UI2_size, height: UI2_size }, scene);
            UIPlane2_colorPicker.position.y = 0.16;
            UIPlane2_colorPicker.position.z = -0.05;
            UIPlane2_colorPicker.rotation.x = -10;
            UIPlane2_colorPicker.parent = UIplane2;
            var UIPlane2_statusbar = MeshBuilder.CreatePlane("UI", { width: UI2_size, height: UI2_size }, scene);
            UIPlane2_statusbar.position.y = -0.19;
            UIPlane2_statusbar.position.z = -0.05;
            UIPlane2_statusbar.rotation.x = Math.PI / 6;
            UIPlane2_statusbar.parent = UIplane2;
            var UIPlane2_menu = MeshBuilder.CreatePlane("UI", { width: UI2_size, height: UI2_size }, scene);
            UIPlane2_menu.parent = UIplane2;
            var paintMenuOpened = true;
            UIplane2.position.y = 1;
            UIplane2.position.z = camera.position.z + disToUIplane;
            UIplane2.alpha = 0;
            //UIplane2.alpha = 0;
            //UIplane2.isVisible = false;
            var advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(UIplane2);
            var advancedTexture_colorPicker = AdvancedDynamicTexture.CreateForMesh(UIPlane2_colorPicker);
            var advancedTexture_statusbar = AdvancedDynamicTexture.CreateForMesh(UIPlane2_statusbar);
            var advancedTexture_menu = AdvancedDynamicTexture.CreateForMesh(UIPlane2_menu);
            //tool palette
            var toolpalette2 = new ToolPalette_Small(advancedTexture2, 1, 1);
            toolpalette2.addButton("Line");
            toolpalette2.addButton("Pen");
            toolpalette2.addButton("Erase");
            toolpalette2.addButton("Brush");
            toolpalette2.addButton("Color");
            toolpalette2.bindBrushMenu(3);
            toolpalette2.bindColorPicker(4);
            toolpalette2.bindColorPickerTexture(advancedTexture_colorPicker);
            toolpalette2.updatePanelSize();
            var statusbar2 = new Statusbar_Small(advancedTexture_statusbar, "600px", 0.9);
            statusbar = statusbar2;
            //DropDown Menu
            var H = "150px";
            var W = "300px";
            dropdownMenu2 = new DropdownMenu(parseInt(H), parseInt(W));
            //File dropdonw
            var dropdown_File2 = new Dropdown_small(advancedTexture_menu, "File", H, W);
            dropdown_File2.addOption("New");
            dropdown_File2.addOption("Load");
            dropdown_File2.addOption("Save");
            dropdown_File2.addOption("Quit");
            //Edit dropdonw
            var dropdown_Edit2 = new Dropdown_small(advancedTexture_menu, "Edit", H, W);
            //dropdown_Edit.container.left = "140px";
            //View drop down
            var dropdown_View2 = new Dropdown_small(advancedTexture_menu, "View", H, W);
            dropdown_View2.addOption("Next");
            dropdown_View2.addOption("Previous");
            dropdownMenu2.add_left(dropdown_File2);
            dropdownMenu2.add_left(dropdown_Edit2);
            dropdownMenu2.add_left(dropdown_View2);
            UIPlane2_statusbar.isVisible = false;
            UIplane2.isVisible = false;
            UIPlane2_menu.isVisible = false;
            var UIplane2setVisiable = function (flag) {
                if (flag == true) {
                    if (paintMenuOpened) {
                        UIplane2.isVisible = true;
                        UIPlane2_colorPicker.isVisible = true;
                    }
                    else
                        UIPlane2_menu.isVisible = true;
                    UIPlane2_statusbar.isVisible = true;
                }
                else {
                    UIplane2.isVisible = false;
                    UIPlane2_menu.isVisible = false;
                    UIPlane2_colorPicker.isVisible = false;
                    UIPlane2_statusbar.isVisible = false;
                    dropdownMenu2.disableOthers("");
                }
            };
        }
        //VR
        var vrHelper = scene.createDefaultVRExperience();
        vrHelper.enableInteractions();
        vrHelper.webVROptions.laserToggle = false;
        vrHelper.displayLaserPointer = false;
        vrHelper.displayGaze = false;
        var webVRCamera = vrHelper.webVRCamera;
        var Brushorigin = new BrushOrigin(BrushMat, webVRCamera);
        drawingControl = new DrawingControl();
        var lefthandQuaternionX = 0;
        //update loop
        scene.onBeforeRenderObservable.add(function () {
            var _a;
            Brushorigin.updatePos();
            if (tool_id != Brushorigin.tool_id)
                Brushorigin.switch(tool_id);
            if (strokeThickness != Brushorigin.scale)
                Brushorigin.scaling(strokeThickness);
            if (UIswitch == 1 && webVRCamera.leftController) {
                UIplane2.position = webVRCamera.leftController.devicePosition;
                UIplane2.position.y += 0.1;
                //UIplane2.rotation = webVRCamera.leftController.deviceRotationQuaternion;
                var angles = webVRCamera.leftController.deviceRotationQuaternion.toEulerAngles();
                UIplane2.rotation = new Vector3(-angles.x + Math.PI / 3, angles.y + Math.PI, 0);
                if ((UIPlane2_statusbar.isVisible) && Math.abs(webVRCamera.leftController.deviceRotationQuaternion.x) >= 0.75 && Math.abs(lefthandQuaternionX) < 0.745) {
                    if (paintMenuOpened) {
                        UIplane2.isVisible = false;
                        UIPlane2_colorPicker.isVisible = false;
                        UIPlane2_menu.isVisible = true;
                        paintMenuOpened = false;
                        dropdownMenu2.disableOthers("");
                    }
                    else {
                        UIplane2.isVisible = true;
                        UIPlane2_colorPicker.isVisible = true;
                        UIPlane2_menu.isVisible = false;
                        paintMenuOpened = true;
                    }
                }
                lefthandQuaternionX = (_a = webVRCamera.leftController) === null || _a === void 0 ? void 0 : _a.deviceRotationQuaternion.x;
            }
            if (drawingControl.activated)
                drawingControl.run(Brushorigin, tool_id, BrushMat);
        });
        // var spawnObject = function(lr:string){
        //     var mesh:any;
        //     // if(tool_id==0){
        //     //     mesh = MeshBuilder.CreateBox("stroke"+meshes.length.toString(),{size:strokeThickness},scene);
        //     // }else if(tool_id==1) mesh = MeshBuilder.CreateSphere("stroke"+meshes.length.toString(),{diameter:strokeThickness},scene);
        //     // if(mesh){
        //     //     statusbar.addtext("mesh generated at "+pos.toString());
        //     //     mesh.position = pos;
        //     //     mesh.material = BrushMat.clone("mat"+mesh.name);
        //     //     meshes.push(mesh);
        //     // }
        //     if(lr=="left"){
        //         mesh = Brushorigin.left.clone("stroke"+meshes.length.toString());
        //     }else if (lr=="right"){
        //         mesh = Brushorigin.right.clone("stroke"+meshes.length.toString());
        //     }
        //     mesh.isPickable = true;
        //     mesh.material = BrushMat.clone("mat"+mesh.name);
        //     meshes.push(mesh);
        // }
        var deleteAllObjects = function () {
            meshes.forEach(function (element) {
                element.dispose();
            });
        };
        vrHelper.onControllerMeshLoaded.add(function (webVRController) {
            var leftLastTriggerValue, rightLastTriggerValue;
            webVRController.onTriggerStateChangedObservable.add(function (stateObject) {
                var _a;
                if (stateObject.value >= 1) {
                    //statusbar.addtext("Right Trigger Pressed!");
                    var ray = (_a = webVRCamera.rightController) === null || _a === void 0 ? void 0 : _a.getForwardRay(30);
                    if (ray) {
                        var hit = scene.pickWithRay(ray);
                        if ((hit === null || hit === void 0 ? void 0 : hit.pickedMesh) && hit.pickedMesh.name == "UI")
                            return;
                        // if(tool_id==2&&hit?.pickedMesh){
                        //     if(hit.pickedMesh.name=='b') deleteAllObjects();
                        //     else hit.pickedMesh.dispose();
                        // }
                        //var pos = ray.origin.add(ray.direction.scale(disstrok));
                        //spawnObject("right");
                        drawingControl.activate(true);
                    }
                }
                else {
                    drawingControl.activate(false);
                }
                rightLastTriggerValue = stateObject.value;
            });
            webVRController.onPadStateChangedObservable.add(function (stateObject) {
                if (stateObject.pressed === true) {
                    if (UIPlane2_statusbar.isVisible == true) {
                        statusbar.addtext("UI closed");
                        UIplane2setVisiable(false);
                        vrHelper.displayLaserPointer = false;
                    }
                    else {
                        statusbar.addtext("UI opened");
                        UIplane2setVisiable(true);
                        vrHelper.displayLaserPointer = true;
                    }
                }
            });
            webVRController.onMainButtonStateChangedObservable.add(function (stateObject) {
                if (webVRController.hand == "right" && stateObject.pressed == true) {
                    drawingControl.undo();
                }
            });
            webVRController.onSecondaryButtonStateChangedObservable.add(function (stateObject) {
                if (webVRController.hand == "right" && stateObject.pressed == true) {
                    drawingControl.redo();
                }
            });
        });
        vrHelper.onEnteringVRObservable.add(function () {
            UIbutton1.isVisible = false;
            UIbutton2.isVisible = false;
        });
        vrHelper.onAfterEnteringVRObservable.add(function () {
            statusbar = statusbar2;
            statusbar.addtext("Enter UI " + UIswitch.toString());
        });
        vrHelper.onExitingVRObservable.add(function () {
            UIbutton1.isVisible = true;
            UIbutton2.isVisible = true;
            UIplane2setVisiable(false);
            UIplane.isVisible = false;
        });
        return scene;
    };
    return Playground;
}());
var BrushOrigin = /** @class */ (function () {
    function BrushOrigin(mat, webVRCamera) {
        this.RSphere = MeshBuilder.CreateSphere("Brushorigin", { diameter: strokeThickness }, scene);
        //this.RSphere.material = mat;
        this.RSphere.material = new StandardMaterial("eraseMat", scene);
        this.RSphere.isPickable = false;
        this.RSphere.isVisible = false;
        this.right = this.RSphere;
        this.webVRCamera = webVRCamera;
        this.tool_id = 0;
        this.scale = strokeThickness;
        this.init_scale = strokeThickness;
        this.stroketipPath = new Array();
        this.stroketipPath.push(new Array());
        this.stroketipPath.push(new Array());
        this.stroketipPath[0].push(new Vector3(0, 0, 1));
        this.stroketipPath[1].push(new Vector3(0, 1, 1));
        this.stroketipPath[0].push(new Vector3(1, 0, 1));
        this.stroketipPath[1].push(new Vector3(1, 1, 1));
        this.stroketip = MeshBuilder.CreateRibbon("stroketip", { pathArray: this.stroketipPath, updatable: true }, scene);
        this.stroketip.material = mat;
        mat.backFaceCulling = false;
        this.stroketip.isPickable = false;
        this.taillength = 9;
        this.stroketiptailPath = new Array();
        this.stroketiptailPath.push(new Array());
        this.stroketiptailPath.push(new Array());
        for (var i = 0; i < this.taillength; i++) {
            this.stroketiptailPath[0].push(new Vector3(i / 100, 0, -1));
            this.stroketiptailPath[1].push(new Vector3(i / 100, 1, -1));
        }
        this.stroketiptail = MeshBuilder.CreateRibbon("stroketiptail", { pathArray: this.stroketiptailPath, updatable: true }, scene);
        this.stroketiptail.material = mat;
        mat.backFaceCulling = false;
        this.stroketiptail.isPickable = false;
        this.stroketiptail.isVisible = false;
        this.tipwidth = 0.0015;
    }
    BrushOrigin.prototype.updatePos = function () {
        var _a, _b;
        var ray = (_a = this.webVRCamera.rightController) === null || _a === void 0 ? void 0 : _a.getForwardRay();
        if (ray) {
            this.right.position = ray.origin.add(ray.direction.scale(disstrok));
        }
        var rotmat = new Matrix();
        (_b = this.webVRCamera.rightController) === null || _b === void 0 ? void 0 : _b.deviceRotationQuaternion.toRotationMatrix(rotmat);
        var downVec = Vector3.TransformCoordinates(new Vector3(0, -1, 0), rotmat);
        var leftVec = Vector3.TransformCoordinates(new Vector3(1, 0, 0), rotmat);
        var vec00 = this.right.position.add(downVec.scale(this.scale / 2));
        var vec10 = this.right.position.add(downVec.scale(-this.scale / 2));
        var vec01 = vec00.add(leftVec.scale(this.tipwidth));
        var vec11 = vec10.add(leftVec.scale(this.tipwidth));
        this.stroketipPath[0][0] = vec00;
        this.stroketipPath[1][0] = vec10;
        this.stroketipPath[0][1] = vec01;
        this.stroketipPath[1][1] = vec11;
        this.stroketiptailPath[0].shift();
        this.stroketiptailPath[1].shift();
        //scale the tail, thinner when close to the end
        for (var i = 0; i < this.stroketiptailPath[0].length; i++) {
            var mid = this.stroketiptailPath[0][i].add(this.stroketiptailPath[1][i]).scale(0.5);
            this.stroketiptailPath[0][i] = mid.scale(0.3).add(this.stroketiptailPath[0][i].scale(0.7));
            this.stroketiptailPath[1][i] = mid.scale(0.3).add(this.stroketiptailPath[1][i].scale(0.7));
        }
        this.stroketiptailPath[0].push(vec00);
        this.stroketiptailPath[1].push(vec10);
        vec00 = vec00.add(leftVec.scale(-this.tipwidth));
        vec10 = vec10.add(leftVec.scale(-this.tipwidth));
        var tailpositions = this.stroketiptail.getVerticesData(VertexBuffer.PositionKind);
        //var tailpositions = new Array();
        if (tailpositions) {
            for (var i = 0; i < this.stroketiptailPath[0].length; i++) {
                this.stroketiptailPath[0][i].toArray(tailpositions, 3 * i);
            }
            for (var i = 0; i < this.stroketiptailPath[0].length; i++) {
                this.stroketiptailPath[1][i].toArray(tailpositions, 3 * i + this.taillength * 3);
            }
            //this.stroketiptail.updateVerticesData(VertexBuffer.PositionKind, tailpositions);
            this.stroketiptail.setVerticesData(VertexBuffer.PositionKind, tailpositions);
        }
        var positions = this.stroketip.getVerticesData(VertexBuffer.PositionKind);
        if (positions) {
            vec00.toArray(positions, 0);
            vec01.toArray(positions, 3);
            vec10.toArray(positions, 6);
            vec11.toArray(positions, 9);
            this.stroketip.setVerticesData(VertexBuffer.PositionKind, positions);
        }
    };
    BrushOrigin.prototype.switch = function (id) {
        if (id == 1) {
            this.right.isVisible = false;
            this.stroketiptail.isVisible = true;
            // this.LSphere.isVisible = true;
            // this.RSphere.isVisible = true;
            // this.LBox.isVisible = false;
            // this.RBox.isVisible = false;
            // this.left = this.LSphere;
            // this.right = this.RSphere;
        }
        else if (id == 0) {
            this.right.isVisible = false;
            this.stroketiptail.isVisible = false;
            // this.LSphere.isVisible = false;
            // this.RSphere.isVisible = false;
            // this.LBox.isVisible = true;
            // this.RBox.isVisible = true;
            // this.left = this.LBox;
            // this.right = this.RBox;
        }
        else if (id == 2) {
            // this.LSphere.isVisible = false;
            // this.RSphere.isVisible = false;
            // this.LBox.isVisible = false;
            // this.RBox.isVisible = false;
            this.stroketiptail.isVisible = false;
            this.right.isVisible = true;
        }
        this.tool_id = id;
    };
    BrushOrigin.prototype.scaling = function (scale) {
        //statusbar.addtext("scaling "+scale.toString());
        var tmp = scale / this.init_scale;
        var scaling = new Vector3(tmp, tmp, tmp);
        // this.LBox.scaling = scaling;
        // this.LSphere.scaling = scaling;
        // this.left.scaling = scaling;
        // this.RBox.scaling = scaling;
        this.RSphere.scaling = scaling;
        this.right.scaling = scaling;
        this.scale = scale;
    };
    return BrushOrigin;
}());
var Action = /** @class */ (function () {
    function Action(name, idx, mesh) {
        this.name = name;
        this.idx = idx;
        this.mesh = meshes;
    }
    return Action;
}());
var DrawingControl = /** @class */ (function () {
    function DrawingControl() {
        this.activated = false;
        this.points = new Array();
        this.redoStack = new Array();
        this.undoStack = new Array();
        this.meshLengthEst = 0.0;
    }
    DrawingControl.prototype.activate = function (flag) {
        this.activated = flag;
        if (!flag) {
            if (this.mesh) {
                meshes.push(this.mesh);
                statusbar.addtext(this.mesh.name + " drawn");
                this.meshLengthEst = 0.0;
                this.undoStack.push(new Action("draw", meshes.length - 1, this.mesh));
                this.redoClear();
            }
            this.mesh = null;
        }
        else {
            this.paths = new Array();
            this.paths.push(new Array());
            this.paths.push(new Array());
            this.points = new Array();
        }
    };
    DrawingControl.prototype.run = function (Brushorigin, id, mat) {
        if (this.mesh)
            this.mesh.dispose();
        var cur_mesh;
        if (id == 1) {
            var new_point = (Brushorigin.stroketipPath[0][0].add(Brushorigin.stroketipPath[0][0])).scale(0.5);
            if (this.points.length > 2) {
                var lastpoint = this.points[this.points.length - 1];
                var lastpoint2 = this.points[this.points.length - 2];
                var vec1 = lastpoint.subtract(lastpoint2).normalize();
                var vec2 = new_point.subtract(lastpoint).normalize();
                //statusbar.addtext("dotproduct: "+Vector3.Dot(vec1,vec2).toString());
                if (Vector3.Dot(vec1, vec2) > 0.995) {
                    this.meshLengthEst -= Vector3.Distance(this.points[this.points.length - 1], this.points[this.points.length - 2]);
                    this.points.pop();
                    this.paths[0].pop();
                    this.paths[1].pop();
                }
            }
            this.points.push(new_point);
            this.paths[0].push(Brushorigin.stroketipPath[0][0]);
            this.paths[1].push(Brushorigin.stroketipPath[1][0]);
            // this.paths[0].push( Brushorigin.stroketipPath[0][0]);
            // this.paths[1].push( Brushorigin.stroketipPath[1][1]);
            // var tmp:string = "";
            // tmp += (Brushorigin.stroketipPath[0][0].add(Brushorigin.stroketipPath[0][1]).scale(0.5)).toString();
            // tmp += (Brushorigin.stroketipPath[1][0].add(Brushorigin.stroketipPath[1][1]).scale(0.5)).toString();
            //statusbar.addtext(this.paths[0].length);
            if (this.paths[0].length > 1) {
                this.meshLengthEst += Vector3.Distance(this.points[this.points.length - 1], this.points[this.points.length - 2]);
                cur_mesh = MeshBuilder.CreateRibbon("stroke", { pathArray: this.paths }, scene);
                cur_mesh.material = mat.clone();
                if (texture_id != -1) {
                    cur_mesh.material.diffuseTexture.uScale = this.meshLengthEst / strokeThickness;
                }
                this.mesh = cur_mesh;
            }
        }
        else if (id == 0) {
            var new_point = (Brushorigin.stroketipPath[0][0].add(Brushorigin.stroketipPath[0][0])).scale(0.5);
            if (this.points.length > 1) {
                this.points.pop();
                this.paths[0].pop();
                this.paths[1].pop();
            }
            this.points.push(new_point);
            this.paths[0].push(Brushorigin.stroketipPath[0][0]);
            this.paths[1].push(Brushorigin.stroketipPath[1][0]);
            if (this.paths[0].length > 1) {
                cur_mesh = MeshBuilder.CreateRibbon("strokestraight", { pathArray: this.paths }, scene);
                cur_mesh.material = mat.clone();
                if (texture_id != -1) {
                    cur_mesh.material.diffuseTexture.uScale = Vector3.Distance(this.points[0], this.points[1]) / strokeThickness;
                    //statusbar.addtext("uScale: "+cur_mesh.material.diffuseTexture.uScale.toString());
                }
                this.mesh = cur_mesh;
            }
        }
        else if (id == 2) {
            for (var i = 0; i < meshes.length; i++) {
                if (Brushorigin.right.intersectsMesh(meshes[i], true)) {
                    //meshes[i].dispose();
                    //meshes[i] = null;
                    if (meshes[i].isVisible) {
                        meshes[i].isVisible = false;
                        statusbar.addtext(meshes[i].name + " deleted");
                        this.undoStack.push(new Action("delete", i, meshes[i]));
                    }
                }
            }
        }
        //mesh.scaling = new Vector3(2,2,2);
    };
    DrawingControl.prototype.undo = function () {
        if (this.undoStack.length < 1)
            return;
        var last_action = this.undoStack.pop();
        if (last_action) {
            this.redoStack.push(last_action);
            var mesh = meshes[last_action.idx];
            if (last_action.name == "draw") {
                mesh.isVisible = false;
            }
            else if (last_action.name == "delete") {
                mesh.isVisible = true;
            }
        }
        //     var tmp = "undo stack: "
        //     this.undoStack.forEach(element => {
        //         tmp += element.name + " ";
        //     });
        //     statusbar.addtext(tmp);
        //     var tmp = "redo stack: "
        //     this.redoStack.forEach(element => {
        //         tmp += element.name + " ";
        //     });
        //     statusbar.addtext(tmp);
    };
    DrawingControl.prototype.redo = function () {
        if (this.redoStack.length < 1)
            return;
        var last_action = this.redoStack.pop();
        if (last_action) {
            this.undoStack.push(last_action);
            var mesh = meshes[last_action.idx];
            if (last_action.name == "draw") {
                mesh.isVisible = true;
            }
            else if (last_action.name == "delete") {
                mesh.isVisible = false;
            }
        }
        // var tmp = "undo stack: "
        // this.undoStack.forEach(element => {
        //     tmp += element.name + " ";
        // });
        // statusbar.addtext(tmp);
        // var tmp = "redo stack: "
        // this.redoStack.forEach(element => {
        //     tmp += element.name + " ";
        // });
        // statusbar.addtext(tmp);
    };
    DrawingControl.prototype.redoClear = function () {
        for (var i = 0; i < this.redoStack.length; i++) {
            if (this.redoStack[i].name == "draw") {
                //this.redoStack[i].mesh?.dispose();
            }
        }
        this.redoStack = [];
    };
    return DrawingControl;
}());
;
var DropdownMenu = /** @class */ (function () {
    function DropdownMenu(height, width) {
        this.buttons = new Array();
        this.bheight = height;
        this.bwidth = width;
    }
    DropdownMenu.prototype.add = function (d) {
        d.container.left = (230 + this.buttons.length * this.bwidth).toString() + "px";
        this.buttons.push(d);
    };
    DropdownMenu.prototype.add_left = function (d) {
        d.container.left = (70 + this.buttons.length * this.bwidth).toString() + "px";
        this.buttons.push(d);
    };
    DropdownMenu.prototype.disableOthers = function (name) {
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var d = _a[_i];
            if (d.text != name) {
                d.button.background = d.background;
                d.options.isVisible = false;
                d.container.height = d.height;
            }
        }
    };
    return DropdownMenu;
}());
var Dropdown = /** @class */ (function () {
    function Dropdown(advancedTexture, name, height, width) {
        this.advancedTexture = advancedTexture;
        this.text = name;
        this.height = height;
        this.width = width;
        this.color = "white";
        this.background = "#95afc0";
        this.container = new Container();
        //this.container.background = "blue";
        this.container.width = this.width;
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.isHitTestVisible = true;
        this.container.top = "10px";
        //this.container.left = "10px";
        //this.container.background = "pink";
        this.button = Button.CreateSimpleButton(this.text, this.text);
        //this.button.cornerRadius = 55;
        this.button.height = this.height;
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.button.fontSize = 30;
        this.options = new StackPanel();
        this.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.options.top = this.height;
        this.options.isVertical = true;
        this.options.isVisible = false;
        var _this = this;
        this.button.onPointerUpObservable.add(function () {
            statusbar.addtext(_this.button.name + " Button Pressed!");
            _this.options.isVisible = !_this.options.isVisible;
            if (_this.options.isVisible) {
                _this.container.height = (5 * parseInt(_this.height)).toString() + "px";
            }
            else {
                _this.container.height = _this.height;
            }
            if (_this.button.background == selected_color) {
                _this.button.background = _this.background;
            }
            else
                _this.button.background = selected_color;
            // dropdownMenu.disableOthers(_this.text);
        });
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.button);
        this.container.addControl(this.options);
    }
    Dropdown.prototype.addOption = function (text) {
        var _this_1 = this;
        var button = Button.CreateSimpleButton(text, text);
        button.height = this.height;
        button.width = this.width;
        button.thickness = 2;
        button.paddingTop = "-1px";
        button.background = this.background;
        button.color = this.color;
        button.alpha = 1.0;
        button.cornerRadius = 5;
        button.fontSize = this.button.fontSize;
        button.onPointerUpObservable.add(function () {
            statusbar.addtext(button.name + " Button Pressed!");
            _this_1.button.background = _this_1.background;
            _this_1.options.isVisible = false;
        });
        //button.onPointerClickObservable.add(); 
        this.options.addControl(button);
    };
    return Dropdown;
}());
;
var Dropdown_small = /** @class */ (function (_super) {
    __extends(Dropdown_small, _super);
    function Dropdown_small(advancedTexture, name, height, width) {
        var _this_1 = _super.call(this, advancedTexture, name, 0, 0) || this;
        _this_1.advancedTexture = advancedTexture;
        _this_1.text = name;
        _this_1.height = height;
        _this_1.width = width;
        _this_1.color = "white";
        _this_1.background = "#95afc0";
        _this_1.container = new Container();
        //this.container.background = "blue";
        _this_1.container.width = _this_1.width;
        _this_1.container.height = _this_1.height;
        _this_1.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        _this_1.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        _this_1.container.isHitTestVisible = true;
        _this_1.container.top = "10px";
        //this.container.left = "10px";
        _this_1.container.background = "gray";
        _this_1.container.alpha = 0.7;
        _this_1.button = Button.CreateSimpleButton(_this_1.text, _this_1.text);
        //this.button.cornerRadius = 55;
        _this_1.button.height = _this_1.height;
        _this_1.button.background = _this_1.background;
        _this_1.button.color = _this_1.color;
        _this_1.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        _this_1.button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        _this_1.button.fontSize = 40;
        _this_1.options = new StackPanel();
        _this_1.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        _this_1.options.top = _this_1.height;
        _this_1.options.isVertical = true;
        _this_1.options.isVisible = false;
        var _this = _this_1;
        _this_1.button.onPointerUpObservable.add(function () {
            statusbar.addtext(_this.button.name + " Button Pressed!");
            _this.options.isVisible = !_this.options.isVisible;
            if (_this.options.isVisible) {
                _this.container.height = (5 * parseInt(_this.height)).toString() + "px";
            }
            else {
                _this.container.height = _this.height;
            }
            if (_this.button.background == selected_color) {
                _this.button.background = _this.background;
            }
            else
                _this.button.background = selected_color;
            dropdownMenu2.disableOthers(_this.text);
        });
        _this_1.advancedTexture.addControl(_this_1.container);
        _this_1.container.addControl(_this_1.button);
        _this_1.container.addControl(_this_1.options);
        return _this_1;
    }
    Dropdown_small.prototype.addOption = function (text) {
        var _this_1 = this;
        var button = Button.CreateSimpleButton(text, text);
        button.height = this.height;
        button.width = this.width;
        button.thickness = 2;
        button.paddingTop = "-1px";
        button.background = this.background;
        button.color = this.color;
        button.alpha = 1.0;
        button.cornerRadius = 5;
        button.fontSize = this.button.fontSize;
        button.onPointerUpObservable.add(function () {
            statusbar.addtext(button.name + " Button Pressed!");
            _this_1.button.background = _this_1.background;
            _this_1.options.isVisible = false;
            dropdownMenu2.disableOthers("");
        });
        //button.onPointerClickObservable.add(); 
        this.options.addControl(button);
    };
    return Dropdown_small;
}(Dropdown));
;
var ToolPalette = /** @class */ (function () {
    function ToolPalette(advancedTexture, height, width) {
        this.advancedTexture = advancedTexture;
        this.height = height;
        this.width = width;
        this.background = "#b2bec3";
        this.color = "white";
        this.container = new Container();
        this.container.height = this.height;
        this.container.width = this.width;
        this.container.paddingLeft = "10px";
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.container.paddingTop = "100px";
        //this.container.background = "pink";   
        this.lcontainer = new Container();
        this.lcontainer.height = 1;
        this.lcontainer.width = (parseInt(this.width) / 2).toString() + "px";
        //this.lcontainer.paddingLeft = "10px";
        this.lcontainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.lcontainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        //this.lcontainer.paddingTop = "-100px";     
        //this.lcontainer.background = "red";   
        this.backpanel = new Rectangle();
        this.backpanel.cornerRadius = 30;
        this.backpanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.backpanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.backpanel.width = 1;
        this.backpanel.height = "";
        this.backpanel.background = "#f7f1e3";
        this.backpanel.alpha = 0.9;
        this.lcontainer.addControl(this.backpanel);
        this.bcontainer = new Container();
        this.bcontainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.bcontainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.bcontainer.paddingTop = this.lcontainer.paddingTop;
        this.bcontainer.left = this.lcontainer.width;
        this.bcontainer.width = this.lcontainer.width;
        this.bcontainer.height = this.lcontainer.height;
        //this.bcontainer.background = "blue";
        //this.bcontainer.alpha = 0.3;
        this.bbackpanel = new Rectangle();
        this.bbackpanel.cornerRadius = 5;
        this.bbackpanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.bbackpanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.bbackpanel.width = 1;
        this.bbackpanel.alpha = 0.8;
        this.bbackpanel.height = "";
        this.bbackpanel.background = this.backpanel.background;
        this.bbackpanel.alpha = this.backpanel.alpha;
        this.bbackpanel.isVisible = false;
        this.bcontainer.addControl(this.bbackpanel);
        this.buttons = new Array();
        //brush option
        this.brushes = new Array();
        this.options = new Container();
        this.options.height = 1;
        this.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.options.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        //this.options.paddingTop = "30px";
        this.options.paddingLeft = "20px";
        this.options.isVisible = false;
        this.options.isVertical = true;
        this.options2 = new Container();
        this.options2.height = 1;
        this.options2.verticalAlignment = this.options.verticalAlignment;
        this.options2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.options2.paddingTop = this.options.paddingTop;
        this.options2.paddingRight = this.options.paddingLeft;
        this.options2.left = (parseInt(this.bcontainer.width) / 2).toString() + "px";
        this.options2.isVisible = false;
        this.options2.isVertical = true;
        this.colorPicker = new ColorPicker();
        //this.colorPicker.height = "150px";
        this.colorPicker.width = (parseInt(this.bcontainer.width) * 0.8).toString() + "px";
        this.colorPicker.isVisible = false;
        this.colorPicker.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.colorPicker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.colorPicker.onValueChangedObservable.add(function (value) {
            BrushMat.diffuseColor.copyFrom(value);
        });
        this.tool_id = 0;
        this.brush_id = 0;
        this.brushPanel_id = 0;
        this.bcontainer.addControl(this.options);
        this.bcontainer.addControl(this.options2);
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.lcontainer);
        this.container.addControl(this.bcontainer);
        this.advancedTexture.addControl(this.colorPicker);
    }
    ToolPalette.prototype.addButton = function (name) {
        var _this_1 = this;
        var _a;
        var button = Button.CreateSimpleButton(name, name);
        button.width = "160px";
        button.height = "90px";
        button.color = this.color;
        button.cornerRadius = 55;
        button.background = this.background;
        (_a = button.name) === null || _a === void 0 ? void 0 : _a.fontsize(0.1);
        if (this.buttons.length == 0)
            button.background = selected_color3;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        button.top = (20 + (this.buttons.length * parseInt(button.height) * 1.5)).toString() + "px";
        button.fontSize = 25;
        //statusbar.addtext(button.paddingTop);
        button.onPointerUpObservable.add(function () {
            //dropdownMenu.disableOthers("");
            if (button.background == selected_color3)
                button.background = _this_1.background;
            else
                button.background = selected_color3;
            for (var i = 0; i < 3; ++i) {
                if (_this_1.buttons[i].name != name) {
                    _this_1.buttons[i].background = _this_1.background;
                }
                else {
                    _this_1.buttons[i].background = selected_color3;
                    _this_1.tool_id = i;
                    tool_id = i;
                }
            }
            statusbar.addtext(button.name + " Selected!");
        });
        this.lcontainer.addControl(button);
        this.buttons.push(button);
    };
    ToolPalette.prototype.updateBrushSelection = function (name) {
        for (var i = 0; i < this.brushes.length; ++i) {
            if (this.brushes[i].name != name) {
                this.brushes[i].thickness = 5;
                this.brushes[i].color = "black";
            }
        }
    };
    ToolPalette.prototype.addBrushOption = function (col, row, id, name, img, texture) {
        var _this_1 = this;
        var button = Button.CreateImageOnlyButton(name, img);
        //button.height = this.buttons[0].height;
        button.width = (parseInt(this.bcontainer.width) / 3).toString() + "px";
        button.height = button.width;
        button.thickness = 5;
        //button.paddingTop = "3px";
        button.top = (20 + (row * parseInt(button.height) * 1.5)).toString() + "px";
        //button.left = this.width;
        button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        button.color = "black";
        button.alpha = 1.0;
        button.cornerRadius = 5;
        button.onPointerUpObservable.add(function () {
            dropdownMenu.disableOthers("");
            if (_this_1.brush_id != id) {
                statusbar.addtext(button.name + " Brush Selected!");
                button.color = selected_color3;
                button.thickness = 3;
                _this_1.updateBrushSelection(name);
                _this_1.brush_id = id;
                BrushMat.diffuseTexture = textures[_this_1.brush_id];
            }
            else {
                statusbar.addtext(button.name + " Brush DeSelected!");
                _this_1.brush_id = -1;
                _this_1.updateBrushSelection("");
                BrushMat.diffuseTexture = null;
            }
        });
        //button.onPointerClickObservable.add(); 
        if (col == 0)
            this.options.addControl(button);
        else
            this.options2.addControl(button);
        this.brushes.push(button);
        if (textures.length <= id)
            textures.push(new Texture(texture, scene));
        //this.bcontainer.addControl(button);
    };
    ToolPalette.prototype.updatePanelSize = function () {
        this.backpanel.height = (30 + (this.buttons.length * parseInt(this.buttons[0].height) * 1.5)).toString() + "px";
        this.bbackpanel.height = (20 + (this.buttons.length * parseInt(this.buttons[0].height) * 1.5)).toString() + "px";
        this.lcontainer.height = this.backpanel.height;
        this.bcontainer.height = this.backpanel.height;
        this.colorPicker.top = (50 + ((this.buttons.length - 1) * parseInt(this.buttons[0].height) * 1.5)).toString() + "px";
        this.colorPicker.left = (parseInt(this.lcontainer.width) * 1.1).toString() + "px";
    };
    ToolPalette.prototype.bindBrushMenu = function (id) {
        var _this_1 = this;
        var button = this.buttons[id];
        this.brushPanel_id = id;
        button.onPointerUpObservable.clear();
        button.onPointerUpObservable.add(function () {
            dropdownMenu.disableOthers("");
            _this_1.bbackpanel.isVisible = !_this_1.bbackpanel.isVisible;
            _this_1.options.isVisible = !_this_1.options.isVisible;
            _this_1.options2.isVisible = !_this_1.options2.isVisible;
            if (button.background == selected_color2)
                button.background = _this_1.background;
            else
                button.background = selected_color2;
            if (_this_1.options.isVisible)
                statusbar.addtext("Brush Menu Opened!");
            else
                statusbar.addtext("Brush Menu Closed!");
        });
        this.addBrushOption(0, 0, 0, "b0", "./brushIcons/brush8.png", "./textures/albedo.png");
        this.addBrushOption(0, 1, 1, "b1", "./brushIcons/brush1.png", "./textures/bloc.jpg");
        this.addBrushOption(0, 2, 2, "b2", "./brushIcons/brush2.png", "./textures/distortion.png");
        this.addBrushOption(0, 3, 3, "b3", "./brushIcons/brush7.png", "./textures/grass.jpg");
        this.addBrushOption(1, 0, 4, "b4", "./brushIcons/brush4.png", "./textures/ground.jpg");
        this.addBrushOption(1, 1, 5, "b5", "./brushIcons/brush5.png", "./textures/reflectivity.png");
        this.addBrushOption(1, 2, 6, "b6", "./brushIcons/brush6.png", "./textures/rockyGround_basecolor.png");
        this.addBrushOption(1, 3, 7, "b7", "./brushIcons/brush10.png", "./textures/wood.jpg");
    };
    ToolPalette.prototype.bindColorPicker = function (id) {
        var _this_1 = this;
        var button = this.buttons[id];
        button.onPointerUpObservable.clear();
        button.onPointerUpObservable.add(function () {
            dropdownMenu.disableOthers("");
            _this_1.colorPicker.isVisible = !_this_1.colorPicker.isVisible;
            if (button.background == selected_color2)
                button.background = _this_1.background;
            else
                button.background = selected_color2;
            if (_this_1.colorPicker.isVisible)
                statusbar.addtext("ColorPicker Panel Opened!");
            else
                statusbar.addtext("ColorPicker Panel Closed!");
        });
    };
    return ToolPalette;
}());
var ToolPalette_Small = /** @class */ (function (_super) {
    __extends(ToolPalette_Small, _super);
    function ToolPalette_Small(advancedTexture, height, width) {
        var _this_1 = _super.call(this, advancedTexture, height, width) || this;
        _this_1.advancedTexture = advancedTexture;
        _this_1.height = height;
        _this_1.width = width;
        _this_1.background = "#b2bec3";
        _this_1.color = "white";
        _this_1.container = new Container();
        _this_1.container.height = _this_1.height;
        _this_1.container.width = _this_1.width;
        _this_1.container.paddingLeft = "10px";
        _this_1.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        _this_1.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        //this.container.paddingTop = "100px";     
        //this.container.background = "pink";   
        _this_1.lcontainer = new Container();
        _this_1.lcontainer.height = 1;
        _this_1.lcontainer.width = (parseInt(_this_1.width) / 2).toString() + "px";
        //this.lcontainer.paddingLeft = "10px";
        _this_1.lcontainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        _this_1.lcontainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        //this.lcontainer.paddingTop = "-100px";     
        //this.lcontainer.background = "red";   
        _this_1.backpanel = new Rectangle();
        _this_1.backpanel.cornerRadius = 30;
        _this_1.backpanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        _this_1.backpanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        _this_1.backpanel.width = 1;
        _this_1.backpanel.height = "";
        _this_1.backpanel.background = "#f7f1e3";
        _this_1.backpanel.alpha = 0.;
        _this_1.lcontainer.addControl(_this_1.backpanel);
        _this_1.bcontainer = new Container();
        _this_1.bcontainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        _this_1.bcontainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        _this_1.bcontainer.paddingTop = _this_1.lcontainer.paddingTop;
        //this.bcontainer.left = this.width;
        _this_1.bcontainer.width = _this_1.lcontainer.width;
        _this_1.bcontainer.height = _this_1.lcontainer.height;
        //this.bcontainer.background = "blue";
        _this_1.bbackpanel = new Rectangle();
        _this_1.bbackpanel.cornerRadius = 5;
        _this_1.bbackpanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        _this_1.bbackpanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        _this_1.bbackpanel.width = 1;
        _this_1.bbackpanel.alpha = 0.8;
        _this_1.bbackpanel.height = "";
        _this_1.bbackpanel.background = _this_1.backpanel.background;
        _this_1.bbackpanel.alpha = _this_1.backpanel.alpha;
        _this_1.bbackpanel.isVisible = false;
        _this_1.bcontainer.addControl(_this_1.bbackpanel);
        _this_1.buttons = new Array();
        //brush option
        _this_1.brushes = new Array();
        _this_1.options = new Container();
        _this_1.options.height = 1;
        _this_1.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        _this_1.options.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        //this.options.paddingTop = "30px";
        //this.options.paddingLeft = "20px";
        _this_1.options.isVisible = false;
        _this_1.options.background = "blue";
        _this_1.options2 = new Container();
        _this_1.options2.height = 1;
        _this_1.options2.verticalAlignment = _this_1.options.verticalAlignment;
        _this_1.options2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        _this_1.options2.paddingTop = _this_1.options.paddingTop;
        //this.options2.paddingRight = this.options.paddingLeft;
        //this.options2.left = (parseInt(this.bcontainer.width)/2).toString() + "px";
        _this_1.options2.isVisible = _this_1.options.isVisible;
        _this_1.colorPicker = new ColorPicker();
        //this.colorPicker.height = "150px";
        _this_1.colorPicker.width = 1;
        _this_1.colorPicker.isVisible = false;
        _this_1.colorPicker.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        _this_1.colorPicker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        _this_1.colorPicker.onValueChangedObservable.add(function (value) {
            BrushMat.diffuseColor.copyFrom(value);
        });
        _this_1.brushSizePanel = new Container();
        _this_1.brushSizePanel.width = "120px";
        _this_1.brushSizePanel.height = _this_1.lcontainer.height;
        _this_1.brushSizePanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        _this_1.brushSizePanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        //this.brushSizePanel.background = "blue";
        _this_1.brushSizeSlider = new Slider();
        _this_1.brushSizeSlider.isVertical = true;
        _this_1.brushSizeSlider.maximum = 0.1;
        _this_1.brushSizeSlider.minimum = 0.01;
        _this_1.brushSizeSlider.height = 1;
        _this_1.brushSizeSlider.width = 0.7;
        _this_1.brushSizeSlider.cornerRadius = 30;
        _this_1.brushSizeSlider.color = "white";
        _this_1.brushSizeSlider.background = selected_color;
        _this_1.brushSizeSlider.displayThumb = true;
        _this_1.brushSizeSlider.isThumbCircle = true;
        _this_1.brushSizeSlider.value = strokeThickness;
        var _this = _this_1;
        _this_1.brushSizeSlider.onValueChangedObservable.add(function (value) {
            strokeThickness = value;
        });
        _this_1.brushSizePanel.addControl(_this_1.brushSizeSlider);
        _this_1.tool_id = 0;
        _this_1.brush_id = 0;
        _this_1.bcontainer.addControl(_this_1.options);
        _this_1.bcontainer.addControl(_this_1.options2);
        _this_1.advancedTexture.addControl(_this_1.container);
        _this_1.container.addControl(_this_1.lcontainer);
        _this_1.container.addControl(_this_1.bcontainer);
        _this_1.container.addControl(_this_1.brushSizePanel);
        return _this_1;
        //this.advancedTexture.addControl(this.colorPicker);
    }
    ToolPalette_Small.prototype.addButton = function (name) {
        var _this_1 = this;
        var _a;
        var button = Button.CreateSimpleButton(name, name);
        button.width = "300px";
        button.height = "180px";
        button.color = this.color;
        button.cornerRadius = 55;
        button.background = this.background;
        (_a = button.name) === null || _a === void 0 ? void 0 : _a.fontsize(0.1);
        if (this.buttons.length == 0)
            button.background = selected_color3;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        button.top = ((this.buttons.length * parseInt(button.height) * 1)).toString() + "px";
        button.fontSize = 55;
        //statusbar.addtext(button.paddingTop);
        button.onPointerUpObservable.add(function () {
            dropdownMenu.disableOthers("");
            // this.options.isVisible = false;this.options2.isVisible = false;
            // this.buttons[this.brushPanel_id].background = this.background;
            if (button.background == selected_color3)
                button.background = _this_1.background;
            else
                button.background = selected_color3;
            for (var i = 0; i < 3; ++i) {
                if (_this_1.buttons[i].name != name) {
                    _this_1.buttons[i].background = _this_1.background;
                }
                else {
                    _this_1.buttons[i].background = selected_color3;
                    _this_1.tool_id = i;
                    tool_id = i;
                }
            }
            statusbar.addtext(button.name + " Selected!");
        });
        this.lcontainer.addControl(button);
        this.buttons.push(button);
    };
    ToolPalette_Small.prototype.addBrushOption = function (col, row, id, name, img, texture) {
        var _this_1 = this;
        var button = Button.CreateImageOnlyButton(name, img);
        //button.height = this.buttons[0].height;
        button.width = (parseInt(this.buttons[0].height)).toString() + "px";
        button.height = button.width;
        button.thickness = 5;
        //button.paddingTop = "3px";
        button.top = ((row * parseInt(button.height) * 1)).toString() + "px";
        //button.left = this.width;
        button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        button.color = "black";
        button.alpha = 1.0;
        button.cornerRadius = 5;
        button.onPointerUpObservable.add(function () {
            dropdownMenu.disableOthers("");
            if (_this_1.brush_id != id) {
                statusbar.addtext(button.name + " Brush Selected!");
                button.color = selected_color3;
                button.thickness = 10;
                _this_1.updateBrushSelection(name);
                _this_1.brush_id = id;
                BrushMat.diffuseTexture = textures[_this_1.brush_id];
            }
            else {
                statusbar.addtext(button.name + " Brush DeSelected!");
                _this_1.brush_id = -1;
                _this_1.updateBrushSelection("");
                BrushMat.diffuseTexture = null;
            }
            texture_id = _this_1.brush_id;
        });
        //button.onPointerClickObservable.add(); 
        if (col == 0)
            this.options.addControl(button);
        else
            this.options2.addControl(button);
        this.brushes.push(button);
        textures.push(new Texture(texture, scene));
        //this.bcontainer.addControl(button);
    };
    ToolPalette_Small.prototype.updatePanelSize = function () {
        this.backpanel.height = ((this.buttons.length * parseInt(this.buttons[0].height) * 1)).toString() + "px";
        this.bbackpanel.height = ((4 * parseInt(this.buttons[0].height) * 1)).toString() + "px";
        this.options.width = this.buttons[0].height;
        this.options2.width = this.options.width;
        this.lcontainer.height = this.backpanel.height;
        this.lcontainer.width = this.buttons[0].width;
        this.bcontainer.height = this.bbackpanel.height;
        this.bcontainer.width = (2 * parseInt(this.options.width)).toString() + "px";
        this.bcontainer.left = (-parseInt(this.lcontainer.width) - (parseInt(this.bcontainer.width) - parseInt(this.lcontainer.width)) / 2).toString() + "px";
        this.bcontainer.top = (-parseInt(this.options.width).toString()) + "px";
        this.brushSizePanel.left = (30 + parseInt(this.lcontainer.width) + (parseInt(this.brushSizePanel.width) - parseInt(this.lcontainer.width)) / 2).toString() + "px";
        this.brushSizePanel.height = this.lcontainer.height;
    };
    ToolPalette_Small.prototype.bindColorPickerTexture = function (advancedTexture) {
        advancedTexture.addControl(this.colorPicker);
    };
    return ToolPalette_Small;
}(ToolPalette));
var Statusbar = /** @class */ (function () {
    function Statusbar(advancedTexture, height, width) {
        this.advancedTexture = advancedTexture;
        this.height = height;
        this.width = width;
        this.short_log = "";
        this.all_log = "";
        this.container = new Container();
        this.container.width = width;
        this.container.height = this.height;
        //this.container.background = "blue";
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.container.top = "-225px";
        this.container.left = "100px";
        //this.container.background = "pink"
        //this.container.HORIZONTAL_ALIGNMENT_LEFT = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.scrollviewer = new ScrollViewer();
        this.scrollviewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.scrollviewer.top = "20px";
        this.scrollviewer.color = "white";
        this.scrollviewer.background = "black";
        this.scrollviewer.alpha = 0.5;
        this.scrollviewer.width = 1;
        this.scrollviewer.height = 0.85;
        this.button = Button.CreateSimpleButton("Status Bar Expand", "^");
        //this.button.top = "20px";
        this.button.width = this.scrollviewer.width;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.button.height = "20px";
        this.button.color = "white";
        this.button.alpha = 0.7;
        this.button.background = "#95afc0";
        this.button.textWrapping = TextWrapping.WordWrap;
        this.button.resizeToFit = true;
        this.textblock = new TextBlock();
        this.background = "black";
        this.textblock.text = this.short_log;
        this.textblock.textWrapping = TextWrapping.WordWrap;
        this.textblock.resizeToFit = true;
        this.textblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.textblock.paddingLeft = "5px";
        this.expand_flag = false;
        var _this = this;
        this.button.onPointerClickObservable.add(function () {
            _this.addtext(_this.button.name + " Button Pressed!");
            if (!_this.expand_flag) {
                _this.expand_flag = true;
                _this.container.height = 0.5;
                _this.scrollviewer.height = 0.96;
                _this.textblock.text = _this.all_log;
                _this.button.children[0].text = "===";
            }
            else {
                _this.expand_flag = false;
                _this.container.height = _this.height;
                _this.scrollviewer.height = 0.85;
                _this.textblock.text = _this.short_log;
                _this.button.children[0].text = "^";
            }
        });
        advancedTexture.addControl(this.container);
        this.scrollviewer.addControl(this.textblock);
        this.container.addControl(this.button);
        this.container.addControl(this.scrollviewer);
    }
    Statusbar.prototype.addtext = function (txt) {
        this.all_log += txt + "\n";
        this.short_log = txt + "\n";
        if (this.expand_flag)
            this.textblock.text = this.all_log;
        else
            this.textblock.text = this.short_log;
    };
    Statusbar.prototype.setadvancedTexture = function (advancedTexture) {
        this.advancedTexture = advancedTexture;
        this.advancedTexture.addControl(this.container);
    };
    return Statusbar;
}());
var Statusbar_Small = /** @class */ (function () {
    function Statusbar_Small(advancedTexture, height, width) {
        this.advancedTexture = advancedTexture;
        this.init_height = "90px";
        this.init_width = 0.6;
        this.height = height;
        this.width = width;
        this.short_log = "";
        this.all_log = "";
        this.container = new Container();
        this.container.width = this.init_width;
        this.container.height = this.height;
        //this.container.background = "blue";
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        //this.container.top = "-225px";
        //this.container.left = "100px";
        //this.container.background = "pink"
        //this.container.HORIZONTAL_ALIGNMENT_LEFT = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.scrollviewer = new ScrollViewer();
        this.scrollviewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.scrollviewer.color = "white";
        this.scrollviewer.background = "black";
        this.scrollviewer.alpha = 0.5;
        this.scrollviewer.width = 1;
        this.scrollviewer.height = this.init_height;
        this.button = Button.CreateSimpleButton("Status Bar Expand", "v");
        //this.button.top = "20px";
        this.button.width = this.scrollviewer.width;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.button.top = this.scrollviewer.height;
        this.button.height = "70px";
        this.button.color = "white";
        this.button.alpha = 0.7;
        this.button.background = "#95afc0";
        this.button.textWrapping = TextWrapping.WordWrap;
        this.button.resizeToFit = true;
        this.button.fontSize = 100;
        this.textblock = new TextBlock();
        this.background = "black";
        this.textblock.text = this.short_log;
        this.textblock.fontSize = 35;
        this.textblock.textWrapping = TextWrapping.WordWrap;
        this.textblock.resizeToFit = true;
        this.textblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.textblock.paddingLeft = "5px";
        this.expand_flag = false;
        var _this = this;
        this.button.onPointerClickObservable.add(function () {
            _this.addtext(_this.button.name + " Button Pressed!");
            if (!_this.expand_flag) {
                _this.expand_flag = true;
                _this.container.width = _this.width;
                _this.scrollviewer.height = (parseInt(_this.height) - parseInt(_this.button.height)).toString() + "px";
                _this.button.top = _this.scrollviewer.height;
                _this.textblock.text = _this.all_log;
                _this.button.children[0].text = "^";
            }
            else {
                _this.expand_flag = false;
                //_this.container.height = _this.height;
                _this.container.width = _this.init_width;
                _this.scrollviewer.height = _this.init_height;
                _this.button.top = _this.scrollviewer.height;
                _this.textblock.text = _this.short_log;
                _this.button.children[0].text = "v";
            }
        });
        advancedTexture.addControl(this.container);
        this.scrollviewer.addControl(this.textblock);
        this.container.addControl(this.button);
        this.container.addControl(this.scrollviewer);
    }
    Statusbar_Small.prototype.addtext = function (txt) {
        this.all_log += txt + "\n";
        this.short_log = txt + "\n";
        if (this.expand_flag)
            this.textblock.text = this.all_log;
        else
            this.textblock.text = this.short_log;
    };
    Statusbar_Small.prototype.setadvancedTexture = function (advancedTexture) {
        this.advancedTexture = advancedTexture;
        this.advancedTexture.addControl(this.container);
    };
    return Statusbar_Small;
}());
/******* End of the create scene function ******/
// code to use the Class above
var createScene = function () {
    return Playground.CreateScene(engine, engine.getRenderingCanvas());
};
var scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
//# sourceMappingURL=index.js.map