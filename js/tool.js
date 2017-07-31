/*
 功能性函数，用于调用
 * */
//创建一个li函数，即创建一个文件夹，用于方格模式，形参data：数据，用于放文件夹的名字
function folder(data){
	//创建节点
	var li = document.createElement('li');
	li.className = 'item';
	var inp = document.createElement('input');
	inp.type = 'checkbox';
	inp.className = 'checkbox';
	var div = document.createElement('div');
	div.className = 'fileicon';
	var p = document.createElement('p');
	p.innerHTML = data.name;
	p.className = 'file-name';
	li.appendChild(inp);
	li.appendChild(div);
	li.appendChild(p);
	list.appendChild(li);
	//移入li，input出现，当前li高亮
	li.onmouseenter = function(){
		if(New.onOff&&rename.onOff){
			var inp = this.getElementsByTagName('input')[0];
			this.classList.add('active');
			inp.style.display = 'block';
		}
	}
	//移出li，如果没有勾选，高亮消失，input消失，如果已经勾选，不变
	li.onmouseleave = function(){
		if(New.onOff&&rename.onOff){
			var inp = this.getElementsByTagName('input')[0];
			if(!inp.checked){
				this.classList.remove('active');
				inp.style.display = 'none';
			}
		}
	}
	//双击li，渲染子级文件夹
	li.ondblclick = function(){
		//如果没有完成新建操作，不能进入子级
		if(New.onOff&&rename.onOff){
			all.checked = false;
			if(location.hash==''){
				//如果hash为空，加上#path=/
				location.hash = '#path=/'+data.name;
			}else{
				//不为空，累加上文件夹的名字
				location.hash += '/'+data.name;
			}
		}
	}
	//右键li，出现右键菜单
	li.oncontextmenu = function(ev){
		ev.preventDefault();
		var rightMenuFielL = ev.clientX;
		var rightMenuFielT = ev.clientY;
		rightMenuFiel.style.left = rightMenuFielL+'px';
		rightMenuFiel.style.top = rightMenuFielT+'px';
		rightMenuFiel.style.display = 'block';
		rightMenu.style.display = 'none';
	}
	//鼠标移入文件右键下的li，高亮
	for(var i=0;i<rightMenuFielLi.length;i++){
		//鼠标移入右键菜单，每个li高亮
		rightMenuFielLi[i].onmouseenter = function(){
			for(var i=0;i<rightMenuFielLi.length;i++){
				rightMenuFielLi[i].classList.remove('activeLi');
			}
			this.classList.add('activeLi');
		}
	}
	//单选
	var inps = list.getElementsByTagName('input');
	for(var i=0;i<inps.length;i++){
		inps[i].index = i;
		inps[i].onclick = function(){
			var num = 0;
			for(var i=0;i<inps.length;i++){
				if(inps[i].checked){
					num++;
				}
			}
			if(num==inps.length){
				all.checked = true;
			}else{
				all.checked = false;
			}
		}
	}
}

