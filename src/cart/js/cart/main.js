
import Requester from './_requester';
import Scrollbar from './_scrollbar';
import Calendar from './_calendar';
import Content from './_content';

const $WINDOW = $(window);
const $DOCUMENT = $(document);

function Cart(args){

	const SCOPE = this;

	SCOPE.option = args || {
		scope: '#CartName',
		ui: {
			button: {
				scope: '#CartUI',
				menu: {
					name: '#CartMenu',
					dom: function(opt){
						let id = opt.ui.button.menu.name.substr(1);
						return [
							'<div id="'+id+'" class="button">',
							'	<span class="icon"></span>',
							'	<span class="skip">메뉴 is 뭔들</span>',
							'</div>'
						].join('')
					},
					event: {
						name: 'click.CartMenu',
						target: '#CartMenu'
					}
				},
				add: {
					name: '#CartAdding',
					dom: function(opt){
						let id = opt.ui.button.add.name.substr(1);
						return [
							'<div id="'+id+'" class="button">',
							'	<span class="icon"></span>',
							'	<span class="skip">추가 is 뭔들</span>',
							'</div>'
						].join('')
					}
				},
				search: {
					name: '#CartSearch',
					dom: function(opt){
						let id = opt.ui.button.search.name.substr(1);
						return [
							'<div id="'+id+'" class="button">',
							'	<span class="icon"></span>',
							'	<span class="skip">검색 is 뭔들</span>',
							'</div>'
						].join('')
					}
				}
			},
			calendar: {
				scope: '#CartCalendar',
				control: {
					name: '#CartControl',
					dom: function(opt){
						let id = opt.ui.calendar.control.name.substr(1);
						let month = opt.data.month;
						let year = opt.data.year;
						return [
							'<div id="'+id+'">',
							'	<button class="prev" data-calendar="prev" type="button"><span class="skip">'+(month-1)+'월 일정</span></button>',
							'	<span class="month">'+year+'년 '+month+' 월</span>',
							'	<button class="next" data-calendar="next" type="button"><span class="skip">'+(month+1)+'월 일정</span></button>',
							'</div>'
						].join('');
					},
					event: {
						name: 'click.CartControl',
						target: '#CartControl button'
					}
				},
				category: {
					name : '#CartCategory',
					dom : function(opt){
						let id = opt.ui.calendar.category.name.substr(1);
						return '<div id="'+id+'"></div>';
					},
					event: {
						name: 'click.CartCategory',
						target: '#CartCategory label'
					}
				},
				body: {
					name: '#CartBody',
					dom: function(opt){
						let id = opt.ui.calendar.body.name.substr(1);
						return '<table id="'+id+'"></table>'
					}
				}
			}
		},
		category: {
			account: null,
			jqxhr: function(opt){
				return $.get('/cart/data/category.json?account='+opt.category.account);
			},
			response: null
		},
		data: {
			year: new Date().getFullYear(),
			month: new Date().getMonth()+1,
			day: new Date().getDate(),
			param: function(opt){
				return {
					date: opt.data.year+''+(opt.data.month<10?'0'+opt.data.month:opt.data.month),
					category: function(){
						let result = '{';

						for(let objectKey in opt.category.response){
							result += (objectKey>0?',':'')+'"'+objectKey+'":"'+opt.category.response[objectKey].code+'"';

						}

						result += '}';

						return JSON.parse(result);

					}()

				}
			},
			response: null
		},
	}

	let Cart = SCOPE.option;

	// 쌍판때기 보소
	for(let calendarButtonKey in Cart.ui.calendar){
		if(calendarButtonKey == "scope"){
			$(Cart.scope).append('<div id="'+Cart.ui.calendar.scope.substr(1)+'" />');
			continue;
		}

		let dom = Cart.ui.calendar[calendarButtonKey].dom;
		$(Cart.ui.calendar.scope).append(typeof dom == "function" ? dom(Cart) : dom);
	}

	// 영 좋지 못한 눈, 코, 입
	for(let uiButtonKey in Cart.ui.button){
		if(uiButtonKey == "scope"){
			$(Cart.scope).append('<div id="'+Cart.ui.button.scope.substr(1)+'" class="buttonGroup" />');
			continue;
		}

		let dom = Cart.ui.button[uiButtonKey].dom;
		$(Cart.ui.button.scope).append(typeof dom == "function" ? dom(Cart) : dom);

	}

	Cart.category.jqxhr(Cart).done(function(res){
		Cart.category.response = res;

		SCOPE.setCategory('devjung') // 카테고리
		SCOPE.setBody(); // 달력
		SCOPE.setModal(); // 메뉴 셋

	});

	$DOCUMENT
		.off(Cart.ui.calendar.control.event.name, Cart.ui.calendar.control.event.target)
		.on(Cart.ui.calendar.control.event.name, Cart.ui.calendar.control.event.target,
			function(event){
				event.preventDefault();

				const t = $(this);

				let value = t.data("calendar");

				if(value == "prev"){
					SCOPE.setBody({
						year: Cart.data.year ,
						month: function(){
							return Cart.data.month > 1 ? Cart.data.month -= 1 : function(){
								Cart.data.year -= 1;
								return 12;
							}();
						}
					});
				}

				if(value == "next"){
					SCOPE.setBody({
						year: Cart.data.year ,
						month: function(){
							return Cart.data.month < 12 ? Cart.data.month += 1 : function(){
								Cart.data.year += 1;
								return 1;
							}();
						}
					});
				}

			}
		);
}

