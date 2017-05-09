####设计思路：
####1.写好button绑定事件，切换的时候改变颜色
####2.设计画的操作的步骤：
####①初始化数据，定义两个数组，都保存好每个点的信息：坐标以及index值，一个用来保存已走过的点，一个保存没有走的点，为互补的关系
####②画圆函数，画边框函数，画线函数（每次都是从第一个点开始画到现在的位置，不断刷新）
####③绑定触发事件：
touchstart: //手指放到屏幕上时触发
   获取当前位置，判断是否在圆心内，当前的坐标和圆的坐标做差，若小于，落在园内；将iftouch改为true，把当前点放入路径中，将这个点从另外一个restarray移除
touchmove: //手指在屏幕上滑动式触发
   判断iftouch的状态，开始画线；先画出圆的图形，每过一个点，将该点从restarray中移除，并且加入路径，注意，每次都是从第一个点开始，到当前位置结束；
touchend: //手指离开屏幕时触发
  判断iftouch的状态，验证第几次输入密码以及检测密码