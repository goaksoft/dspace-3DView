/**
 * @author byf
 * 1.http://rwoodley.org/?p=1073
 * 2.https://threejs.org/
 * 3.https://blog.csdn.net/joyvonlee/article/details/85324194
 */ 

//
document.write('<script src="js/jquery-2.0.3.min.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="js/three.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="js/OrbitControls.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="js/OBJLoader.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="js/OBJMTLLoader.js" type="text/javascript" charset="utf-8"></script>');
document.write('<link rel="stylesheet" href="css/style.css" />')

;(function(global){

var BYF={
 //mtlURL 是当文件夹下.mtl 文件所在的位置 'gutou/gutou.mtl'
 //a 为想要将该div 放到哪个div中    div的id;{
   init:function(mtlURL,a){
  	// 绘制div
  	write(a);
  	//相机距离模型中心的距离
   	var whole_distance;
   	              
    var x;
    var y;
    var z;
    var num=1;
   	            
    var scene = new THREE.Scene();//创建一个场景
	var fov = 45;
	var aspect;
	var near;
	var far;
	var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);//相机 
	//渲染器			
    var renderer = new THREE.WebGLRenderer({antialias: true,precision: "mediump",premultipliedAlpha: true,maxLights: 2});
    renderer.setClearColor(0x000000);//渲染器颜色设置

	var three =document.getElementById(a);			       
	renderer.setSize(three.clientWidth,three.clientHeight);//渲染器的大小     		 				
	//renderer.shadowMapEnabled = true;//是否开启阴影
				
	var axes = new THREE.AxisHelper(10);//坐标系		
    var controls = new THREE.OrbitControls(camera, renderer.domElement);//轨迹球
	var ambientLight = new THREE.AmbientLight(0xcccccc, 2);			
	var pointLight = new THREE.PointLight(0xffffff, 0.8);//灯光 前者颜色 后者亮度；			
	var planeGeometry = new THREE.PlaneGeometry(4,4);			 
	var planeMaterial = new THREE.MeshNormalMaterial({color:0xffffff});
    
    var geo;
    var mesh = new THREE.Mesh(geo,planeMaterial);
   	scene.add(ambientLight);
	camera.add(pointLight);
	scene.add(camera);
    scene.add(mesh);  
     //渲染器颜色切换 效果是背景颜色切换
    $("#AreaId").change(function(){
	    var c = document.getElementById("AreaId").value;
	    if(c == 1){
	        renderer.setClearColor(0xffffff);
	    }
	    else{
	        renderer.setClearColor(0x000000);
	    }
	})
//                back btn 
    $("#back").click(function(){
        camera.position.x=x;
		camera.position.y=y;
		camera.position.z=z;
    })             
//               reverse  btn
    $("#reverse").click(function(){
        $('#reverse').hide();
		$('#positive').show();
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
		camera.position.z = - camera.position.z;
		camera.position.x = 0;
    })           
//               positive  btn
    $("#positive").click(function(){
        $('#positive').hide();
		$('#reverse').show(); 
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
        camera.position.x = 0;
    })
//				left  btn
	$("#left").click(function(){
		$('#left').hide();
		$('#right').show();
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
        camera.position.x = -(x + whole_distance * 0.8);
		camera.position.z = 0;
		camera.position.y = 0;
	})				 
//				 right  btn
	$("#right").click(function(){
		$('#right').hide();
		$('#left').show();
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
		camera.position.x = x + whole_distance * 0.8;
		camera.position.z = 0;
		camera.position.y = 0;
	})
//				up btn
	$("#up").click(function(){
		$('#up').hide();
		$('#down').show();
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
	    camera.position.y = y + whole_distance * 0.8;
		camera.position.x = 0;
		camera.position.z = 0;
	})			
//			    down btn
	$("#down").click(function(){
		$('#down').hide();
		$('#up').show();
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
		camera.position.y = -(y + whole_distance * 0.8);
		camera.position.x = 0;
		camera.position.z = 0;
	}) 
//			    photo img 
	$("#photo").click(function(){
        if(num == 1){
            this.src="img/narrow.png";
            var docElm = document.getElementById(a);
                //W3C   全屏功能      
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
                //FireFox   
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
                //Chrome等   
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();  
            }
                //IE11   
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();  
            } 
            num=0;
        }
        else {
            this.src = "img/amplification.png";
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } 
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } 
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } 
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            num = 1;
        }
    })
//				add btn 
	$("#add").click(function(){
		$('#add').hide();
		$('#del').show();
		scene.add(axes);
	})
//				del btn 
	$("#del").click(function(){
	    $('#add').show();
	    $('#del').hide();
	    scene.remove(axes);
	})			