//新建文件夹时，创建div函数，形参obj：被插入的父元素，Data:当前同级数据,type:不传参，新建，传参，重命名
function fielName(obj,Data,type){
	//如果不传参就是新建，传参就是重命名
	if(!type&&type!=0){
		type = undefined;
	}
	var div = document.createElement('div');
	div.className = 'new-item';
	div.style.display = 'block';
	var inp = document.createElement('input');
	inp.className = 'box';
	inp.type = 'text';
	inp.placeholder = '新建文件夹';
	var spanSure = document.createElement('span');
	spanSure.className = 'sure';
	spanSure.innerHTML = '√';
	var spanCancel = document.createElement('span');
	spanCancel.className = 'cancel';
	spanCancel.innerHTML = '×';
	div.appendChild(inp);
	div.appendChild(spanSure);
	div.appendChild(spanCancel);
	obj.appendChild(div);
	var sure = document.getElementsByClassName('sure')[0];
	var cancel = document.getElementsByClassName('cancel')[0];
	var box = document.getElementsByClassName('box')[0];
	list.onmousedown = null;
	list.onmousemove = null;
	//确定，勾
	sure.onclick = function(){
		New.onOff = !New.onOff;
		rename.onOff = !rename.onOff;
		move.onOff = !move.onOff;
		//输入文件夹名
		var val = box.value;
		if(val){
			//val存在，再判断val是否与当前同级数据的文件夹名是否相同
			if(checkName(Data,val)){
				//返回true,名字重复，只判断新建文件夹系列
				var name = Number(val.split('新建文件夹(').join('').split(')').join(''));
				//如果name是由纯数字组成，如111,222等，命名重复，不能新建
				if(isNaN(name)){
					if(val=='新建文件夹'||name){
						//新建文件夹系列
						list.removeChild(obj);
						if(type==undefined){
							//新建，把数据添加到第一位
							folder(newData(Data,findNewName(Data)));
							list.insertBefore(lis[lis.length-1],lis[0]);
						}else{
							//重命名，更改原来数据的name
							folder(reNameData(Data,type,findNewName(Data)));
							list.insertBefore(lis[lis.length-1],lis[type]);
						}
					}else{
						//不是新建文件夹系列
						dialog('文件夹名不能重复！');
						New.onOff = !New.onOff;
					}
				}else{
					dialog('文件夹名不能重复！');
					New.onOff = !New.onOff;
				}
			}else{
				//返回false,名字不重复
				var p = document.createElement('p');
				p.innerHTML = val;
				p.className = 'file-name'; 
				obj.removeChild(div);
				obj.appendChild(p);
				//把生成的数据扔到Data里
				if(type==undefined){
					//新建，把val赋值给数据第一个值的name
					newData(Data,val);
				}else{
					//重命名，把val赋值给当前数据的name
					reNameData(Data,type,val);
				}
			}
		}else{
			//val值为空，默认文件夹名是新建文件夹，再判断是否与新建系列重名
			list.removeChild(obj);
			if(type==undefined){
				//新建，把数据添加到第一位
				folder(newData(Data,findNewName(Data)));
				list.insertBefore(lis[lis.length-1],lis[0]);
			}else{
				//重命名，更改原来数据的name
				folder(reNameData(Data,type,findNewName(Data)));
				list.insertBefore(lis[lis.length-1],lis[type]);
			}
		}
	}
	//叉
	cancel.onclick = function(){
		New.onOff = !New.onOff;
		rename.onOff = !rename.onOff;
		move.onOff = !move.onOff;
		if(type==undefined){
			//新建，删除
			list.removeChild(obj);
		}else{
			//重命名，原来的name
			var p = document.createElement('p');
			p.innerHTML = Data[type].name;
			p.className = 'file-name'; 
			obj.removeChild(div);
			obj.appendChild(p);
		}
	}
}

//根据hash获取数据函数
function getData(data){
	var hash = location.hash;
	//路径:#path=/
	var path = hash?hash.substring(7).split('/'):[];
	//利用路径的长度判断是否进入子级
	if(path.length==0){
		//第一次点击，没有hash值，path为[],将data数据返回，渲染第一级的数据
		var arr = data;
	}else{
		//进入子级，path的值不为[]，起码有一个数据
		var arr = fn(data,path);
	}
	function fn(data,path){
		var arr1 = [];
		fn(data,path);
		function fn(data,path){
			if(path.length==0){
				//当path的值为0时，终止递归
				arr1 = data;
				return;
			}
			data.forEach(function(a){
				if(a.name==path[0]){
					//删除path中第一个与data[i].name相同的项
					path.shift();
					//显示子文件夹，同时传入path值
					fn(a.child,path);
				}
			})
		}
		return arr1;
	}
	return arr;
}

//渲染页面函数
function show(data){
	//清空容器里原有的内容
	list.innerHTML = '';
	//如果是第一次点击，说明未进入子级，循环的是data的长度，a表示data里的每一个值，调用创建li的函数
	data.forEach(function(a){
		folder(a);
	})
}

