var level=0;
var path='viz://';
var search='';

var ltmp_arr={
	none:'<div class="none"><em>Ничего не найдено.</em></div>',
	account_settings:'<a data-href="fsp:account_settings">[настройки]</a>',
	account_settings_caption:'Настройки аккаунта',

	search:'<a data-href="fsp:search">[поиск]</a>',
	search_caption:'Поиск',
};
function app_mouse(e){
	if(!e)e=window.event;
	var target=e.target || e.srcElement;
	if(typeof $(target).attr('data-href') != 'undefined'){
		var href=$(target).attr('data-href');
		/*//change menu element state
		if($(target).hasClass('menu-el')){
			if('none'==$('.menu-list').css('float')){
				$('.menu-list').css('display','none');
			}
		}
		*/
		view_path(href,{},true,false);
		e.preventDefault();
	}
	if($(target).hasClass('back-action')){
		$('.loader').css('display','block');
		$('.view').css('display','none');

		if(0<$('.view[data-level="'+level+'"]').length){
			$('.view[data-level="'+level+'"]').remove();
		}

		level--;
		path='viz://';
		search='';
		//search prev level props
		if(0<$('.view[data-level="'+level+'"]').length){
			if(typeof $('.view[data-level="'+level+'"]').data('path') != 'undefined'){
				path=$('.view[data-level="'+level+'"]').data('path');
			}
			if(typeof $('.view[data-level="'+level+'"]').data('search') != 'undefined'){
				search=$('.view[data-level="'+level+'"]').data('search');
			}
		}
		//trigger view_path with update prop
		view_path(path,{},true,true);
	}
	/*
	//button to scroll top, need to show it for long views on scrolling more that 100hv?
	if($(target).hasClass('go-top')){
		$(window)[0].scrollTo({behavior:'smooth',top:0});
	}
	*/
}

function view_account_settings(view,path_parts,title){
	document.title=ltmp_arr.account_settings_caption+' - '+title;
	view.find('.header .caption').html(ltmp_arr.account_settings_caption);
	$('.loader').css('display','none');
	view.css('display','block');
}

function view_search(view,path_parts,title){
	document.title=ltmp_arr.search_caption+' - '+title;
	view.find('.header .caption').html(ltmp_arr.search_caption);
	view.find('input[name=search]').val('');
	$('.loader').css('display','none');
	view.css('display','block');
	//focus working only after parent block is show up
	view.find('input[name=search]')[0].focus();
}

function app_keyboard(e){
	if(!e)e=window.event;
	var key=(e.charCode)?e.charCode:((e.keyCode)?e.keyCode:((e.which)?e.which:0));
	let char=String.fromCharCode(key);
	//console.log(key,char);
	/*
	if(key==27){
		e.preventDefault();
	}
	*/
}

function parse_fullpath(){
	let fullpath=window.location.hash.substr(1);
	path='';
	search='';
	if(-1==fullpath.indexOf('?')){
		path=fullpath;
	}
	else{
		path=fullpath.substring(0,fullpath.indexOf('?'));
		search=fullpath.substring(fullpath.indexOf('?')+1);
	}
	if(''==path){
		path='viz://';
	}
}

function view_path(location,state,save_state,update){
	//save to history browser
	save_state=typeof save_state==='undefined'?false:save_state;
	//update current level?
	update=typeof update==='undefined'?false:update;
	var path_parts=[];
	var title='Free Speech Project';

	if(typeof state.path == 'undefined'){
		if(-1!=location.indexOf('viz://')){
			path_parts=location.substr(location.indexOf('viz://')+6).split('/');
		}
		else{
			path_parts=location.split('/');
		}
	}
	else{
		path_parts=state.path;
	}

	//work with path_parts, form new view or update current
	//clearTimeout(update_dgp_timer);
	//$('.view').css('display','none');

	if(save_state){
		history.pushState({path,title},'','#'+location);
	}

	document.title=title;

	console.log('location: '+location,path_parts,'search: '+search);

	if(''==path_parts[0]){
		$('.loader').css('display','block');
		$('.view').css('display','none');
		let view=$('.view[data-level="0"]');
		let header='';
		header+=ltmp_arr.account_settings;
		header+=ltmp_arr.search;
		view.find('.header').html(header);
		view.find('.objects').html(ltmp_arr.none);
		level=0;
		$('.loader').css('display','none');
		view.css('display','block');
	}
	else{
		if(0==path_parts[0].indexOf('fsp:')){
			$('.loader').css('display','block');
			$('.view').css('display','none');
			let view=$('.view[data-path="'+path_parts[0]+'"]');
			level++;
			//view.data('level',level);
			//execute view_ function if exist to prepare page (load vars to input)
			let current_view=path_parts[0].substring(('fsp:').length);
			if(typeof window['view_'+current_view] === 'function'){
				setTimeout(window['view_'+current_view],1,view,path_parts,title);
			}
			else{
				$('.loader').css('display','none');
				view.css('display','block');
			}
		}
	}
	/*
	if(''!=location){
		if($('.view[data-path="'+location+'"]').length>0){
			$('.view[data-path="'+location+'"]')[0].scrollIntoView({behavior:'smooth',block:'start'});
		}
	}
	else{
		$(window)[0].scrollTo({behavior:'smooth',top:0});
	}*/
}

function escape_html(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g,function(m){return map[m];});
}

$(window).on('hashchange',function(e){
	e.preventDefault();
	parse_fullpath();
	view_path(path,{},true,false);
});

parse_fullpath();
view_path(path,{},false,false);

document.addEventListener('click',app_mouse,false);
document.addEventListener('tap',app_mouse,false);
document.addEventListener('keyup',app_keyboard,false);