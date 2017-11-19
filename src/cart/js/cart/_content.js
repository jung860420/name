
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

				$(SCOPE.CartContent.scope).append(SCOPE.CartContent.dom(args.code));
			}

			SCOPE.onPushSlide(args.code);
		});

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