//寻找数据中id的最大值,形参data：数据
function getMaxId(data){
	var max = 0;
	fn(data);
	function fn(data){
		data.forEach(function(a){
			//如果数据data的每个值存在，才能递归，如果不存在，终止递归
			if(a){
				//寻找最大值
				if(max<a.id){
					max = a.id;
				}
				//递归寻找
				fn(a.child);
			}
		})
	}
	return max
}

//判断当前同级数据是否重命名，形参data：当前数据，name：新建文件夹的名字
function checkName(data,name){
	//全部不相等，返回false
	return data.some(function(a){
		return a.name==name;
	})
}

//生成一条新数据，形参data：数据;Name：输入的名字
function newData(data,Name){
	var j = {
		id:++maxId,
		name:Name,
		child:[]
	}
	//把创建的数据扔到data的第一个
	data.unshift(j);
	return j;
}

//找到可用的最小的序号,返回新建文件夹名字，形参data：当前同级数据
function findNewName(data){
	var arr = [];
	data.forEach(function(a){
		if(a.name=='新建文件夹'){
			arr[0] = true;
		}
		if(isNaN(Number(a.name))){
			var name = Number(a.name.split('新建文件夹(').join('').split(')').join(''));
			if(name){
				arr[name] = true;
			}
		}
	})
	var n = 0;
	if(arr[0]==undefined){
		return '新建文件夹';
	}
	if(arr.every(function(a){
		return a!=undefined;
	})){
		n = arr.length;
	}
	for(var i=0;i<arr.length;i++){
	   if(arr[i]==undefined){
	   	 n = i;
	   	 break;
	   }
	}
	return '新建文件夹('+n+')';
}

//找到重命名的是哪一个
function getRename(){
	list.onmousedown = null;
	list.onmousemove = null;
	var index = null;
	var arr = [];
	for(var i=0;i<lis.length;i++){
		var inp = lis[i].getElementsByTagName('input')[0];
		if(inp.checked){
			arr.push(lis[i]);
			index = i;
		}
	}
	//判断是否只有一个被选中
	if(arr.length==0){
		//未选中
		dialog('未选中文件！');
		rename.onOff = !rename.onOff;
		New.onOff = !New.onOff;
	}
	if(arr.length>1){
		//选中超过一个
		dialog('只能对单个文件夹重命名！');
		rename.onOff = !rename.onOff;
		New.onOff = !New.onOff;
	}
	if(arr.length==1){
		var p = arr[0].getElementsByTagName('p')[0];
		arr[0].removeChild(p);
		//清除勾选和高亮
		var checkBox = arr[0].getElementsByClassName('checkbox')[0];
		arr[0].classList.remove('active');
		checkBox.style.display = 'none';
		checkBox.checked = false;
		fielName(arr[0],Data,index);
	}
}

function reNameData(Data,index,Name){
	Data[index].name = Name;
	return Data[index];
}

//面包屑导航
function crumbs(){
	list.onmousedown = null;
	list.onmousemove = null;
	var hash = location.hash;
	var path = hash?hash.substring(7).split('/'):[];
	sub.innerHTML = '';
	//渲染全部文件（第一级）
	var ab = document.createElement('a');
	ab.href = 'javascript:;';
	ab.innerHTML = '全部文件';
	sub.appendChild(ab);
	//根据path的长度生成面包屑
	path.forEach(function(a){
		var span = document.createElement('span');
		var ab = document.createElement('a');
		ab.href = 'javascript:;';
		ab.innerHTML = a;
		sub.appendChild(span);
		sub.appendChild(ab);
	})
	var abs = sub.getElementsByTagName('a');
	//默认最后一个a标签高亮
	abs[abs.length-1].classList.add('hover');
	//最后一个不能点击
	for(var i=0;i<abs.length-1;i++){
		abs[i].index = i;
		abs[i].onclick = function(){
			all.checked = false;
			//清除其他高亮
			for(var i=0;i<abs.length;i++){
				abs[i].classList.remove('hover');
			}
			this.classList.add('hover');
			//清空list内容
			list.innerHTML = '';
			//截取hash
			h = path.slice(0,this.index);
			if(h.length){
				//改变hash，重新渲染页面
				location.hash = '/path='+h.join('/');
			}else{
				//点击全部文件，显示第一级的文件夹
				location.hash = '';
			}
		}
	}
}