Cart.prototype.setCategory = function(args){
	
	let Cart = this.option;	
	
	Cart.category.account = args || 'test';

	let result = '<ul>';

	for(let objectKey in Cart.category.response){

		let identify = Cart.category.response[objectKey].code;

		result += [
			'<li>',
			'	<label for="'+identify+'" class="icon">'+Cart.category.response[objectKey].name,
			'		<input id="'+identify+'" ',
			'			class="skip"',
			'			name="category['+objectKey+']" ',
			'			checked="checked"',
			'			type="checkbox" ',
			'			value="'+identify+'">',
			'	</label>',
			'</li>'
		].join('');

	}

	result += '</ul>';

	$(Cart.ui.calendar.category.name).html(result);

	return 1;
}

Cart.prototype.setBody = function(args){

	let Cart = this.option;

	Cart.data.year = arguments.length ? args.year : new Date().getFullYear();
	Cart.data.month = arguments.length ? args.month() : new Date().getMonth()+1;

	$(Cart.ui.calendar.control.name)
		.replaceWith(Cart.ui.calendar.control.dom(Cart));

	CALENDAR.setCalender();

	return 1;
};

Cart.prototype.setModal = function(args){

	let Cart = this.option;

	Cart.ui.modalMenu = args || {
		name: '#CartModal',
		dom: function(opt){
			let id = opt.ui.modalMenu.name.substr(1);
			return [
				'<div id="'+id+'">',
				'	<div class="scrollbar"><div class="scroll-ground"><button type="button"><span class="skip">스크롤</span></button></div></div>',
				'	<button data-modalCode="-1" class="close" type="button"><span class="icon"></span> 닫기</button>',
				'	<ul class="obj">',
				'		<li class="item"><button data-modalcode="0" type="button"><span class="icon"></span> 월</button></li>',
				'		<li class="item"><button data-modalcode="1" type="button"><span class="icon"></span> 주</button></li>',
				'		<li class="item"><button data-modalcode="2" type="button"><span class="icon"></span> 일</button></li>',
				'		<li class="item"><button data-modalcode="3" type="button"><span class="icon person"></span> 내일정</button></li>',
				'		<li class="item"><button data-modalcode="4" type="button"><span class="icon pin"></span> 주변일정</button></li>',
				'		<li class="item"><button data-modalcode="5" type="button"><span class="icon group"></span> 모임일정</button></li>',
				'		<li class="item"><button data-modalcode="6" type="button"><span class="icon setting"></span> 설정</button></li>',
				'	</ul>',
				'</div>'
			].join('');
		},
		event: {
			name: 'click.modal',
			target: '#CartModal [data-modalcode]'
		}
	}

	if($(Cart.ui.modalMenu.name).length){
		$(Cart.ui.modalMenu.name)
			.replaceWith(Cart.ui.modalMenu.dom(Cart));
	}
	else{
		$(Cart.scope)
			.prepend(Cart.ui.modalMenu.dom(Cart));
	}

	// 버튼
	$DOCUMENT
		.off(".modal", Cart.ui.modalMenu.event.target)
		.on(Cart.ui.modalMenu.event.name, Cart.ui.modalMenu.event.target,
			function(event){
				event.preventDefault();

				const t = $(this);

				let value = t.data("modalcode");

				console.log('modalcode', value);

				if(value == -1) {
					CART.onCloseModal();

					return 0;
				}

				CART.onCloseModal();
				CONTENT.onPushRemove();
			}
		);

	// 오픈
	$DOCUMENT
		.off(".CartMenu", Cart.ui.button.menu.event.target)
		.on(Cart.ui.button.menu.event.name, Cart.ui.button.menu.event.target,
			function(event){
				event.preventDefault();

				const t = $(this);

				$(Cart.ui.modalMenu.name)
					.animate({ left: 0 }, 700, 'easeOutExpo', 0);

				SCROLLBAR.onScrollY();

			}
		);

	return 1;
}

Cart.prototype.onCloseModal = function() {

	const SCOPE = this;

	let Cart = SCOPE.option;

	$(Cart.ui.modalMenu.name).animate({ left:-100+'%'}, 700, 'easeOutExpo', 0);

};

window.REQUESTER = new Requester;
window.CONTENT = new Content;
window.SCROLLBAR = new Scrollbar;
window.CALENDAR = new Calendar;
window.CART = new Cart;

CONTENT.setDocument({ 
	select: CART.option.scope,
	create: REQUESTER.CartContent.scope
});
