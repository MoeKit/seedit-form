# 自动读取用户资料

---

## Normal usage
<script type="text/javascript" src="http://scdn.bozhong.com/source/common/js/jquery.min.js"></script>

````html
<input class="demo-input" id="input" type="text" value="oMtuSuPR800N-AXWdjMmXmlLHY0Y" placeholder="输入unionid" />
<button id="btnUse" class="demo-btn">使用收件表单</button>
<button id="btn" class="demo-btn">初始化用户资料</button>
````

````javascript
var seeditForm = require('seedit-form');
var $ = require('jquery');
form = '';

document.querySelector('#btn').addEventListener('click', function(){
	form = new seeditForm({
		title: "请正确填写你的个人资料,活动结束后会有客服与你联系~",
		submit: "提交",
		close: "返回",
		validator: {
			isFocus: false,
			pass: true
		},
		unionid: document.querySelector("#input").value,
		type: 'miyuezhuanwechat',
		activityid: '567b68358cf43288478b4568',
		read: true,
		list: [
		{
			name: "realname",
			required: true,
			'data-alt': "姓名不能为空，外部传入"
		},
		{
			name: "qq",
			required: true
		},
		{
			name: "mobile",
			required: true
		},
		{
			name: "provcity",
			required: true
		},
		{
			name: "addr",
			required: true
		}
	],
		onVerifyError: function(a,b,c){
			alert(c);
		},
		onError: function(data){

		},
		onSuccess: function(data){

		}
	});
	document.querySelector('#btnUse').addEventListener('click', function(){
	console.log(form);
		form.open();
	}, false);
}, false);
````