//弹窗出现，延时1s消失
function dialog(val){
	renamePopup.innerHTML = val;
	renamePopup.style.display = 'block';
	clearTimeout(timer);
	timer = setTimeout(function(){
		renamePopup.style.display = 'none';
	},1000)
}

//检测碰撞函数，碰上返回true，没碰上返回false
function duang(obj1,obj2){
	var pos1 = obj1.getBoundingClientRect();
	var pos2 = obj2.getBoundingClientRect();
	if(pos1.right<pos2.left||pos1.top>pos2.bottom||pos1.left>pos2.right||pos1.bottom<pos2.top){
		//有一个符合就是没碰上
		return false;
	}else{
		//碰上了
		return true;
	}
}

//拖拽移动，选框
function Drag(Data){
	list.onmousedown = function(ev){
		ev.preventDefault();
		//鼠标距离可视区左边界，上边界的距离
		oL = ev.clientX;
		oT = ev.clientY;
		shadow.style.display = 'block';
		onOff = true;
		list.onmousemove = function(ev){
			ev.preventDefault();
			if(onOff){
				//鼠标移动时，鼠标距离可视区左边界，上边界的距离
				var iL = ev.clientX;
				var iT = ev.clientY;
				//移动后，背景的宽，高
				var w = Math.abs(iL-oL);
				var h = Math.abs(iT-oT);
				//移动后，背景的左，上定位值，谁小用谁
				var l = iL>oL?oL:iL;
				var t = iT>oT?oT:iT;
				shadow.style.width = w + 'px';
				shadow.style.height = h + 'px';
				shadow.style.left = l + 'px';
				shadow.style.top = t + 'px';
				//移动选框，先清空数组
				check = [];
				arr = [];
				for(var i=0;i<lis.length;i++){
					if(duang(shadow,lis[i])){
						//碰撞后，li高亮，input显示并勾选
						lis[i].classList.add('active');
						inps[i].style.display = 'block';
						inps[i].checked = true;
						check.push({
							obj:lis[i],
							Id:i
						});
					}else{
						//没碰到，移除高亮，input消失，
						lis[i].classList.remove('active');
						inps[i].style.display = 'none';
						inps[i].checked = false;
						arr.push({
							obj:lis[i],
							Id:i
						})
					}
				}
				//判断是否框选中
				if(check.length){
					check.forEach(function(a){
						//鼠标按下，拖拽文件夹出现
						a.obj.onmousedown = function(ev){
							ev.preventDefault();
							shadow.style.cssText = '';
							//鼠标到元素左边，上边的距离
							var shadowL = ev.clientX;
							var shadowT = ev.clientY;
							drag.style.display = 'block';
							drag.style.left = (shadowL -drag.offsetWidth/2)+ 'px';
							drag.style.top = (shadowT -drag.offsetHeight/2) + 'px';
							var disX = ev.clientX - this.getBoundingClientRect().left;
							var disY = ev.clientY - this.getBoundingClientRect().top;
							document.onmousemove = function(ev){
								ev.preventDefault();
								var dragL = ev.clientX - disX;
								var dragT = ev.clientY - disY;
								drag.style.left = dragL +'px';
								drag.style.top = dragT + 'px';
								//和谁碰撞，把数据扔到里面
								arr.forEach(function(a,b){
									if(duang(drag,a.obj)){
										//碰撞，碰撞的li高亮
										a.obj.classList.add('active');
										document.onmouseup = function(){
											document.onmousemove = null;
											drag.style.cssText = '';
											shadow.style.cssText = '';
											shadow.style.display = 'none';
											//被删除的li的对应的数据
											var deleteData = Data.splice(check[0].Id,check.length);
											//把删除的数据扔到对应的碰撞的li里
											for(var i=0;i<deleteData.length;i++){
												Data[b].child.push(deleteData[i]);
											}
											//清掉被勾选的li
											for(var i=0;i<check.length;i++){
												list.removeChild(check[i].obj);
											}
										}
									}else{
										//没有碰撞到，高亮消失
										a.obj.classList.remove('active');
									}
								})
							}
						}
					})
				}
			}
		}
		//鼠标抬起，清空方框的样式
		document.onmouseup = function(){
			drag.style.cssText = '';
			shadow.style.cssText = '';
			onOff = false;
		}
	}
}

