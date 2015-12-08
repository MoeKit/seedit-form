'use strict';

require('./src/css/style.css');
var box = require('./src/tpl/index.tpl');
var item = require('./src/tpl/item.tpl');
var Validator = require('validator');
var Config = require('seedit-config');
var District = require('seedit-district');

var seeditForm = function(options){
	this.init(options);
	return this;
}
seeditForm.prototype.format = function(options){
	var _this = this;
	options = options || {};
	this.timestamp = new Date().getTime();
	this.params = {};
	this.params.id = 'JS_from_' + new Date().getTime();
	// 初始化表单验证组件的参数配置
	this.params.validator = {};
	this.params.validator.id = this.params.id;
	if( Object.prototype.toString.call(options.validator) === '[object Object]' ){
		for(var i in options.validator){
			this.params.validator[i] = options.validator[i];
		}
	}
	// 初始化省市区组件的参数配置
	this.params.district = {};
	this.params.district.input = '#JS_form_provcity_' + this.timestamp;
	this.params.district.cols = 2;
	if( Object.prototype.toString.call(options.district) === '[object Object]' ){
		for(var i in options.district){
			this.params.district[i] = options.district[i];
		}
	}
	// 防止多次提交接口
	this.abled = true;
	// 是否读取数据
	this.params.read =    options.read === true ? true : false;
	// 实际需要的验证列表
	this.params.list =    options.list || [];
	// 顶部提示语
	this.params.title =   options.title || '请正确填写你的个人资料,活动结束后会有客服与你联系~';
	// 提交按钮文案
	this.params.submit =  options.submit || '提交';
	// 关闭按钮文案
	this.params.close =   options.close || '返回';
	// 论坛用户uid
	this.params.uid =     options.uid || '';
	// 微信用户unionid
	this.params.unionid = options.unionid || '';
	this.params.multiple = options.unionid || '信息提交中，请稍等';
	// 表单验证失败回调事件
	this.onVerifyError = options.onVerifyError || function(type, input, alt){
		alert(alt);
	};
	// 表单验证成功回调事件
	this.onVerifySuccess = options.onVerifySuccess || function(){
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
	 * @params data-alt 验证失败文案
	 * @params data-valid 验证类型
	 */
	this.params.data = {
		'realname': {
			'showname': '姓　　名',
			'data-alt': '姓名不能为空哦~'
		},
		'mobile': {
			'showname': '手机号码',
			'data-alt': '手机号码格式不对哦~',
			'data-valid': 'mobile'
		},
		'provcity': {
			'showname': '地区信息',
			'data-alt': '省不能为空~'
		},
		'addr': {
			'showname': '详细地址',
			'data-alt': '详细地址不能为空哦~'
		},
		'zipcode': {
			'showname': '邮　　编',
			'data-valid': 'zipcode',
			'data-alt': '邮编不能为空哦~'
		},
		'qq': {
			'showname': 'Q　 　Q',
			'data-valid': 'number',
			'data-alt': 'QQ格式不对哦~'
		},
		'weixinhao': {
			'showname': '微<i></i>信<i></i>号',
			'data-valid': 'wechatid',
			'data-alt': '微信号格式不对哦~'
		},
		'backupfield1': {
			'showname': '备用字段1',
			'data-alt': '备用字段1不能为空哦~'
		},
		'backupfield2': {
			'showname': '备用字段2',
			'data-alt': '备用字段2不能为空哦~'
		},
		'backupfield3': {
			'showname': '备用字段3',
			'data-alt': '备用字段3不能为空哦~'
		}
	};
	options = null;
	return this;
}
seeditForm.prototype.init = function(options){
	this.format(options);
	this.initHtml();
	document.querySelector('body').innerHTML = document.querySelector('body').innerHTML + box;
	this.valid();
	this.event();
	this.initDistrict();
	this.readApi();
}
seeditForm.prototype._getAttr = function(type, data){
	// 获取参数值，没有就发返回空
	var val = Object.prototype.toString.call( data[type] ) !== '[object Undefined]' ? data[type] :
										(this.params.data[data.name][type] || '');
	val = !!val ? (type + '="' + val  + '"') : '';
	return val;
}
// 根据需要验证的列表，初始化对应的html
seeditForm.prototype.initHtml = function(){
	var list = this.params.list;
	var html = '';
	for(var i=0; i<list.length; i++){
		// 存在字段的name值，才加入初始化的html
		if( !!list[i].name && !!this.params.data[list[i].name] ){
			if( list[i].name === 'provcity' ){
				this.provcity = true;
			}
			list[i]['showname'] =   !!list[i].showname ? list[i].showname : this.params.data[list[i].name].showname;
			list[i]['required'] =   !!list[i].required ? 'required' : '';
			list[i]['data-valid'] = this._getAttr('data-valid', list[i]);
			list[i]['data-alt'] =   this._getAttr('data-alt', list[i]);
			list[i]['pattern'] =    this._getAttr('pattern', list[i]);
			list[i]['min'] =        this._getAttr('min', list[i]);
			list[i]['max'] =        this._getAttr('max', list[i]);
			html += item.replace('{{timestamp}}',  this.timestamp || '' )
						.replace(/{{name}}/gi,     list[i]['name'] || '' )
						.replace('{{showname}}',   list[i]['showname'] || '' )
						.replace('{{value}}',      list[i]['value'] || '' )
						.replace('{{required}}',   list[i]['required'] || '' )
						.replace('{{data-valid}}', list[i]['data-valid'] || '' )
						.replace('{{pattern}}',    list[i]['pattern'] || '' )
						.replace('{{min}}',        list[i]['min'] || '' )
						.replace('{{max}}',        list[i]['max'] || '' )
						.replace('{{data-alt}}',   list[i]['data-alt'] || '' );
		} else {
			list.splice(i,1);
			i--;
		}
	}
	box = box.replace('{{body}}',   html)
			 .replace('{{id}}',     this.params.id || '' )
			 .replace('{{title}}',  this.params.title || '' )
			 .replace('{{submit}}', this.params.submit || '' )
			 .replace('{{close}}',  this.params.close || '' );
	return this;
}
// 初始化表单验证引擎
seeditForm.prototype.valid = function(){
	var _this = this;
	this.validator = new Validator(this.params.validator).on('error', function(type, input, alt){
		_this.onVerifyError && _this.onVerifyError(type, input, alt);
	}).on('success', function(){
		_this.onVerifySuccess && _this.onVerifySuccess();
	});
}
// 表单按钮事件监听
seeditForm.prototype.event = function(){
	var _this = this;
	// 提交信息按钮
	document.querySelector('#' + this.params.id + ' .personal-info-btn').addEventListener('click', function(){
		_this.validator.verify(function(){
			_this.submit();
		});
	}, false);
	// 关闭返回按钮
	document.querySelector('#' + this.params.id + ' .personal-info-btn-return').addEventListener('click', function(){
		_this.close();
	}, false);
}
// 初始化省市选择器
seeditForm.prototype.initDistrict = function(){
	if( !!this.provcity ){
		console.log( new District(this.params.district) );
	}
}
// 提交信息事件
seeditForm.prototype.submit = function(){
	var _this = this;
	var json = {};
	// 获取验证列表的值，并合成数组数据
	for(var i=0; i<this.params.list.length; i++){
		if( this.params.list[i].name === 'provcity' ){
			var provc = document.querySelector('#' + this.params.id + ' input[name="' + this.params.list[i].name + '"]').getAttribute('data-string') || '';
			provc = !!provc ? provc.split(/&&|\$\$/g) : [];
			json.prov = provc[0] || '';
			json.city = provc[1] || '';
		} else json[ this.params.list[i].name ] = document.querySelector('#' + this.params.id + ' input[name="' + this.params.list[i].name + '"]').value;
	}
	// 格式化数据
	json = this.params.formatValue(json);
	if( !!this.params.unionid ) json.unionid = this.params.unionid;
	if( !!this.params.uid ) json.uid = this.params.uid;
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
	$.ajax({
		type: 'POST',
		url: Config.getSiteUrl('huodong') + '/restful/users/operate.json',
		data: json,
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
seeditForm.prototype.close = function(){
	$('html, body').removeClass('contraction-active');
	$(this.validator.dom).removeClass('active');	
}
seeditForm.prototype.open = function(){
	$('html, body').addClass('contraction-active');
	$(this.validator.dom).addClass('active');
}
seeditForm.prototype.readApi = function(){
	var _this = this;
	if( this.params.read ){
		var json = {};
		if( this.params.unionid ) json.unionid = this.params.unionid;
		$.ajax({
			type: 'GET',
			url: Config.getSiteUrl('huodong') + '/restful/users/operate.json',
			data: json,
			xhrFields: {
				withCredentials: true
			},
			success: function(data){
				console.log( _this.params );
				if( data.error_code == 0 ){
					for(var i in _this.params.data){
						console.log( document.querySelector('#JS_form_' + i + '_' + _this.timestamp) );
						if( i == 'provcity' ){
							document.querySelector('#JS_form_' + i + '_' + _this.timestamp).value = data.data['prov'] + data.data['city'];
						} else if( document.querySelector('#JS_form_' + i + '_' + _this.timestamp ) ){
							document.querySelector('#JS_form_' + i + '_' + _this.timestamp).value = data.data[i];
						}
					}
				} else {

				}
			},
			error: function(){
			}
		});
	}
}
module.exports = seeditForm;
