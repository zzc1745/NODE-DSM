var start = true; 
var doubleOperation = false; //是不是将要输入第二个操作符
//var doubleEqual = false;   //是不是第二次按等号
var lastOperation = '';
var preKey = "";
var doubleEqual = false;

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
	doubleEqual = false;
	lastOperation = '';
	preKey = "";
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






// 计算结果
function getResult() {
	var output = document.getElementById('output');
	// alert(preKey);
	if(preKey!== "="){         //如果是第一次按等号
		if (doubleOperation) {   //如果最后一位是符号位   //检查最后是否是符号，保存相应的lastOperation 

				// }else{      //6+=的情况，最后一位是符号位
				var itself = output.value.slice(0,output.value.length-1);
				lastOperation = output.value.slice(-1) + itself;
				output.value = eval(output.value.slice(0,-1)+ lastOperation);
				}else{
					if (output.value.slice(-1)!=="+"&&output.value.slice(-1)!=="-"&&output.value.slice(-1)!=="*"&&output.value.slice(-1)!=="/") {
					//0+6的情况，最后一位不是符号位
					var i;
					for(i = 0; i < output.value.length; i++){
						if (output.value.slice(i,i+1)==preKey) {
							lastOperation = output.value.slice(i);
							// alert(lastOperation);
						}
					};
					output.value = eval(output.value); 
				}
				}
		preKey = "=";
		}else if(preKey == "="){     //如果是第二次按等号
			//读取并保存最后一个操作
			var i;
			for (i = output.value.length - 1; i >= 0 ; i --) {   //如果是第二次取等号，就不用重新保存lastOperation变量
				console.log(output.value.slice(i,i+1));
				if (!doubleEqual) {
					if(output.value.slice(i,i+1) == "+"||output.value.slice(i,i+1) == "-"||output.value.slice(i,i+1) == "*"||output.value.slice(i,i+1) == "/"){
						// alert("找到一个+");
						lastOperation = output.value.slice(i);
						console.log(lastOperation);
						break;
					}
				}
			}
			doubleEqual = true;
 			output.value += lastOperation;
 			console.log(output.value);
 		}
 		output.value = eval(output.value);
 		preKey = "=";
}

// 计算结果
function resultTrriger() {
	var output = document.getElementById('output');
	if (doubleOperation) {   //检查最后是否是符号，是就删除一位
		var output = output.value.slice(0,output.value.length-1);
	}
	output.value = eval(output.value);
	doubleOperation = false;
	if(output.value !== "0"){
		start = false;
	}
}

//加
function plusNumber(obj){
	resultTrriger();
	if (start !== true) {    //不是符号位开头
		preKey = "+";
		// if (preKey=="+") {alert("ok!");}
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
	}else{      //如果以符号开头 -6 == 0-6
		var data = obj.value;
		var output = document.getElementById('output');
		output.value += data;
		doubleOperation = true;
		start = false;
		preKey = "+";
	};
}

//原减
function minusNumber(obj){
	resultTrriger();
	if (start !== true) {    //不是符号位开头
		preKey = "-";
		// if (preKey=="+") {alert("ok!");}
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
	}else{      //如果以符号开头 -6 == 0-6
		var data = obj.value;
		var output = document.getElementById('output');
		output.value += data;
		doubleOperation = true;
		start = false;
		preKey = "+";
	};
}

//减
function minusNumber2(obj){
	resultTrriger();
	if (start !== true) {    //如果不是符号开头
		preKey = "-";
		var output = document.getElementById('output');
		var data = obj.value;
		output.value += data;
		doubleOperation = true;
	}else{      //如果以符号开头 -6 == 0-6
		var data = obj.value;
		var output = document.getElementById('output');
		output.value += data;
		doubleOperation = true;
		start = false;
		preKey = "-";
	}
}


//乘
function multiNumber(obj){
	resultTrriger();
	var output = document.getElementById('output');
	if (start !== true) {
		preKey = "*";
		
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
	}else{      //如果以符号开头 -6 == 0-6
		var data = obj.value;
		var output = document.getElementById('output');
		output.value += data;
		doubleOperation = true;
		start = false;
		preKey = "*";
	}
}


//除
function divideNumber(obj){
	resultTrriger();
	if (start !== true) {
		preKey = "/";
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
	}else{      //如果以符号开头 -6 == 0-6
		var data = obj.value;
		var output = document.getElementById('output');
		output.value += data;
		doubleOperation = true;
		start = false;
		preKey = "/";
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



