//菜单树
function menuTreeShow(data){
	var str = fn(data);
	function fn(data){
		var str2 = '';
		data.forEach(function(a){
			if(a.child.length == 0){
				str2 += '<li><h3>'+a.name+'</h3></li>';
			}else{
				str2 += '<li><h3><span class="right"></span>'+a.name+'</h3><ul class="menuTree">'+fn(a.child)+'</ul></li>';
			}
		})
		return str2;
	}
	return str;
}

//移动到的菜单树显示
function moveToShow(data){
	var str = fn(data);
	function fn(data){
		var str2 = '';
		data.forEach(function(a){
			if(a.child.length == 0){
				str2 += '<li><h3>'+a.name+'</h3></li>';
			}else{
				str2 += '<li><h3><span class="right"></span>'+a.name+'</h3><ul id="menuTreeMove">'+fn(a.child)+'</ul></li>';
			}
		})
		return str2;
	}
	return str;
}

//移动到,找到文件夹的名字
function moveToGetFile(data,str){
	var arr1 = fn(data,str);
	function fn(data,str){
		var arr;
		for(var i=0;i<data.length;i++){
			if(data[i].name == str){
				arr = data[i].child;
			}else{
				if(data[i].child.length){
					fn(data[i].child,str);
				}
			}
		}
		return arr;
	}
	return arr1;
}
moveToGetFile(data,'新建文件夹(4)')
//移动到
function mt(){
	//移动到的弹窗，移入高亮，移出高亮消失
	for(var i=0;i<h3moveToFile.length;i++){
		h3moveToFile[i].onmouseenter = function(){
			this.classList.add('moveActive');
		}
		h3moveToFile[i].onclick = function(){
			for(var i=0;i<h3moveToFile.length;i++){
				h3moveToFile[i].onOff = false;
				h3moveToFile[i].classList.remove('moveActive');
			}
			this.onOff = true
			this.classList.add('moveActive');
		}
		h3moveToFile[i].onmouseleave = function(){
			if(!this.onOff){
				this.classList.remove('moveActive');
			}
		}
	}
	//取消移动到
	omit.onclick = moveToCacel.onclick = function(){
		move.onOff = !move.onOff;
		shadowMove.style.display = 'none';
		moveTo.style.display = 'none';
	}
	moveToSure.onclick = function(){
		move.onOff = !move.onOff;
		arrMoveTo = [];
		var moveToData = [];
		for(var i=0;i<inps.length;i++){
			if(inps[i].checked){
				arrMoveTo.push({
					obj:lis[i],
					Id:i
				})
				moveToData.push(Data.slice(i,i+1));
			}
		}
		for(var i=0;i<inps.length;i++){
			if(inps[i].checked){
				list.removeChild(lis[i]);
				i--;
			}
		}
		checkMoveTo = [];
		for(var i=0;i<h3moveToFile.length;i++){
			if(h3moveToFile[i].onOff){
				var str = h3moveToFile[i].innerText;
				checkMoveTo = moveToGetFile(data,str);
				
				break;
			}
		}
		for(var i=0;i<moveToData.length;i++){
			checkMoveTo.push(moveToData[i][0]);
		}
		shadowMove.style.display = 'none';
		moveTo.style.display = 'none';
	}
}