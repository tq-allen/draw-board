var drawBoard = document.querySelector('#canvas')
var actions = document.querySelector('.actions')
var colorBorad = document.querySelector('.color-board')
var colorBoradItem = document.querySelectorAll('.color-board span')
var sizes = document.querySelector('.sizes')
var sizesItem = document.querySelectorAll('.sizes span')
var context = canvas.getContext('2d')

canvasAutoSize(drawBoard)

// 画矩形
// context.fillStyle = 'green'
// context.fillRect(0, 0, 100, 100)//矩形填充

// context.strokeStyle = 'red'
// context.strokeRect(10, 10, 80, 80)//矩形描边

// context.clearRect(40, 40, 20, 20)//擦除

// 画三角形
// context.fillStyle = 'yellow' //会以最近的fillStyle填充三角形
// context.beginPath()
// context.moveTo(400,400)
// context.lineTo(490,400)
// context.lineTo(490,490)
// context.fill()

// 画圆
// context.beginPath()
// context.strokeStyle = 'green'
// context.arc(200,200,50,0,Math.PI*2)
// context.stroke()



listenUser(drawBoard)


var usingEraser = false
// 使用橡皮擦
eraser.onclick = function(){
	usingEraser = true
	eraser.classList.add('active')
	pen.classList.remove('active')
}
//使用画笔
pen.onclick = function(){
	usingEraser = false
	pen.classList.add('active')
	eraser.classList.remove('active')
}
//清屏
clear.onclick = function(){
	context.clearRect(0,0, canvas.width, canvas.height)
}
// 保存为图片并下载
download.onclick = function(){
	var url = canvas.toDataURL()
	console.log(url)
	var a = document.createElement('a')
	a.href = url
	a.download = '画板保存的画'
	a.target = '_blank'
	a.click()
}
//选择画笔颜色、画笔粗细
var penColor = 'black'
var lineWidthHash = {thin: 1, middle: 3, bold: 5}
var lineWidth = lineWidthHash.middle
if(document.body.ontouchstart !== undefined){
	//触屏设备
	colorBorad.ontouchstart = function(e){
		e.preventDefault()
		if(e.target.id){
			colorBoradItem.forEach(function(item){
				item.classList.remove('active')
			})
			penColor = e.target.id
			e.target.classList.add('active')
		}
	}
	sizes.ontouchstart = function(e){
		if(e.target.id){
			sizesItem.forEach(function(item){
				item.classList.remove('active')
			})
			lineWidth = lineWidthHash[e.target.id]
			e.target.classList.add('active')
		}
	}
}else{
	//非触屏设备
	colorBorad.onclick = function(e){
		e.preventDefault()
		if(e.target.id){
			colorBoradItem.forEach(function(item){
				item.classList.remove('active')
			})
			penColor = e.target.id
			e.target.classList.add('active')
		}
	}
	sizes.onclick = function(e){
		if(e.target.id){
			sizesItem.forEach(function(item){
				item.classList.remove('active')
			})
			lineWidth = lineWidthHash[e.target.id]
			e.target.classList.add('active')
		}
	}
}




function canvasAutoSize(canvas){
	viewportResize(canvas)
	window.onresize = function(){
		viewportResize(canvas)
	}
}

function viewportResize(canvas){
	var vw = document.documentElement.clientWidth
	var vh = document.documentElement.clientHeight
	canvas.width = vw
	canvas.height = vh
}

function listenUser(canvas){
	var using = false
	var start = {x: undefined, y: undefined}
	if(document.body.ontouchstart !== undefined){
		//触屏设备
		canvas.ontouchstart = function(e){
			var x = e.touches[0].clientX//相对于视口
			var y = e.touches[0].clientY
			using = true
			if(usingEraser){
				context.clearRect(x-5,y-5,10,10)
			}else{
				start = {x: x, y: y}
				// drawCircle(x,y,1,penColor)
			}
		}
		canvas.ontouchmove = function(e){
			var x = e.touches[0].clientX//相对于视口
			var y = e.touches[0].clientY

			if(!using) return

			if(usingEraser){
				context.clearRect(x,y,10,10)
			}else{
				var current = {x: x, y: y}
				// drawCircle(x,y,1,penColor)
				drawLine(start.x,start.y,current.x,current.y,lineWidth,penColor)
				start = current
			}
		}
		canvas.ontouchend = function(){
			using = false
		}
	}else{
		//非触屏设备
		canvas.onmousedown = function(e){
			var x = e.offsetX//相对于canvas元素
			var y = e.offsetY
			// var x = e.clientX//相对于视口
			// var y = e.clientY
			using = true
			if(usingEraser){
				context.clearRect(x-5,y-5,10,10)
			}else{
				start = {x: x, y: y}
				// drawCircle(x,y,2,penColor)
			}
		}
		canvas.onmousemove = function(e){
			var x = e.offsetX//相对于canvas元素
			var y = e.offsetY
			// var x = e.clientX//相对于视口
			// var y = e.clientY

			if(!using) return

			if(usingEraser){
				context.clearRect(x,y,10,10)
			}else{
				var current = {x: x, y: y}
				// drawCircle(x,y,2,penColor)
				drawLine(start.x,start.y,current.x,current.y,lineWidth,penColor)
				start = current
			}
		}

		canvas.onmouseup = function(e){
			using = false
		}	
	}
	
}

function drawCircle(x,y,radius,background){
	context.beginPath()
	context.fillStyle = background
	context.arc(x,y,radius,0,Math.PI*2)
	context.fill()	
}

function drawLine(x1,y1,x2,y2,lineWidth,lineColor){
	context.beginPath()
	context.moveTo(x1,y1)
	context.lineWidth = lineWidth
	context.lineTo(x2,y2)
	context.strokeStyle = lineColor
	context.stroke()
	context.closePath()
}