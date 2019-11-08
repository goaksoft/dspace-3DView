var SZ = SZ || {};

(function (SZ) {

    SZ.ModelMeasure = function (scene,objectList,camera,render,control) {
        this.scene = scene;
        this.camera = camera;
        this.render = render;
        this.control = control;
        this.objectList = objectList;
        var domElement=this.render.domElement;
        this.domElement = (domElement !== undefined) ? domElement : document;
        this.measurescope = null;

        this.vMeter=0.3047999995367;
        this.vcMeter=304.7999995367;
        this.width = this.render.domElement.offsetWidth;
        this.height = this.render.domElement.offsetHeight;

        this.vbNew=false; 
        this.vppos = 0;
        this.bMousedown = false;
        this.bMousemove = false;
        this.mousePosition = { x: 0, y: 0 };
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        //this.raycaster.linePrecision = 3;
        this.vecLine = [];
        // line angle area model
        this.vdrawtype = 'line';

        //距离测量 点 线段 值显示精灵模型
        this.lineName= 'lineTextSprite';
        this.lineMesh = null;
        this.lineSphereList = [];
        this.lineSpritePoi = null;
        this.vlineSpriteCanvas = null;
        this.vLineSpriteMaterial = null;

        this.init();
    };

    SZ.ModelMeasure.prototype = {
    constructor: SZ.ModelMeasure,

    init: function() { 
        measurescope = this;
        this.render.domElement.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.render.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
        this.render.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        this.render.domElement.addEventListener( 'dblclick', this.onDocumentMouseDClick, false );
    },

    dispose: function() {
        var _this = this;
        _this.render.domElement.removeEventListener( 'mousemove', _this.onDocumentMouseMove, false );
        _this.render.domElement.removeEventListener( 'mouseup', _this.onDocumentMouseUp, false );
        _this.render.domElement.removeEventListener( 'mousedown', _this.onDocumentMouseDown, false );
        _this.render.domElement.removeEventListener( 'dblclick', _this.onDocumentMouseDClick, false );

        _this.clearMeasure();
    },

    clearMeasure: function() {
        var _this = this;
        _this.clearLine();
    },

    changleModle: function(operType) {
        var _this = this;
        _this.clearMeasure();
        if(operType == 'line') _this.vdrawtype = operType;
    },

    onDocumentMouseDown: function( event ) {
        var _this=measurescope;
        event.preventDefault();
        _this.bMousedown = true;
        _this.mousePosition.x = event.clientX;
        _this.mousePosition.y = event.clientY;
    },

    onDocumentMouseUp: function( event ) {
        var _this=measurescope;
        event.preventDefault();

        if (_this.bMousedown && !_this.bMousemove) {
            _this.fclick(event,'click');
        }
        _this.bMousedown = false;
        _this.bMousemove = false;
    },

    onDocumentMouseDClick: function( event ) {
        var _this=measurescope;
        event.preventDefault();
        _this.fclick(event,'dbclick');
    },

    onDocumentMouseMove: function( event ) {
        var _this=measurescope;
        event.preventDefault();
        if (_this.bMousedown) {
            if (!(_this.mousePosition.x === event.clientX && _this.mousePosition.y === event.clientY)) {
                _this.bMousemove = true;
            }
        }

        var vIndex=-1;
        var intersect = null;
        _this._convertCoordinate(event);
        _this.raycaster.setFromCamera( _this.mouse, _this.camera );

		var intersects = _this.raycaster.intersectObjects( _this.objectList, true );
		if ( intersects.length > 0 ) {
			vIndex=_this.checkObjs(intersects);
			if(vIndex>=0) {
				intersect = intersects[vIndex];
			}
		}

		if ( !_this.vbNew ) {
			if(null!=intersect && _this.vppos>0) {
				_this.vecLine[_this.vppos] =intersect.point;
				//console.log(vecLine.length);
				if(_this.vdrawtype == 'line') _this.drawLine(_this.vecLine);
			}
		}

        //_this.control.enabled=true;
    },

    fclick: function(event,clitype) {
        var _this=this;
        if ('click' == clitype) {

            var vIndex=-1;
            var intersect = null;
            _this._convertCoordinate(event);
            _this.raycaster.setFromCamera( _this.mouse, _this.camera );
            var intersects = _this.raycaster.intersectObjects( _this.objectList,true );
            if ( intersects.length > 0 ) {
                vIndex=_this.checkObjs(intersects);
                if(vIndex>=0) {
                    intersect = intersects[vIndex];
                }
            }

            if (null!=intersect) {
                if(_this.vbNew) {
                    if(_this.vdrawtype == 'line') _this.clearLine();
                    _this.vbNew=false;
                }

                var vpos = intersect.point;
                var vbangle = true;
                var sphereInter = null;
                if(_this.vdrawtype == 'angle' && _this.vecLine.length>3) vbangle = false;
                else if(_this.vdrawtype == 'model') vbangle = false;
                else if(_this.vdrawtype == 'modelVolume') vbangle = false;

                if(vbangle) {
                    var vsize=_this.spheresizebyDistance(vpos);
                    var geometry = new THREE.SphereBufferGeometry(vsize);
                    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
                    sphereInter = new THREE.Mesh(geometry, material);

                    sphereInter.position.copy(vpos);
                    _this.scene.add(sphereInter);
                }

                _this.vecLine[_this.vppos] = vpos;
                _this.vppos++;

                if(_this.vdrawtype == 'line') _this.lineSphereList.push(sphereInter);
            }
        } else if ('dbclick' == clitype) {
            _this.vbNew = true;
            _this.clearVector();

            var vSphereList=null;
            if(_this.vdrawtype == 'line') vSphereList=_this.lineSphereList;
            if(null!=vSphereList) {
                var vobj=vSphereList[vSphereList.length-1];
                if(null!=vobj) {
                    vobj.geometry.dispose();
                    vobj.material.dispose();
                    _this.scene.remove( vobj );
                    vobj=null;
                }
                vSphereList.splice(vSphereList.length-1,1);
            }
        }
    },

    clearVector: function() {
        var _this=this;
        _this.vppos = 0;
        _this.vecLine = [];
    },

    checkObjs: function(objs) {
        var _this=this;
        var vret=-1;
        var uuidlist=[];
        if(_this.lineMesh) uuidlist.push(_this.lineMesh.geometry.uuid);
        if(_this.lineSphereList) {
            for(var i=0;i<_this.lineSphereList.length;i++) {
                var vtemp=_this.lineSphereList[i];
                uuidlist.push(vtemp.geometry.uuid);
            }
        }
        for(var i=0;i<objs.length;i++) {
            var vuuid='';
            var vgeo=objs[i].object.geometry;
            if(null!=vgeo && null!=vgeo.hasOwnProperty('uuid'))
                vuuid=vgeo.uuid;
            if( uuidlist.indexOf(vuuid)<0 ) {
                vret=i;
                break;
            }
        };
        return vret;
    },

    resize: function () {
        var _this = this;
        _this.width = _this.render.domElement.offsetWidth;
        _this.height = _this.render.domElement.offsetHeight;
    },

    update: function () {
        var _this = this;
        if(null!=_this.lineMesh) _this.lineMesh.material.resolution.set( _this.width, _this.height );
        if(null!=_this.lineSpritePoi) {
            var poiRect = {w:_this.vlineSpriteCanvas.width,h:_this.vlineSpriteCanvas.height};
            var vscale=_this.getPoiScale( _this.lineSpritePoi.position,poiRect);
            _this.lineSpritePoi.scale.set(vscale[0], vscale[1], 1.0);
        }
    },

    drawLine: function (vecLine) {
        if(vecLine.length<2) return;
        var _this = this;
        var colors = [];
        var color = new THREE.Color();
        var positions = [];
        var vjl = 0;
        for ( var i = 0; i < vecLine.length; i ++ ) {

            positions.push( vecLine[i].x, vecLine[i].y, vecLine[i].z );
            color.setHSL( i / vecLine.length, 1.0, 0.5 );
            colors.push( color.r, color.g, color.b );

            if(i<(vecLine.length-1)) {
                var vd=vecLine[i].distanceTo(vecLine[i+1]);
                vjl+=vd;
            }
        }
        //单位换算
        vjl*=_this.vcMeter;

        if(null!=_this.lineMesh) {
            _this.lineMesh.geometry.dispose();
            // _this.scene.remove( _this.lineMesh );
            // _this.lineMesh=null;
        }
		var geometry = new THREE.LineGeometry();
		geometry.setPositions( positions );
		geometry.setColors( colors );
        if(null==_this.lineMesh) {
            var matLine = new THREE.LineMaterial( {
                color: 0xffffff,
                linewidth: 3, // in pixels
                vertexColors: THREE.VertexColors,
                //resolution:  // to be set by renderer, eventually
                dashed: false
            } );
            _this.lineMesh = new THREE.Line2( geometry, matLine );
            _this.scene.add( _this.lineMesh );
        } else {
			_this.lineMesh.geometry = geometry;
		}

        var vpos=vecLine[vecLine.length-1];
        var vparam2={
            name:'lineTextSprite',
            position:{x:vpos.x,y:vpos.y+0.1,z:vpos.z},
            size:{x:128,y:32,z:16},
            color:{r:34, g:76, b:143, a:0.0},
            imgurl: '',
            rows: [
                {
                    name:'item1',
                    fontface:'Arial',
                    fontsize:20,
                    borderThickness:4,
                    textColor:{r:255, g:0, b:255, a:1.0},
                    text:_this._getnum(vjl)+'mm',
                    size:{x:10,y:10},
                    position:{x:5,y:10,z:0},
                }
            ]
        };
        if(null==_this.lineSpritePoi) {
            _this.makeDynamicTextSprite(this.lineName,vparam2);
        } else {
            _this.makeItemValue(this.lineName,null,vparam2);
        }
    },

    clearLine: function () {
        var _this = this;
        if(null!=_this.lineMesh) {
            _this.lineMesh.geometry.dispose();
            _this.lineMesh.material.dispose();
            _this.scene.remove( _this.lineMesh );
            _this.lineMesh=null;
        }
        if(null!=_this.lineSpritePoi) {
            _this.lineSpritePoi.material.dispose();
            _this.scene.remove( _this.lineSpritePoi );
            _this.lineSpritePoi = null;
            _this.vlineSpriteCanvas = null;
            _this.vLineSpriteMaterial = null;
        }

        for(var i=0;i<_this.lineSphereList.length;i++) {
            var vobj=_this.lineSphereList[i];
            vobj.geometry.dispose();
            vobj.material.dispose();
            _this.scene.remove( vobj );
            vobj=null;
        }
        _this.lineSphereList=[];
        _this.clearVector();
    },

    getPoiScale: function(position,poiRect) {
        var _this=measurescope;
        if (!position) return;
        var distance = _this.camera.position.distanceTo(position);
        var top = Math.tan(_this.camera.fov / 2 * Math.PI / 180) * distance;    //camera.fov 相机的拍摄角度
        var meterPerPixel = 2 * top / window.innerHeight;
        var scaleX = poiRect.w * meterPerPixel;
        var scaleY = poiRect.h * meterPerPixel;
        return [scaleX, scaleY, 1.0];
    },

    makeDynamicTextSprite: function (_objname, parameters) {
        var _this = this;
        var vobjx = 0;
        var vobjy = 0;
        var vobjz = 0;
        var ratio = 1;

        if ( parameters === undefined || parameters === null ) parameters = {};
        var vname = parameters.hasOwnProperty("name") ? parameters["name"] : "mark";
        var vbkColor = parameters.hasOwnProperty("color") ?parameters["color"] : { r:255, g:255, b:255, a:1.0 };
        var imgurl = parameters.hasOwnProperty("imgurl") ? parameters["imgurl"] : "models/西安三木-23.jpg";
        var x = parameters.hasOwnProperty("position") ? parameters["position"].x : 10;
        var y = parameters.hasOwnProperty("position") ? parameters["position"].y : 80;
        var z = parameters.hasOwnProperty("position") ? parameters["position"].z : 0;
        var vWidth = parameters.hasOwnProperty("size") ? parameters["size"].x : 128;
        var vheight = parameters.hasOwnProperty("size") ? parameters["size"].y : 64;
        var vscale = parameters.hasOwnProperty("size") ? parameters["size"].z : 18;

        var canvas = document.createElement('canvas');
        canvas.width = vWidth*ratio;
        canvas.height = vheight*ratio;
        canvas.style.width = vWidth+'px';
        canvas.style.height = vheight+'px';
        var context = canvas.getContext('2d');

        if ( imgurl != undefined && imgurl != null && imgurl != '' ) {
            var clockImage = new Image();
            clockImage.src = imgurl;	//'res/floor2.jpg';
            clockImage.onload = function () {
                context.drawImage(clockImage, 0, 0, vWidth, vheight);
            };
        } else {
            context.fillStyle = "rgba("+vbkColor.r+", "+vbkColor.g+", "+vbkColor.b+", "+vbkColor.a +" )";
            context.fillRect(0,0,vWidth,vheight);
        }

        if (parameters.rows != null && parameters.rows.length > 0) {
            for(var i=0;i<parameters.rows.length;i++) {
                var _obj=parameters.rows[i];
                var fontsize = _obj.fontsize;
                var fontface = _obj.fontface;
                var borderThickness = _obj.borderThickness;
                var message = _obj.text;
                var textColor= _obj.textColor;
                var vix = _obj.position.x;
                var viy = _obj.position.y;
                var viz = _obj.position.z;
                context.textAlign = 'left';
                context.textBaseline = 'middle';//bold
                context.font = " " + fontsize + "px " + fontface;
                //context.lineWidth = borderThickness;
                context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
                context.fillText(message, vix, viy);
            };
        }
        context.scale(ratio,ratio);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.x = vobjx + x;
        sprite.position.y = vobjy + y;
        sprite.position.z = vobjz + z;
        sprite.name = parameters.name;
        sprite.renderOrder=10000;
        sprite.material.depthTest=false;
        sprite.castShadow = true;
        sprite.receiveShadow = true;
        //sprite.scale.set(1.0 * vscale, vheight/vWidth * vscale, 1.0);
        var poiRect = {w:canvas.width,h:canvas.height};
        var vscale=_this.getPoiScale( sprite.position,poiRect);
        sprite.scale.set(vscale[0], vscale[1], 1.0);
        //sprite.renderOrder=1;
        //sprite.castShadow=true;

        _this.scene.add( sprite );
        ////
        if(_objname==this.lineName) {
            _this.lineSpritePoi = sprite;
            _this.vlineSpriteCanvas = canvas;
            _this.vLineSpriteMaterial = spriteMaterial;
        }
        return null;
    },

    makeItemValue: function (objname,objitem,objparameters) {
        var _this = this;
        var canvas = null;
        var vspriteMaterial = null;
        var vlineSpritePoi = null;
        if(_this.lineName==objname) {
            canvas = _this.vlineSpriteCanvas;
            vspriteMaterial = _this.vLineSpriteMaterial;
            vlineSpritePoi = _this.lineSpritePoi;
        }

        if (canvas != null && typeof (canvas) != 'undefined') {
            var context = canvas.getContext('2d');

            var vWidth = canvas.width;
            var vheight = canvas.height;
            var vbkColor = objparameters.color;
            var imgurl = objparameters.imgurl;
            var clockImage = new Image();
            if ( imgurl != undefined && imgurl != null && imgurl != '' ) {
                clockImage.src = imgurl;	//'res/floor2.jpg';
                context.drawImage(clockImage, 0, 0, vWidth, vheight);
            } else {
                context.clearRect(0,0,vWidth,vheight);
                context.fillStyle = "rgba("+vbkColor.r+", "+vbkColor.g+", "+vbkColor.b+", "+vbkColor.a +" )";
                context.fillRect(0,0,vWidth,vheight);
            }

            if (objparameters.rows != null && objparameters.rows.length > 0) {
                for(var i=0;i<objparameters.rows.length;i++) {
                    var _obj=objparameters.rows[i];
                    var fontsize = _obj.fontsize;
                    var fontface = _obj.fontface;
                    var borderThickness = _obj.borderThickness;
                    var message = _obj.text;
                    if(_obj.name == objitem) message = '';
                    var textColor= _obj.textColor;
                    var vix = _obj.position.x;
                    var viy = _obj.position.y;
                    var viz = _obj.position.z;
                    context.textAlign = 'left';
                    context.textBaseline = 'middle';
                    context.font = "bold " + fontsize + "px " + fontface;
                    //context.lineWidth = borderThickness;
                    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
                    context.fillText(message, vix, viy);
                };
            }

            vspriteMaterial.map.needsUpdate = true;
            vlineSpritePoi.position.set(objparameters.position.x,objparameters.position.y,objparameters.position.z);
        }
    },
    _convertCoordinate: function (event) {
        this.mouse.x = (event.clientX  / this.domElement.offsetWidth) * 2 - 1;
        this.mouse.y = -(event.clientY  / this.domElement.offsetHeight) * 2 + 1;
    },

    _getnum: function (fvalue) {
        return Math.round(fvalue*100)/100;
    },

    spheresizebyDistance: function (vec) {
        var vsize=0.2;
        var vec3 = this.camera.position.clone();
        var fdis=vec3.distanceTo(vec);
        if(fdis<2.5)  vsize=0.01;
        else if(fdis<5)  vsize=0.03;
        else if(fdis<15)  vsize=0.05;
        else if(fdis<25)  vsize=0.10;
        else if(fdis<35)  vsize=0.15;
        //console.log(fdis,vsize);
        return vsize;
    }
};

})(SZ);
