//初始化数据
window.onload=function(){
   touch.buttonevent();
   touch.init();
}
var touch={
  buttonevent: function()
  {
		   var first=document.getElementById("setpw");
		   var second=document.getElementById("checkpw");
		   first.addEventListener("click",function()
		   {
		      first.className="checked";
		      second.className="unchecked";
		   },false);
		   second.addEventListener("click",function() 
		   {
		      first.className="unchecked";
		      second.className="checked";
		   },false);
   
 },
   init : function()
  {
	    	this.password = {};
		    this.ifTouch = false;
		    this.canvas = document.getElementById('canvas');
		    this.getWidHei(this.canvas);
		    this.ctx = this.canvas.getContext('2d');
		    this.createPoint();
		    this.touchEvent();
    },
    getWidHei : function(canvas)
    {
            var width = document.body.clientWidth;
            canvas.width = 0.85 * width;
            canvas.height = 0.85 * width;
            canvas.style.marginLeft = -0.5 * canvas.width + 'px';
    },
    createPoint:function()//初始化数据
    {
           var count=0;
           this.r=this.ctx.canvas.width/14;
           this.passwordPath=[];
           this.pointArr=[];//已经走过的点的数组保存数据
           this.restPoint=[];//将走过的点移除后保存的数组
           for(var i=0;i<3;i++)
           {
              for(var j=0;j<3;j++)
              {
                count++;
                var obj=
                {
                    x: j * 4 * this.r + 3 * this.r,
	                y: i * 4 * this.r + 3 * this.r,
	                index: count
                };
                this.pointArr.push(obj);
                this.restPoint.push(obj);

              }

           }
           this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
           this.drawCircle();
           for(var i=0;i<this.pointArr.length;i++)
           {
           	         this.drawBorder(this.pointArr[i].x, this.pointArr[i].y);
           }
    },
    drawCircle : function()
    {
    	 for (var i = 0 ; i < this.pointArr.length ; i++) {
	            this.ctx.fillStyle = 'pink';
                this.ctx.beginPath();
                this.ctx.arc(this.pointArr[i].x, this.pointArr[i].y, this.r / 2, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fill();
	     }
    },
    drawBorder : function(x,y)
    {
	        this.ctx.strokeStyle = 'pink';
	        this.ctx.lineWidth = 2;
	        this.ctx.beginPath();
	        this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
	        this.ctx.closePath();
	        this.ctx.stroke();
    },

     drawLine : function(localPos, passwordPath) 
     {
            this.ctx.beginPath();
            this.ctx.lineWidth = 8;
            this.ctx.strokeStyle = 'pink';
            this.ctx.moveTo(this.passwordPath[0].x, this.passwordPath[0].y);
            for (var i = 1 ; i < this.passwordPath.length ; i++) 
            {
                this.ctx.lineTo(this.passwordPath[i].x, this.passwordPath[i].y);
            }
            this.ctx.lineTo(localPos.x, localPos.y);
            this.ctx.stroke();
            this.ctx.closePath();
    },
     touchEvent : function()
     {
             var that = this;
             this.canvas.addEventListener("touchstart", function (e) 
             {
	             e.preventDefault();//禁止滚动
	             var localPos= that.getPosition(e);
	             for (var i = 0 ; i < that.pointArr.length ; i++) 
	             {
	                if (Math.abs(localPos.x - that.pointArr[i].x) < that.r && Math.abs(localPos.y - that.pointArr[i].y) < that.r) {
	                    that.ifTouch = true;
	                    that.passwordPath.push(that.pointArr[i]);
	                    that.restPoint.splice(i,1);
	                    break;
	                }
	             }
	         },  { passive: false });
	         this.canvas.addEventListener("touchmove", function (e) 
	         {
	            if (that.ifTouch) 
	            {
	                that.updatePancel(that.getPosition(e));
	            }
	         },  { passive: false });
	         this.canvas.addEventListener("touchend", function (e) {
	             if (that.ifTouch) 
	             {
	                 that.ifTouch = false;
	                 that.promptInfo(that.passwordPath);
	                 that.resetPanel();
	             }
	         },  { passive: false });
    },
   getPosition : function(e)//*
    {
	         var rect= e.currentTarget.getBoundingClientRect();
	         var localPos = {
	             x: e.touches[0].clientX - rect.left,
	             y: e.touches[0].clientY - rect.top
	         };
	         return localPos;
    },
     updatePancel : function(localPos)
     {

     	     //画圆
	         this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	          this.drawCircle();   
	         for (var i = 0 ; i < this.pointArr.length ; i++) { 
	            this.drawBorder(this.pointArr[i].x, this.pointArr[i].y);
	         }   
	           

	         this.drawLine(localPos,this.passwordPath);
	      for (var i = 0 ; i < this.restPoint.length ; i++) {//*
	             var pt = this.restPoint[i];
	             if (Math.abs(localPos.x - pt.x) < this.r && Math.abs(localPos.y - pt.y) < this.r) {
	                 this.passwordPath.push(pt);
                     this.restPoint.splice(i, 1);
	                 break;
	             }
	         }
    },
     promptInfo : function(psw)
     {
            var buttonBox = document.getElementsByTagName('button');
        	if(buttonBox[0].className == 'checked'){
        		 if (this.password.step == 1) 
        		 {
	                if (this.checkDistance(this.password.firstPassword,psw)) {
	                    this.password.step = 2;
	                    this.password.secondPassword = psw;
	                    document.getElementById('words').innerHTML = '密码设置成功';
	                    window.localStorage.setItem('password', JSON.stringify(this.password.secondPassword));//*
	                } else {
	                    document.getElementById('words').innerHTML = '两次输入的不一致';
	                    delete this.password.step;
	                }
	            }
	            else{
                     if(psw.length < 5)
                     {
                	document.getElementById('words').innerHTML = '密码太短，至少需要5个点';
	                }
	                else{
	                	this.password.step = 1;
	                    this.password.firstPassword = psw; 
	                	document.getElementById('words').innerHTML = '请再次输入手势密码';
	                }
	            }
        	}
        	else{
        		if(this.password.step == 2){
        			//console.log(psw);
        			//console.log(window.localStorage.getItem('password'));
       			if (this.lastCheck(window.localStorage.getItem('password'),psw)) {
	                    document.getElementById('words').innerHTML = '密码正确！';
	                } else {
	                    document.getElementById('words').innerHTML = '输入的密码不正确';
	                }
        		}
        	}
    },
    resetPanel : function()//*
    {
    	var that = this;
    	setTimeout(function()
    	{
          that.createPoint();
    	},200);
    },
     checkDistance : function(psw1, psw2)
     {
            var p1 = '',p2 = '';
            for (var i = 0 ; i < psw1.length ; i++) {
                p1 += psw1[i].index;
            }
            for (var i = 0 ; i < psw2.length ; i++) {
                p2 += psw2[i].index;
            }
            return p1 === p2;
    },
    lastCheck : function(localstorage,psw)
    {
    	 localstorage = eval("(" + localstorage + ")");
    	 return this.checkDistance(localstorage,psw);
    },
};

