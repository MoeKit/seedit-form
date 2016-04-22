'use strict';

require('./src/css/style.css');
var item = require('./src/tpl/item.tpl');
var index = require('./src/tpl/index.tpl');
var form = require('./src/tpl/form.tpl');
var box = require('./src/tpl/box.tpl');
var addrlist = require('./src/tpl/list.tpl');
var editlist = require('./src/tpl/edit.tpl');
var info = require('./src/tpl/info.tpl');
var Validator = require('validator');
var Config = require('seedit-config');
var District = require('seedit-district');
var $ = window.$ || window.jQuery;
var seeditForm = function(options){
	this.init(options);
	return this;
}
seeditForm.prototype.format = function(options){
	var _this = this;
	options = options || {};
	this.timestamp = new Date().getTime();
	this.params = {};
	this.params.id = 'JS_from_' + this.timestamp;
	// 初始化表单验证组件的参数配置
	this.params.validator = {};
	this.params.validator2 = {};
	this.params.validator.id = this.params.id;
	this.params.validator2.id = this.params.id + '_form';
	if( Object.prototype.toString.call(options.validator) === '[object Object]' ){
		for(var i in options.validator){
			this.params.validator[i] = options.validator[i];
		}
	}
	if( Object.prototype.toString.call(options.validator2) === '[object Object]' ){
		for(var i in options.validator2){
			this.params.validator2[i] = options.validator2[i];
		}
	}
	// 初始化省市区组件的参数配置
	this.params.district = {};
	this.params.district.input = '#JS_form_provcity_' + this.timestamp;
	this.params.district.cols = 3;
	if( Object.prototype.toString.call(options.district) === '[object Object]' ){
		for(var i in options.district){
			this.params.district[i] = options.district[i];
		}
	}
	// 外部引入$时，使用外部的$, 否则使用全局的$
	if( !!options.$ ){
		$ = options.$;
	}
	// 防止多次提交接口
	this.abled = true;
	// 当前信息列表aid
	this.params.aid  = '0';
	// 活动需要的额外信息
	this.params.list =       options.list || [];
	// 实际需要的地址信息
	this.params.addr =       options.addr || [];
	// 提交地址顶部提示语
	this.params.subTips =  options.subTips || '请确认您的收件信息';
	// 添加地址顶部提示语
	this.params.addTips =  options.addTips || '请填写您的收件信息';
	// 修改地址顶部提示语
	this.params.addrEditTips =  options.addrEditTips || '收件信息详情';
	// 地址信息下方提示语
	this.params.tips = 		 options.tips || '点击以上内容可以直接修改';
	// 提交保存按钮文案
	this.params.subBtn =     options.subBtn || '确认保存';
	// 修改保存按钮文案
	this.params.editBtn =     options.editBtn || '保存';
	// 添加保存按钮文案
	this.params.addBtn =     options.addBtn || '保存新地址';
	// 返回上一页面按钮文案
	this.params.closeBtn =     options.closeBtn || '返回';
	// 返回列表页按钮文案
	this.params.returnList =     options.closeBtn || '点击返回';
	// 信息列表页下方删除文案
	this.params.delBtn =      options.delBtn || '删除收件信息';
	// 删除弹出文字提示语
	this.params.delTips =      options.delTips || '是否将此地址删除';
	// 删除取消按钮文案
	this.params.cancle =     options.cancle || '暂不';
	// 删除确认按钮文案
	this.params.delBtnYes =      options.delBtnYes || '确定删除';
	// 地址选择页提示语
	this.params.choiceTips =  options.choiceTips || '点击以下内容，可快速选择收件信息';
	// 地址修改页提示语
	this.params.editTips =  options.editTips || '选择需要修改或删除的收件信息';
	// 新建地址按钮文案
	this.params.listAddBtn =  options.listAddBtn || '新建收件地址';
	// 编辑地址按钮文案
	this.params.listEditBtn =  options.listEditBtn || '编辑收件地址';
	// 论坛用户uid
	this.params.uid =        options.uid || '';
	// 微信用户unionid
	this.params.unionid =    options.unionid || '';
	this.params.apiurl  =    options.apiurl || {
		infoPost: Config.getSiteUrl('huodong') + '/restful/users/info.json',
		infoGet:  Config.getSiteUrl('huodong') + '/restful/users/info.json'
	};
	// 微信用户unionid
	this.params.multiple =   options.multiple || '信息提交中，请稍等';
	// 新版接口多了类型和活动id（例如：type=miyuezhuanwechat; activityid=567b68358cf43288478b4568）
	this.params.type =       options.type || '';
	this.params.activityid = options.activityid || '';
	this.params.activityAPI = options.activityAPI || Config.getSiteUrl('huodong') + '/restful/activity/user.json'; 
	this.btn = {};
	this.btn.submit = options.onSubmit || function(){
			if( !_this.params.type || !_this.params.activityid ){
				_this.close();
			} else {
				_this.validator.verify(function(){
					_this.submit();
				});
			}
	};
	this.btn.close = options.onClose || function(){
		_this.close();
	};
	// 程序异常回调
	this.onEventError =      options.onEventError || function(){
		
	};
	// 表单验证失败回调事件
	this.onVerifyError =     options.onVerifyError || function(type, input, alt){
		alert(alt);
	};
	// 表单验证成功回调事件
	this.onVerifySuccess =   options.onVerifySuccess || function(){
		_this.submit();
	};
	// 表单数据格式化事件
	this.params.formatValue = options.formatValue || function(json){
		return json;
	}
	// 提交信息异常回调事件
	this.onError = options.onError || function(data){
		alert(data.error_message);
	}
	// 提交信息成功回调事件
	this.onSuccess = options.onSuccess || function(data){
		alert("收件信息提交成功");
		_this.close();
	}
	/*
	 * 基本构造数据
	 * @params showname 表单左侧显示文案
	 * @params placeholder 输入框提示文案
	 * @params data-alt 验证失败文案
	 * @params data-valid 验证类型
	 */
	this.params.data = {
		'realname': {
			'showname': '真实姓名',
			'placeholder':'填写您的收件人姓名',
			'data-alt': '姓名不能为空哦~',
			'data-valid': 'realname'
		},
		'qq': {
			'showname': 'QQ',
			'placeholder':'填写您的QQ号码',
			'data-valid': 'number',
			'data-alt': 'QQ格式不对哦~'
		},
		'mobile': {
			'showname': '手机号码',
			'placeholder':'填写11位数字手机号码',
			'data-alt': '手机号码格式不对哦~',
			'data-valid': 'mobile'
		},
		'provcity': {
			'showname': '地区信息',
			'placeholder':'选择省、市、区',
			'data-alt': '地区信息不能为空~'
		},
		'addr': {
			'showname': '详细街道',
			'placeholder':'街道门牌信息',
			'data-alt': '详细街道不能为空哦~'
		},
		'zipcode': {
			'showname': '邮　　编',
			'placeholder':'填写区域邮编',
			'data-valid': 'zipcode',
			'data-alt': '邮编不能为空哦~'
		},
		'wechat': {
			'showname': '微信号',
			'placeholder':'填写您的微信号',
			'data-valid': 'wechat',
			'data-alt': '微信号格式不对哦~'
		},
		'backupfield1': {
			'showname': '备用字段1',
			'placeholder':'',
			'data-alt': '备用字段1不能为空哦~'
		},
		'backupfield2': {
			'showname': '备用字段2',
			'placeholder':'',
			'data-alt': '备用字段2不能为空哦~'
		},
		'backupfield3': {
			'showname': '备用字段3',
			'placeholder':'',
			'data-alt': '备用字段3不能为空哦~'
		}
	};
	if( Object.prototype.toString.call(options.structure) === '[object Object]' ){
		for(var i in options.structure){
			this.params.data[i] = options.structure[i];
		}
	}
	options = null;
	return this;
}
seeditForm.prototype._getAttr = function(type, data){
	// 获取参数值，没有就发返回空
	var val = Object.prototype.toString.call( data[type] ) !== '[object Undefined]' ? data[type] :
										(this.params.data[data.name][type] || '');
	val = !!val ? (type + '="' + val  + '"') : '';
	return val;
}
seeditForm.prototype.init = function(options){
	var _this=this;
	var a = ''
	this.format(options);
	this.loadDefaultAddr(2);
}
// 初始化表单验证引擎
seeditForm.prototype.valid = function(){
	var _this = this;
	this.validator = new Validator(this.params.validator).on('error', function(type, input, alt){
		_this.onVerifyError && _this.onVerifyError(type, input, alt);
	}).on('success', function(){
		_this.onVerifySuccess && _this.onVerifySuccess();
	});
	this.params.validator2.custom = {
			'realname':function(val,dom){
				return /^.{2,}$/.test(val);
			}
		}
	this.validator2 = new Validator(this.params.validator2).on('error', function(type, input, alt){
   		if (type == 'realname') {
   			var text = document.querySelector("#" + _this.params.id + "_form input[name='realname']").value;
   			if(text == ''){
	   			var tips = alt;
   			} else {
	   			var tips = '你的收件人姓名真的是'+ text + '吗？别骗我噢，写一个能找到你的名字吧~';
   			}
	   		alert(tips);
   		}else{
			_this.onVerifyError && _this.onVerifyError(type, input, alt);
		}
	}).on('success', function(){
		_this.onVerifySuccess && _this.onVerifySuccess();
	});
}

