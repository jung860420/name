
import Requester from './_requester';

export default class Content extends Requester {

	setDocument(args) {

		const SCOPE = this;

		let doc = document;
		let el = doc.createElement('div');

		el.id = args.create.substr(1);

		doc.querySelector(args.select).appendChild(el);

		return 1;
	}

	setContent(args) {

		const SCOPE = this;

		SCOPE.onAjax(args.request, function(res) {

			if($('#CartContent-modal-'+args.code).length == 0) {

				var resLen = res.length;

				var str = SCOPE.CartContent.dom(args.code);

				for (var i=0; i<resLen; i++) {
					str = str.replace('{{CONTENTS}}', res[i].CONTENTS);
					str = str.replace('{{DEL_CHK}}', res[i].DEL_CHK);
					str = str.replace('{{END_DE}}', res[i].END_DE);
					str = str.replace('{{REG_DE}}', res[i].REG_DE);
					str = str.replace('{{REG_ID}}', res[i].REG_ID);
					str = str.replace('{{SCHEDULE_NO}}', res[i].SCHEDULE_NO);
					str = str.replace('{{START_DE}}', res[i].START_DE);
					str = str.replace('{{SUBJECT}}', res[i].SUBJECT);
				}

				console.log(str);

				$(SCOPE.CartContent.scope).append(str);
			}
			
			SCOPE.onPushSlide(args.code);
		});

		return 1;
	}

	getMenuContent(args) {

		console.log(args);

		const SCOPE = this;

		let request = {
		   type: 'GET',
		   url: args.url,
		   data: {
		        cd: args.code
		   }
		};

		// SCOPE.onAjax(request, function(res) {

			if($('#CartMenuContent-modal-'+args.code).length == 0) {

				// var resLen = res.length;

				var str = SCOPE.CartMenuContent.dom(args.code);

				// for (var i=0; i<resLen; i++) {
				 	// str = str.replace('{{TITLE}}', res[i].title);
				 	str = str.replace('{{TITLE}}', args.code);
				// }

				console.log(str);

				$(SCOPE.CartMenuContent.scope).append(str);
			}

			CART.onCloseModal();
			CONTENT.onPushRemove();

		// });

		return 1;
	}

	onPushSlide(args) {

		const SCOPE = this;

		if(SCOPE.CartContent.floatbox != '#CartContent-modal-'+args) {

			$('#CartContent-modal-'+args)
				.animate({ left: -100+'%'}, 700, 'easeOutExpo',
					function() {
						SCOPE.CartContent.floatbox = '#CartContent-modal-'+args;
						return 1;
					}
				);
		}

		CART.onCloseModal();

		return 1;
	}

	onPushRemove(args) {

		const SCOPE = this;

		if(SCOPE.CartContent.floatbox) {
			$(SCOPE.CartContent.floatbox)
				.animate({ left: -200+'%'}, 700, 'easeOutExpo',
					function() {
						$(this).remove();
						return 1;
					}
				);
		}

	}


}