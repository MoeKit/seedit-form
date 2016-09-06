# 微信用户提交资料

---

## Normal usage
<script type="text/javascript" src="http://scdn.bozhong.com/source/common/js/jquery.min.js"></script>

````html
<button id="btn" class="demo-btn">使用收件表单</button>
````

```javascript
var seeditForm = require('seedit-form');

form = new seeditForm({
	validator: {
		isFocus: false
	},

	unionid: 'oMtuSuPR800N-AXWdjMmXmlLHY0Y',
	type: 'miyuezhuanwechat',
	activityid: '567b68358cf43288478b4568',
	html:'<p>hello</p>',
	structure: {
		name: 'gid',
		showname: '我的gid',
		'data-alt': '不能为空'
	},
	list: [
		{
			name: "wechat",
			required: true
		},
		{
			name: "qq",
			required: true
		}
	],
	addr: [
		{
			name: "realname",
			required: true,
			'data-alt': "姓名不能为空",
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
		},
		{
			name: "gid",
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
document.querySelector('#btn').addEventListener('click', function(){
	form.open();
}, false);
console.log(form);
```

````javascript
var seeditForm = require('seedit-form');
form = new seeditForm({
	validator: {
		isFocus: false
	},
	$: $,
	unionid: 'oMtuSuPR800N-AXWdjMmXmlLHY0Y',
	type: 'miyuezhuanwechat',
	activityid: '567b68358cf43288478b4568',
	html:'<p>hello</p>',
	structure: {
		gid: {
			showname: '我的gid',
			'data-alt': '不能为空'
		}
	},
	list: [
		{
			name: "wechat",
			required: true
		},
		{
			name: "qq",
			required: true
		}
	],
	addr: [
		{
			name: "realname",
			required: true,
			'data-alt': "姓名不能为空",
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
		},
		{
			name: "gid",
			required: true
		}
	],
	onVerifyError: function(a,b,c){
		alert(c);
	},
	onVerifySuccess: function(){
		alert("okokok");
	},
	formatValue: function(json){
		console.log(json);return json;
	}
});
document.querySelector('#btn').addEventListener('click', function(){
	form.open();
}, false);
console.log(form);
````
