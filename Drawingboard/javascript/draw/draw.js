//画布
var canvas ;
var context ;
//蒙版
var canvas_bak;
var context_bak;

var canvasWidth = bodyWidth;
var canvasHeight = bodyWidth;

var canvasTop;
var canvasLeft;

//初始化画笔 类型、大小、颜色
var graphType = "pencil"; 
var size = 1;
var color  = '#000000';

//画图形
/*不可将 mousedown()/mouseup()/mousemove() 放在draw_graph()中，如果切换画笔后，保存历史saveImageToAry()会运行不止一次，
规律是每切换一次画笔，mouseup()会多运行一次，同样保存历史会多运行一次！*/
var draw_graph = function(graphTypes,obj){	 
	graphType = graphTypes; //切换画笔
	//把蒙版放于画板上面
	$("#canvas_bak").css("z-index",1);
	//先画在蒙版上 再复制到画布上
		
	chooseImg(obj);			
	var canDraw = false;	
	
	$(canvas_bak).unbind();
	canvas_bak.addEventListener("touchstart",mousedown,false);
	canvas_bak.addEventListener("touchmove",mousemove,false);
	canvas_bak.addEventListener("touchend",mouseup,false)
};

var startX;
var startY;

//鼠标按下获取 开始xy 开始画图
var mousedown = function(e){
	context.strokeStyle= color;
	context_bak.strokeStyle= color;
	context_bak.lineWidth = size;
	var touches = e.touches[0];
	startX = touches.clientX  - canvasLeft;
	startY = touches.clientY  - canvasTop;
	context_bak.moveTo(startX ,startY );
	canDraw = true;			
	
	if(graphType == 'pencil'){
		context_bak.beginPath();
	}else if(graphType == 'circle'){
		context.beginPath();
		context.moveTo(startX ,startY );
		context.lineTo(startX +2 ,startY+2);
		context.stroke();	
		
	}else if(graphType == 'rubber'){							
		context.clearRect(startX - size * 10 ,  startY - size * 10 , size * 20 , size * 20);				
	}	
};	

//鼠标离开 把蒙版canvas的图片生成到canvas中
var mouseup = function(e){
//		e=e||window.event;
	canDraw = false;
	var image = new Image();
	if(graphType!='rubber'){
		context_bak.closePath();
		image.src = canvas_bak.toDataURL();
		image.onload = function(){
			context.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , canvasWidth , canvasHeight);
			clearContext();
			saveImageToAry();
			console.log("保存一次")
		}
	};
	
	if(graphType != 'handwriting'){ //清除橡皮擦的方框
		clearContext();
		context.stroke();
	};
		
//			var touches = e.touches[0];
//		var x = e.clientX   - canvasLeft;
//		var y = e.clientY  - canvasTop;	
//		context.beginPath();
//		context.moveTo(x ,y );
//		context.lineTo(x +2 ,y+2);
//		context.stroke();	
//	}
	console.log(cancelList);
	console.log(cancelIndex)
};

// 鼠标移动
var  mousemove = function(e){
	var touches = e.touches[0];
	var x = touches.clientX   - canvasLeft;
	var y = touches.clientY  - canvasTop;	
	//方块  4条直线搞定
	if(graphType == 'square'){
		if(canDraw){
			context_bak.beginPath();
			clearContext();
			context_bak.moveTo(startX , startY);						
			context_bak.lineTo(x  ,startY );
			context_bak.lineTo(x  ,y );
			context_bak.lineTo(startX  ,y );
			context_bak.lineTo(startX  ,startY );
			context_bak.stroke();
		}
	//直线
	}else if(graphType =='line'){						
		if(canDraw){
			context_bak.beginPath();
			clearContext();
			context_bak.moveTo(startX , startY);
			context_bak.lineTo(x  ,y );
			context_bak.stroke();
		}
	//画笔
	}else if(graphType == 'pencil'){
		if(canDraw){
			context_bak.lineTo(x ,y);
			context_bak.stroke();						
		}
	//圆 未画得时候 出现一个小圆
	}else if(graphType == 'circle'){						
		clearContext();
		if(canDraw){
			context_bak.beginPath();			
			var radii = Math.sqrt((startX - x) *  (startX - x)  + (startY - y) * (startY - y));
			context_bak.arc(startX,startY,radii,0,Math.PI * 2,false);									
			context_bak.stroke();
		}else{	
			context_bak.beginPath();					
			context_bak.arc(x,y,20,0,Math.PI * 2,false);
			context_bak.stroke();
		}
	//涂鸦 未画得时候 出现一个小圆
	}else if(graphType == 'handwriting'){											
		if(canDraw){
			context_bak.beginPath();	
			context_bak.strokeStyle = color;
			context_bak.fillStyle  = color;
			context_bak.arc(x,y,size*10,0,Math.PI * 2,false);		
			context_bak.fill();
			context_bak.stroke();
			context_bak.restore();
		}else{	
			clearContext();
			context_bak.beginPath();					
			context_bak.fillStyle  = color;
			context_bak.arc(x,y,size*10,0,Math.PI * 2,false);
			context_bak.fill();
			context_bak.stroke();
		}
	//橡皮擦 不管有没有在画都出现小方块 按下鼠标 开始清空区域
	}else if(graphType == 'rubber'){	
		context_bak.lineWidth = 1;
		clearContext();
		context_bak.beginPath();			
		context_bak.strokeStyle =  '#000000';						
		context_bak.moveTo(x - size * 10 ,  y - size * 10 );						
		context_bak.lineTo(x + size * 10  , y - size * 10 );
		context_bak.lineTo(x + size * 10  , y + size * 10 );
		context_bak.lineTo(x - size * 10  , y + size * 10 );
		context_bak.lineTo(x - size * 10  , y - size * 10 );
		context_bak.stroke();
		context_bak.closePath();
		if(canDraw){
			context.clearRect(x - size * 10 ,  y - size * 10 , size * 20 , size * 20);
		}			
	}
};

//选择功能按钮 修改样式
function chooseImg(obj){
	var imgAry  = $("#drawController img");
	for(var i=0;i<imgAry.length;i++){
		$(imgAry[i]).removeClass('border_choose');
		$(imgAry[i]).addClass('border_nochoose');				
	}
	$(obj).removeClass("border_nochoose");
	$(obj).addClass("border_choose");
}

//阻止默认事件
function defaultEvent(e) { 
	e.preventDefault();
}


//清空层
var clearContext = function(type){
	if(!type){
		context_bak.clearRect(0,0,canvasWidth,canvasHeight);
	}else{
		context.clearRect(0,0,canvasWidth,canvasHeight);
		context_bak.clearRect(0,0,canvasWidth,canvasHeight);
	}
}