// 地址信息页按钮事件监听
seeditForm.prototype.formEvent = function(){
	var _this = this;
	try{
		// 确认修改地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-btn-edit'), function(){
			_this.validator2.verify(function(){
		 			_this.submit(2);	
		 	})
		});
		// 确认添加地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-btn-add'), function(){
			_this.validator2.verify(function(){
		 			_this.submit(2);	
		 	})
		});
		//  删除地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-btn-delet'), _this.btn.use || function(){
			_this.isdelet(_this.params.aid);
		});
		// 关闭页面按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-new-close'), function(){
				$('#'+ _this.params.id + '_form').parent().removeClass('active');
				_this.close();
		});
		// 返回选择地址列表按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-btn-return'), function(){
				$('#'+_this.params.id+'_form').parent().removeClass('active');
		});
		// 返回修改地址列表按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .personal-btn-return2'), function(){
				$('#'+_this.params.id+'_form').parent().removeClass('active');
		})
		setInterval(function(){
			if($('.picker-dialog').hasClass('modal-in')){
				setTimeout(function(){
					$('#' + _this.params.id + '_form input').not('input[name=provcity]').blur();
					// $('#' + _this.params.id + '_form').css('overflow','hide')
				},300)
			} else {
				$('#' + _this.params.id + '_form').css({'overflow-y':'scroll','-webkit-overflow-scrolling': 'touch'})
			}
		},500)
		} catch(err){
		_this.onEventError(err);
	}
}
// 初始化省市选择器
seeditForm.prototype.initDistrict = function(){
	if( !!this.provcity ){
		this.district = new District(this.params.district);
	}
}
seeditForm.prototype.loadEvent = function(){
	var _this = this;
	try{
		// 提交信息按钮
		__tap__(document.querySelector('#' + this.params.id + ' .personal-btn-sub'), _this.btn.submit || function(){
			if( !_this.params.type || !_this.params.activityid ){
				_this.close();
			} else {
				_this.validator.verify(function(){
					_this.submit();
				});
			}
		});
		// 关闭页面按钮
		__tap__(document.querySelector('#' + this.params.id + ' .personal-btn-close'), _this.btn.close || function(){
			_this.close();
		});
		// 默认地址详情
		__tap__(document.querySelector('#' + this.params.id + ' .user-info'), function(){
					$('#'+_this.params.id+'_list').parent().addClass('active');
		});
	} catch(err){
		_this.onEventError(err);
	}
}
// 地址列表页按钮事件监听
seeditForm.prototype.listEvent = function(){
	var _this = this;
	try{
		// 新建收件信息按钮
		__tap__(document.querySelector('#' + this.params.id + '_list .list-btn-add'), function(){
					_this.initHtml();
					_this.addAddrBtn();
					$('#' + _this.params.id +'_form').parent().addClass('active');
        });
		// 编辑收件地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_list .list-btn-edit'), function(){
				$('#' + _this.params.id +'_edit').parent().addClass('active')
		});
		// 修改地址按钮 
		$('.info-list-edit').each(function(){
			var j = $(this).attr('id');
			__tap__(document.querySelector('#' + j), function(){
				var aid = j.replace('JS_edi_','');
				_this.hasAddr(aid);
				setTimeout(function(){
					$('#' + _this.params.id +'_form').parent().addClass('active');

				},100)
			});

		})

		// 选择地址返回提交页
		$('.info-list-choice').each(function(){
			var j = $(this).attr('id');
			__tap__(document.querySelector('#' + j), function(){
				var aid = j.replace('JS_cho_','');
				_this.isdefault(aid)
			});

		})
		// 返回提交地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_list .list-btn-return'), function(){
				$('#' + _this.params.id +'_list').parent().removeClass('active')
		});
		// 返回选择地址按钮
		__tap__(document.querySelector('#' + this.params.id + '_edit .list-btn-return2'), function(){
				$('#' + _this.params.id +'_edit').parent().removeClass('active');
		});
	} catch(err){
		_this.onEventError(err);
	}
}
// 根据需要验证的列表，初始化对应的html
seeditForm.prototype.initHtml = function(data,num){
	try {
		var html='';
		var list = this.params.addr;
		var addr = {};
		if(!!data){
			 addr = eval(data);
			 addr['provcity'] = addr['prov'] + addr['city']+addr['ditrict'];
			 var c = addr['prov'] +'&&'+ addr['city']+ '&&'+addr['ditrict'];
		} else {
			addr = '';
			this.addAddrBtn();
		}
		this.params.aid = !!data ? data.aid : 0;
		for(var i=0; i<list.length; i++){
			// 存在字段的name值，才加入初始化的html
			if( !!list[i].name && !!this.params.data[list[i].name] ){
				var addrname = list[i].name;
				if( addrname === 'provcity' ){
					this.provcity = true;
					var provcityStr = c;
				}
				html += item.replace('{{timestamp}}',  this.timestamp || '' )
							.replace(/{{name}}/gi,     list[i]['name'] || '' )
							.replace('{{showname}}',   !!list[i].showname ? list[i].showname : this.params.data[list[i].name].showname || '' )
							.replace('{{placeholder}}',!!list[i].placeholder ? 'placeholder='+list[i].placeholder : this._getAttr('placeholder', list[i]) || '')
							.replace('{{value}}',      !!addr[addrname] ? addr[addrname] : '' )
							.replace('{{required}}',   !!list[i].required ? 'required ' : '' )
							.replace('{{data-string}}',provcityStr ||'')
							.replace('{{data-valid}}', this._getAttr('data-valid', list[i]) || '' )
							.replace('{{pattern}}',    this._getAttr('pattern', list[i]) || '' )
							.replace('{{min}}',        this._getAttr('min', list[i]) || '' )
							.replace('{{max}}',        this._getAttr('max', list[i]) || '' )
							.replace('{{data-alt}}',   this._getAttr('data-alt', list[i]) || '' );
			} else {
				list.splice(i,1);
				i--;
			}
		}
		var box2 = form.replace('{{body}}',   html)
				 .replace('{{id}}',     	this.params.id + '_form'|| '' )
				 .replace('{{addTips}}',       this.params.addTips || '' )
				 .replace('{{editTips}}',    this.params.addrEditTips || '' )
				 .replace('{{tips}}',     this.params.tips || '' )
				 .replace('{{editBtn}}',      this.params.editBtn || '' )
				 .replace('{{addBtn}}',     this.params.addBtn || '' )
				 .replace(/{{returnList}}/gi,     this.params.returnList || '' )
				 .replace('{{colBtn}}',  this.params.closeBtn || '')
				 .replace('{{delBtn}}',  this.params.delBtn || '' )
				 .replace('{{delTips}}',   this.params.delTips || '' )
				 .replace('{{cancle}}',     this.params.cancle || '' )
				 .replace('{{delBtnYes}}', this.params.delBtnYes || '');
		if(!!num){
			var list1 = index.replace('{{box}}', "<div class='list-container' id='"+this.params.id + "_list'></div>");
			var list2 = index.replace('{{box}}', "<div class='list-container' id='"+this.params.id + "_edit'></div>");
			var con1 = index.replace('{{box}}', "<div id='"+this.params.id + "'></div>");
			var con2 = index.replace('{{box}}', box2);
			$("body").append(con1).append(list1).append(list2).append(con2);
			$('#' + this.params.id + '_form').parent().css('z-index:999');
		}else{
			$('.picker-dialog,.picker-mask').remove();
			$('#' + this.params.id + '_form').replaceWith(box2);
		}
		this.valid();
		this.formEvent();
		this.initDistrict();
	} catch(err){
		this.onEventError(err);
	}
	return this;
}
// 读取默认用户地址
seeditForm.prototype.defaultAddr = function(data,num){
	this.params.json=data;
	try {
		var text = '';
		var list = this.params.list;
		var addr = {};
		var html = '';
		this.params.aid = !!data ? data.aid : 0;
		for(var i=0; i<list.length; i++){
			// 存在字段的name值，才加入初始化的html
			if( !!list[i].name && !!this.params.data[list[i].name] ){
				var addrname = list[i].name;
				if( addrname === 'provcity' ){
					this.provcity = true;
				}
				html += item.replace('{{timestamp}}',  this.timestamp || '' )
							.replace(/{{name}}/gi,     list[i]['name'] || '' )
							.replace('{{showname}}',   !!list[i].showname ? list[i].showname : this.params.data[list[i].name].showname || '' )
							.replace('{{placeholder}}',!!addr[addrname] ? '' : this._getAttr('placeholder', list[i]) || '')
							.replace('{{value}}',      !!addr[addrname] ? addr[addrname] : '' )
							.replace('{{required}}',   !!list[i].required ? 'required ' : '' )
							.replace('{{data-string}}','')
							.replace('{{data-valid}}', this._getAttr('data-valid', list[i]) || '' )
							.replace('{{pattern}}',    this._getAttr('pattern', list[i]) || '' )
							.replace('{{min}}',        this._getAttr('min', list[i]) || '' )
							.replace('{{max}}',        this._getAttr('max', list[i]) || '' )
							.replace('{{data-alt}}',   this._getAttr('data-alt', list[i]) || '' );
			} else {
				list.splice(i,1);
				i--;
			}
		}
		var box1 = box.replace('{{body}}',   html)
					.replace('{{realname}}', '收件人：' + data['realname'] || '')
					.replace('{{defid}}',   data['aid'] )
					.replace('{{mobile}}',     data['mobile'] || '')
					.replace('{{prov}}',       data['prov']+' ' || '')
					.replace('{{city}}',       data['city']+' ' || '')
					.replace('{{ditrict}}',    data['ditrict']+' ' || '')
					.replace('{{addr}}',       data['addr'] || '')
					.replace('{{infoid}}',       data['aid'] || '')
				 	.replace('{{id}}',     	this.params.id || '' )
				 	.replace('{{subTips}}', 	    this.params.subTips || '' )
					 .replace('{{tips}}',     this.params.tips || '' )
					 .replace('{{subBtn}}',      this.params.subBtn || '' )
					 .replace('{{closeBtn}}',    this.params.closeBtn|| '' );
		if(!!num){	
			var list1 = index.replace('{{box}}', "<div class='list-container' id='"+this.params.id + "_list'></div>");
			var list2 = index.replace('{{box}}', "<div class='list-container' id='"+this.params.id + "_edit'></div>");
			var con1 = index.replace('{{box}}', box1);
			var con2 = index.replace('{{box}}', "<div id='"+this.params.id + "_form'></div>");
			$("body").append(con1).append(list1).append(list2).append(con2);
		}else{
			$('#' + this.params.id).replaceWith(box1);
		}
		this.valid();
		this.loadEvent();
		this.initDistrict();
	} catch(err){
		this.onEventError(err);
	}
	return this;
}
// 提交地址信息 
// 参数为1提交到活动用户
// 参数为2提交到地址管理
seeditForm.prototype.submit = function(num){
	var _this = this;
	var json = {};
	// 获取验证列表的值，并合成数组数据
	if(!!num){
		for(var i=0; i<this.params.addr.length; i++){
			if( this.params.addr[i].name === 'provcity' ){
			var provc = document.querySelector('#' + this.params.id + '_form input[name="' + this.params.addr[i].name + '"]').getAttribute('data-string') || '';
			provc = !!provc ? provc.split(/&&|\$\$/g) : [];
			json.prov = provc[0] || '';
			json.city = provc[1] || '';
			json.ditrict= provc[2] || '';
			} else json[ this.params.addr[i].name ] = document.querySelector('#' + this.params.id + '_form input[name="' + this.params.addr[i].name + '"]').value;
		}
		json.aid = this.params.aid;
		json.is_default = '1';
	} else {
		json=this.params.json;
		for(var i=0; i<this.params.list.length; i++){
	 		if( this.params.list[i].name === 'provcity' ){
				var provc = document.querySelector('#' + this.params.id + ' input[name="' + this.params.list[i].name + '"]').getAttribute('data-string') || '';
	 			provc = !!provc ? provc.split(/&&|\$\$/g) : [];
	 			json.prov = provc[0] || '';
	 			json.city = provc[1] || '';
	 			json.ditrict= provc[2] || '';
	 		} else json[ this.params.list[i].name ] = document.querySelector('#' + this.params.id + ' input[name="' + this.params.list[i].name + '"]').value;
		 }
	}
	// 格式化数据
	json = this.params.formatValue(json);
	if( !!this.params.unionid )    json.unionid = this.params.unionid;
	if( !!this.params.type )       json.type = this.params.type;
	if( !!this.params.activityid ) json.activityid = this.params.activityid;
	if( !!this.params.uid )        json.uid = this.params.uid;
	// 保证提交的信息是json格式
	if( Object.prototype.toString.call(json) !== '[object Object]' ){
		console && console.error('提交表单的数据格式必须是json格式：', json);
		return false;
	}
	// 防止多次点击提交接口
	if( !this.abled ){
		alert( this.params.multiple );
		return false;
	}
	_this.abeld = false;
	if(!!num){
		_this.addrSub(json);
	} else{
		_this.activitySub(json);
	}
}
// 活动地址提交
seeditForm.prototype.activitySub = function(data){
	var _this = this;
	$.ajax({
		type: 'POST',
		url: _this.params.activityAPI,
		data: data,
		xhrFields: {
			withCredentials: true
		},
		success: function(data){
			if( data.error_code == 0 ){
				_this.onSuccess(data);
			} else {
				_this.onError(data);
			}
			_this.abeld = true;
		},
		error: function(){
			_this.abeld = true;
		}
	})
}
// 地址修改提交
seeditForm.prototype.addrSub = function(data){
	var _this = this;
	$.ajax({
		type: 'POST',
		url: Config.getSiteUrl('common') + '/user/address_addradmin.json',
		data: data,
		xhrFields: {
			withCredentials: true
		},
		success: function(data){
			if( data.error_code == 0 ){
				_this.loadDefaultAddr();
			} else {
				_this.onError(data);
			}
			$('#'+ _this.params.id + '_edit').parent().removeClass('active');
			$('#'+ _this.params.id + '_list').parent().removeClass('active');
			$('#'+ _this.params.id + '_form').parent().removeClass('active');
			if(!$('#'+ _this.params.id).parent().hasClass('active')){
				$('#'+ _this.params.id).parent().addClass('active');
			}
			_this.abeld = true;
		},
		error: function(){
			_this.abeld = true;
		}
	})
}
// 地址设置默认并提交数据
seeditForm.prototype.isdefault = function(aid){
    var _this=this;
    try{
		$.ajax({
				type:'POST',
  				url:Config.getSiteUrl('common') + '/user/address_addr.json',
  				data:{
  					aid:aid,
  					unionid:_this.params.unionid,
  					__method:'PUT'
  				},
  				xhrFields:{
  					withCredentials:true
  				},
  				success:function(data){
  					if(data.error_code == 0 && data.data.data.rs == 1){
  						_this.loadDefaultAddr();
						$('#' + _this.params.id + '_list').parent().removeClass('active');
  					} else {
  					console.log('设置默认地址失败');
  					}
  				}
			})
    }catch(err){
		_this.onEventError(err);
  	}
 	return this
}
// 读取用户地址列表
// 存在num，列表更新显示，否则只更新不显示
seeditForm.prototype.userAddrList = function(num){
	var _this = this;
	try{
		$.ajax({
			type:'GET',
			url:Config.getSiteUrl('common') + '/user/address_addradmin.json',
			data:'unionid='+ this.params.unionid,
			xhrFields:{
				withCredentials:true
			},
			success:function(data){
				if(data.error_code == 0 ){
					_this.addrList(data.data.data,num);
				}
				_this.listEvent();
			}
		})

	} catch(err) {
		_this.onEventError(err)
	}
	return this;
}
// 读取用户地址列表
seeditForm.prototype.addrList = function(data,num){
	var _this = this;
	try{
		var html = '';
		var addr = '';
		var edit = '';
		var isdefault = ''
		var ischoice = ''
		if(!!data.length){
			for(var i=0;i<data.length;i++){
				if(i == 0){
					isdefault = '(默认)';
					ischoice='';
				} else{
					isdefault ='';
					ischoice=' ischoice';
				}
				html+=info.replace(/{{realname}}/g, data[i]['realname'] || '')
				.replace(/{{isdefault}}/g,  isdefault || '')
				.replace(/{{ischoice}}/g,  ischoice || '')
				.replace(/{{mobile}}/g,     data[i]['mobile'] || '')
				.replace(/{{prov}}/g,       data[i]['prov']+' ' || '')
				.replace(/{{city}}/g,       data[i]['city']+' ' || '')
				.replace(/{{ditrict}}/g,    data[i]['ditrict']+' ' || '')
				.replace(/{{addr}}/g,       data[i]['addr'] || '')
				.replace(/{{infoid}}/g,       data[i]['aid'] || '');
			}
				$('#'+_this.params.id + '_form').parent().removeClass('active');
		} else if(!!num){
			_this.newAddrBtn()
				$('#'+this.params.id + '_form').parent().addClass('active');
				$('#'+this.params.id + '_list').parent().removeClass('active');
				$('#'+this.params.id + '_edit').parent().removeClass('active');
		}
		addr = addrlist.replace('{{body}}',   html)
				 .replace('{{listid}}',     this.params.id + '_list' || '' )
				 .replace('{{choiceTips}}', this.params.choiceTips || '')
				 .replace('{{listAddBtn}}',    this.params.listAddBtn || '' )
				 .replace('{{listEditBtn}}',    this.params.listEditBtn || '' )
				 .replace(/{{closeBtn}}/gi,    this.params.closeBtn || '' );
		edit = editlist.replace('{{body}}',   html)
				 .replace('{{editlistid}}',     this.params.id + '_edit' || '' )
				 .replace('{{editTips}}',this.params.editTips || '')
				 .replace(/{{closeBtn}}/gi,    this.params.closeBtn || '' );
		$('#' + this.params.id + '_list').replaceWith(addr);
		$('#' + this.params.id + '_edit').replaceWith(edit);
		$('#' + this.params.id + '_list .info-list-edit').remove();
		$('#' + this.params.id + '_edit .info-list-choice').remove();
	} catch(err){
		_this.onEventError(err)
	}
	return this;
}
// 读取详细地址
seeditForm.prototype.hasAddr = function(aid,num){
	var _this = this;
	try{
		$.ajax({
				type: 'POST',
				url: Config.getSiteUrl('common') + '/user/address_addradmin.json',
				data: {
					aid: aid,
					__method:'PUT'
				},
				xhrFields:{
					withCredentials:true
				},
				success:function(data){
					if(data.error_code == 0 && data.data.data !=''){
						_this.initHtml(data.data.data);
					} else {
						_this.initHtml();
					}
					_this.editAddrBtn();
				}
			})
	} catch(err) {
		_this.onEventError(err);
	}
	return this;
}
seeditForm.prototype.isdelet = function(aid){
	var _this = this;
	$('.opacity-bg').removeClass('hide');
	$('.personal-delet-confirm').removeClass('hide');
	try{
		// 确认删除按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .delet-btn-yes'), function(){
			_this.deletAddr(aid);	
        });
		// 取消按钮
		__tap__(document.querySelector('#' + this.params.id + '_form .delet-btn-no'), function(){
			$('.opacity-bg').addClass('hide');
			$('.personal-delet-confirm').addClass('hide');
		});	
	} catch(err){
		_this.onEventError(err);
	}
}
// 删除当前地址
seeditForm.prototype.deletAddr = function(aid){
	var _this = this;
	try{
		$.ajax({
			type:'POST',
			url:Config.getSiteUrl('common') + '/user/address_addradmin.json',
			data:{
				aid:aid,
				__method:'DELETE'
			},
			xhrFields:{
				withCredentials:true
			},
			success:function(data){
				if(data.error_code == 0 && data.data.data.rs == 1){
					alert('删除成功');
				}
				$('.opacity-bg').addClass('hide');
				$('.personal-delet-confirm').addClass('hide');
				_this.loadDefaultAddr();
				_this.userAddrList(2);
			}
		})
	} catch(err) {
		_this.onEventError(err)
	}
	return this;
}
// 读取默认地址
seeditForm.prototype.loadDefaultAddr = function(num){

	var _this = this;
	var a='';
	try{
		$.ajax({
		type: 'GET',
		url: Config.getSiteUrl('common') + '/user/address_addr.json',
		data:'unionid=' + _this.params.unionid,
		xhrFields: {
			withCredentials: true
		},
		success: function(data){
			if( data.error_code == 0 && data.data.data !='' )
			{
				_this.defaultAddr(data.data.data,num);
			} else {
				_this.initHtml(a,num);
				_this.newAddrBtn();
			}
			_this.userAddrList();
			}
		});
	} catch(err){
		_this.onEventError(err)
	}
	return this;
}
// 按钮及提示信息的隐藏&显示
seeditForm.prototype.open = function(){
	//$('html, body').addClass('contraction-active');
		if(this.params.aid != 0){
				$('#'+ this.params.id).parent().addClass('active');
		} else {
				$('#'+ this.params.id).parent().addClass('active');
				$('#' + this.params.id +'_form').parent().addClass('active');
		}
}
seeditForm.prototype.close = function(){
	//$('html, body').removeClass('contraction-active');
		$('#'+this.params.id).parent().removeClass('active');
}
seeditForm.prototype.newAddrBtn = function(){
	$('.personal-info-add').removeClass('hide');
	$('.personal-info-edit').addClass('hide');
	$('.personal-info-tips2').addClass('hide');
	$('.personal-btn-edit').addClass('hide');
	$('.personal-btn-add').removeClass('hide');
	$('.personal-btn-return2').addClass('hide');
	$('.personal-new-close').removeClass('hide');
	$('.personal-btn-return').addClass('hide');
	$('.personal-btn-delet').addClass('hide');
}
seeditForm.prototype.addAddrBtn = function(){
	$('.personal-info-add').removeClass('hide');
	$('.personal-info-edit').addClass('hide');
	$('.personal-info-tips2').addClass('hide');
	$('.personal-btn-edit').addClass('hide');
	$('.personal-btn-add').removeClass('hide');
	$('.personal-btn-return2').addClass('hide');
	$('.personal-btn-return').removeClass('hide');
	$('.personal-new-close').addClass('hide');
	$('.personal-btn-delet').addClass('hide');
}
seeditForm.prototype.editAddrBtn = function(){
	$('.personal-info-add').addClass('hide');
	$('.personal-info-edit').removeClass('hide');
	$('.personal-info-tips2').removeClass('hide');
	$('.personal-btn-edit').removeClass('hide');
	$('.personal-btn-add').addClass('hide');
	$('.personal-btn-return2').removeClass('hide');
	$('.personal-new-close').addClass('hide');
	$('.personal-btn-return').addClass('hide');
	$('.personal-btn-delet').removeClass('hide');
}
module.exports = seeditForm;
