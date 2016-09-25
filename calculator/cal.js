var start = true; 
var doubleOperation = false; //是不是将要输入第二个操作符
var doubleEqual = false;   //是不是第二次按等号
var lastOperation = '';


//把选择的数字或操作符添加入运算公式
function  show(obj) {
	doubleOperation = false;
	var data = obj.value;
	var output = document.getElementById('output');
	if (start) {
		output.value = '';
		start = false;
	};
	output.value += data;
}


//清屏键
function clearMsg(){
	var output = document.getElementById('output');
	output.value = '0';
	start = true;
	doubleOperation = false;
	lastOperation = '';
}

//正负转换
function plusOrMinus(){
	var output = document.getElementById('output');
	output.value = eval(output.value);
	output.value = - output.value;
}

//百分号显示为/100
function percent(){
	var output = document.getElementById('output');
	if (!doubleOperation) {
		output.value = output.value+"/100";
	};
}


//回删一位
// function backDelete(){
// 	var output = document.getElementById('output');
// 	if (output.value !== '0') {
// 		output.value = output.value.slice(0,-1);
// 		// 从已有的数组中返回选定的元素。 start ~ end;
// 	}else{
// 		start = true;
// 	}
// 	//如果之前是一个符号位
// 	if (doubleOperation) {
// 		doubleOperation = false;
// 	};
// }



//加
function plusNumber(obj){
	if (start !== true) {
		var output = document.getElementById('output');
		var data = obj.value;
		if (doubleOperation) {   //前一位是符号位,去掉一位，再加符号位
			output.value = output.value.slice(0,-1);
		}
		//如果前面删去的是小数点，那还要再判断要不要删一位
		var test = output.value.slice(-1);
		if (test == "+" || test == "-" || test == "*" || test == "/") {
			output.value = output.value.slice(0,-1);
		};
		output.value += data;
		doubleOperation = true;
	};
}

//减
function minusNumber(obj){
	if (start !== true) {
		var output = document.getElementById('output');
		var data = obj.value;
		if (doubleOperation) {   //前一位是符号位,去掉一位，再加符号位
			output.value = output.value.slice(0,-1);
		}
		//如果前面删去的是小数点，那还要再判断要不要删一位
		var test = output.value.slice(-1);
		if (test == "+" || test == "-" || test == "*" || test == "/") {
			output.value = output.value.slice(0,-1);
		};
		output.value += data;
		doubleOperation = true;
	}
}


//乘
function multiNumber(obj){
	if (start !== true) {
		var output = document.getElementById('output');
		var data = obj.value;
		if (doubleOperation) {   //前一位是符号位,去掉一位，再加符号位
			output.value = output.value.slice(0,-1);
		}
		//如果前面删去的是小数点，那还要再判断要不要删一位
		var test = output.value.slice(-1);
		if (test == "+" || test == "-" || test == "*" || test == "/") {
			output.value = output.value.slice(0,-1);
		};
		output.value += data;
		doubleOperation = true;
	}
}


//除
function divideNumber(obj){
	if (start !== true) {
		var output = document.getElementById('output');
		var data = obj.value;
		if (doubleOperation) {   //前一位是符号位,去掉一位，再加符号位
			output.value = output.value.slice(0,-1);
		}
		//如果前面删去的是小数点，那还要再判断要不要删一位
		var test = output.value.slice(-1);
		if (test == "+" || test == "-" || test == "*" || test == "/") {
			output.value = output.value.slice(0,-1);
		};
		output.value += data;
		doubleOperation = true;
	}
}


//加小数点
function addPoint(obj){
	var output = document.getElementById('output');
	var data = obj.value;
	if (output.value.slice(-1) == ".") {
		doubleOperation = true;
	}else{
		output.value += data;
		doubleOperation = true;
	}
}



// 计算结果
function getResult() {
	var output = document.getElementById('output');
	if(!doubleEqual){         //如果是第一次按等号
		if (doubleOperation) {   //检查最后是否是符号，是就删除一位
			output.value = output.value.slice(0,-1);
		}
			//读取并保存最后一个操作
			for (var i = output.value.length - 1; i >= 0; i --) {
			console.log(output.value.slice(i,i+1));
			if(output.value.slice(i,i+1) == "+"){
				// alert("找到一个+");
				lastOperation = output.value.slice(i);
				console.log(lastOperation);
				break;
			}
			if(output.value.slice(i,i+1) == "-"){
				// alert("找到一个-");
				lastOperation = output.value.slice(i);
				console.log(lastOperation);
				break;
			}
			if(output.value.slice(i,i+1) == "*"){
				// alert("找到一个*");
				lastOperation = output.value.slice(i);
				console.log(lastOperation);
				break;
			}
			if(output.value.slice(i,i+1) == "/"){
				// alert("找到一个/");
				lastOperation = output.value.slice(i);
				console.log(lastOperation);
				break;
			}
		};
		doubleEqual = true;
 		}else{       //如果不是第一次按等号
 			output.value += lastOperation;
 			console.log(output.value);
 		}
 		output.value = eval(output.value);
}

















