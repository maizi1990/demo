/*
1.建立数据
2.拿数据
 	第一次打开，拿到第一级的数据
 	进入到子级，拿到子级的数据
3.根据数据渲染页面
4.新建文件夹
 	在第一个位置出现空白文件夹，弹窗
 	弹窗里的文字默认是新建文件夹，点击确定，新建；点击取消，取消本次新建，空白文件夹消失
 	如果命名重复：如果名字不是新建文件夹系列名字，取消
 			    如果名字是新建文件夹系列名字，加序号
5.批量删除
	删数据，删结构
6.重命名
	只有一个被选中才能重命名
	知道点的是谁，对应数据
	弹窗出现，点击取消，取消本次重命名，点击确定，判断是否重命名，不能重命名
7.面包屑导航
	生成面包屑导航，最后一个不可点击，点其他的可以回到某一级
8.右键菜单，空白区域和文件夹上点右键，显示不同菜单
9.框选，拖拽移动文件
10.移动到(树形菜单)
11.网格和列表模式(选做)
 * */
//大容器
var list = document.getElementById('list');
//大容器下的input
var inps = list.getElementsByTagName('input');
//大容器下的li
var lis = list.getElementsByTagName('li');
//新建按钮
var New = document.getElementsByClassName('new')[0];
//删除按钮
var del = document.getElementsByClassName('delete')[0];
//重命名按钮
var rename = document.getElementsByClassName('rename')[0];
//移动到按钮
var move = document.getElementsByClassName('move')[0];
//全选按钮
var all = document.getElementById('all');
//面包屑导航容器
var sub = document.getElementsByClassName('sub')[0];
//重命名未选中文件时弹窗
var renamePopup = document.getElementsByClassName('rename-popup')[0];
//点击移动到出现的弹窗
var moveTo = document.getElementsByClassName('moveTo')[0];
//移动到遮罩
var shadowMove = document.getElementsByClassName('shadowMove')[0];
//移动到文件夹
var menuTreeMove = document.getElementById('menuTreeMove');
//取消移动到
var omit = document.getElementsByClassName('omit')[0];
var moveToCacel = document.getElementsByClassName('moveToCacel')[0];
//确定移动到
var moveToSure = document.getElementsByClassName('moveToSure')[0];
//移动到文件夹
var moveToFile = document.getElementsByClassName('moveToFile')[0];
//框选背景
var shadow = document.getElementById('shad');
//拖拽的文件夹
var drag = document.getElementsByClassName('drag')[0];
//空白区域右键
var rightMenu = document.getElementsByClassName('rightMenu')[0];
//右键菜单下的li
var rightMenuLi = rightMenu.getElementsByTagName('li');
//文件夹右键
var rightMenuFiel = document.getElementsByClassName('rightMenuFiel')[0];
//文件夹右键下的li
var rightMenuFielLi = rightMenuFiel.getElementsByTagName('li');
//菜单树
var mainLeft = document.getElementsByClassName('main-left')[0];
var menuTree = document.getElementsByClassName('menuTree')[0];
//菜单树
menuTree.innerHTML = menuTreeShow(data);
//菜单树的头文件
var h3 = mainLeft.getElementsByTagName('h3');
for(var i=0;i<h3.length;i++){
	h3[i].index = i;
	h3[i].onOff = true;
	h3[i].onclick = function(){
		var up = h3[this.index].getElementsByTagName('span')[0];
		if(this.onOff){
			//展开
			if(this.nextElementSibling){
				this.nextElementSibling.style.display = 'block';
				up.style.backgroundImage = 'url(images/up.png)';
			}
			this.onOff = false;
		}else{
			//收缩
			if(this.nextElementSibling){
				this.nextElementSibling.style.display = 'none';
				up.style.backgroundImage = 'url(images/right.png)';
			}
			this.onOff = true;
		}
	}
}
//移动到的弹窗
menuTreeMove.innerHTML = moveToShow(data);
//移动到文件夹的头文件
var h3moveToFile = moveToFile.getElementsByTagName('h3');
//用变量存住getData返回的结果，当前页面的数据
var Data = getData(data);
//数据最大id
var maxId = getMaxId(data);
//弹窗出现用的延时定时器
var timer = null;
//渲染页面，默认显示第一级
show(Data);
//面包屑导航
crumbs(); 
//框选
var oL,oT;
var onOff = false;
var check = [];
var arr = [];
Drag(Data);
//第一次点击，没有改变hash，不需要调用下面的代码；当hash改变时，调用下面的代码，渲染子级的数据
window.onhashchange = function(){
	Data = getData(data);
	show(Data);
	crumbs();
	Drag(Data);
	mt();
}
//控制只能新建一个文件夹
New.onOff = true;
//新建
New.onclick = function(){
	if(New.onOff){
		all.checked = false;
		New.onOff = !New.onOff;
		rename.onOff = !rename.onOff;
		move.onOff = !move.onOff;
		for(var i=0;i<lis.length;i++){
			var inp = lis[i].getElementsByTagName('input')[0];
			lis[i].classList.remove('active');
			inp.style.display = 'none';
			inp.checked = false;
		}
		//创建一个li，文件夹名默认是新建文件夹
		folder({name:'新建文件夹'});
		//让新建的文件夹放到第一个
		list.insertBefore(lis[lis.length-1],lis[0]);
		var p = lis[0].getElementsByTagName('p')[0];
		//删除原来的p节点
		lis[0].removeChild(p);
		//添加div节点
		fielName(lis[0],Data);
	}
}
//删除
del.onclick = function(){
	list.onmousedown = null;
	list.onmousemove = null;
	all.checked = false;
	for(var i=0;i<inps.length;i++){
		if(inps[i].checked){
			list.removeChild(lis[i]);
			Data.splice(i,1);
			i--;
		}
	}
}
//只能重命名一个
rename.onOff = true;
//重命名
rename.onclick = function(){
	if(rename.onOff){
		New.onOff = !New.onOff;
		rename.onOff = !rename.onOff;
		getRename();
	}
}
//移动到
var m = 0;
move.onOff = true;
move.onclick = function(){
	if(move.onOff){
		move.onOff = !move.onOff;
		for(var i=0;i<inps.length;i++){
			if(inps[i].checked){
				m++;
			}
		}
		if(m==0){
			//未选中任何文件
			dialog('未选中任何文件！');
			move.onOff = !move.onOff;
		}else{
			//选中文件
			shadowMove.style.display = 'block';
			moveTo.style.display = 'block';
		}
	}
}
//移动到
var arrMoveTo = [];
var checkMoveTo = [];
mt();
//全选
all.onclick = function(){
	if(this.checked){
		for(var i=0;i<inps.length;i++){
			inps[i].checked = true;
			inps[i].style.display = 'block';
			lis[i].classList.add('active');
		}
	}else{
		for(var i=0;i<inps.length;i++){
			inps[i].checked = false;
			inps[i].style.display = 'none';
			lis[i].classList.remove('active');
		}
	}
	if(lis.length==0){
		this.checked = false;
	}
}
//点击右键
list.oncontextmenu = function(ev){
	ev.preventDefault();
	//右键菜单左，上定位能出现的最大值，document.documentElement.clientWidth：可视区的宽
	var maxL = document.documentElement.clientWidth-rightMenu.offsetWidth;
	var maxT = document.documentElement.clientHeight-rightMenu.offsetHeight;
	//谁小用谁
	var rightMenuL = ev.clientX>maxL?maxL:ev.clientX;
	var rightMenuT = ev.clientY>maxT?maxT:ev.clientY;
	rightMenu.style.left = rightMenuL+'px';
	rightMenu.style.top = rightMenuT+'px';
	rightMenu.style.display = 'block';
	rightMenuFiel.style.display = 'none';
}
document.onclick = function(ev){
	//单击document，如果不是点的rightMenu或者rightMenuFiel，菜单消失
	if(!(ev.target.parentNode==rightMenu||ev.target.parentNode==rightMenuFiel)){
		rightMenu.style.cssText = '';
		rightMenuFiel.style.cssText ='';
	}
}
for(var i=0;i<rightMenuLi.length;i++){
	//鼠标移入右键菜单，每个li高亮
	rightMenuLi[i].onmouseenter = function(){
		for(var i=0;i<rightMenuLi.length;i++){
			rightMenuLi[i].classList.remove('activeLi');
		}
		this.classList.add('activeLi');
	}
}