//				rotating btn
	$("#stoprotating").click(function(){
		$('#stoprotating').hide();
		$('#rotating').show();
		renderScene1();
	})
//			   stoprotating btn
	$("#rotating").click(function(){
		$('#rotating').hide();
		$('#stoprotating').show();
		renderScene();
	})	
//		                           加载进度百分比显示
	var onProgress = function(h) {
		if(h.lengthComputable) {
			var percentComplete = h.loaded / h.total * 100;
			var percent = document.getElementById("percent");
			percent.innerText = Math.round(percentComplete, 2) + '%已经加载';
		}
	};
				//报错
	var onError = function(h) {};
               //根据模型的大小计算相机的距离和方位
	function cameraArea( boxSize, boxCenter) {
		var sizeToFitOnScreen = boxSize*1.2; 
		var halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
		var halfFovY = THREE.Math.degToRad(camera.fov * 0.5);
					   //相机距离模型中心的距离
		whole_distance = (halfSizeToFitOnScreen / Math.tan(halfFovY))+15 ;		   
		
		var directon = (new THREE.Vector3().subVectors((camera.position), boxCenter).normalize());
				//相机位置
		camera.position.copy(directon.multiplyScalar(whole_distance).add(boxCenter));
             // 使得相机的定位都在模型的上方
        if(camera.position.x < 0){
            camera.position.x = -camera.position.x;
        }
        if(camera.position.y < 0){
            camera.position.y = -camera.position.y;
        }
        if(camera.position.z < 0){
            camera.position.z = -camera.position.z;
        }
		camera.near = boxSize / 100;
		camera.far  = boxSize * 100;
		camera.updateProjectionMatrix();			   
		camera.lookAt(boxCenter.x,boxCenter.y, boxCenter.z);
		 //第一次加载时相机的位置赋值；
		x = camera.position.x;
		y = camera.position.y;
		z = camera.position.z;
	}		
		        //加载模型的主要程序
	function jiazai(mtlURL){
		   // 将.mtl文件后缀替换为.obj
		var objURL= mtlURL.replace(/mtl/,"obj");
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.load(mtlURL, function(materials){		
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);			
		    objLoader.load(objURL, function(object){
		          //模型展示的倍数 这里是0.05  也就是缩小为原型的0.05
		        object.scale.set(0.05, 0.05, 0.05);
                object.castShadow = true;
                //给加载的模型添加一个包围盒子
                var box = new THREE.BoxHelper(object);
                //获取包围最大和最小顶点
                box.geometry.computeBoundingBox();
		        var a = (box.geometry.boundingBox.max.x - box.geometry.boundingBox.min.x);
		        var b = (box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y);
		        var c = (box.geometry.boundingBox.max.z - box.geometry.boundingBox.min.z);
		        percent.innerHTML = '长:' + (a * 20).toFixed(2) + 'mm' + "<br/>" + '宽:' + (b * 20).toFixed(2) + 'mm' + "<br/>" + '高:' + (c * 20).toFixed(2) + 'mm';
		        var box1 = new THREE.Box3().setFromObject(object);
		        var boxSize = box1.getSize(new THREE.Vector3()).length()*1.2;	
		        var boxCenter = box1.getCenter(new THREE.Vector3());				
		        cameraArea(boxSize, boxCenter); 
		        //将模型添加到mesh 上
		        mesh.add(object);
		    }, onProgress, onError);
		});
   }
     //渲染到哪个区域；
	three.append(renderer.domElement)	
         //先要刷新一遍 先渲染
    renderScene();
        //先加载一次
	jiazai(mtlURL);
	   // 渲染循环     
	function renderScene() {
		var clock = new THREE.Clock();
		var delta = clock.getDelta();
		controls.update(delta);
		//mesh 转动  模型添加在mesh种  mesh转动引起模型转动 达到模型转动的效果
		mesh.rotation.y += 0.02;
		//刷新renderer的大小避免使用放大功能是renderer范围还停留到原地。
        renderer.setSize(three.clientWidth,three.clientHeight);     
		requestAnimationFrame(renderScene);				
		renderer.render(scene, camera);
	};
       // 另外一种渲染循环
    function renderScene1() {
		var clock = new THREE.Clock();
		var delta = clock.getDelta();
		controls.update(delta);
		mesh.rotation.y -=0.02;		    
		renderer.setSize(three.clientWidth,three.clientHeight);     
		requestAnimationFrame(renderScene1);				
		renderer.render(scene, camera);
	};                         
}
   }
    // 注册全局变量 直接使用new  Byf.init();
    global.Byf=BYF;
    //写DIV
    function write(a){
	//this.a=a;
  	var divT = document.getElementById(a);
  	    //创建div标签并给它添加id id名等于percent。
  	var divP = document.createElement('div');
  	var divPid = divP.setAttribute('id','percent');
  	                      
  	var divTP = document.createElement('div');
  	var divTPid = divTP.setAttribute('id','tupian');
  	           
    var img = document.createElement('img');
  	var imgid = img.setAttribute('id','photo');
  	var src = img.setAttribute('src','img/amplification.png');
               
    var divB = document.createElement('div');
    var divBclass = divB.setAttribute('class','btn');
               
    var p1 = document.createElement('p');
    var p1id = p1.setAttribute('id','add');
    var p1class = p1.setAttribute('class','btn1');
    var p1text = document.createTextNode('添加坐标系');
    p1.appendChild(p1text);
               
    var p2 = document.createElement('p');
    var p2id = p2.setAttribute('id','del');
    var p2class = p2.setAttribute('class','btn1');
    var p2text = document.createTextNode('删除坐标系');
    var p2Style = p2.setAttribute('style','display: none;')
    p2.appendChild(p2text);
                
    var p3 = document.createElement('p');
    var p3id = p3.setAttribute('id','stoprotating');
    var p3class = p3.setAttribute('class','btn1');
    var p3text = document.createTextNode('停止旋转');
    p3.appendChild(p3text); 
               
    var p4 = document.createElement('p');
    var p4id = p4.setAttribute('id','rotating');
    var p4class = p4.setAttribute('class','btn1');
    var p4text = document.createTextNode('开始旋转');
    var p4Style = p4.setAttribute('style','display: none;')
    p4.appendChild(p4text);
               
    var p5 = document.createElement('p');
    var p5id = p5.setAttribute('id','reverse');
    var p5class = p5.setAttribute('class','btn1');
    var p5text = document.createTextNode('反面');
    p5.appendChild(p5text);  
               
    var p6 = document.createElement('p');
    var p6id = p6.setAttribute('id','positive');
    var p6class = p6.setAttribute('class','btn1');
    var p6text = document.createTextNode('正面');
    var p6Style = p6.setAttribute('style','display: none;')
    p6.appendChild(p6text); 
               
    var p7 = document.createElement('p');
    var p7id = p7.setAttribute('id','left');
    var p7class = p7.setAttribute('class','btn1');
    var p7text = document.createTextNode('左面');
    p7.appendChild(p7text); 
               
    var p8 = document.createElement('p');
    var p8id = p8.setAttribute('id','right');
    var p8class = p8.setAttribute('class','btn1');
    var p8text = document.createTextNode('右面');
    var p8Style = p8.setAttribute('style','display: none;')
    p8.appendChild(p8text); 
               
    var p9 = document.createElement('p');
    var p9id = p9.setAttribute('id','up');
    var p9class = p9.setAttribute('class','btn1');
    var p9text = document.createTextNode('顶部');
    p9.appendChild(p9text);
               
    var p10 = document.createElement('p');
    var p10id = p10.setAttribute('id','down');
    var p10class = p10.setAttribute('class','btn1');
    var p10text = document.createTextNode('右面');
    var p10Style = p10.setAttribute('style','display: none;')
    p10.appendChild(p10text);
               
    var p0 = document.createElement('p');
    var p0id = p0.setAttribute('id','back');
    var p0class = p0.setAttribute('class','btn1');
    var p0text = document.createTextNode('复位');
    p0.appendChild(p0text);
               
    var slect = document.createElement('select');
    slect.setAttribute('id','AreaId');
               
    var op2 = document.createElement('option');
    op2.setAttribute('value','2');
    var op2Text = document.createTextNode('黑色');
    op2.appendChild(op2Text);
                
    var op1 = document.createElement('option');
    op1.setAttribute('value','1');
    var op1Text = document.createTextNode('白色');
    op1.appendChild(op1Text);

    divB.appendChild(p1);
    divB.appendChild(p2);
    divB.appendChild(p3);
    divB.appendChild(p4);
    divB.appendChild(p5);
    divB.appendChild(p6);
    divB.appendChild(p7);
    divB.appendChild(p8);
    divB.appendChild(p9);
    divB.appendChild(p10);
    divB.appendChild(p0);
               
    divT.appendChild(slect);
    slect.appendChild(op2);
    slect.appendChild(op1);
               
    divT.appendChild(divB);
    divTP.appendChild(img);
  	divT.appendChild(divTP);
  	divT.appendChild(divP);
  	

  }
 })(window);
