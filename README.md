# seedit-form [![spm version](https://moekit.com/badge/seedit-form)](https://moekit.com/package/seedit-form)

---

## 说明
> 该模块只用来做移动端活动资料收集使用

## 使用方法
```
var seeditForm = require('seedit-form');
// 初始化一个带姓名、手机、省市、街道地址的表单
var form = new seeditForm({
	title: "请正确填写你的个人资料,活动结束后会有客服与你联系~",
	submit: "提交",
	close: "返回",
	validator: {
		isFocus: false
	},
	list: [
		{
			name: "realname",
			required: true,
			'data-alt': "姓名不能为空，外部传入"
		},
		{
			name: "mobile",
			required: true
		},
		{
			name: "provcity",
			required: true
		}
		{
			name: "addr",
			required: true
		}
	]
});
```

## 初始化参数
+ title: `string` 顶部引导文案
+ submit: `string` 提交按钮文案
+ close: `string` 关闭按钮文案
+ validator: `object` 表单验证组件初始化配置
+ list: `array` 需要验证的表单元素列表, 以下参数均依赖[validator](https://moekit.com/package/validator)组件的表单标签属性
	+ name `string` 需要验证的元素name值，存在正确的name值才会显示表单元素出来
	+ required `boolean` 默认为空，设置为true才算启用必填校验
	+ data-alt `string` 表单验证失败的文案
	+ data-valid `string` 表单校验类型
	+ 更多请参考validator的表单标签属性
+ onVerifyError: `function` 表单验证失败回调，带三个参数`name`, `dom`, `alt`
+ onVerifySuccess: `function` 表单验证通过回调
+ formatValue: `function` 提交资料的json数据格式化事件
+ onError: `function` 提交资料成功回调
+ onSuccess: `function` 提交资料失败回调

## 初始化参数的`list`下的`name`值介绍
+ `realname`     姓名
+ `mobile`       手机号码
+ `provcity`     地区信息（省市）
+ `addr`         详细地址
+ `zipcode`      邮编
+ `qq`           QQ
+ `weixinhao`    微信号
+ `backupfield1` 备用字段1
+ `backupfield2` 备用字段2
+ `backupfield3` 备用字段3
			