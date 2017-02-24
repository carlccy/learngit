window.onload = function(){
	var oWrap = document.getElementById("wrap");
	var oImg = oWrap.getElementsByTagName("img");
	var oImgLength = oImg.length;
	var Deg = 360/oImgLength;//获取度数
	var nowX,nowY,lastX,lastY,minusX,minusY;
	var roY = 0,roX = -10;//给默认值
	var timer = null;//给定时器设置默认值
	//循环遍历每一个图片对象，添加相应的旋转度数与动画时间
	for(var i=0;i<oImgLength;i++){
		oImg[i].style.transform = "rotateY("+i*Deg+"deg) translateZ(350px)";
		oImg[i].style.transition = "transform 1s "+(oImgLength-1-i)*0.2+"s";
	};

	//动态的实现oWrap的位置居中
	mTop();
	window.onresize = mTop;
	function mTop(){
		var wH = window.innerHeight;
		oWrap.style.marginTop = ""+wH/2-180+"px";
	};

	//拖拽 三个事件  按下 移动 抬起
	document.onmousedown = function(e){
		//鼠标按下的时候，给前一点坐标赋值，避免第一次相减的时候出错
		var ev = e||window.event;
		lastX = ev.clientX;
		lastY = ev.clientY;
		//鼠标移动
		this.onmousemove = function(e){
			var ev = e||window.event;
			
			clearInterval(timer);//下一次拖动的时候清除上一次的定时

			//拿到当前坐标的值
			nowX = ev.clientX;
			nowY = ev.clientY;
			
			//获取差值
			minusX = nowX - lastX;
			minusY = nowY - lastY;
			
			roY += minusX*0.2;
			roX -= minusY*0.2;
			oWrap.style.transform = "rotateX("+roX+"deg) rotateY("+roY+"deg)";
			/*
			//先写div,熟悉鼠标移动事件（测试代码）
			var oDiv = document.createElement("div");
			oDiv.style.cssText = "width:5px;height:5px;background:yellow;position:fixed;left:"+nowX+"px;top:"+nowY+"px;";
			this.body.appendChild(oDiv);
			*/

			//拿到上一个坐标的值
			lastX = nowX;
			lastY = nowY;

		};
		//鼠标抬起
		this.onmouseup = function(){
			this.onmousemove = null;
			timer = setInterval(function(){
				minusX *= 0.95;//让距离越来越小，乘以摩擦系数
				minusY *= 0.95;
				//console.log(minusX);
				roY += minusX*0.2;
				roX -= minusY*0.2;
				oWrap.style.transform = "rotateX("+roX+"deg) rotateY("+roY+"deg)";
				//考虑到会往反方向移动所以加绝对值
				if(Math.abs(minusX)<0.5 && Math.abs(minusY)<0.5){
					clearInterval(timer);
				}
			},13);

		};
		return false;//阻止默认事件（全部选中与点击拖拽）
	};
}
