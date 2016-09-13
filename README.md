# seedit-form [![spm version](https://moekit.com/badge/seedit-form)](https://moekit.com/package/seedit-form)

---

## 说明
> 该模块只用来做移动端活动资料及地址管理资料收集使用  
> 模块依赖jquery，内部没有引用，使用时请自己引入jquery

## 使用方法
```
var seeditForm = require('seedit-form');

//  初始化一个用于收集信息的表单
//  addr参数_提交到地址管理的信息
//  list参数_活动提交时除addr外所需信息 

var form = new seeditForm({
	submit: "确认保存",
	close: "返回",
	validator: {
		isFocus: false
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
			'data-alt': "姓名不能为空，外部传入"
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
	]
});
```

## 初始化参数
支持微信用户和社区用户，微信用户需要自己带入unionid，社区用户会自动读取用户信息

+ unionid:         `string` 微信unionid
+ type:            `string` 活动类型，通过活动统一接口获取
+ activityid:      `string` 活动id
+ activityAPI:	   `string` 活动提交信息接口API
+ $:               `string` jquery，可选，没有值时默认使用全局$, 也可以外部传入jquery
+ uid:             `string|number` 论坛用户uid，默认自动读取用户信息，一般不需要填写
+ html             `html`   显示在最外层页面
+ subTips          `string` 提交地址页顶部提示语
+ addTips          `string` 添加地址页顶部提示语
+ addrEditTips     `string` 修改地址页顶部提示语
+ choiceTips       `string` 选择地址列表页顶部提示语
+ editTips         `string` 修改地址列表页顶部提示语
+ tips             `string` 修改地址页信息底部提示语
+ subBtn           `string` 提交保存按钮文案
+ editBtn          `string` 修改保存按钮文案
+ addBtn           `string` 添加保存按钮文案
+ closeBtn		   `string` 返回按钮文案
+ delBtn		   `string` 删除地址文案
+ delTips		   `string` 确认删除提示语
+ cancle		   `string` 取消按钮提示语
+ delBtnYes		   `string` 确定删除按钮文案
+ listAddBtn	   `string` 新建地址按钮文案
+ listEditBtn	   `string` 修改地址按钮文案
+ list/attr:       `array` 需要验证的表单元素列表, 以下参数除placeholder外均依赖[validator](https://moekit.com/package/validator)组件的表单标签属性
	+ placeholer   `string`  表单占位符，表单无内容时显示
	+ required     `boolean` 默认为空，设置为true才算启用必填校验
	+ data-alt     `string` 表单验证失败的文案
	+ data-valid   `string` 表单校验类型，姓名相关请填realname
	+ 更多请参考validator的表单标签属性
+ structure        `object` 追加表单字段结构
	+ key值        `string` 对应表单字段名，用于接口提交
	+ value值      `object` showname显示值，data-alt异常显示文案
+ onVerifyError:   `function` 表单验证失败回调，带三个参数`name`, `dom`, `alt`
+ onVerifySuccess: `function` 表单验证通过回调,(默认自带提交资料到接口，一般不需要重写此方法)
+ formatValue:     `function` 提交资料的json数据格式化事件
+ onError:         `function` 提交资料成功回调
+ onSuccess:       `function` 提交资料失败回调
+ onClose:         `function` 返回按钮的回调事件
+ onSubmit:        `function` 提交按钮的回调事件
+ editJson:        `function` 外部修改提交的json

## 初始化参数的`list`下的`name`值介绍
+ `realname`     真实姓名
+ `qq`           QQ
+ `mobile`       手机号码
+ `provcity`     地区信息（省市区）
+ `addr`         详细街道
+ `zipcode`      邮编
+ `wechat`       微信号
+ `backupfield1` 备用字段1
+ `backupfield2` 备用字段2
+ `backupfield3` 备用字段3
+ 外部structrue追加

## 实例参数
+ params `object` 所有参数集合
	+ data `object` 内部表单元素内容
+ validator `instance` 表单组件的实例化对象[参数参考](https://moekit.com/package/validator)
+ submit `function` 提交资料到活动接口
+ open `function` 打开表单
+ close `function` 关闭表单
			
## 接口相关
http://common.office.bzdev.net/user/address_addr.doc

http://common.office.bzdev.net/user/address_addradmin.doc

http://huodong.office.bzdev.net/restful/activity/user.doc